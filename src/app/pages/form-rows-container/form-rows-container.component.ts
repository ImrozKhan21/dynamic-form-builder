import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {forkJoin} from 'rxjs';
import {isNullOrUndefined} from 'util';
import {CinchyService} from '@cinchy-co/angular-sdk';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-form-rows-container',
  templateUrl: './form-rows-container.component.html',
  styleUrls: ['./form-rows-container.component.scss']
})
export class FormRowsContainerComponent implements OnInit {

  mobileQuery: MediaQueryList;
  fullScreenHeight = 400;
  rowsForTable;
  tableName: string;
  formId: number;
  rowId: number;
  tablesWithRows = [];
  pageState = {showError: false, showLoader: false, saved: false};
  callbackResponse: any;
  private mobileQueryListener: () => void;

  constructor(private cinchyService: CinchyService, private router: Router,
              private activatedRoute: ActivatedRoute,
              private appService: AppService,
              private spinner: NgxSpinnerService,
              changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    // For Sidenav
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit() {
    this.getAndSetFormTables();
  }

  async getAndSetFormTables() {
    this.spinner.show();
    this.formId = this.appService.formId;
    console.log('FORM IF', this.formId);
    const formsMetaDataResp = await this.appService.getFormMetaDataBasedOnId(this.formId).toPromise();
    const formsMetaData = formsMetaDataResp.queryResult.toObjectArray();
    this.setRowsForEachTable(formsMetaData);
  }

  async setRowsForEachTable(formMetaData) {
    const tablesWithRows = [];
    //   const addNewOption = {rowId: 0, lookUpLabel: 'Add new data'};
    const allApis = this.getApiCallObservableForEachTable(formMetaData);
    const allTablesResp = await forkJoin(allApis).toPromise();
    allTablesResp.forEach((rowsForTableResp, index) => {
      const rowsForTable = rowsForTableResp.queryResult.toObjectArray();
      //    rowsForTable.push(addNewOption);
      this.tableName = formMetaData[index].tableName;
      const formId = formMetaData[index].formId;
      tablesWithRows.push({tableName: this.tableName, rowsForTable, formId});
    });
    this.tablesWithRows = tablesWithRows; // Only setting once we get all tables Data
    this.spinner.hide();
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
    this.spinner.show();
    this.pageState.saved = false;
    this.formId = rowClicked.formId;
    this.rowId = rowClicked.rowId;
  }

  eventHappenedInForms(event) {
    this.pageState.saved = event.Data ? typeof (event.Data.CinchyId) === 'number' : false;
    if (event.type === 5) {
      // Change border color if it's value is null
      if (isNullOrUndefined(event.Data.Value) || event.Data.Value === '') {
        event.Data.event.target['style'].borderColor = 'red';
        event.Data.event.target.placeholder = 'This field is required';
      } else {
        // append tr_ text as a prefix
        event.Data.event.target['style'].borderColor = '#ced4da';
       // event.Data.event.target['value'] = 'tr_' + event.Data.Value;
      }
    }
    this.callbackResponse = event;
    // tslint:disable-next-line:no-unused-expression
    this.pageState.saved && this.getAndSetFormTables();
  }

  cancel() {
    this.rowId = null;
  }

}