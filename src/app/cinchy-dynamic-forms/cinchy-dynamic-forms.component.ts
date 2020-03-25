import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, OnChanges } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ChildFormDirective } from './fields/cinchy-child-form.directive';
import { MatDialog } from '@angular/material';
import { CinchyService } from '@cinchy-co/angular-sdk';
import { Form, IForm } from './models/cinchy-form.model';
import { DropdownDataset } from './service/cinchy-dropdown-dataset/cinchy-dropdown-dataset';
import { FormSection } from './models/cinchy-form-sections.model';
import { ICinchyColumn, CinchyColumn } from './models/cinchy-column.model';
import { IQuery } from './models/cinchy-query.model';
import { FormField } from './models/cinchy-form-field.model';
import { ResponseType } from './enums/response-type.enum';
import { IEventCallback, EventCallback } from './models/cinchy-event-callback.model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'cinchy-dynamic-forms',
  template: `
  <form *ngIf='form != null'>
  <div *ngFor='let section of form.sections'>
      <mat-accordion class="expansion-collapse-wrapper">
        <mat-expansion-panel [expanded]="true">
          <mat-expansion-panel-header class='sectionHeaderRow divMarginBottomHeader'>
            <mat-panel-title>
              <div class='sectionHeader'>{{ section.label }}</div>
            </mat-panel-title>
          </mat-expansion-panel-header>
          <div *ngFor='let field of section.fields; let idx = index'>
            <div class='formField'>
              <cinchy-checkbox [field]='field'></cinchy-checkbox>
              <cinchy-link [targetTableName] = "form.targetTableName" [field]='field'
                           (eventHandler)="handleFieldsEvent($event)"></cinchy-link>
              <cinchy-textarea (eventHandler)="handleFieldsEvent($event)"
                               [targetTableName] = "form.targetTableName" [field]='field'></cinchy-textarea>
              <cinchy-textbox [targetTableName] = "form.targetTableName" [field]='field'
                              (eventHandler)="handleFieldsEvent($event)" ></cinchy-textbox>
              <cinchy-calculated [field]='field'></cinchy-calculated>
              <cinchy-number [field]='field'></cinchy-number>
              <cinchy-childform-table [field]='field' (childform)='openChildForm($event)'></cinchy-childform-table>
            </div>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
  </div>
  <div class='btnDiv'>
    <button mat-raised-button class='btnSave' (click)='saveForm(form, RowId)'>Save</button>
    <button mat-raised-button (click)="cancelClicked.emit()">Cancel</button>
  </div>
</form>
  `,
  styleUrls: ['./style/style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CinchyDynamicFormsComponent implements OnInit, OnChanges {
  @Input() RowId: number;
  @Input() FormId: number;
  @Input() CallbackEventResponse: any;
  @Output() EventHandler = new EventEmitter<any>();
  @Output() cancelClicked = new EventEmitter<any>();
  formFieldMetadataResult: any;
  private parentTableId: number = 0;
  form: IForm = null;
  public childDataForm = [];
  public childCinchyId = -1;
  public multiFieldValues: any;
  public childFieldArray: Array<any> = [];
  public formsData: any;
  public unique = [];
  public childForms: any;
  public tableEntitlements: any;
  constructor(private _dialog: MatDialog, private _cinchyService: CinchyService,
              private spinner: NgxSpinnerService) {
  }
  ngOnInit() {
  }
  //#region Get Form Meta Data On Change of the Library
  ngOnChanges() {
    console.log('ON CHANGE', this.RowId, this.CallbackEventResponse);
    this.childDataForm = [];
    this.getFormMetaData();
  }
  //#endregion 
  //#region Edit Add Child Form Data
  openChildForm(data): void {
    const dialogRef = this._dialog.open(ChildFormDirective, {
      width: '500px',
      data: data
    });
    // Handle Event from child form and pass to the Project
    const sub = dialogRef.componentInstance.EventHandler.subscribe((data) => {
      this.EventHandler.emit(data);
    });
    this.childForms = data.childFormData;
    dialogRef.afterClosed().subscribe(result => {
      if (!isNullOrUndefined(result)) {
        if (isNullOrUndefined(data.multiFieldValues.sections['MultiFields'])) {
          data.multiFieldValues.sections['MultiFields'] = [];
        }
        const childResult = {};
        const childResultForLocal = {};
        const formvalidation = result.data.checkChildFormValidation();
        if (formvalidation.status) {
          result.data.sections.forEach(section => {
            if (isNullOrUndefined(section['MultiFields'])) {
              section['MultiFields'] = [];
            }
            const fieldRow = section['MultiFields'].filter(rowData => {
              if (rowData['Cinchy ID'] === result.id) {
                return rowData;
              }
            });
            // Check for the record is new or in edit mode
            const childFieldRow = this.childFieldArray.filter(rowData => {
              if (rowData['Cinchy ID'] === result.id) {
                return rowData;
              }
            });
            if (fieldRow.length > 0) {
              // if the code is in edit mode
              section.fields.forEach(element => {
                if (element.cinchyColumn.dataType === 'Link') {
                  if (!isNullOrUndefined(element['dropdownDataset'])) {
                    const dropdownResult = element['dropdownDataset'].options.find(e => e.id ===
                      element.value);
                    if (!isNullOrUndefined(dropdownResult)) {
                      fieldRow[0][element.cinchyColumn.name] = dropdownResult['label'];
                    } else {
                      fieldRow[0][element.cinchyColumn.name] = '';
                    }
                  }
                } else {
                  fieldRow[0][element.cinchyColumn.name] = element.value;
                }
              });
            } else {
              // if the code is in add mode.
              section.fields.forEach(element => {
                if (element.cinchyColumn.dataType === 'Link') {
                  if (!isNullOrUndefined(element['dropdownDataset'])) {
                    const dropdownResult = element['dropdownDataset'].options.find(e => e.id ===
                      element.value);
                    if (!isNullOrUndefined(dropdownResult)) {
                      childResult[element.cinchyColumn.name] = dropdownResult['id'];
                      childResult[element.cinchyColumn.name + ' label'] = dropdownResult['label'];
                      childResultForLocal[element.cinchyColumn.name] = dropdownResult['label'];
                    } else {
                      childResultForLocal[element.cinchyColumn.name] = '';
                    }
                  } else {
                    childResult[element.cinchyColumn.name] = element.value;
                    childResultForLocal[element.cinchyColumn.name] = element.value;
                  }
                } else {
                  childResult[element.cinchyColumn.name] = element.value;
                  childResultForLocal[element.cinchyColumn.name] = element.value;
                }
                if (element.cinchyColumn.dataType === 'Yes/No') {
                  if (element.value === '' || isNullOrUndefined(element.value)) {
                    element.value = false;
                    childResult[element.cinchyColumn.name] = false;
                    childResultForLocal[element.cinchyColumn.name] = false;
                  }
                }
              });
              // create a random cinchy id for the local storage.
              const random = result.id = Math.random();
              childResultForLocal['Cinchy ID'] = random;
              childResult['Cinchy ID'] = random;
              // store child form data in local storage.
              this.childFieldArray.push(childResult);
              section['MultiFields'].push(childResultForLocal);
            }

            if (childFieldRow.length > 0) {
              section.fields.forEach(element => {
                if (element.cinchyColumn.dataType === 'Link') {
                  if (!isNullOrUndefined(element['dropdownDataset'])) {
                    const dropdownResult = element['dropdownDataset'].options.find(e => e.id ===
                      element.value);
                    if (!isNullOrUndefined(dropdownResult)) {
                      childFieldRow[0][element.cinchyColumn.name + ' label'] = dropdownResult['label'];
                      childFieldRow[0][element.cinchyColumn.name] = dropdownResult['id'];
                    } else {
                      childFieldRow[0][element.cinchyColumn.name] = '';
                    }
                  }
                } else {
                  childFieldRow[0][element.cinchyColumn.name] = element.value;
                }
              });
            }
          });
          const _cinchyid = result.id;
          if (result.id <= 1) {
            result.id = null;
          }
          // Generate insert query for child form
          const insertQuery: IQuery = result.data.generateSaveForChildQuery(result.id, '{sourceid}');
          const queryResult = {
            id: _cinchyid,
            Query: insertQuery
          }
          // check query for add/edit mode
          let _query = this.childDataForm.filter(x => x.id === _cinchyid);
          if (_query.length > 0) {
            _query[0].Query = insertQuery;
          } else {
            // create a collection of queries for child form
            this.childDataForm.push(queryResult);
          }
          this.childCinchyId = result.id;
        }
      } else {
      //  this.childCinchyId = -1;
      }
      // Need to perform logic to pass the output data....
    });
  }
  //#endregion
  //#region Load Meda Data For the Forms
  /**
   * using this method we load all the meta data of form.
   */
  async getFormMetaData() {
    let query = ` Select
    ff.[Form Section].[Form].[Cinchy Id] as 'FormId',
    ff.[Form Section].[Form].[Name] as 'Form',
    ff.[Form Section].[Form].[Table].[Cinchy Id] as 'TableId',
    ff.[Form Section].[Form].[Table].[Domain].[Name] as 'Domain',
    ff.[Form Section].[Form].[Table].[Name] as 'Table',
    ff.[Form Section].[Form].[Table].[JSON] as 'JsonData',
    ff.[Form Section].[Cinchy Id] as 'FormSectionId',
    ff.[Form Section].[Name] as 'FormSection',
    ff.[Cinchy Id] as 'FormFieldId',ff.[Name] as 'FormField',
    ff.[Caption] as 'Caption',
    ff.[Child Form].[Cinchy Id] as 'ChildFormId',
    ff.[Child Form Fields To Display].[Cinchy Id] as 'DisplayColumn',
    ff.[Child Form Link Field].[Cinchy Id] as 'LinkFieldId',
    ff.[Table Column].[Cinchy Id] as 'ColumnId',ff.[Table Column].[Table].[Cinchy Id] as 'TableId',
    ff.[Table Column].[Name] as 'ColumnName',ff.[Table Column].[Type] as 'ColumnType',
    ff.[Table Column].[Is Mandatory] as 'ColumnIsMandatory',
    ff.[Table Column].[Text Column Max Length] as 'ColumnMaxLength',
    ff.[Table Column].[Link Column Target].[Cinchy Id] as 'LinkTargetColumnId',
    ff.[Table Column].[Link Column Target].[Name] as 'LinkTargetColumnNName',
    ff.[Child Form].[Cinchy Id] as 'ChildFormID',
    ff.[File Name Column] as 'FileNameColumn',
    ff.[Table Column].[Link Column Target].[Table].[Cinchy Id] as 'LinkTargetTableId'
    from [Dynamic Forms].[Form Fields] ff
    where ff.[Deleted] is null
    and ff.[Form Section].[Deleted] is null
    order by ff.[Form Section].[Form].[Cinchy Id], ff.[Form Section].[Sequence], ff.[Sequence] `;
    // Get form Meta data Only when Once.
    if(isNullOrUndefined(this.formFieldMetadataResult)) {
      this.formFieldMetadataResult = (await this._cinchyService.executeCsql(query, null).toPromise()).queryResult.toObjectArray();
    }

    const formdata = this.formFieldMetadataResult.filter(data => data['FormId'] == this.FormId);

    if(formdata.length > 0) {
        let tableid = formdata[0].TableId;
        this.parentTableId = formdata[0].TableId;
        this._cinchyService.getTableEntitlementsById(tableid).subscribe(
          response => {
            this.tableEntitlements = response;
            this.getForm(this.FormId).then((res) => {
              this.form = res;
              this.spinner.hide();
            });
          },
          error => {
            this.spinner.hide();
            console.log(error);
          });
      }
  }
  //#endregion
  //#region Get form Values by form ID and CInchy ID and NUll for new Form
  private async getForm(FormId: number, displayColumns: number[] = null, isChild: boolean = false): Promise<IForm> {
    if (FormId <= 0) {
      return null;
    }
    let formFieldMetadataQueryResult = this.formFieldMetadataResult;
    if (!isNullOrUndefined(formFieldMetadataQueryResult)) {
      formFieldMetadataQueryResult = formFieldMetadataQueryResult.filter(data => data['FormId'] == FormId);
    }
    let result = new Form(formFieldMetadataQueryResult[0]['FormId'],
      formFieldMetadataQueryResult[0]['Form'], formFieldMetadataQueryResult[0]['TableId'],
      formFieldMetadataQueryResult[0]['Domain'], formFieldMetadataQueryResult[0]['Table']);
    this.unique = [];
    for (let i = 0; i < formFieldMetadataQueryResult.length; i++) {
      let formData = this.unique.filter(x => x['FormSectionId'] === formFieldMetadataQueryResult[i]['FormSectionId']);
      if (formData.length === 0) {
        this.unique.push(formFieldMetadataQueryResult[i]);
      }
    }
    for (let i = 0; i < this.unique.length; i++) {
      result.sections.push(new FormSection(this.unique[i]['FormSectionId'],
        this.unique[i]['FormSection']));
    }

    if (isNullOrUndefined(formFieldMetadataQueryResult) || formFieldMetadataQueryResult.length == 0) {
      return null;
    }
    let minSectionIter: number = 0;
    for (let i = 0; i < formFieldMetadataQueryResult.length; i++) {

      if (displayColumns && displayColumns.length > 0) {
        if (displayColumns.indexOf(formFieldMetadataQueryResult[i]['FormFieldId']) === -1) {
          continue;
        }
      }
      let tableJsonData = JSON.parse(formFieldMetadataQueryResult[i]['JsonData']);
      let filterData = tableJsonData.Columns.filter(x => x.columnId === formFieldMetadataQueryResult[i]['ColumnId'])
      let allowMultiple = false;
      let validationExpression = null;
      let minValue = 0;
      if (!isNullOrUndefined(filterData[0])) {
        allowMultiple = isNullOrUndefined(filterData[0].allowMultiple) ? false : filterData[0].allowMultiple;
        validationExpression = isNullOrUndefined(filterData[0].validationExpression) ? null : filterData[0].validationExpression;
        minValue = isNullOrUndefined(filterData[0].minValue) ? 0 : filterData[0].minValue;
      }
      // set entitlement canedit/canview according to the user.
      const entitlementDataForField = this.tableEntitlements.columnEntitlements.filter(ent =>
        ent.columnId === formFieldMetadataQueryResult[i]['ColumnId']);
      let canEdit: boolean = true;
      let canView: boolean = true;
      if(entitlementDataForField.length > 0) {
        canEdit = entitlementDataForField[0].canEdit;
        canView = entitlementDataForField[0].canView;
      }
      let cinchyColumn: ICinchyColumn = new CinchyColumn(formFieldMetadataQueryResult[i]['ColumnId'],
        formFieldMetadataQueryResult[i]['TableId'],
        formFieldMetadataQueryResult[i]['ColumnName'], formFieldMetadataQueryResult[i]['ColumnType'],
        formFieldMetadataQueryResult[i]['ColumnIsMandatory'], formFieldMetadataQueryResult[i]['ColumnMaxLength'],
        formFieldMetadataQueryResult[i]['LinkTargetColumnId'], formFieldMetadataQueryResult[i]['LinkTargetColumnNName'], allowMultiple,
        validationExpression, minValue, canEdit, canView, formFieldMetadataQueryResult[i]['LinkTargetTableId']);
      let dropdownDataset: DropdownDataset = null;
      let childForm: IForm = null;
      const childFormId: number = formFieldMetadataQueryResult[i]['ChildFormId'];
      if (childFormId) {

        const displayColumnId = formFieldMetadataQueryResult[i]['DisplayColumn'].split(',').map((item) => {
          return parseInt(item, 10);
        });
        displayColumnId.push(formFieldMetadataQueryResult[i]['LinkFieldId']);
        await this.getForm(childFormId, displayColumnId, true).then((res) => {
          childForm = res;
        });
      }

      let formField: FormField = new FormField(formFieldMetadataQueryResult[i]['FormFieldId'],
        formFieldMetadataQueryResult[i]['FormField'], formFieldMetadataQueryResult[i]['Caption'], childForm, cinchyColumn, dropdownDataset);
      for (let j = minSectionIter; j < result.sections.length; j++) {
        if (result.sections[j].id === formFieldMetadataQueryResult[i]['FormSectionId']) {
          minSectionIter = j;
          result.sections[j].fields.push(formField);
          break;
        }
      }
    }
    if (!isNullOrUndefined(this.RowId) && this.RowId > 0) {
      let selectQuery: IQuery = result.generateSelectQuery(this.RowId, this.parentTableId, isChild);
      let selectQueryResult: Object[] = (await this._cinchyService.executeCsql(selectQuery.query,
        selectQuery.params).toPromise()).queryResult.toObjectArray();
      if (isChild === false) {
        result.loadRecordData(this.RowId, selectQueryResult);
      } else {
        result.loadMultiRecordData(this.RowId, selectQueryResult);
      }
    }
    this.formsData = result;
    // this.form = result;
    return result;
  }
  //#endregion
  //#region  Save Values of MetaData
  public async saveForm(formdata, _RowId) {
    // check validations for the form eg: Required, Regular expression
    const formvalidation = formdata.checkFormValidation();
    if (formvalidation.status) {
    // Generate dynamic query using dynamic form meta data
    const insertQuery: IQuery = formdata.generateSaveQuery(_RowId);
    //execute dynamic query.
    console.log(JSON.stringify(insertQuery));
      this.spinner.show();
      this._cinchyService.executeCsql(insertQuery.query, insertQuery.params).subscribe(
      response => {
        console.log(response);
        let RowId = null;
        RowId = this.saveMethodLogic(RowId, response);
        this.spinner.hide();
        // pass response to the project on data save
      },
      error => {
        this.spinner.hide();

        console.error('Error in cinchy-dynamic-forms save method', error);
        let Data = {
          'Error': error,
          'Method': 'Save Parent Data'
        }
        // Event Callback Response type is onError enum 4
        let callback: IEventCallback = new EventCallback(ResponseType.onError, Data);
        this.EventHandler.emit(callback);
      });
    } else {
      let Data = {
        'Error': formvalidation.message
      }
      // Event Callback Response type is onError enum 4
      let callback: IEventCallback = new EventCallback(ResponseType.onError, Data);
      this.EventHandler.emit(callback);
    }
  }
  private saveMethodLogic(RowId: any, response) {
    if(response.queryResult._jsonResult.data.length > 0) {
      RowId = response.queryResult._jsonResult.data[0][0];
    } else{
      RowId = this.RowId;
    }
    // passing data by event handler
    let Data = {
      'CinchyId': RowId
    }
    // Event Callback Response type is save enum 1
    let callback: IEventCallback = new EventCallback(ResponseType.onSave, Data);
    // Emit data to the user.
    this.EventHandler.emit(callback);
    if (this.childCinchyId !== -1) {
      this.savechildForm(RowId, 0);
    } else {
      if (!isNullOrUndefined(this.RowId)) {
        this.getSavedData();
      }
    }
    return RowId;
  }
  //#endregion
  //#region save Child Form Values
  public async savechildForm(sourceid, idx) {
    if (this.childDataForm.length === 0 && !isNullOrUndefined(this.RowId)) {
       this.getSavedData();
    }
    if (this.childDataForm.length > idx) {
      const element = this.childDataForm[idx];
      element.Query.query = element.Query.query.replace('{sourceid}', sourceid);
      const params = JSON.stringify(element.Query.params).replace('{sourceid}', sourceid);
      this._cinchyService.executeCsql(element.Query.query, JSON.parse(params)).subscribe(
        response => {
          this.savechildForm(sourceid, idx + 1);
          if (this.childDataForm.length === (idx + 1)) {
             this.getchildSavedData(sourceid);
            this.childDataForm = [];
            this.childCinchyId = -1;
          }
        },
        error => {
        let Data = {
          'Error': error,
          'Method': 'Save Child Data'
        }
        // Event Callback Response type is onError enum 4
        let callback: IEventCallback = new EventCallback(ResponseType.onError, Data);
        this.EventHandler.emit(callback);
        });
    }
  }
  //#endregion
  //#region Get Parent Form Data After Save in Database
  public async getSavedData(isChild = false) {
    const selectQuery: IQuery = this.formsData.generateSelectQuery(this.RowId, this.parentTableId, isChild);
    const selectQueryResult: Object[] = (await this._cinchyService.executeCsql(
      selectQuery.query, selectQuery.params).toPromise()).queryResult.toObjectArray();
    this.formsData.loadRecordData(this.RowId, selectQueryResult);
    this.form = this.formsData;
  }
  //#endregion
  //#region Get Child Form Data After Save in Database
  public async getchildSavedData(rowID) {
    let isChild: boolean = true;
    const selectQuery: IQuery = this.childForms.generateSelectQuery(rowID, this.parentTableId, isChild);
    const selectQueryResult: Object[] = (await this._cinchyService.executeCsql(
      selectQuery.query, selectQuery.params).toPromise()).queryResult.toObjectArray();
    this.childForms.loadMultiRecordData(rowID, selectQueryResult);
  }
  //#endregion
  //#region This method is used to handle the field event
  handleFieldsEvent ($event) {
    // Emit the event to the Project.
    this.EventHandler.emit($event);
  }
  //#endregion
//#region Handle the call back response from project.
handleCallbackResponse(response: any) {
  console.log(response);
}
//#endregion
}
