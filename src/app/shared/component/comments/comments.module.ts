import { NgModule } from '@angular/core';
import { CommentsModalComponent } from './comments-modal/comments-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ImageDirectiveModule } from '../../directives/modules/image-directive.module';
import { PipesModule } from '../../pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { CommonComponentsModule } from '../common-components.module';
import { CommentsComponent } from './comments.component';


const COMPONENTS = [
    CommentsModalComponent,
    CommentsComponent,
];

const MATERIAL_MODULE = [
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatToolbarModule,
    MatExpansionModule
];

@NgModule({
    imports: [
        FormsModule,
        MATERIAL_MODULE,
        PerfectScrollbarModule,
        ImageDirectiveModule,
        PipesModule,
        CommonComponentsModule
    ],
    declarations: [
        COMPONENTS
    ],
    exports: [
        COMPONENTS
    ]
})
export class CommentsSharedModule { }
