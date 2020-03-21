import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {CinchyConfig, CinchyModule, CinchyService} from '@cinchy-co/angular-sdk';
import {NgxSelectModule, INgxSelectOptions} from 'ngx-select-ex';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ToastrModule} from 'ngx-toastr';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {CustomMaterialModule} from './custom-material.module';
import {environment} from '../environments/environment';
import {CinchyDynamicFormsModule} from './cinchy-dynamic-forms/cinchy-dynamic-forms.module';
import {CoreModule} from './core/core.module';

const CustomSelectOptions: INgxSelectOptions = { // Check the interface for more options
  optionValueField: 'id',
  optionTextField: 'label',
  keepSelectedItems: true
};

@NgModule({
  declarations: [
    AppComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CinchyModule.forRoot(),
    AngularFontAwesomeModule,
    FilterPipeModule,
    AngularMultiSelectModule,
    NgxSelectModule.forRoot(CustomSelectOptions),
    NgxSpinnerModule,
    CustomMaterialModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      closeButton: true,
      preventDuplicates: true
    }),
    CoreModule,
    CinchyDynamicFormsModule // cinchy-dynamic-form-modules
  ],
  providers: [CinchyModule, CinchyService, {
    provide: CinchyConfig, useValue: environment.cinchyConfig
  }],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
