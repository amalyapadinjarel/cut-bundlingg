import { NgModule, ModuleWithProviders } from '@angular/core';

import { DivisionComponent } from './division.component';
import { DivisionRoutingModule } from './division-routing.module';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SmdModule } from 'app/shared/component/smd/smd.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DivisionService } from './services/division.service';
import { DivisionSharedService } from './services/division-shared.service';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';


import { HeaderComponent } from './Form/header/header.component';
import { ListComponent } from './list/list.component';
import { CardComponent } from './Form/card/card.component';
import { FormComponent } from './Form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { NewLocationComponent } from './Form/new-location/new-location.component';



const PROVIDERS = [ LocalCacheService, TnzInputService,DivisionService,DivisionSharedService]
@NgModule({

  declarations: [
    DivisionComponent,
    ListComponent,
    CardComponent,
    FormComponent,
    HeaderComponent,
    NewLocationComponent
  ],
  imports: [
    CommonModule,
    DivisionRoutingModule,
    SmdModule,
    PerfectScrollbarModule,
    TnzInputModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule

  ],
  providers: [PROVIDERS],
  bootstrap: [DivisionComponent]
})

export class DivisionModule { 
  static forRoot(): ModuleWithProviders<DivisionModule> {
    return {
      ngModule: DivisionRoutingModule,
      providers: [PROVIDERS]
    }
  }
}
