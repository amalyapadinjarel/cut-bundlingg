import { NgModule } from '@angular/core';
import { CommentDirective } from '../comment.directive';


const DIRECTIVES = [
    CommentDirective,
];

@NgModule({
    declarations: [
        DIRECTIVES
    ],
    exports: [
        DIRECTIVES
    ]
})
export class CommentsDirectiveModule { }
