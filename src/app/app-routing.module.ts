import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AllFormsComponent} from './pages/all-forms/all-forms.component';
import {FormRowsContainerComponent} from './pages/form-rows-container/form-rows-container.component';


const routes: Routes = [
  {
    path: 'form-rows',
    component: FormRowsContainerComponent
  },
  {
    path: 'all-forms',
    component: AllFormsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
