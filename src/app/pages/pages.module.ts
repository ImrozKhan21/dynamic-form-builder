import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CustomMaterialModule} from '../custom-material.module';
import {AllFormsComponent} from './all-forms/all-forms.component';
import {FormRowsContainerComponent} from './form-rows-container/form-rows-container.component';
import {CoreModule} from '../core/core.module';
import {CinchyDynamicFormsModule} from '../cinchy-dynamic-forms/cinchy-dynamic-forms.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [AllFormsComponent, FormRowsContainerComponent],
  imports: [
    BrowserModule, // Used for async pipes
    RouterModule,
    CustomMaterialModule,
    CinchyDynamicFormsModule,
    CoreModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ],
  exports: [],
  providers: []
})
export class PagesModule {
}
