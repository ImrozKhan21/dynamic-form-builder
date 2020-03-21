import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CinchyService} from '@cinchy-co/angular-sdk';
import {Router, ActivatedRoute} from '@angular/router';
import {AppService} from './app.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mobileQuery: MediaQueryList;
  fullScreenHeight = 400;
  rowsForTable;
  tableName: string;
  formId: number;
  rowId: number;
  tablesWithRows = [];
  private mobileQueryListener: () => void;

  constructor(private cinchyService: CinchyService, private router: Router,
              private activatedRoute: ActivatedRoute,
              private appService: AppService,
              changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    // For Sidenav
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }


  ngOnInit(): void {
    window.addEventListener('message', this.receiveMessage, false);
    this.cinchyService.login().then(success => {
      if (success) {
        if (localStorage.getItem('fullScreenHeight')) {
          this.fullScreenHeight = parseInt(localStorage.getItem('fullScreenHeight'), 10);
          this.getAndSetFormTables();
          console.log('Login Success!');
        }
      }
    }).catch(error => {
      console.log('Login Failed');
    });
  }

// get Full Screen height of screen
  receiveMessage(event) {
    if (event.data.toString().startsWith('[Cinchy][innerHeight]')) {
      this.fullScreenHeight = parseInt(event.data.toString().substring(21), 10) + 4;
      localStorage.setItem('fullScreenHeight', this.fullScreenHeight.toString());
      const elements = document.getElementsByClassName('full-height-element');
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < elements.length; i++) {
        elements[i]['style'].height = this.fullScreenHeight + 'px';
      }
    }
  }

  async getAndSetFormTables() {
    this.formId = this.activatedRoute.snapshot.queryParams.formId;
    const formsMetaDataResp = this.formId ? await this.appService.getFormMetaDataBasedOnId(this.formId).toPromise()
      : await this.appService.getAllForms().toPromise();
    const formsMetaData = formsMetaDataResp.queryResult.toObjectArray();
    this.setRowsForEachTable(formsMetaData);
  }

  async setRowsForEachTable(formMetaData) {
    const tablesWithRows = [];
    const addNewOption = {rowId: 0, lookUpLabel: 'Add new data'};
    const allApis = this.getApiCallObservableForEachTable(formMetaData);
    const allTablesResp = await forkJoin(allApis).toPromise();
    allTablesResp.forEach((rowsForTableResp, index) => {
      const rowsForTable = rowsForTableResp.queryResult.toObjectArray();
      rowsForTable.push(addNewOption);
      const tableName = formMetaData[index].tableName;
      const formId = formMetaData[index].formId;
      tablesWithRows.push({tableName, rowsForTable, formId});
    });
    this.tablesWithRows = tablesWithRows; // Only setting once we get all tables Data
  }

  getApiCallObservableForEachTable(formMetaData) {
    const allTableRowsObservable = [];
    if (formMetaData) {
      formMetaData.forEach(table => {
        const rowsForTableResp = this.appService.getRowsForTable(table);
        allTableRowsObservable.push(rowsForTableResp);
      });
    }
    return allTableRowsObservable;
  }

  getRowData(rowClicked) {
    this.formId = rowClicked.formId;
    this.rowId = rowClicked.rowId;
  }
}
