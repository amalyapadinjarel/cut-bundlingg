import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import {UomComponent } from './uom.component';
import { UomRoutingModule } from './uom-routing.module';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { CommonModule } from '@angular/common';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'app/shared/shared.module';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { ListComponent } from './list/list.component';
import { UomSharedService } from './service/uom-shared.service';
import { UomService } from './service/uom.service';
import { FormComponent } from './form/form.component';
import { GeneralComponent } from './form/general/general.component';
import { UomHeaderComponent } from './form/uom-header/uom-header.component';
import { UomConversionComponent } from './form/uom-conversion/uom-conversion.component';

const PROVIDERS = [ LocalCacheService, TnzInputService,UomSharedService,UomService]

@NgModule({
  declarations: [
    UomComponent,
    ListComponent,
    FormComponent,
    GeneralComponent,
    UomHeaderComponent,
    UomConversionComponent
  ],
  imports: [
    CommonModule,
    SmdModule,
    PerfectScrollbarModule,
    SharedModule,
    TnzInputModule,
    UomRoutingModule
  ],
  providers: [PROVIDERS],
  bootstrap: [UomComponent]
})
export class UomModule { 
  static forRoot(): ModuleWithProviders<UomModule> {
    return {
      ngModule: UomRoutingModule,
      providers: [PROVIDERS]
    }
  }
}
