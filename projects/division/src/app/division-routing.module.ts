import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DivisionComponent } from './division.component';
import { CardComponent } from './Form/card/card.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './Form/form.component';
;



const routes: Routes = [
  {
    path : '',
    component : DivisionComponent
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
      path: ':divisionId',
      component: FormComponent
    },
    {
      path: 'create',
      component: FormComponent
    },
     {
      path: ':divisionId/edit',
      component: FormComponent
    },
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisionRoutingModule { }
