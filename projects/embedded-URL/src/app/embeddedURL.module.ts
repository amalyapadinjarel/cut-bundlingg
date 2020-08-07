import { NgModule, ModuleWithProviders } from '@angular/core';
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
import { FormComponent } from './form/form.component';
import { GeneralCardComponent } from './form/general-card/general-card.component';
import { EmbeddedURLService } from './_service/embedded-URL.service';
import { EmbeddedURLSharedService } from './_service/embedded-URL-shared.service';
import { MatTabsModule } from '@angular/material/tabs';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { SmdPaginatorComponent } from 'app/shared/component/smd/smd-paginator';
import { EmbeddedURLComponent } from './embeddedURL.component';
import { EmbeddedURLUsersComponent } from './form/embedded-url-users/embedded-url-users.component';

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
  EmbeddedURLService,
  EmbeddedURLSharedService,
  LocalCacheService
]

const embeddedURLRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: EmbeddedURLComponent,
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
        path: ':EmbeddedURL/edit',
        component: FormComponent
      },
      {
        path: ':EmbeddedURL',
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
    EmbeddedURLComponent,
    ListComponent,
    FormComponent,
    EmbeddedURLUsersComponent,
    GeneralCardComponent,
    EmbeddedURLUsersComponent,
    
    
  ],
  imports: [
    embeddedURLRouting,
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
  bootstrap: [EmbeddedURLComponent]
})
export class EmbeddedURLModule {
  static forRoot(): ModuleWithProviders<EmbeddedURLModule> {
    return {
      ngModule: EmbeddedURLModule,
      providers: [
        PROVIDERS
      ]
    }
  }
}
