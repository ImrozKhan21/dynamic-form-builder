import { Component, Input, Output, EventEmitter } from '@angular/core';

//#region Cinchy Dynamic Child form Table
/**
 * This section is used to create the table of cinchy child form data.
 * We use keyValue pipe for creating the dynamic table from array.
 */
//#endregion
@Component({
  selector: 'cinchy-childform-table',
  template: `  <div *ngIf="field.childForm" class="full-width-element">
    <div *ngIf="field.childForm" class="full-width-element">
      <ng-container *ngFor="let section of field.childForm.sections">
        <!-- Child form table header -->
        <div class="mat-header-child">{{section.label}}
          <span class="text-left"><a (click)="manageChildRecords(field.childForm,null, section.label, 'Add',field.childForm)">
              <fa size="lg" name="plus" class="plusIcon btn-dynamic-child"></fa>
            </a>
          </span>
        </div>
        <!-- Child form table Row header --> 
        <div class="table-responsive" *ngIf="section['MultiFields'] !== undefined && section['MultiFields']!==null" >
        <table class="table table-bordered" *ngIf="section['MultiFields'].length > 0">
          <tr>
            <ng-container *ngFor="let _field of section['MultiFields'][0] | keys">
           <!-- Child form dynamic table Row header --> 
            <th *ngIf="(_field.key !== 'Cinchy ID' && _field.key !=='Source Table Name' && _field.key !=='Raw View Name' &&
            _field.key !=='Curated Table Name' && _field.key !== 'Curated View Table Name'
            )">
                {{_field.key}}
            </th>
          </ng-container>
            <th class="mat-row-child">Action</th>
          </tr>
          <!-- Child form dynamic table Row Data --> 
          <tr *ngFor="let _field of section['MultiFields']">
            <ng-container *ngFor="let item of _field | keys">
                <td *ngIf="(item.key !== 'Cinchy ID' && item.key !=='Source Table Name' && item.key !=='Raw View Name' &&
                item.key !=='Curated Table Name' && item.key !== 'Curated View Table Name'
                )">
                    {{item.value}}
                </td>
            </ng-container>
            <!--Edit Child form  --> 
            <td class="action-width">
              <a class="btn-dynamic-child primary btnForm" (click)="manageChildRecords(field.childForm, _field, section.label,'Edit',field.childForm)">
                <fa size="lg" name="edit" class="plusIcon"></fa>
              </a>
              <a class="btn-dynamic-child warn btnForm">
                <fa size="lg" name="trash" class="plusIcon"></fa>
              </a>
            </td>
          </tr>
        </table>
      </div>
        <ng-container>

        </ng-container>
      </ng-container>
    </div>
  </div>
    `,
})
export class ChildFormTableDirective {
  @Input() field: any;
  @Output() childform = new EventEmitter<any>();
  constructor() {
  }
  
  manageChildRecords(childFormData: any, values: any, title: string, type: string, multiFieldValues: any) {
    let data = {
      childFormData: childFormData,
      values: values,
      title: title,
      type: type,
      multiFieldValues: multiFieldValues
    };
    this.childform.emit(data);
  }
}
