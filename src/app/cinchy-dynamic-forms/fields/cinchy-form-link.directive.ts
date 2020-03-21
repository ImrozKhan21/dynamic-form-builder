import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {DropdownDatasetService} from '../service/cinchy-dropdown-dataset/cinchy-dropdown-dataset.service';
import { DropdownDataset } from '../service/cinchy-dropdown-dataset/cinchy-dropdown-dataset';
import { isNullOrUndefined } from 'util';
import { IEventCallback, EventCallback } from '../models/cinchy-event-callback.model';
import { ResponseType } from '../enums/response-type.enum';
//#region Cinchy Dynamic Link field
/**
 * This section is used to create Link field for the cinchy.
 * Lazy loading of the dropdown is used here. Bind dropdown on click
 */
//#endregion
@Component({
    selector: 'cinchy-link',
    template: `  <div *ngIf="(field.cinchyColumn.dataType == 'Link' && 
    field.cinchyColumn.canView)" class="full-width-element divMarginBottom linkField">
    <label class="cinchy-label">
      {{field.label}}
    </label>
     <ngx-select [disabled]="(field.cinchyColumn.canEdit === false ? true : false)" noResultsFound="{{field.dropdownDataset !== null ?
      'No Result Found': 'Loading...'}}"
      [items]="(field.dropdownDataset !== null ?
        field.dropdownDataset.options: null)"
        [multiple]="(field.cinchyColumn.isMultiple === false ? false: true )"
        [(ngModel)]="field.value"
        (click)="bindDropdownList(field, field.cinchyColumn.linkTargetColumnId)"
         [ngModelOptions]="{standalone: true}"  (selectionChanges)="callbackEvent(targetTableName, 
          field.cinchyColumn.name, $event, 'value')"></ngx-select>
  </div>
    `,
    providers: [DropdownDatasetService]
})
export class LinkDirective {
    @Input() field:any;
    @Input() targetTableName: string;
    @Output() eventHandler = new EventEmitter<any>();
    constructor(private _dropdownDatasetService: DropdownDatasetService) {
    }

    //#region Bind Link type (DropdownList) on click
    /**
     * @param dataSet dataset of the link type
     * @param linkTargetId (Taget Column ID) of link table
     */
    async bindDropdownList(dataSet:any, linkTargetId: number) {
      let dropdownDataset: DropdownDataset = null;
      if (!isNullOrUndefined(linkTargetId)) {
        dropdownDataset = await this._dropdownDatasetService.getDropdownDataset(linkTargetId);
        dataSet.dropdownDataset = dropdownDataset;
      }
    }
    //#endregion
    //#region pass callback event to the project On change of link (dropdown)
    callbackEvent(targetTableName: string, columnName: string, event: any, prop: string) {
      // constant values
      const value = event[0].value;
      const text = event[0].text;
      const Data = {
        'TableName': targetTableName,
        'ColumnName': columnName,
        'Value': value,
        'Text': text,
        'Event': event
      }
      // pass calback event
      const callback: IEventCallback = new EventCallback(ResponseType.onChange, Data);
      this.eventHandler.emit(callback);
    }
    //#endregion
  }
