import {ModuleWithProviders, NgModule} from '@angular/core';

import { MfgRoutingRoutingModule } from './mfgRouting-routing.module';
import { MfgRoutingComponent } from './mfg-routing.component';
import { MfgRoutingListComponent } from './components/mfg-routing-list/mfg-routing-list.component';
import { MfgRoutingFormComponent } from './components/mfg-routing-form/mfg-routing-form.component';
import {LocalCacheService} from '../../../../src/app/shared/services';
import {MfgRoutingSharedService} from './services/mfg-routing-shared.service';
import {TnzInputService} from '../../../../src/app/shared/tnz-input/_service/tnz-input.service';
import {CommonModule} from '@angular/common';
import { DocumentDetailsComponent } from './components/mfg-routing-form/components/document-details/document-details.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SmdModule} from '../../../../src/app/shared/component/smd/smd.module';
import {TnzInputModule} from '../../../../src/app/shared/tnz-input/tnz-input.module';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import { GeneralDetailsComponent } from './components/mfg-routing-form/components/general-details/general-details.component';
import {MfgRoutingService} from './services/mfg-routing.service';
import { OperationsTabComponent } from './components/mfg-routing-form/components/operations-tab/operations-tab.component';
import { NewOperationGroupComponent } from './components/mfg-routing-form/components/new-operation-group/new-operation-group.component';
import {SharedModule} from '../../../../src/app/shared/shared.module';

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

const PROVIDERS = [MfgRoutingService, MfgRoutingSharedService, LocalCacheService, TnzInputService];


@NgModule({
  declarations: [
    MfgRoutingComponent,
    MfgRoutingListComponent,
    MfgRoutingFormComponent,
    DocumentDetailsComponent,
    GeneralDetailsComponent,
    OperationsTabComponent,
    NewOperationGroupComponent
  ],
    imports: [
        MfgRoutingRoutingModule,
        CommonModule,

        FormsModule,
        ReactiveFormsModule,
        MATERIAL_MODULE,
        SmdModule,
        TnzInputModule,
        PerfectScrollbarModule,
        SharedModule
    ],
  providers: [PROVIDERS],
  bootstrap: [MfgRoutingComponent]
})
export class MfgRoutingModule {
  static forRoot(): ModuleWithProviders<MfgRoutingModule> {
    return {
      ngModule: MfgRoutingRoutingModule,
      providers: [PROVIDERS]
    }
  }
}
