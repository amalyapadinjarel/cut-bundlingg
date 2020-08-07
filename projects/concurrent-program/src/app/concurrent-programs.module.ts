import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ConcurrentProgramsComponent } from './concurrent-programs.component';
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
import { RouterModule } from '@angular/router';
import { ConcurrentProgramService } from './services/concurrent-program.service';
import { ConcurrentProgramSharedService } from './services/concurrent-program-shared.service';
import { LocalCacheService } from 'app/shared/services';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { TnzInputModule } from 'app/shared/tnz-input/tnz-input.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from 'app/shared/shared.module';
import { ConcurrentProgramsListComponent } from './components/concurrent-programs-list/concurrent-programs-list.component';
import { ConcurrentProgramsFormComponent } from './components/concurrent-programs-form/concurrent-programs-form.component';
import { HeaderComponent } from './components/concurrent-programs-form/header/header.component';
import { CardComponent } from './components/concurrent-programs-form/card/card.component';
import { ParameterComponent } from './components/concurrent-programs-form/parameter/parameter.component';
import { TemplatesComponent } from './components/concurrent-programs-form/templates/templates.component';
import { StyleSheetComponent } from './components/concurrent-programs-form/style-sheet/style-sheet.component';
import { RolesComponent } from './components/concurrent-programs-form/roles/roles.component';
import { ExportImportService } from 'app/shared/services/export-import.service';
import { ConcurrentProgramImportComponent } from './components/concurrent-program-import/concurrent-program-import.component';

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
const ConcurrentProgramsRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: ConcurrentProgramsComponent,
    children: [
      {
        path: 'list',
        component: ConcurrentProgramsListComponent
      },
      {
        path: ':pgmId/edit',
        component: ConcurrentProgramsFormComponent
      },
      {
        path: ':pgmId',
        component: ConcurrentProgramsFormComponent
      },
      {
        path: 'create',
        component: ConcurrentProgramsFormComponent
      },
      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  },
]);

const PROVIDERS = [
  ConcurrentProgramService,
  ConcurrentProgramSharedService,
  LocalCacheService,
  ExportImportService
]

@NgModule({
  declarations: [
    ConcurrentProgramsComponent,
    ConcurrentProgramsListComponent,
    ConcurrentProgramsFormComponent,
    HeaderComponent,
    CardComponent,
    ParameterComponent,
    TemplatesComponent,
    StyleSheetComponent,
    RolesComponent,
    ConcurrentProgramImportComponent
  ],
  imports: [
    ConcurrentProgramsRouting,
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
  bootstrap: [ConcurrentProgramsComponent]
})
export class ConcurrentProgramsModule {
  static forRoot(): ModuleWithProviders<ConcurrentProgramsModule> {
    return {
      ngModule: ConcurrentProgramsModule,
      providers: [
        PROVIDERS
      ]
    }
  }
 }
