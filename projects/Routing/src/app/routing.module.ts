import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { RoutingComponent } from './routing.component';
import { RouterModule } from '@angular/router';
import { RoutingListComponent } from './routing-list/routing-list.component';
import { RoutingService } from './_service/routing.service';
import { RoutingSharedService } from './_service/routing-shared.service';
import { LocalCacheService } from 'app/shared/services/local-cache.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RoutingFormComponent } from './routing-form/routing-form.component';
import { HeaderComponent } from './routing-form/header/header.component';
import { RoutingCardComponent } from './routing-form/routing-card/routing-card.component';
import { CutPanelsComponent } from './routing-form/cut-panels/cut-panels.component';
import { AddNewSemiProductComponent } from './routing-form/add-new-semi-product/add-new-semi-product.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from 'app/shared/shared.module';

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
const RoutingRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: RoutingComponent,
    children: [
      {
        path:'',
        redirectTo:'list',
        pathMatch:'full'
      },
      {
        path: 'list',
        component: RoutingListComponent
      },
      {
        path: ':routingId/edit',
        component: RoutingFormComponent
      },
      {
        path: ':routingId',
        component: RoutingFormComponent
      },
      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  },
]);

const PROVIDERS = [
  RoutingService,
  RoutingSharedService,
  LocalCacheService
]
@NgModule({
  declarations: [
    RoutingComponent,
    RoutingListComponent,
    RoutingFormComponent,
    HeaderComponent,
    RoutingCardComponent,
    CutPanelsComponent,
    AddNewSemiProductComponent
  ],
  imports: [
    RoutingRouting,
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
  bootstrap: [RoutingComponent]
})
export class RoutingModule { 
  static forRoot(): ModuleWithProviders<RoutingModule> {
    return {
      ngModule: RoutingModule,
      providers: [
        PROVIDERS
      ]
    }
  }
}
