import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { ApiServiceV4 } from './api-v4.service';
import { AlertUtilities } from '../utils/alert.utility';
import { ApiService } from 'app/shared/services/api.service';


@Injectable()
export class TrendzMessageService {

	public checkNotification: Subscription;

	constructor(
		private apiService: ApiService,
		private alertUtils: AlertUtilities,
	) {
	}

	getNewNotifications(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.apiService.get("/trendz-messages/user-notifications/new")
				.subscribe(
					response => {
						resolve(response);
					}, err => {
						resolve(err);
					});
		});
	}

	getPendingNotificationCount(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.apiService.get("/trendz-messages/user-notifications/pending/count")
				.subscribe(
					response => {
						if (response.status == "S") {
							resolve(response.count);
						}
						else {
							resolve();
						}
					}, err => {
						resolve();
					});
		});
	}

	updateReadStatus(isRead, subId = null): Promise<any> {
		return new Promise((resolve, reject) => {
			this.apiService.put("/trendz-messages/" + (subId ? "" : 'user-') + "notifications" + (subId ? "/" + subId : '') + "/isread" + (subId ? "" : '/all'), { notification: { isRead: isRead } })
				.subscribe(
					response => {
						if (response.status == "S") {
							resolve(response.notification);
						}
						else {
							this.alertUtils.showAlerts("Failed to update read status");
							resolve();
						}
					}, err => {
						resolve();
					});
		});
	}

	updateNotifiedAll(notification): Promise<any> {
		return new Promise((resolve, reject) => {
			this.apiService.put("/trendz-messages/notifications/isNotified", { notification: notification })
				.subscribe(
					response => {
						resolve();
					}, err => {
						resolve();
					});
		});
	}

}
