import { NgModule } from '@angular/core';
import { LoadingDirective } from '../loading.directive';


const DIRECTIVES = [
    LoadingDirective,
];

@NgModule({
    declarations: [
        DIRECTIVES
    ],
    exports: [
        DIRECTIVES
    ]
})
export class LoadingDirectiveModule { }
