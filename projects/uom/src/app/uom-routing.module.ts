import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UomComponent } from './uom.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';


const routes: Routes = [
 {
    path : '',
    component : UomComponent
    ,
  children: [
    {
      path : '',
      redirectTo: 'list',
      pathMatch: 'full'
    },
    {
      path: 'list',
      component: ListComponent
   },
   {
     path: ':categoryId',
     component: FormComponent
   },
   {
     path: 'create',
     component: FormComponent
   }
   ,
    {
     path: ':categoryId/edit',
     component: FormComponent
   }

  ]}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UomRoutingModule { }
