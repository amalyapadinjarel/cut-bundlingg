import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValueSetComponent } from './valueSet.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';



const routes: Routes = [
  {
    path : '',
    component : ValueSetComponent
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
    }
   ,
    {
      path: ':setId',
      component: FormComponent
    },
    {
      path: 'create',
      component: FormComponent
    }
    ,
     {
      path: ':setId/edit',
      component: FormComponent
    }
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValueSetRoutingModule { }
