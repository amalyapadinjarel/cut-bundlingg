
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DocSequenceComponent } from './doc-sequence.component';
import { DocSequenceRoutingModule } from './doc-sequence-routing.module';
import { ListComponent } from './list/list.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { DocSequenceService } from './_service/doc-sequence.service';
import { DocSequenceSharedService } from './_service/doc-sequence-shared.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { TnzInputModule } from '../../../../src/app/shared/tnz-input/tnz-input.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { GeneralComponent } from './form/general/general.component';
import { LineDetailComponent } from './form/line-detail/line-detail.component';
import { ConfigRefComponent } from './form/config-ref/config-ref.component';

const MATERIAL_MODULE = [
  MatCardModule,
  MatIconModule,
  MatInputModule,
];
const PROVIDERS = [
  LocalCacheService
  , TnzInputService
  ,DocSequenceService
  ,DocSequenceSharedService
  
];

@NgModule({
  declarations: [
    DocSequenceComponent,
    ListComponent,
    FormComponent,
    GeneralComponent,
    LineDetailComponent,
    ConfigRefComponent,
    
  ],
  imports: [
    DocSequenceRoutingModule,
    PerfectScrollbarModule,
    SmdModule,
    MATERIAL_MODULE,
     CommonModule,
     SharedModule,
    TnzInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
 
  bootstrap: [DocSequenceComponent],
  providers: [PROVIDERS]
})
export class DocSequenceModule {
  static forRoot(): ModuleWithProviders<DocSequenceModule> {
    return {
      ngModule: DocSequenceRoutingModule,
      providers: [
        PROVIDERS
      ]
    }
  }
 }
