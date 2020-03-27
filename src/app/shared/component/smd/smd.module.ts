import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SmdDataTable, SmdDatatableActionButton, SmdContextualDatatableButton, SmdDataTableColumnComponent, SmdDataTableRowComponent, SmdDataTableCellComponent } from './smd-datatable';
import { SmdPaginatorComponent } from './smd-paginator';
import { SmdFabSpeedDialTrigger, SmdFabSpeedDialActions, SmdFabSpeedDialComponent } from './smd-fab-speed-dial';
import { SmdBottomNavLabelDirective, SmdBottomNavGroupComponent, SmdBottomNavComponent } from './smd-bottom-nav';
import { SmdErrorMessageComponent, SmdErrorMessagesComponent } from './smd-error-messages';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentsModule } from '../common-components.module';


const COMPONENTS = [
    SmdDataTable,
    SmdDatatableActionButton,
    SmdContextualDatatableButton,
    SmdDataTableColumnComponent,
    SmdDataTableRowComponent,
    SmdDataTableCellComponent,
    SmdPaginatorComponent,
    SmdFabSpeedDialTrigger,
    SmdFabSpeedDialActions,
    SmdFabSpeedDialComponent,
    SmdBottomNavLabelDirective,
    SmdBottomNavGroupComponent,
    SmdBottomNavComponent,
    SmdErrorMessageComponent,
    SmdErrorMessagesComponent,
];

const MATERIAL_MODULE = [
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatRippleModule
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MATERIAL_MODULE,
        CommonComponentsModule
    ],
    declarations: [
        COMPONENTS
    ],
    exports: [
        COMPONENTS
    ]
})
export class SmdModule { }
