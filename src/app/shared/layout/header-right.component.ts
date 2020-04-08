
import {interval as observableInterval,  Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';

import { User } from '../models';
import { ApiServiceV4, EventService, UserService, TrendzMessageService, ApiService } from 'app/shared/services';
import { MatDialog } from '@angular/material/dialog';
import { AlertUtilities } from '../utils/alert.utility';

@Component({
	selector: 'app-header-right',
	templateUrl: './header-right.component.html',
	styleUrls: ['./header-right.component.scss']
})
export class HeaderRightComponent implements OnInit, OnDestroy {

	personnelNum: any;
	currentUser: User;
	private userSubs: Subscription;

	pendingNotificationCount = 0;
	private onNewNotification: Subscription;
	private onPendingNotificationCountChanged: Subscription;
	private fetchingNotification = false;

	@ViewChild("downloadsBtn", { static: true }) downloadsBtn: ElementRef;
	@ViewChild("notificationsBtn", { static: true }) notificationsBtn: ElementRef;
	@ViewChild("usermenuBtn", { static: true }) usermenuBtn: ElementRef;
	@ViewChild("settingsBtn", { static: true }) settingsBtn: ElementRef;

	constructor(
		private userService: UserService,
		private apiService: ApiService,
		private eventService: EventService,
		private trendzMessageService: TrendzMessageService,
		private alertUtils: AlertUtilities,
		private dialog: MatDialog,
	) { }

	ngOnInit() {
		this.userSubs = this.userService.currentUser.subscribe(
			(userData) => {
				this.currentUser = userData;
			}
		);
		this.initNotificationCheck();

		this.onPendingNotificationCountChanged = this.eventService.onPendingNotificationCountChanged.subscribe(change => {
			if (change) {
				if (change == 'ALL') {
					this.pendingNotificationCount = 0;
				}
				else {
					this.pendingNotificationCount += change;
				}
			}
		});
	}

	ngOnDestroy() {
		if (this.userSubs) {
			this.userSubs.unsubscribe();
		}
		if (this.onNewNotification) {
			this.onNewNotification.unsubscribe();
		}
		if (this.onPendingNotificationCountChanged) {
			this.onPendingNotificationCountChanged.unsubscribe();
		}
		if (this.trendzMessageService.checkNotification) {
			this.trendzMessageService.checkNotification.unsubscribe();
		}
	}

	initNotificationCheck() {

		this.getNewNotifications();

		if (this.trendzMessageService.checkNotification) {
			this.trendzMessageService.checkNotification.unsubscribe();
		}
		this.trendzMessageService.checkNotification = observableInterval(40000).subscribe(() => {
			this.getNewNotifications();
		});

		if (this.onNewNotification) {
			this.onNewNotification.unsubscribe();
		}
		this.onNewNotification = this.eventService.onNewNotification.subscribe(change => {
			if (change == 1) {
				this.getNewNotifications();
			}
		});

	}

	getNewNotifications() {
		if (this.currentUser.userId) {
			if (!this.fetchingNotification) {
				this.fetchingNotification = true;
				this.trendzMessageService.getNewNotifications().then(response => {
					if (response) {
						if (response.status == 200) {
							this.pendingNotificationCount = response.data.pendingCount;
							if (response.data.count > 3) {
								this.alertUtils.showAlerts("You have " + response.data.count + " new notifications.");
							}
							else {
								for (let notification of response.data.notifications) {
									let tmp = document.implementation.createHTMLDocument("New").body;
									tmp.innerHTML = notification.notification;
									this.alertUtils.showAlerts(tmp.textContent || tmp.innerText || "");
								}
							}
							if (response.data.count > 0) {
								let subscriptionIds: any = { isNotified: 1, subscriptionIds: [] };
								for (let notification of response.data.notifications) {
									subscriptionIds.subscriptionIds.push({ subscriptionId: notification.subscriptionId });
								}
								this.trendzMessageService.updateNotifiedAll(subscriptionIds);
							}
						} else if (response.status == 401) {
							this.alertUtils.showAlerts("Authentication has been failed");
							this.userService.purgeAuth();
						}
					}
					this.fetchingNotification = false;
				}, () => {
					this.fetchingNotification = false;
				});
			}
		}
	}

	closeGadget() {
		this.eventService.showGadget.next(false);
	}

	showNotifications() {
		const event = { key: 'notifications', position: { origin: this.notificationsBtn, align: 'right' } };
		this.eventService.showGadget.next(event);
	}

	showDownloads() {
		const event = { key: 'downloads', position: { origin: this.downloadsBtn, align: 'right' } };
		this.eventService.showGadget.next(event);
	}

	showUserMenu() {
		const event = { key: 'usermenu', position: { origin: this.usermenuBtn, align: 'right' } };
		this.eventService.showGadget.next(event);
	}

	showUserSettings() {
		const event = { key: 'usersettings', position: { origin: this.settingsBtn, align: 'right' } };
		this.eventService.showGadget.next(event);
	}
}
