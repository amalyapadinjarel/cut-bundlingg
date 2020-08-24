import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { RolesComponent } from './roles.component';
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
import { RolesSharedService } from './_service/roles-shared.service';
import { RolesService } from './_service/roles.service';
import { LocalCacheService } from 'app/shared/services';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { RoleUsersComponent } from './form/role-users/role-users.component';
import { RolesOrgAccessComponent } from './form/role-org-access/role-org-access.component';
import { ApplicationGroupComponent } from './form/application-group/application-group.component';
import { TaskFlowComponent } from './form/taskflow/taskflow.component';
import { ApplicationComponent } from './form/application/application.component';
import { OrgAccessExpansionComponent } from './form/org-access-expansion-panel/org-access-expansion-panel';
import { TestComponent } from './form/test/test.component';

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
  RolesService,
  RolesSharedService,
  LocalCacheService
]

const rolesRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: RolesComponent,
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
        path: ':roleId/edit',
        component: FormComponent
      },
      {
        path: ':roleId',
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
    RolesComponent,
    FormComponent,
    ListComponent,
    GeneralCardComponent,
    RoleUsersComponent,
    RolesOrgAccessComponent,
    ApplicationGroupComponent,
    TaskFlowComponent,
    ApplicationComponent,
    OrgAccessExpansionComponent,
    TestComponent
  ],
  imports: [
   rolesRouting,
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
  bootstrap: [RolesComponent]
})
export class RolesModule { 
static forRoot():ModuleWithProviders<RolesModule>{
  return{
    ngModule:RolesModule,
    providers:[PROVIDERS]
  }
}

}
