import { NgModule } from '@angular/core';
import { PasswordCheckerComponent } from './password-checker.component';
import { CommonModule } from '@angular/common';


const COMPONENTS = [
    PasswordCheckerComponent
];

const MATERIAL_MODULE = [
];

@NgModule({
    imports: [
        CommonModule,
        MATERIAL_MODULE,
    ],
    declarations: [
        COMPONENTS
    ],
    exports: [
        COMPONENTS
    ]
})
export class PasswordCheckerModule { }
