import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { SchedulerUtils } from './scheduler.utils';
import { ProgramFormComponent } from './program-form/form';
import { CronEditorModule } from "app/shared/component/cron-generator/cron-editor.module";

@NgModule({
	imports: [
		SharedModule,
		CronEditorModule
	],
	declarations: [
		ProgramFormComponent,
	],
	entryComponents: [
		ProgramFormComponent
	],
	providers: [
		SchedulerUtils,
	]
})
export class SchedulerUtilsModule { }
