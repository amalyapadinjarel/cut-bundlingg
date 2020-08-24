import { NgModule, ModuleWithProviders } from '@angular/core';
import { ProductionProcessesComponent } from './production-processes.component';
import { ProductionProcessesRoutingModule } from './production-processes-routing.module';

import { PdnProcessListComponent } from './components/pdn-process-list/pdn-process-list.component';

import { SmdModule } from 'app/shared/component/smd/smd.module';
import { PdnProcessService } from './services/pdn-process.service';
import { PdnProcessSharedService } from './services/pdn-process-shared.service';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { SharedModule } from 'app/shared/shared.module';

const PROVIDERS = [PdnProcessService, PdnProcessSharedService, LocalCacheService, TnzInputService];

@NgModule({
  declarations: [
    ProductionProcessesComponent,
    PdnProcessListComponent
  ],
  imports: [
    CommonModule,
    ProductionProcessesRoutingModule,
    SmdModule,
    PerfectScrollbarModule,
    TnzInputModule,
    SharedModule
  ],
  providers: [PROVIDERS],
  bootstrap: [ProductionProcessesComponent]
})
export class ProductionProcessesModule { 
  static forRoot(): ModuleWithProviders<ProductionProcessesModule> {
    return {
      ngModule: ProductionProcessesRoutingModule,
      providers: [PROVIDERS]
    }
  }
}
