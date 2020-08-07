
import { NgModule, ModuleWithProviders } from '@angular/core';

import { ValueSetComponent } from './valueSet.component';
import { ValueSetRoutingModule } from './valueSet-routing.module';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { FormComponent } from './form/form.component';
import { GeneralComponent } from './form/general/general.component';
import { ValueSetSharedService } from './services/valueSet-shared.service';
import { ValueSetService } from './services/valueSet.service';
import { ValidationTableComponent } from './form/validation-table/validation-table.component';
import { ValidationQueryBasedComponent } from './form/validation-query-based/validation-query-based.component';
import { ValidationStaticComponent } from './form/validation-static/validation-static.component';
import { ExportImportService } from 'app/shared/services/export-import.service';
import { ImportComponent } from './form/import/import.component';






const PROVIDERS = [ LocalCacheService, TnzInputService, ValueSetSharedService,ValueSetService,ExportImportService]
@NgModule({
  declarations: [
    ValueSetComponent,
    ListComponent,
    FormComponent,
    GeneralComponent,
    ValidationTableComponent,
    ValidationQueryBasedComponent,
    ValidationStaticComponent,
    ImportComponent,

 
  ],
  imports: [
    CommonModule,
    ValueSetRoutingModule,
    SmdModule,
    PerfectScrollbarModule,
    TnzInputModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [PROVIDERS],
  bootstrap: [ValueSetComponent]
})
export class ValueSetModule {
  static forRoot(): ModuleWithProviders<ValueSetModule> {
    return {
      ngModule: ValueSetRoutingModule,
      providers: [PROVIDERS]
    }
  }
 }
