import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacilityComponent } from "./facility.component";
import {FacilityListComponent} from './components/facility-list/facility-list.component';
import { FacilityFormComponent } from './components/form/facility-form.component';

const routes: Routes = [
{
  path : '',
  component:FacilityComponent,
  children: [
    {
      path: 'list',
      component: FacilityListComponent
  },
  {
    path: ':facilityId',
    component: FacilityFormComponent
  },
  {
    path: 'create',
    component: FacilityFormComponent
  },
   {
    path: ':facilityId/edit',
    component: FacilityFormComponent
  },
  {
    path: '**',
    redirectTo: 'list'
}

  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityRoutingModule { }
