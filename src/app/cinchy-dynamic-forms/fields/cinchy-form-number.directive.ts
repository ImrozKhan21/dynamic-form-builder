import { Component, Input } from '@angular/core';
//#region Cinchy Dynamic Number field
/**
 * This section is used to create Dynamic Number field
 */
//#endregion
@Component({
    selector: 'cinchy-number',
    template: `<div *ngIf="(field.cinchyColumn.dataType == 'Number' && 
    field.cinchyColumn.canView)" class="full-width-element divMarginBottom">
    <label class="cinchy-label">
      {{field.label}}
    </label>
  <input class='form-control'
  [disabled]="(field.cinchyColumn.canEdit=== false ? true : false)"
  type="number" min="{{field.cinchyColumn.minValue}}"  [value]='field.value' [(ngModel)]="field.value"
    [ngModelOptions]="{standalone: true}">

</div>
    `
})
export class NumberDirective {
    @Input() field: any;
    constructor() {

    }
}
