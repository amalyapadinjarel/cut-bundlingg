import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ApiServiceV4, EventService, AuthGuard, UserService, JwtService, LocalCacheService } from 'app/shared/services';
import { SchedulerService } from './_services';

import { SchedulerComponent } from './scheduler.component';
import { ProgramsListingComponent } from './programs-listing/programs-listing.component';
import { JobsComponent } from './jobs/jobs.component';
import { QueueComponent } from './queue/queue.component';
import { JobLogComponent } from './job-log/job-log';
import { SmdModule } from 'app/shared/component/smd/smd.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SchedulerUtils } from 'app/shared/scheduler-utils';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { PipesModule } from 'app/shared/pipes/pipes.module';
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";
import {EMailOutputComponent} from "./email-output/email-output";
import {ProgramMoreInfoComponent} from "./program-more-info/more-info";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {SchedulerJobStatePipe} from "./_services/jobStatePipe";
import {SchedulerJobStatusPipe} from "./_services/jobStatusPipe";
import {SharedModule} from "../../../../src/app/shared/shared.module";

// const MATERIAL_MODULE = [
// 	  MatIconModule
// 	, MatCardModule
// 	, MatTooltipModule
// 	, MatFormFieldModule
// 	, MatInputModule
// 	, MatMenuModule
// 	, MatDialogModule
// 	, MatSnackBarModule
// 	, MatButtonModule
// ];
const PROVIDERS = [
	SchedulerService,
	ApiServiceV4,
	EventService,
	SchedulerUtils,
	UserService,
	JwtService,
	AlertUtilities,
	DateUtilities,
	LocalCacheService
]

const schedulerRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: '',
		canActivate: [AuthGuard],
		component: SchedulerComponent,
		children: [
			{
				path: 'general',
				component: ProgramsListingComponent,
			},
			{
				path: 'jobs',
				component: JobsComponent,
			},
			{
				path: 'schedules',
				component: QueueComponent,
			},
			{
				path: '**',
				redirectTo: 'general'
			}
		]
	}
]);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		// MATERIAL_MODULE,
		schedulerRouting,
		PerfectScrollbarModule,
		SmdModule,
		HttpClientModule,
		PipesModule,
		//	Material
		MatIconModule
		, MatCardModule
		, MatTooltipModule
		, MatFormFieldModule
		, MatInputModule
		, MatMenuModule
		, MatDialogModule
		, MatSnackBarModule
		, MatButtonModule, MatCheckboxModule, SharedModule
	],
	declarations: [
		SchedulerComponent,
		ProgramsListingComponent,
		JobsComponent,
		QueueComponent,
		JobLogComponent,
		EMailOutputComponent,
		ProgramMoreInfoComponent,
		SchedulerJobStatePipe,
		SchedulerJobStatusPipe
	],
	entryComponents: [
		JobLogComponent
	],
	providers: [
		PROVIDERS
	],
	bootstrap: [SchedulerComponent]
})
export class SchedulerModule {
	static forRoot(): ModuleWithProviders<SchedulerModule> {
		return {
			ngModule: SchedulerModule,
			providers: [
				PROVIDERS
			]
		}
	}
}
