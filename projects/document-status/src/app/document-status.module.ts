import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DocumentStatusComponent } from './document-status.component';
import { DocumentStatusRoutingModule } from './document-status-routing.module';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { DocumentStatusService } from './services/document-status.service';
import { DocumentStatusSharedService } from './services/document-status-shared.service';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ModuleWithProviders } from '@angular/core';

const PROVIDERS = [DocumentStatusService, DocumentStatusSharedService, LocalCacheService, TnzInputService];
@NgModule({
  declarations: [
    DocumentStatusComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    DocumentStatusRoutingModule,
    SmdModule,
    PerfectScrollbarModule,
    TnzInputModule,
    SharedModule
  ],
  providers: [PROVIDERS],
  bootstrap: [DocumentStatusComponent]
})
export class DocumentStatusModule {
  static forRoot(): ModuleWithProviders<DocumentStatusModule> {
    return {
      ngModule: DocumentStatusRoutingModule,
      providers: [PROVIDERS]
    }
  }
}
