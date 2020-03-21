import { Component, Input } from '@angular/core';

//#region Cinchy Dynamic Calculated field
/**
 * This section is used to create Calculated field of cinchy table.
 */
//#endregion
@Component({
    selector: 'cinchy-calculated',
    template: ` <div *ngIf="(field.cinchyColumn.dataType == 'Calculated' )" class="full-width-element divMarginBottom">
    <label class="calculatedStyle">{{field.label}}</label><br/>
    <label>{{field.value}}</label>
  </div>
    `,
})
export class CalculatedDirective {
    @Input() field: any;
    constructor() {

    }
}
