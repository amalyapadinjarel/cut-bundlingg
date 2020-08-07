import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocSequenceComponent } from './doc-sequence.component';
import { ListComponent } from '../../../doc-sequence/src/app/list/list.component';
import { FormComponent } from '../../../doc-sequence/src/app/form/form.component';


const routes: Routes = [{
  path: '',
  component: DocSequenceComponent,
  children: [
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: ':docSeqId',
    component: FormComponent
  },
  {
    path: 'create',
    component: FormComponent
  } ,

  {
    path: ':docSeqId/edit',
    component: FormComponent
  } ,
  {
    path: '**',
    redirectTo: 'list'
  }
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocSequenceRoutingModule { }
 