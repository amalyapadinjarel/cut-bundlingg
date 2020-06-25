import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

//import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { GeneralCardComponent } from './form/general-card/general-card.component';
import { MatCardModule } from '@angular/material/card';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserSharedService } from './_service/user-shared.service';
import { UserAppService } from './_service/user.service';
import { LocalCacheService } from 'app/shared/services';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { UserRolesComponent } from './form/user-roles/user-roles.component';
import { UserOrgAccessComponent } from './form/user-org-access/user-org-access.component';

const MATERIAL_MODULE = [
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatSnackBarModule,
  MatButtonModule,
  MatTabsModule,
  MatMenuModule,
  MatTooltipModule
];

const PROVIDERS = [
  UserAppService,
  UserSharedService,
  LocalCacheService
]

const userRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: 'create',
        component: FormComponent
      },
      {
        path: ':userId/edit',
        component: FormComponent
      },
      {
        path: ':userId',
        component: FormComponent
      },
      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  },
]);

@NgModule({
  declarations: [
    UserComponent,
    FormComponent,
    ListComponent,
    GeneralCardComponent,
    UserRolesComponent,
    UserOrgAccessComponent
  ],
  imports: [
    //BrowserModule,
   // UserRoutingModule,
    userRouting,
    TnzInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MATERIAL_MODULE,
    SmdModule,
    PerfectScrollbarModule,
    SharedModule
  ],
  providers: [PROVIDERS],
  bootstrap: [UserComponent]
})
export class UserModule { 
static forRoot():ModuleWithProviders<UserModule>{
  return{
    ngModule:UserModule,
    providers:[PROVIDERS]
  }
}

}
