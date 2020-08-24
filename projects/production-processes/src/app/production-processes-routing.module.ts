import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductionProcessesComponent } from './production-processes.component';
import { PdnProcessListComponent } from './components/pdn-process-list/pdn-process-list.component';


const routes: Routes = [
  {
    path : '',
    component:ProductionProcessesComponent,
    children: [
      {
        path: 'list',
        component: PdnProcessListComponent
    },
    {
      path: '**',
      redirectTo: 'list'
  }
    ]
  }
];

@NgModule({
  imports:  [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionProcessesRoutingModule { }
