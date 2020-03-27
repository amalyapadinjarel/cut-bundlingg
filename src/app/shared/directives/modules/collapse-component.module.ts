import { NgModule } from '@angular/core';
import { CollapsibleComponentDirective } from '../collapse-component.directive';
import { MatIcon } from '@angular/material/icon';


const DIRECTIVES = [
    CollapsibleComponentDirective,
];

@NgModule({
    declarations: [
        DIRECTIVES
    ],
    exports: [
        DIRECTIVES
    ],
    entryComponents: [
        MatIcon
    ]
})
export class CollapsibleComponentModule { }
