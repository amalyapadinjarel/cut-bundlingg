import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ListComponent } from './list/list.component';
//import { GeneralCardComponent } from './form/general-card/general-card.component';
import { MatCardModule } from '@angular/material/card';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OperationSharedService } from './_service/operation-shared.service';
import { OperationService } from './_service/operation.service';
import { LocalCacheService } from 'app/shared/services';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { OperationComponent } from './operation.component';
// import { UserRolesComponent } from './form/user-roles/user-roles.component';
// import { UserOrgAccessComponent } from './form/user-org-access/user-org-access.component';

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
  OperationService,
  OperationSharedService,
  LocalCacheService
]

const operationRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: OperationComponent,
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
  },
]);

@NgModule({
  declarations: [
    OperationComponent,
    ListComponent
 
  ],
  imports: [
   
    operationRouting,
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
  bootstrap: [OperationComponent]
})
export class OperationModule {
  static forRoot(): ModuleWithProviders<OperationModule> {
    return {
      ngModule: OperationModule,
      providers: [PROVIDERS]
    }
  }

}
