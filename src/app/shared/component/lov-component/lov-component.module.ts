import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOVComponent } from './lov-component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SmdModule } from '../smd/smd.module';


const COMPONENTS = [
    LOVComponent
];

const MATERIAL_MODULE = [
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatCardModule
];

@NgModule({
    imports: [
        CommonModule,
        MATERIAL_MODULE,
        SmdModule
    ],
    declarations: [
        COMPONENTS
    ],
    entryComponents: [
        LOVComponent,
    ],
    exports: [
        COMPONENTS
    ]
})
export class LOVComponentsModule { }
