import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DefectGroupComponent } from './defect-group.component';
import { DefectGroupRoutingModule } from './defect-group-routing.module';
import { CommonModule } from '@angular/common';
import { DefectGroupService } from './services/defect-group.service';
import { DefectGroupSharedService } from './services/defect-group-shared.service';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ListComponent } from './components/defect-group-list/defect-group-list.component';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefectGroupFormComponent } from './components/defect-group-form/defect-group-form.component';
import { GeneralDetailsComponent } from './components/defect-group-form/components/general-details/general-details.component';
import { defectLineComponent } from './components/defect-group-form/components/defects-tab/defects-tab.component';
import { CopyDefectComponent } from './components/defect-group-form/components/copy-defect/copy-defect.component';

const PROVIDERS = [DefectGroupService, DefectGroupSharedService, LocalCacheService, TnzInputService];
@NgModule({
  declarations: [
    DefectGroupComponent , ListComponent , DefectGroupFormComponent , GeneralDetailsComponent , DefectGroupFormComponent , defectLineComponent , CopyDefectComponent
  ],
  imports: [
    CommonModule,
    DefectGroupRoutingModule,
    SmdModule,
    PerfectScrollbarModule,
    TnzInputModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [PROVIDERS],
  bootstrap: [DefectGroupComponent]
})
export class DefectGroupModule {

  static forRoot(): ModuleWithProviders<DefectGroupModule> {
    return {
      ngModule: DefectGroupRoutingModule,
      providers: [PROVIDERS]
    }
  }
}
