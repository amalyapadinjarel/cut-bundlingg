import { NgModule, ModuleWithProviders } from '@angular/core';

import { PackingInstructionsComponent } from './packing-instructions.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { LocalCacheService } from 'app/shared/services';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'app/shared/shared.module';
import { PackingInstructionsListComponent } from './packing-instructions-list/packing-instructions-list.component';
import { PackingInstructionsService } from './services/packing-instructions.service';
import { PackingInstructionsSharedService } from './services/packing-instructions-shared.service';
import { PackingInstructionsFormComponent } from './packing-instructions-form/packing-instructions-form.component';
import { HeaderComponent } from './packing-instructions-form/header/header.component';
import { CardComponent } from './packing-instructions-form/card/card.component';
import { PacksComponent } from './packing-instructions-form/packs/packs.component';
import { AddPacksComponent } from './packing-instructions-form/packs/add-packs/add-packs.component';
import { SolidPacksComponent } from './packing-instructions-form/packs/solid-packs/solid-packs.component';
import { RatioPacksComponent } from './packing-instructions-form/packs/ratio-packs/ratio-packs.component';
import { CartonsComponent } from './packing-instructions-form/cartons/cartons.component';
import { RepackReasonComponent } from './packing-instructions-form/packs/repack-reason/repack-reason.component';

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
const PackingInstructionsRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: PackingInstructionsComponent,
    children: [
      {
        path:'',
        redirectTo:'list',
        pathMatch:'full'
      },
      {
        path: 'list',
        component: PackingInstructionsListComponent
      },
      {
        path: ':poId/:orderId/:parentProductId/edit',
        component: PackingInstructionsFormComponent
      },
      {
        path: ':poId/:orderId/:parentProductId',
        component: PackingInstructionsFormComponent
      },
      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  },
]);

const PROVIDERS = [
  PackingInstructionsService,
  PackingInstructionsSharedService,
  LocalCacheService
]
@NgModule({
  declarations: [
    PackingInstructionsComponent,
    PackingInstructionsListComponent,
    PackingInstructionsFormComponent,
    HeaderComponent,
    CardComponent,
    PacksComponent,
    AddPacksComponent,
    SolidPacksComponent,
    RatioPacksComponent,
    CartonsComponent,
    RepackReasonComponent
  ],
  imports: [
    PackingInstructionsRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MATERIAL_MODULE,
    SmdModule,
    TnzInputModule,
    PerfectScrollbarModule,
    SharedModule
  ],
  providers: [PROVIDERS],
  bootstrap: [PackingInstructionsComponent]
})
export class PackingInstructionsModule { 
  static forRoot(): ModuleWithProviders<PackingInstructionsModule> {
    return {
      ngModule: PackingInstructionsModule,
      providers: [
        PROVIDERS
      ]
    }
  }
}
