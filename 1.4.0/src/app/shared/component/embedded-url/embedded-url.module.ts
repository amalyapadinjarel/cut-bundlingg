import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmdModule } from '../smd/smd.module';
import { EmbeddedUrlComponent } from './embedded-url.component';


const COMPONENTS = [
    EmbeddedUrlComponent
];


@NgModule({
    imports: [
        CommonModule,
        SmdModule
    ],
    declarations: [
        COMPONENTS
    ],
    exports: [
        COMPONENTS
    ]
})
export class EmbeddedUrlModule { }
