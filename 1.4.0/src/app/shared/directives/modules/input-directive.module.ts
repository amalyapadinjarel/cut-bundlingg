import { NgModule } from '@angular/core';

import { InputDateFilterDirective } from '../date-format.directive';
import { TimeFormatDirective } from '../time-format.directive';
import { AutosizeTextareaDirective } from '../autosize-textarea.directive';
import { FocusDirective } from '../focus-directive.directive';

const DIRECTIVES = [
    InputDateFilterDirective,
    TimeFormatDirective,
    AutosizeTextareaDirective,
    FocusDirective,
];

@NgModule({
    declarations: [
        DIRECTIVES
    ],
    exports: [
        DIRECTIVES
    ]
})
export class InputDirectiveModule { }
