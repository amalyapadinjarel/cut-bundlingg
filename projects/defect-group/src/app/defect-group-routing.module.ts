import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefectGroupComponent } from './defect-group.component';
import { ListComponent } from './components/defect-group-list/defect-group-list.component';
import { DefectGroupFormComponent } from './components/defect-group-form/defect-group-form.component';


const routes: Routes = [
  {
    path: '',
    component: DefectGroupComponent,
    children: [
   
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: ':defGroupId',
        component: DefectGroupFormComponent
      },
      {
        path: 'create',
        component: DefectGroupFormComponent
      } ,
      {
        path: ':defGroupId/edit',
        component: DefectGroupFormComponent
      } ,
      {
        path: '**',
        redirectTo: 'list',
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefectGroupRoutingModule { }
