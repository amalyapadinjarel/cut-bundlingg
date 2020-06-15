import { NgModule } from '@angular/core';
import { ImageDirective } from '../image.directive';


const DIRECTIVES = [
    ImageDirective,
];

@NgModule({
    declarations: [
        DIRECTIVES
    ],
    exports: [
        DIRECTIVES
    ]
})
export class ImageDirectiveModule { }
