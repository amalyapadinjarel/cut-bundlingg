import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency.pipe';
import { FileSizePipe } from './file-size.pipe';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';
import { LineBreakToBR } from './lineBreakToBR.pipe';
import { SquareBracketPipe } from './square-bracket.pipe';


const PIPES = [
    CurrencyPipe,
    FileSizePipe,
    HtmlToPlaintextPipe,
    LineBreakToBR,
    SquareBracketPipe,
];

@NgModule({
    declarations: [
        PIPES
    ],
    exports: [
        PIPES
    ]
})
export class PipesModule { }
