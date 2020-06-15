import { NgModule, ModuleWithProviders } from '@angular/core';
import { LookupComponent } from './lookup.component';
import { RouterModule } from '@angular/router';
import { ApiService, UserService, JwtService, EventService, NavigationService, LocalCacheService } from 'app/shared/services';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { AlertUtilities } from 'app/shared/utils';
import { AuthService } from '../../../authentication/src/app/_services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { LookupFormComponent } from './form/lookupForm.component';
import { LookupHeaderComponent } from './form/header/header.component';
import { GeneralCardComponent } from './form/General-card/card.component';
import { LookupService } from './_service/lookup.service';
import { LookupSharedService } from './_service/lookup-shared.service';
import { MatTabsModule } from '@angular/material/tabs';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LookupValueComponent } from './form/lookupValue/lookupValue.component';
import { SharedModule } from 'app/shared/shared.module';
import { SmdPaginatorComponent } from 'app/shared/component/smd/smd-paginator';

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
  LookupService,
  LookupSharedService,
  LocalCacheService
]

const lookupRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: LookupComponent,
    children: [
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: 'create',
        component: LookupFormComponent
      },
      {
        path: ':LookupType/edit',
        component: LookupFormComponent
      },
      {
        path: ':LookupType',
        component: LookupFormComponent
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
    LookupComponent,
    ListComponent,
    LookupFormComponent,
    LookupHeaderComponent,
    LookupValueComponent,
    GeneralCardComponent,
    
    
  ],
  imports: [
    lookupRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MATERIAL_MODULE,
    SmdModule,
    TnzInputModule,
    PerfectScrollbarModule,
    SharedModule
    // TrendzDriveModule
  ],
  providers: [
    PROVIDERS
  ],
  bootstrap: [LookupComponent]
})
export class LookupModule {
  static forRoot(): ModuleWithProviders<LookupModule> {
    return {
      ngModule: LookupModule,
      providers: [
        PROVIDERS
      ]
    }
  }
}
