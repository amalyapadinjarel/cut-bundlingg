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
	ApiService
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
		path: 'loading',
		canActivate: [AuthGuard],
		component: LoadingComponent
	},
	{
		path: 'cut-register',
		// canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/CutRegister/src/app/cutRegister.module').then(m => m.CutRegisterModule)
	},
	{
		path: 'routing',
		// canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/mfg-routing/src/app/mfgRouting.module').then(m => m.MfgRoutingModule)
	},
	{
		path: 'scheduler',
		// canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/scheduler/src/app/scheduler.module').then(m => m.SchedulerModule)
	},
    {
		path: 'lookup',
		// canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/lookup/src/app/lookup.module').then(m => m.LookupModule)
	},
	
	{
		path: 'user',
		// canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/user/src/app/user.module').then(m => m.UserModule)
	},
	{

		path: 'routing-cut-panels',
		// canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/Routing/src/app/routing.module').then(m => m.RoutingModule)
	},
	{

		path: 'packing-instructions',
		// canActivate: [AuthGuard],
		loadChildren: () => import('../../projects/packing-instrutions/src/app/packing-instructions.module').then(m => m.PackingInstructionsModule)
	},
	{
		path: '**',
		redirectTo: 'not-found'
	},
], { useHash: true , onSameUrlNavigation : 'reload'});

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
		LOVComponentsModule
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
		{ provide: DateAdapter, useClass: TrendzDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: TRENDZ_DATE_FORMATS },
		{ provide: ErrorHandler, useClass: TrendzErrorHandler },
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
