import { NgModule } from '@angular/core';
import { ClickOutsideDirective } from '../click-outside.directive';


const DIRECTIVES = [
    ClickOutsideDirective,
];

@NgModule({
    declarations: [
        DIRECTIVES
    ],
    exports: [
        DIRECTIVES
    ]
})
export class ClickOutsideDirectiveModule { }
