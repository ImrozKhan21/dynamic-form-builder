//#region Import module for the Forms
/**
 * This section is used to import the modules
 * used for the form
 */
import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxSelectModule, INgxSelectOptions} from 'ngx-select-ex';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {CinchyModule, CinchyService, CinchyConfig} from '@cinchy-co/angular-sdk';

//#endregion

import {CinchyDynamicFormsComponent} from './cinchy-dynamic-forms.component';

//#region Directive for form fields
/***
 * These are all the directives that can be used to create the
 * forms Like textbox,textarea,checkbox, child table etc.
 */
import {LinkDirective} from './fields/cinchy-form-link.directive';
import {TextBoxDirective} from './fields/cinchy-form-textbox.directive';
import {TextAreaDirective} from './fields/cinchy-form-textarea.directive';
import {CheckBoxDirective} from './fields/cinchy-form-checkbox.directive';
import {ChildFormTableDirective} from './fields/cinchy-child-form-table.directive';
import {CalculatedDirective} from './fields/cinchy-form-calculated.directive';
import {NumberDirective} from './fields/cinchy-form-number.directive';
import {ChildFormDirective} from './fields/cinchy-child-form.directive';
//#endregion

//#region Pipes for the forms
import {KeysPipe} from './pipes/cinchy-column-key.pipe';
import {DropdownDatasetService} from './service/cinchy-dropdown-dataset/cinchy-dropdown-dataset.service';
import {CustomMaterialModule} from '../custom-material.module';
//#endregion

//#region Select Dropdownlist options
const CustomSelectOptions: INgxSelectOptions = { // Check the interface for more options
  optionValueField: 'id',
  optionTextField: 'label',
  keepSelectedItems: true
};

//#endregion

@NgModule({
  declarations: [CinchyDynamicFormsComponent,
    LinkDirective,
    TextBoxDirective,
    TextAreaDirective,
    CheckBoxDirective,
    ChildFormTableDirective,
    CalculatedDirective,
    NumberDirective,
    ChildFormDirective,
    KeysPipe,

  ],
  imports: [
    FormsModule,
    CommonModule,
    NgxSelectModule.forRoot(CustomSelectOptions),
    AngularFontAwesomeModule,
    CinchyModule.forRoot(),
    CustomMaterialModule
  ],
  exports: [CinchyDynamicFormsComponent],
  providers: [CinchyModule],
  entryComponents: [ChildFormDirective]
})

export class CinchyDynamicFormsModule {
}
