import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { WorkCenterComponent } from './work-center.component';
import { WorkCenterRoutingModule } from './work-center-routing.module';
import { WorkCenterService } from './services/work-center.service';
import { WorkCenterSharedService } from './services/work-center-shared.service';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { SharedModule } from 'app/shared/shared.module';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { FormsModule } from '@angular/forms';
const PROVIDERS = [WorkCenterService, WorkCenterSharedService, LocalCacheService, TnzInputService];
@NgModule({
  declarations: [
    WorkCenterComponent, ListComponent
  ],
  imports: [
    CommonModule,
    WorkCenterRoutingModule,
    SmdModule,
    PerfectScrollbarModule,
    TnzInputModule,
    SharedModule,
    // NgSelectModule,
    // FormsModule
  ],
  providers: [PROVIDERS],
  bootstrap: [WorkCenterComponent]
})
export class WorkCenterModule {

  static forRoot(): ModuleWithProviders<WorkCenterModule> {
    return {
      ngModule: WorkCenterRoutingModule,
      providers: [PROVIDERS]
    }
  }
}
