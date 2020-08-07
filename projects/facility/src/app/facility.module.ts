import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';


import { CommonModule } from '@angular/common';
import { SmdModule } from 'app/shared/component/smd/smd.module';

import { FacilityService } from './services/facility.service';
import { FacilitySharedService } from './services/facility-shared.service';

import { FacilityComponent } from './facility.component';
import { FacilityRoutingModule } from "./facility-routing.module";
import { LocalCacheService } from "app/shared/services";
import { TnzInputService } from "app/shared/tnz-input/_service/tnz-input.service";
import { FacilityListComponent } from './components/facility-list/facility-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { FacilityFormComponent } from './components/form/facility-form.component';
import { FacilityCardComponent } from './components/form/facility-card/facility-card.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FacilityHeaderComponent } from './components/form/facility-header/facility-header.component';
import { AddlocationPopupComponent } from './components/form/addlocation-popup/addlocation-popup.component';
const PROVIDERS = [ LocalCacheService, TnzInputService,FacilityService,FacilitySharedService];
const MATERIAL_MODULE = [
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatSnackBarModule,
  MatButtonModule,
  MatTabsModule,
  MatMenuModule,
  MatTooltipModule
];
@NgModule({
  declarations: [
    FacilityComponent,
    FacilityListComponent,
    FacilityFormComponent,
    FacilityCardComponent,
    FacilityHeaderComponent,
    AddlocationPopupComponent
  ],
  imports: [
    CommonModule,
    FacilityRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    MATERIAL_MODULE,
    SmdModule,
    TnzInputModule,
    PerfectScrollbarModule,
    SharedModule
  ],
  providers: [PROVIDERS],
  bootstrap: [FacilityComponent]
})
export class FacilityModule { 
  static forRoot(): ModuleWithProviders<FacilityModule> {
    return {
      ngModule: FacilityRoutingModule,
      providers: [PROVIDERS]
    }
  }
}
