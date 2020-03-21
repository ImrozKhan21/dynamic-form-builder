import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ResponseType } from './../enums/response-type.enum';
import {IEventCallback, EventCallback} from '../models/cinchy-event-callback.model';
//#region Cinchy Dynamic Textbox Field
/**
 * This section is used to create dynamic textbox field for the cinchy.
 */
//#endregion
@Component({
  selector: 'cinchy-textbox',
  template: `<div *ngIf="(field.cinchyColumn.dataType == 'Text' && field.cinchyColumn.textColumnMaxLength <= 500 
  && field.cinchyColumn.canView)"
     class="full-width-element divMarginBottom">
    
    <label class="cinchy-label">
      {{field.label}}
    </label>
    <input class='form-control'
    [disabled]="(field.cinchyColumn.canEdit=== false ? true : false)"
    type="text" [(ngModel)]="field.value" (blur)="callbackEvent(targetTableName, field.cinchyColumn.name, $event, 'value')"
      [ngModelOptions]="{standalone: true}">
   
  </div>
    `
})
export class TextBoxDirective {
  @Input() field: any;
  @Input() targetTableName: string;
  @Output() eventHandler = new EventEmitter<any>();
  constructor() {

  }
  //#region pass callback event to the project On blur
  callbackEvent(targetTableName: string, columnName: string, event: any, prop: string) {
    // constant values
    const value = event.target[prop];
    const Data = {
      'TableName': targetTableName,
      'ColumnName': columnName,
      'Value': value,
      'event': event
    }
    // pass calback event
    const callback: IEventCallback = new EventCallback(ResponseType.onBlur, Data);
    this.eventHandler.emit(callback);
  }
  //#endregion
}
