import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentTypeComponent } from './document-type.component';
import { ListComponent } from './list/list.component';
import { DocTypeFormComponent } from './form/form.component';



const routes: Routes = [{
  path: '',

component: DocumentTypeComponent,
children: [
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'create',
    component: DocTypeFormComponent
  } ,

  {
    path: ':docTypeId/edit',
    component: DocTypeFormComponent
  } ,
  {
    path: ':docTypeId',
    component: DocTypeFormComponent
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
export class DocumentTypeRoutingModule { }
