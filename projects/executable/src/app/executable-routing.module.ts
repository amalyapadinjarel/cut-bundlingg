import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExecutableComponent } from './executable.component';
import { ListComponent } from './list/list.component';


const routes: Routes =
  [
    {
      path: '',
      component: ExecutableComponent,
      children: [
        {
          path: '',
          redirectTo: 'list',
          pathMatch: 'full'
        },
        {
          path: 'list',
          component: ListComponent
        }
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutableRoutingModule { }
