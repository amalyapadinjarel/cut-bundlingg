
import { catchError } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import {
	ActivatedRoute,
	NavigationCancel,
	NavigationEnd,
	RouteConfigLoadStart,
	Router,
} from '@angular/router';
import { Subscription } from 'rxjs';

import { EventService, UserService } from './shared/services';
import { ApiServiceV4, NavigationService } from 'app/shared/services';
import { MatDialog } from '@angular/material/dialog';
import { PushMessageService } from 'app/shared/websocket/push-message.service';
import { AlertUtilities } from './shared/utils/alert.utility';
import { AuthPopUpComponent } from '../../projects/authentication/src/app/auth-pop-up/auth-pop-up.component';
import { DateUtilities } from './shared/utils';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [
		'../freee.scss',
		'../dark.scss',
		'../boot.scss'
	]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
	count: any = 0;
	s1: HTMLScriptElement;
	s0: HTMLScriptElement;

	curMenu: any = '';
	menuFilterd = false;
	private fousedMenu = -1;
	private filterdMenuItems = [];
	filter: any = '';
	appMenus: any = {};
	filterdMenu: any[] = [];
	timer: any = 120;
	isAuthenticated = false;
	theme: string;
	isLoading = true;
	loading = true;
	userSubs: Subscription;
	eventSubs: Subscription;
	authFailed: boolean = false;
	@ViewChild('quickMenuList') menuItem: ElementRef;
	@ViewChild('quickMenuFilter') quickMenuFilter: ElementRef;

	currentGadget = "";
	currentGadgetData: any = {};
	gadgetPosition: any = {};
	gadgetOverlay = false;
	gadgetSubs: Subscription;

	constructor(private route: ActivatedRoute,
		private userService: UserService,
		public navService: NavigationService,
		public alertUtil: AlertUtilities,
		private eventService: EventService,
		private apiService: ApiServiceV4,
		private dialog: MatDialog,
		private router: Router,
		public pushMessageService: PushMessageService,
		public dateUtils: DateUtilities) {

		/** Setting embedded mode */
		this.apiService.changeEmitted$.subscribe(data => {
			if (data.status === 401 && !this.authFailed) {
				this.authFailed = true;
				this.dialog.closeAll();
				this.alertUtil.blockAlerts();
				this.dialog.open(AuthPopUpComponent, { disableClose: true });
			}
		});

		Number.prototype.toFixed = function (decimalPlaces) {
			var factor = Math.pow(10, decimalPlaces || 0);
			var v = (Math.round(Math.round(this * factor * 100) / 100) / factor).toString();
			if (v.indexOf('.') >= 0) {
				return v + factor.toString().substr(v.length - v.indexOf('.'));
			}
			return v + '.' + factor.toString().substr(1);
		};

	}

	ngOnInit() {

		let url = window.location.href;
		if (url && url.length > (url.substring(url.indexOf('#') + 1).length)) {
			this.userService.redirectUrl = url.substring(url.indexOf('#') + 1, url.length);
		}

		this.userSubs = this.userService.isAuthenticated.subscribe(
			(isAuthenticated) => {
				if (isAuthenticated) {
					this.isAuthenticated = true;
					this.pushMessageService.initializeWebSocketConnection();
					this.loadTawkTo();
				} else {
					this.isAuthenticated = false;
					this.pushMessageService.disconnectWebSocket();
					this.unloadTawkTo();
				}
				this.authFailed = !this.isAuthenticated;
			});

		this.userService.populate();

		this.eventSubs = this.eventService.isLoadingPage.subscribe(res => {
			if (res === true) {
				this.isLoading = true;
			} else {
				this.isLoading = false;
			}
		});

		this.gadgetSubs = this.eventService.showGadget.subscribe(gadget => {
			if (gadget) {
				if (gadget.key == 'notifications') {
					this.setGadgetPosition(gadget.position);
					this.showNotifications();
				}
				else if (gadget.key == 'downloads') {
					this.setGadgetPosition(gadget.position);
					this.showDownloads();
				}
				else if (gadget.key == 'usermenu') {
					this.setGadgetPosition(gadget.position);
					this.showUserMenu();
				}
				else if (gadget.key == 'application-reports') {
					this.setGadgetPosition(gadget.position);
					this.showApplicationReports(gadget.data);
				}
				else if (gadget.key == 'application-programs') {
					this.setGadgetPosition(gadget.position);
					this.showApplicationPrograms(gadget.data);
				}
				else if (gadget.key == 'usersettings') {
					this.setGadgetPosition(gadget.position);
					this.showUserSettings();
				}
				else {
					this.currentGadget = "";
				}
			}
			else {
				this.currentGadget = "";
			}
		});
	}

	ngAfterViewInit() {
		this.router.events
			.subscribe((event) => {
				if (event instanceof RouteConfigLoadStart) {
					this.isLoading = true;
				} else if (
					event instanceof NavigationEnd ||
					event instanceof NavigationCancel
				) {
					this.isLoading = false;
				}
			});
	}

	ngOnDestroy(): void {
		if (this.eventSubs) {
			this.eventSubs.unsubscribe();
		}
		if (this.userSubs) {
			this.userSubs.unsubscribe();
		}
		this.pushMessageService.disconnectWebSocket();
		this.unloadTawkTo();
	}

	handleMessage(msg): void {
		console.debug('shell received message: ', msg.detail);
	}

	fetchMenuData() {
		try {
			this.navService.fetchMenuData().then(data => {
				this.appMenus = data;
			}, () => {
				this.alertUtil.showAlerts('Failed to fetch menu items')
			});
		} catch (error) {
			this.alertUtil.showAlerts('Failed to fetch menu items');
		}
	}
	isLargeScreen() {
		const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		return (this.isAuthenticated && width > 1280);
	}

	onThemeChange(theme: string) {
		this.theme = theme;
	}

	// @HostListener('window:keydown', ['$event'])
	// keyboardInput(event: any) {
	// 	if (this.router && this.router.url !== '/login') {
	// 		if (event.ctrlKey && event.keyCode == 71) {
	// 			this.navService.showQuickMenu = true;
	// 			event.stopPropagation();
	// 			event.preventDefault();
	// 		} else if (this.navService.showQuickMenu && event.keyCode == 27) {
	// 			this.navService.showQuickMenu = false;
	// 		} else if (this.navService.showQuickMenu && (event.keyCode == 40 || event.code == 'ArrowDown')) {
	// 			this.focusToList();
	// 			event.stopPropagation();
	// 			event.preventDefault();
	// 		} else if (this.navService.showQuickMenu && (event.keyCode == 38 || event.code == 'ArrowUp')) {
	// 			this.focusToList('up');
	// 			event.stopPropagation();
	// 			event.preventDefault();
	// 		} else if (this.navService.showQuickMenu && event.keyCode != 32 && event.keyCode != 13 && event.keyCode != 17) {
	// 			if (this.quickMenuFilter) {
	// 				this.quickMenuFilter.nativeElement.focus();
	// 			}
	// 		}
	// 	}
	// }

	focusToList(direction = 'down') {
		if (this.menuItem) {

			if (direction === 'up' && this.fousedMenu <= 0) {
				this.fousedMenu = this.filterdMenuItems.length;
			}
			if (direction === 'down' && this.fousedMenu == this.filterdMenuItems.length - 1) {
				this.fousedMenu = -1;
			}
			direction == 'up' ? this.fousedMenu-- : this.fousedMenu++;
			if (-1 < this.fousedMenu && this.fousedMenu < this.filterdMenuItems.length) {
				this.menuItem.nativeElement.getElementsByClassName('quick-menu-filter-result')[this.fousedMenu].focus();
			}
		}
	}

	searchApps($event) {
		this.fetchMenuData();
		if ($event) {
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(() => {
				this.filterdMenu = [];
				this.appMenus.forEach(app => {
					if (app.applicationName.toLowerCase().includes(this.filter.toLowerCase()) || app.applicationShortCode.toLowerCase().includes(this.filter.toLowerCase())) {
						this.pushLeafNodes(app, []);
					} else {
						this.search(app);
					}
				});
				this.menuFilterd = true;
				if (this.menuItem) {
					this.filterdMenuItems = this.menuItem.nativeElement.getElementsByClassName('quick-menu-filter-result');
				}
				this.fousedMenu = -1;
			}, 120);
		}
		if (this.menuFilterd && !$event) {
			this.filterdMenuItems = [];
			this.filterdMenu = [];
			this.menuFilterd = false;
		}
	}

	onClickedOutside(e: Event) {
		this.navService.showQuickMenu = false;
	}

	search(app) {
		app.childList.forEach(menu => {
			this.filterMenu(menu)
		});
	}

	menuItemClicked(menuItem) {
		this.curMenu = menuItem.menuItemId;
		this.resetMenuFields();

	}

	filterMenu(menu, parent = []) {
		if (menu && menu.menuItemName) {
			if (menu.menuItemName.toLowerCase().includes(this.filter.toLowerCase())) {
				this.pushLeafNodes(menu, parent);
			} else {
				if (menu.childList.length > 0) {
					parent.push(menu.menuItemName);
					menu.childList.filter(menuItem => this.filterMenu(menuItem, parent));
				}
			}
		}
	}

	pushLeafNodes(menu, parent) {
		if (menu.childList.length > 0) {
			parent.push(menu.menuItemName ? menu.menuItemName : menu.applicationName);
			menu.childList.forEach(element => {
				this.pushLeafNodes(element, parent);
			});
		} else {
			if (parent.length > 0) {
				let parentStr = '';
				parent.forEach((element, index) => {
					if (index > 0) {
						parentStr = parentStr + '->'
					}
					parentStr = parentStr + element;
				});
				menu.info = parentStr.toLowerCase();
			}
			this.filterdMenu.push(menu);
		}
	}

	resetMenuFields() {
		this.curMenu = '';
		this.menuFilterd = false;
		this.fousedMenu = -1;
		this.filterdMenuItems = [];
		this.filter = '';
		this.navService.showQuickMenu = false;
	}

	addPin(event, menuItem) {
		event.stopPropagation();
		let bookmark: any = {};
		bookmark.bookmarkName = menuItem.menuItemName;
		bookmark.taskFlowId = menuItem.taskFlowId;
		bookmark.url = menuItem.url;
		bookmark.displayOrder = 0;
		this.navService.saveBookMark(bookmark).pipe(
			catchError((err) => {
				return err;
			}))
			.subscribe(data => {
				if (data.status == 'S') {
					bookmark.bookmarkId = data.bookmark.bookmarkId;
					this.navService.bookmarks.push(bookmark);
					this.navService.bookmarkedTaskFlows.push(bookmark.taskFlowId);
				}
			});
	}

	removePin(event, menuItem) {
		event.stopPropagation();
		let bookmark = this.navService.bookmarks.find(item => {
			return item.taskFlowId == menuItem.taskFlowId;
		})
		if (bookmark) {
			this.navService.deleteBookmark(bookmark.bookmarkId)
				.subscribe((data) => {
					if (data.status == 'S') {
						this.sliceBookmark(this.navService.bookmarks, bookmark.bookmarkId);
					}
				});
		}
	}

	sliceBookmark(bookmarks, bookmarkId) {
		for (let bmPtr = 0; bmPtr < bookmarks.length; bmPtr++) {
			if (bookmarks[bmPtr].bookmarkId == bookmarkId) {
				this.navService.bookmarks.splice(bmPtr, 1);
				this.navService.bookmarkedTaskFlows.splice(bmPtr, 1);
			}
		}
	}


	setGadgetPosition(position: any) {
		let btn = position.origin.nativeElement ? position.origin.nativeElement.getBoundingClientRect() : position.origin._elementRef.nativeElement.getBoundingClientRect();
		this.gadgetPosition.align = position.align;
		this.gadgetPosition.top = btn.top + btn.height + 9;
		if (position.align == 'right') {
			this.gadgetPosition.left = null;
			this.gadgetPosition.right = window.innerWidth - btn.right;
		} else {
			this.gadgetPosition.left = btn.left;
			this.gadgetPosition.right = null;
		}
	}

	closeGadget() {
		this.currentGadget = "";
		this.gadgetOverlay = false;
	}

	showNotifications() {
		if (this.currentGadget !== "notifications") {
			this.currentGadget = "notifications";
			this.gadgetOverlay = true;
		}
		else {
			this.currentGadget = "";
		}
	}

	showDownloads() {
		if (this.currentGadget !== "downloads") {
			this.currentGadget = "downloads";
			this.gadgetOverlay = true;
		}
		else {
			this.currentGadget = "";
		}
	}

	showUserMenu() {
		if (this.currentGadget !== "usermenu") {
			this.currentGadget = "usermenu";
			this.gadgetOverlay = true;
		}
		else {
			this.currentGadget = "";
		}
	}

	showUserSettings() {
		if (this.currentGadget !== "usersettings") {
			this.currentGadget = "usersettings";
			this.gadgetOverlay = true;
		}
		else {
			this.currentGadget = "";
		}
	}

	showApplicationReports(gadget) {
		if (this.currentGadget !== "application-reports") {
			this.currentGadgetData = gadget;
			this.currentGadget = "application-reports";
			this.gadgetOverlay = true;
		}
		else {
			this.currentGadget = "";
		}
	}
	showApplicationPrograms(gadget) {
		if (this.currentGadget !== "application-programs") {
			this.currentGadgetData = gadget;
			this.currentGadget = "application-programs";
			this.gadgetOverlay = true;
		}
		else {
			this.currentGadget = "";
		}
	}

	loadTawkTo() {
		/*let userName = this.userService.getCurrentUser().userName ? this.userService.getCurrentUser().userName : "";
		let email = this.userService.getCurrentUser().email ? this.userService.getCurrentUser().email : "";
		let Tawk_API = window["Tawk_API"];
		let Tawk_LoadStart = new Date();
		if (Tawk_API) {
			Tawk_API.showWidget();
			if (!Tawk_API.visitor || userName != Tawk_API.visitor.name) {
				Tawk_API.setAttributes({ name: userName });
				Tawk_API.setAttributes({ email: email });
			}
		}
		else {
			Tawk_API = {};
			Tawk_API.visitor = {
				name: userName,
				email: email
			};
			window["Tawk_API"] = Tawk_API;
			this.s1 = document.createElement("script"),
				this.s0 = document.getElementsByTagName("script")[0];
			this.s1.async = true;
			this.s1.src = 'https://embed.tawk.to/5cdd1627d07d7e0c6393ded5/default'
			this.s1.charset = 'UTF-8';
			this.s1.setAttribute('crossorigin', '*');
			this.s0.parentNode.insertBefore(this.s1, this.s0);
		}
		window["Tawk_LoadStart"] = Tawk_LoadStart;*/
	}

	unloadTawkTo() {
		/*let Tawk_API = window["Tawk_API"]
		if (Tawk_API) {
			Tawk_API.setAttributes({ name: '' });
			Tawk_API.setAttributes({ email: '' });
			Tawk_API.hideWidget();
		}*/
	}
}
