import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ExecutableRoutingModule } from './executable-routing.module';
import { ExecutableComponent } from './executable.component';
import { ListComponent } from './list/list.component';
import { ModuleWithProviders } from '@angular/core';
import { ExecutableService } from './services/executable.service';
import { ExecutableSharedService } from './services/executable-shared.service';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { CommonModule } from '@angular/common';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { SharedModule } from 'app/shared/shared.module';

const PROVIDERS = [ExecutableService, ExecutableSharedService, LocalCacheService, TnzInputService];
@NgModule({
  declarations: [
    ExecutableComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    ExecutableRoutingModule,
    SmdModule,
    PerfectScrollbarModule,
    TnzInputModule,
    SharedModule
  ],
  providers: [PROVIDERS],
  bootstrap: [ExecutableComponent]
})
export class ExecutableModule {
  static forRoot(): ModuleWithProviders<ExecutableModule> {
    return {
      ngModule: ExecutableRoutingModule,
      providers: [PROVIDERS]
    }
  }
}
