import { NgModule } from '@angular/core';
import { NoDataToDisplayComponent } from './no-data-to-display/no-data-to-display.component';
import { ConfirmPopupComponent } from './confirm-popup';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


const COMPONENTS = [
    NoDataToDisplayComponent
    , ConfirmPopupComponent
];

const MATERIAL_MODULE = [
    MatIconModule,
    MatDialogModule,
    MatButtonModule
];

@NgModule({
    imports: [
        CommonModule,
        MATERIAL_MODULE,
    ],
    declarations: [
        COMPONENTS
    ],
    entryComponents: [
        ConfirmPopupComponent,
    ],
    exports: [
        COMPONENTS
    ]
})
export class CommonComponentsModule { }
