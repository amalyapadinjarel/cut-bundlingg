import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { ListErrorsComponent } from './list-errors.component';
import { ShowAuthedDirective } from './show-authed.directive';
import { CommentsModalComponent } from 'app/shared/component/comments/comments-modal/comments-modal.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TrendzFilePreviewComponent } from 'app/shared/component/file-preview/file-preview.component';
import { InputDirectiveModule } from './directives/modules/input-directive.module';
import { LoadingDirectiveModule } from './directives/modules/loading-directive.module';
import { CommentsDirectiveModule } from './directives/modules/comments-directive.module';
import { ImageDirectiveModule } from './directives/modules/image-directive.module';
import { CommentsSharedModule } from './component/comments/comments.module';
import { PipesModule } from './pipes/pipes.module';
import { CommonComponentsModule } from './component/common-components.module';
import { ExpansionPanelsContainerComponent } from './component/expansion-panels-container';
import { ExpansionPanelComponent, ExpansionPanelTitle, ExpansionPanelContent, ExpansionPanelDescriptionToggled, ExpansionPanelDescriptionHidden, ExpansionPanelButtons } from './component/expansion-panel';
import { UploadFileComponent } from './component/upload-file/upload-file.component';
import { SmdModule } from './component/smd/smd.module';
import { FormNavComponent } from './component/form-nav/form-nav.component';
import { SchedulerJobStatePipe } from '../../../projects/scheduler/src/app/_services/jobStatePipe';
import { SchedulerJobStatusPipe } from '../../../projects/scheduler/src/app/_services/jobStatusPipe';
import { DocStatusComponent } from './component/doc-status/doc-status.component';
const MATERIAL_MODULE = [
    MatAutocompleteModule
    , MatCheckboxModule
    , MatDatepickerModule
    , MatInputModule
    , MatSelectModule
    , MatSlideToggleModule
    , MatMenuModule
    , MatSidenavModule
    , MatToolbarModule
    , MatCardModule
    , MatTabsModule
    , MatExpansionModule
    , MatButtonModule
    , MatButtonToggleModule
    , MatChipsModule
    , MatIconModule
    , MatDialogModule
    , MatTooltipModule
    , MatSnackBarModule
    , MatRippleModule
    , MatRadioModule
    , MatStepperModule
    , MatListModule
    , MatGridListModule
    , MatProgressBarModule
    , MatProgressSpinnerModule
];
const COMPONENTS = [
    ListErrorsComponent,
    ShowAuthedDirective,
    ExpansionPanelsContainerComponent,
    ExpansionPanelComponent,
    ExpansionPanelTitle,
    ExpansionPanelContent,
    ExpansionPanelDescriptionToggled,
    ExpansionPanelDescriptionHidden,
    ExpansionPanelButtons,
    UploadFileComponent,
    TrendzFilePreviewComponent,
    FormNavComponent,
    DocStatusComponent
];

const PIPES = [
    SchedulerJobStatePipe,
    SchedulerJobStatusPipe,
];

const IMPORTS = [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    CommentsDirectiveModule,
    LoadingDirectiveModule,
    InputDirectiveModule,
    ImageDirectiveModule,
    CommentsSharedModule,
    PipesModule,
    SmdModule
];




@NgModule({
    imports: [
        IMPORTS,
        MATERIAL_MODULE,
        PerfectScrollbarModule,
        CommonComponentsModule
    ],
    declarations: [PIPES,COMPONENTS],
    exports: [
        IMPORTS,
        COMPONENTS,
        PIPES,
        MATERIAL_MODULE,
    ],
    entryComponents: [
        UploadFileComponent,
        CommentsModalComponent,
        TrendzFilePreviewComponent
    ]
})
export class SharedModule {
    static forRoot(...imports: any[]): any[] {
        return [
            FormsModule,
            ReactiveFormsModule,
            CommonModule,
            MATERIAL_MODULE,
            RouterModule,
            SharedModule,
            ...imports
        ]
    }

}
