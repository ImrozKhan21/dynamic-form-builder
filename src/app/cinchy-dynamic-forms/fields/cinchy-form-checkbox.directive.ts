
import { Component, Input } from '@angular/core';

//#region Cinchy Dynamic YES/NO fields (Checkbox)
/**
 * This section is used to create Yes/No fields for the cinchy.
 */
//#endregion
@Component({
    selector: 'cinchy-checkbox',
    template: `<div *ngIf="(field.cinchyColumn.dataType == 'Yes/No' && field.cinchyColumn.canView)">
    <input type='checkbox' [(ngModel)]="field.value" [ngModelOptions]="{standalone: true}"/>{{field.label}}
    <br *ngIf="field.caption != ''"/>
    <label>{{field.caption}}</label>
  </div>
    `,
})
export class CheckBoxDirective {
    @Input() field:any;
    constructor() {

    }
}
