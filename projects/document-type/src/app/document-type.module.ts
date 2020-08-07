
import { NgModule,ModuleWithProviders } from '@angular/core';
import { DocumentTypeComponent } from './document-type.component';
import { DocumentTypeRoutingModule } from './document-type-routing.module';
import { LocalCacheService } from '../../../../src/app/shared/services';
import { TnzInputService } from '../../../../src/app/shared/tnz-input/_service/tnz-input.service';
import { CommonModule } from '@angular/common';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { RouterModule } from '@angular/router';
import { ListComponent } from '../../../document-type/src/app/list/list.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DocTypeFormComponent } from './form/form.component';
import { GeneralComponent } from './form/general/general.component';
import { TnzInputModule } from '../../../../src/app/shared/tnz-input/tnz-input.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';


import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RolesDetailsComponent } from './form/roles-details/roles-details.component';
import { StatusDetailsComponent } from './form/status-details/status-details.component';
import { DocumentTypeService } from './_service/document-type.service';
import { DocumentTypeSharedService } from './_service/document-type-shared.service';
import { CommonComponentsModule } from 'app/shared/component/common-components.module';

const MATERIAL_MODULE = [
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatSnackBarModule,
  MatButtonModule,
  MatTabsModule,
  MatMenuModule,
  MatTooltipModule,
  MatToolbarModule,
  MatDialogModule,
  MatExpansionModule
];


const PROVIDERS = [LocalCacheService, TnzInputService,DocumentTypeService,DocumentTypeSharedService];

@NgModule({
  declarations: [
    DocumentTypeComponent,
    ListComponent,
    DocTypeFormComponent,
    GeneralComponent,
    RolesDetailsComponent,
    StatusDetailsComponent
  ],
  imports: [
    DocumentTypeRoutingModule,
    CommonModule,
    SmdModule,
    CommonComponentsModule,
    PerfectScrollbarModule,
    TnzInputModule,
    FormsModule,
    ReactiveFormsModule,
    MATERIAL_MODULE,
    SharedModule
  ],
  providers: [PROVIDERS],
  bootstrap: [DocumentTypeComponent]
})
export class DocumentTypeModule {
  static forRoot(): ModuleWithProviders<DocumentTypeModule> {
    return {
      ngModule: DocumentTypeModule,
      providers: [
        PROVIDERS
      ]
    }
  }
 }
