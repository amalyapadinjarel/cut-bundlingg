import { NgModule, ModuleWithProviders } from '@angular/core';
import { CutRegisterComponent } from './cutRegister.component';
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
import { PdmCostingFormComponent } from './form/form.component';
import { CutPanelDetailsComponent } from './form/cut-panel-details/cut-panel-details.component';
import { PdmCostingHeaderComponent } from './form/header/header.component';
import { PdmCostingCardComponent } from './form/costing-card/card.component';
import { CutRegisterService } from './_service/cut-register.service';
import { CutRegisterSharedService } from './_service/cut-register-shared.service';
import { MatTabsModule } from '@angular/material/tabs';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LayerDetailsComponent } from './form/layer-details/layer-details.component';
import { MarkerDetailsComponent } from './form/marker-details/marker-details.component';
import { OrderDetailsComponent } from './form/order-details/order-details.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CutBundleComponent } from './form/cut-bundle/cut-bundle.component';

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
  CutRegisterService,
  CutRegisterSharedService,
  LocalCacheService
]

const cutRegisterRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: CutRegisterComponent,
    children: [
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: 'create',
        component: PdmCostingFormComponent
      },
      {
        path: ':costingId/edit',
        component: PdmCostingFormComponent
      },
      {
        path: ':costingId',
        component: PdmCostingFormComponent
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
    CutRegisterComponent,
    ListComponent,
    PdmCostingFormComponent,
    PdmCostingHeaderComponent,
    PdmCostingCardComponent,
    CutPanelDetailsComponent,
    LayerDetailsComponent,
    MarkerDetailsComponent,
    OrderDetailsComponent,
    CutBundleComponent
  ],
  imports: [
    cutRegisterRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MATERIAL_MODULE,
    SmdModule,
    TnzInputModule,
    PerfectScrollbarModule
    // TrendzDriveModule
  ],
  providers: [
    PROVIDERS
  ],
  bootstrap: [CutRegisterComponent]
})
export class CutRegisterModule {
  static forRoot(): ModuleWithProviders<CutRegisterModule> {
    return {
      ngModule: CutRegisterModule,
      providers: [
        PROVIDERS
      ]
    }
  }
}
