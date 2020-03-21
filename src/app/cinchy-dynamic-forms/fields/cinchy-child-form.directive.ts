import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Input, Inject, EventEmitter } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { DropdownDatasetService } from '../service/cinchy-dropdown-dataset/cinchy-dropdown-dataset.service';

//#region Cinchy Dynamic Child Form
/**
 * This section is used to create cinchy child form.
 */
//#endregion
@Component({
    selector: 'cinchy-child-form',
    template: `
    <h1 mat-dialog-title> <div class="mat-card-header-child">{{data.title}}</div></h1>
<div mat-dialog-content>
    <ng-container *ngFor="let section of data.childFormData.sections">
        <ng-container *ngFor="let field of section.fields">
        <cinchy-checkbox [field]='field'></cinchy-checkbox>
      <cinchy-link [targetTableName] = "data.childFormData.targetTableName" [field]='field'
      (eventHandler)="handleFieldsEvent($event)"></cinchy-link>
      <cinchy-textarea [field]='field' [targetTableName] = "data.childFormData.targetTableName" [field]='field'
      (eventHandler)="handleFieldsEvent($event)"></cinchy-textarea>
      <cinchy-textbox [targetTableName] = "data.childFormData.targetTableName" [field]='field'
      (eventHandler)="handleFieldsEvent($event)" ></cinchy-textbox>
      <cinchy-calculated [field]='field'></cinchy-calculated>
      <cinchy-number [field]='field'></cinchy-number>
        </ng-container>
      </ng-container>

</div>
<div mat-dialog-actions>
<button mat-button color="primary" (click)="onOkClick()" cdkFocusInitial>OK</button>
<button mat-button color="warn" (click)="onNoClick()">Cancel</button>
</div>
    `,
    // TODO Need to set this environment Dynamically
    providers: [DropdownDatasetService]
})
export class ChildFormDirective {
    public data: any;
    public datachild = [];
    public cinchyID = null;
    public fieldName = '';
    public fieldValue = '';
    EventHandler = new EventEmitter();
    constructor(
      public dialogRef: MatDialogRef<ChildFormDirective>,
      @Inject(MAT_DIALOG_DATA) public _ChildFormData: any
    ) {
    }
    ngOnInit() {
      // bind and load child form.
      let obj = this._ChildFormData.values;
      this._ChildFormData.childFormData.sections.forEach(section => {
        section.fields.forEach(element => {
          if(!isNullOrUndefined(obj)) {
            // bind dropdown values
            if (element.cinchyColumn.dataType === 'Link') {
              if (!isNullOrUndefined(element['dropdownDataset'])) {
                let dropdownResult =element['dropdownDataset'].options.find(e => e.label ===
                  obj[element.cinchyColumn.name]);
                if(!isNullOrUndefined(dropdownResult)) {
                  element.value = dropdownResult['id'];
                } else {
                  element.value = null;
                }
              }
            } else {
              element.value = obj[element.cinchyColumn.name]
            }
          } else {
            element.value = '';
          }
        });
      });
      // this check is for new record or edit record
      if(this._ChildFormData.type === 'Add') {
        this.cinchyID = 0;
      } else {
        this.cinchyID = obj['Cinchy ID'];
      }
      this.data = this._ChildFormData;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
    /**
     * On click of Ok Button
     * 1. Check validation for the fields.
     * 2. pass data to parent form
     */
    async onOkClick() {
      let formvalidation = this._ChildFormData.childFormData.checkChildFormValidation();
      let result = {
        data: this._ChildFormData.childFormData,
        id: this.cinchyID
      };
      if (formvalidation.status) {
        this.dialogRef.close(result);
      } else {
          console.log(formvalidation.message);
      }
    }
  
    //#region This method is used to handle the field event
  handleFieldsEvent ($event) {
    // Emit the event to the Project.
    this.EventHandler.emit($event);
  }
  //#endregion
}
