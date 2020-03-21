import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IEventCallback, EventCallback } from '../models/cinchy-event-callback.model';
import { ResponseType } from '../enums/response-type.enum';
//#region Cinchy Dynamic TextArea
/**
 * This section is used to create dynamic textarea fields for the cinchy.
 */
//#endregion
@Component({
    selector: 'cinchy-textarea',
    template: `<div *ngIf="(field.cinchyColumn.dataType == 'Text'
     && field.cinchyColumn.textColumnMaxLength > 500 && field.cinchyColumn.canView)" class="full-width-element divMarginBottom">
    <label class="cinchy-label">
      {{field.label}}
    </label>
    <textarea [disabled]="(field.cinchyColumn.canEdit=== false ? true : false)" class='form-control' type="text"  [(ngModel)]="field.value"
    (blur)="callbackEvent(targetTableName, field.cinchyColumn.name, $event, 'value')"
      [ngModelOptions]="{standalone: true}"></textarea>
  </div>
    `,
})
export class TextAreaDirective {
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
