import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import {  MachinesComponent } from './machines.component';
import { MachinesRoutingModule } from './machines-routing.module';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MachinesSharedService } from './services/machine-shared.service';
import { SharedModule } from 'app/shared/shared.module';
import { MachinesService } from './services/machine.service';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';

const PROVIDERS = [ LocalCacheService, TnzInputService,MachinesSharedService,MachinesService]

@NgModule({
  declarations: [
    MachinesComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    MachinesRoutingModule,
    SmdModule,
    PerfectScrollbarModule,
    SharedModule,
    TnzInputModule
  ],
  providers: [PROVIDERS],
  bootstrap: [MachinesComponent]
})
export class MachinesModule { 
  static forRoot(): ModuleWithProviders<MachinesModule> {
    return {
      ngModule: MachinesRoutingModule,
      providers: [PROVIDERS]
    }
  }
}
