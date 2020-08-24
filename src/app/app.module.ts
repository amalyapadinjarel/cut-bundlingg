import { ErrorHandler, ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// import 'HammerJS';

import { PageNotFoundComponent } from './shared/component/page-not-found/page-not-found.component';
import { PeoplezNavComponent } from 'app/app-nav';
import { SchedulerUtilsModule } from 'app/shared/scheduler-utils/scheduler.utils.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { StorageServiceModule } from 'ngx-webstorage-service';

import { AppNavMenuComponent } from './app-nav/app-nav-menu/app-nav-menu.component';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import {
	ApiServiceV4,
	AuthGuard,
	EventService,
	JwtService,
	TrendzErrorHandler,
	UserService,
	TrendzMessageService,
	LocalConfigService,
	NavigationService,
	DocumentService,
	ApiService,
	LocalCacheService
} from './shared/services';
import { AlertUtilities, AutoCompleteUtilities, DateUtilities } from './shared/utils';
import { UserNotificationsComponent } from './gadgets/user-notifications/user-notifications.component';
import { UserProfileMenuComponent } from './gadgets/user-profile-menu/user-profile-menu.component';
import { ApplicationReportListingComponent } from 'app/shared/scheduler-utils/app-report-listing/list';
import { ApplicationProgramListingComponent } from 'app/shared/scheduler-utils/app-program-listing/list';
import { PushMessageService } from 'app/shared/websocket/push-message.service';
import { UserSettingsComponent } from 'app/gadgets/user-settings/user-settings.component';

import { ClickOutsideDirectiveModule } from './shared/directives/modules/clickoutside-directive.module';
import { SidenavComponent, HeaderLeftComponent, HeaderRightComponent } from './shared/layout';
import { SharedModule } from './shared/shared.module';
import { LoadingComponent } from './shared/component/loading/loading.component';
import { LOVComponentsModule } from './shared/component/lov-component/lov-component.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '../../projects/authentication/src/app/auth.module';
import { AuthPopUpComponent } from '../../projects/authentication/src/app/auth-pop-up/auth-pop-up.component';
import { CutRegisterComponent } from '../../projects/CutRegister/src/app/cutRegister.component';
import { CutRegisterModule } from '../../projects/CutRegister/src/app/cutRegister.module';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { TrendzDateAdapter } from 'app/shared/locale-adapters/trendz-date-adapter';
import { InsufficientPrivilageComponent } from './shared/component/insufficient-privilage/insufficient-privilage.component';
import { UserDownloadsComponent } from './gadgets/user-downloads/user-downloads.component';
import { PipesModule } from 'app/shared/pipes/pipes.module';


// Gestures
import {
	HAMMER_GESTURE_CONFIG,
	HammerModule
} from '@angular/platform-browser';

/** Import Alyle UI */
import {
	LyTheme2,
	StyleRenderer,
	LY_THEME,
	LY_THEME_NAME,
	LyHammerGestureConfig
} from '@alyle/ui';


/** Import the component modules */
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';

/** Import themes */
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';



const TRENDZ_DATE_FORMATS = {
	parse: {
		dateInput: { month: 'long', year: 'numeric', day: 'numeric' },
	},
	display: {
		dateInput: 'input',
		monthYearLabel: { year: 'numeric', month: 'numeric' },
		dateA11yLabel: { year: 'numeric', month: 'numeric', day: 'numeric' },
		monthYearA11yLabel: { year: 'numeric', month: 'numeric' }
	},
};

const rootRouting: ModuleWithProviders = RouterModule.forRoot([
	{
		path: 'not-found',
		component: PageNotFoundComponent
	},
	{
		path: 'insufficient-privilage',
		component: InsufficientPrivilageComponent
	},
	{
		path: 'loading',
		canActivate: [AuthGuard],
		component: LoadingComponent
	},
	{
		path: 'cut-register',
		canActivate: [AuthGuard], 
		loadChildren: () => import('../../projects/CutRegister/src/app/cutRegister.module').then(m => m.CutRegisterModule)
	},
	{
		path: 'routing', 
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/mfg-routing/src/app/mfgRouting.module').then(m => m.MfgRoutingModule)
	},
	{
		path: 'scheduler',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/scheduler/src/app/scheduler.module').then(m => m.SchedulerModule)
	},
	{
		path: 'lookup',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/lookup/src/app/lookup.module').then(m => m.LookupModule)
	},

	{
		path: 'user',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/user/src/app/user.module').then(m => m.UserModule)
	},
	{
        path: 'roles',
        canActivate: [AuthGuard],
        loadChildren: () => import('../../projects/roles/src/app/roles.module').then(m => m.RolesModule)
    },
	{
		path: 'operations',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/operation/src/app/operation.module').then(m => m.OperationModule)
	},
	{

		path: 'routing-cut-panels', 
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/Routing/src/app/routing.module').then(m => m.RoutingModule)
	},
	{

		path: 'document-type',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/document-type/src/app/document-type.module').then(m => m.DocumentTypeModule)
	},
	{

		path: 'packing-instructions',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/packing-instrutions/src/app/packing-instructions.module').then(m => m.PackingInstructionsModule)
	},
	{

		path: 'division',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/division/src/app/division.module').then(m => m.DivisionModule)
	},
	{

		path: 'operation-group',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/operationGroup/src/app/operationGroup.module').then(m => m.OperationGroupModule)
	},

	{
		path: 'embeddedURL',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/embedded-URL/src/app/embeddedURL.module').then(m => m.EmbeddedURLModule)
	},
	{

		path: 'executable',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/executable/src/app/executable.module').then(m => m.ExecutableModule)
	},
	{

		path: 'valueSet',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/valueSet/src/app/valueSet.module').then(m => m.ValueSetModule)
	},
	{

		path: 'document-status',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/document-status/src/app/document-status.module').then(m => m.DocumentStatusModule)
	},
    {

		path: 'doc-sequence',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/doc-sequence/src/app/doc-sequence.module').then(m => m.DocSequenceModule)
	},
    {


		path: 'facility',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/facility/src/app/facility.module').then(m => m.FacilityModule)
	},
	{
		path: 'concurrent-programs',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/concurrent-program/src/app/concurrent-programs.module').then(m => m.ConcurrentProgramsModule)
	},
	{
		path: 'machines',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/machines/src/app/machines.module').then(m => m.MachinesModule)
	},
	{

		path: 'user-profile',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/userProfile/src/app/user-profile.module').then(m => m.UserProfileModule)
	},
	{

		path: 'user-workcenter-access',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/user-wc-access/src/app/user-wc-access.module').then(m => m.UserWcAccessModule)
	},
	{
		path: 'work-center',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/work-center/src/app/work-center.module').then(m => m.WorkCenterModule)
	},
	{
		path: 'defect-group',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/defect-group/src/app/defect-group.module').then(m => m.DefectGroupModule)
	},
	{
		path: 'uom',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/uom/src/app/uom.module').then(m => m.UomModule)
	},
	{
		path: 'production-processes',
		canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/production-processes/src/app/production-processes.module').then(m => m.ProductionProcessesModule)
	},
	{
	path: '**',
		redirectTo: 'not-found'
	}
], { useHash: true, onSameUrlNavigation: 'reload' });

@NgModule({
	declarations: [
		AppComponent,
		SidenavComponent,
		HeaderLeftComponent,
		HeaderRightComponent,
		PeoplezNavComponent,
		LoadingComponent,
		AppNavMenuComponent,
		PageNotFoundComponent,
		UserNotificationsComponent,
		UserDownloadsComponent,
		UserSettingsComponent,
		UserProfileMenuComponent,
		ApplicationReportListingComponent,
		ApplicationProgramListingComponent
	],
	imports: [
		BrowserAnimationsModule,
		rootRouting,
		AuthModule.forRoot(),
		PerfectScrollbarModule,
		StorageServiceModule,
		HomeModule,
		HttpClientModule,
		SharedModule,
		SchedulerUtilsModule,
		ClickOutsideDirectiveModule,
		LOVComponentsModule,
		// Add components
		LyButtonModule,
		LyToolbarModule,
		LyImageCropperModule,
		// Gestures
		HammerModule
	],
	entryComponents: [
		AuthPopUpComponent
	],
	providers: [
		DocumentService,
		NavigationService,
		EventService,
		ApiService,
		ApiServiceV4,
		AuthGuard,
		JwtService,
		UserService,
		AlertUtilities,
		DateUtilities,
		AutoCompleteUtilities,
		TrendzMessageService,
		PushMessageService,
		LocalConfigService,
		LocalCacheService,
		{ provide: DateAdapter, useClass: TrendzDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: TRENDZ_DATE_FORMATS },
		{ provide: ErrorHandler, useClass: TrendzErrorHandler },

		/** Add themes */

		[LyTheme2],
		[StyleRenderer],
		// Theme that will be applied to this module
		{ provide: LY_THEME_NAME, useValue: 'minima-light' },
		{ provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
		{ provide: LY_THEME, useClass: MinimaDark, multi: true }, // name: `minima-dark`
		// Gestures
		{ provide: HAMMER_GESTURE_CONFIG, useClass: LyHammerGestureConfig }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
