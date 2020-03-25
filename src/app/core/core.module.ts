import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {SidenavComponent} from './sidenav/sidenav.component';
import {RouterModule} from '@angular/router';
import {CustomMaterialModule} from '../custom-material.module';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    SidenavComponent],
  imports: [
    BrowserModule, // Used for async pipes
    RouterModule,
    CustomMaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    SidenavComponent
  ],
  providers: []
})
export class CoreModule {
}
