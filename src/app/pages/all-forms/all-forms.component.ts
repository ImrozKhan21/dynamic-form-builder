import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CinchyService} from '@cinchy-co/angular-sdk';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {forkJoin} from 'rxjs';
import {startWith} from 'rxjs/operators';

@Component({
  selector: 'app-all-forms',
  templateUrl: './all-forms.component.html',
  styleUrls: ['./all-forms.component.scss']
})
export class AllFormsComponent implements OnInit {

  constructor(private cinchyService: CinchyService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private appService: AppService,
              private spinner: NgxSpinnerService) {
  }

  searchControl = new FormControl();
  allFormTables;
  tableName: string;
  formId: number;
  rowId: number;
  filteredOptions;

  static getFilterValue(value) {
    if (typeof value === 'object') {
      return value.tableName ? value.tableName.toLowerCase() : '';
    }
    return value.toLowerCase();
  }

  ngOnInit() {
    this.getAndSetFormTables();
  }

  async getAndSetFormTables() {
    this.spinner.show();
    const formsMetaDataResp = await this.appService.getAllForms().toPromise();
    this.allFormTables = formsMetaDataResp.queryResult.toObjectArray();
    this.filteredOptions = this.allFormTables.slice();
    this.onInputChange();
    console.log('allForms', this.allFormTables);
  }

  onInputChange() {
    this.searchControl.valueChanges.pipe(
      startWith('')).subscribe(value => {
      this.filteredOptions = value ? this.filter(value) : this.allFormTables;
    });
  }

  filter(value: any): string[] {
    if (value && this.allFormTables) {
      const filterValue = AllFormsComponent.getFilterValue(value);
      // Filtering out addNewItem because multiple inputs can cause race condition
      return this.allFormTables.filter(option => option && option.tableName
        ? option.tableName.toLowerCase().includes(filterValue) : null);
    }
    return [];
  }

  goToForm(table) {
    console.log('table', table);
    this.appService.formId = table.formId;
    this.router.navigate(['/form-rows']);
  }

}
