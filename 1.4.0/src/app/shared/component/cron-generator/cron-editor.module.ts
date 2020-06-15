import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CronGenComponent } from './cron-editor.component';
import { TimePickerComponent } from './cron-time-picker.component';
import { SharedModule } from "app/shared/shared.module";

@NgModule({
    imports: [CommonModule, FormsModule,SharedModule],
    exports: [CronGenComponent, TimePickerComponent],
    declarations: [CronGenComponent, TimePickerComponent]
})
export class CronEditorModule {
}