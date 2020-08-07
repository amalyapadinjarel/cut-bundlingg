import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { OperationGroupRoutingModule } from './operationGroup-routing.module';
import { OperationGroupComponent } from './operationGroup.component';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { ListComponent } from './list/list.component';
import { CommonModule } from '@angular/common';
import { OperationGroupSharedService } from './services/operationGroup-shared.service';
import { OperationGroupService } from './services/operationGroup.service';

const PROVIDERS = [OperationGroupService, OperationGroupSharedService, LocalCacheService, TnzInputService];
@NgModule({
  declarations: [
    OperationGroupComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    OperationGroupRoutingModule,
    SmdModule,
    PerfectScrollbarModule,
    TnzInputModule,
    SharedModule
  ],
  providers: [PROVIDERS],
  bootstrap: [OperationGroupComponent]
})
export class OperationGroupModule {
  static forRoot(): ModuleWithProviders<OperationGroupModule> {
    return {
      ngModule: OperationGroupRoutingModule,
      providers: [PROVIDERS]
    }
  }
}
