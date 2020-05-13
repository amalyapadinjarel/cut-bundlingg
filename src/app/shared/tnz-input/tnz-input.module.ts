import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LocalConfigService } from '../services';
import { TnzInputService } from './_service/tnz-input.service';
import { TnzInputComponent } from './component/tnz-input.component';
import { TnzInputLOVComponent } from './input-lov/input-lov.component';
import { SmdModule } from '../component/smd/smd.module';
import { InputDirectiveModule } from '../directives/modules/input-directive.module';
import { NumericDirective } from '../directives/numeric.directive';

const PROVIDERS = [
  LocalConfigService,
  TnzInputService
];

@NgModule({
  declarations: [
    TnzInputComponent,
    TnzInputLOVComponent,
    NumericDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    SmdModule,
  ],
  providers: [
    PROVIDERS
  ],
  entryComponents: [
    TnzInputLOVComponent
  ],
  exports: [
    TnzInputComponent
  ]
})
export class TnzInputModule {
}
