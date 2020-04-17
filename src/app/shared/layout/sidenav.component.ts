import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { appVersion } from "environments/environment";
import { NavigationService } from '../services';
import { AlertUtilities } from '../utils/alert.utility';


@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit, OnDestroy {
	fousedMenu = -1;
	menuFilterd = false;
	bookmarkFiltered = false;
	filterdMenu: any[];
	timer: any;
	mainFilter: any;
	bookmarkFilter: any;
	@ViewChild('mainMenuList', { static: true }) mainMenuItems: ElementRef;
	@ViewChild('mainMenuFilter', { static: true }) mainMenuFilter: ElementRef;
	@Output() menuSelected: EventEmitter<any> = new EventEmitter<any>();
	public appMenus = [];
	public bookmarks = [];
	public menuItem;
	public curMenu;
	app = 'apps';
	today: number = Date.now();
	selectedMenuTab = 0;
	version = appVersion;

	constructor(
		private navService: NavigationService
		, private alertUtils: AlertUtilities
	) { }

	ngOnInit(): void {
		this.fetchMenuData();
		// this.navService.fetchBookmarks();
	}

	fetchMenuData() {
		try {
			this.navService.fetchMenuData().then(data => {
				this.appMenus = data;
			}, () => {
				this.alertUtils.showAlerts('Failed to fetch menu items')
			});
		} catch (error) {
			this.navService.fetchMenuData().then(data => {
				this.appMenus = data;
			}, () => {
				this.alertUtils.showAlerts('Failed to fetch menu items')
			});
		}
	}

	ngOnDestroy(): void {
	}

	removePin(event, bookmark) {
		event.stopPropagation();
		this.navService.deleteBookmark(bookmark.bookmarkId)
			.subscribe((data) => {
				if (data.status == 'S') {
					this.sliceBookmark(this.navService.bookmarks, bookmark.bookmarkId);
				}
			});
	}

	sliceBookmark(bookmarks, bookmarkId) {
		for (let bmPtr = 0; bmPtr < bookmarks.length; bmPtr++) {
			if (bookmarks[bmPtr].bookmarkId == bookmarkId) {
				this.navService.bookmarks.splice(bmPtr, 1);
				this.navService.bookmarkedTaskFlows.splice(bmPtr, 1);
			}
		}
	}

	menuTabChanged($event) {
		if (this.selectedMenuTab != $event.index) {
			this.selectedMenuTab = $event.index;
			if (this.selectedMenuTab == 1) {
				this.fetchBookmarks();
			}
		}
	}

	fetchBookmarks() {
		this.bookmarks = [];
		this.navService.fetchBookmarks().then(data => {
			this.bookmarks = data;
			for (let bm = 0; bm <= this.bookmarks.length; bm++) {
				if (this.bookmarks[bm] && this.bookmarks[bm].url) {
					let splitArray = this.bookmarks[bm].url.split('/');
					this.bookmarks[bm].createdByName = '';
					for (let sA = 2; sA < splitArray.length; sA++) {
						this.bookmarks[bm].createdByName = this.bookmarks[bm].createdByName + ' -> ' + splitArray[sA];
					}
				}
			}
		}, () => {
			this.alertUtils.showAlerts('Failed to fetch bookmarks')
		});
	}

	searchApps($event) {
		if ($event) {
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(() => {
				this.filterdMenu = [];
				this.appMenus.forEach(app => {
					if (app.applicationName.toLowerCase().includes(this.mainFilter.toLowerCase()) || app.applicationShortCode.toLowerCase().includes(this.mainFilter.toLowerCase())) {
						this.pushLeafNodes(app, []);
					} else {
						this.search(app);
					}
				});
				this.menuFilterd = true;
			}, 120);
		}
		if (this.menuFilterd && !$event) {
			this.filterdMenu = [];
			this.menuFilterd = false;
		}
	}

	search(app) {
		app.childList.forEach(menu => {
			this.filterMenu(menu)
		});
	}

	filterMenu(menu, parent = []) {
		if (menu && menu.menuItemName) {
			if (menu.menuItemName.toLowerCase().includes(this.mainFilter.toLowerCase())) {
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
	@HostListener('window:keydown', ['$event'])
	keyboardInput(event: any) {
		if (!this.navService.showQuickMenu) {
			if ((event.keyCode == 40 || event.code == 'ArrowDown')) {
				this.focusToList();
			} else if ((event.keyCode == 38 || event.code == 'ArrowUp')) {
				this.focusToList('up');
			}
		}
	}
	focusToList(direction = 'down') {
		if (this.mainMenuItems && this.filterdMenu) {
			if (direction === 'up' && this.fousedMenu <= 0) {
				this.fousedMenu = this.filterdMenu.length;
			}
			if (direction === 'down' && this.fousedMenu == this.filterdMenu.length - 1) {
				this.fousedMenu = -1;
			}
			direction == 'up' ? this.fousedMenu-- : this.fousedMenu++;
			if (-1 < this.fousedMenu && this.fousedMenu < this.filterdMenu.length) {
				this.mainMenuItems.nativeElement.getElementsByClassName('main-menu-button')[this.fousedMenu].focus();
			}
		}
	}
	menuItemClicked(menuItemId?) {
		if (menuItemId) {
			this.curMenu = menuItemId;
		}
		this.menuSelected.emit({ clicked: true });
	}
}
