import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserWcAccessComponent } from './user-wc-access.component';
import { ListComponent } from '../../../user-wc-access/src/app/list/list.component';


const routes: Routes = [
  {
    path: '',
    component: UserWcAccessComponent,
    children: [
      {
        path: 'list',
        component: ListComponent
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
export class UserWcAccessRoutingModule { }
