import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrendzMessgesComponent } from './trendz-messages.component';
import { NotificationsListingComponent } from './notifications/notifications-listing.component';
import { NotificaionFormComponent } from './notification-form/form';
import { AuthGuard } from 'app/shared/services';
import { SharedModule } from 'app/shared/shared.module';

const routing: ModuleWithProviders = RouterModule.forChild([
	{
		path: '',
		canActivate: [AuthGuard],
		children: [
			{
				path: ':tab',
				component: TrendzMessgesComponent,
				resolve: {
					// mail: SchedulerService
				},
			},
			{
				path: '**',
				redirectTo: 'notifications'
			}
		]
	}
]);

@NgModule({
	imports: [
		routing,
		SharedModule,
	],
	declarations: [
		TrendzMessgesComponent,
		NotificationsListingComponent,
		NotificaionFormComponent
	],
	entryComponents: [
	],
	providers: [
	]
})
export class TrendzMessgesModule { }
