
import {catchError} from 'rxjs/operators';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavigationService } from "app/shared/services";

@Component({
	selector: 'p-app-nav-menu',
	templateUrl: './app-nav-menu.component.html'
})
export class AppNavMenuComponent {
	menuItem: any;
	@Input() menu;
	@Input() menuFilterd = false;
	@Input() curMenu;
	@Input() curExpand = [];
	@Output() menuClicked: EventEmitter<any> = new EventEmitter<any>();
	selected: Boolean[] = [];
	hovered: Boolean[] = [];
	loadedOnce = false;
	menuItemId;
	constructor(
		public navService: NavigationService) {
	}

	ngOnInit() {

	}

	expandHeader(menuItem) {
		const index = this.curExpand.indexOf(menuItem.menuItemId);
		if (!menuItem.parentItem) {
			this.curExpand = [];
		}
		if (this.curExpand && index > -1) {
			if (index > -1) {
				this.curExpand.splice(index, 1)
			}
		} else {
			this.curExpand.push(menuItem.menuItemId);
		}
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

	menuSelected(menuItemId) {
		this.curMenu = menuItemId;
		this.menuClicked.emit({ clicked: true });
	}

	hoveringFn(bool, i) {
		this.hovered[i] = bool;
	}
	filterdItemClicked(menuItemId) {
		this.curMenu = menuItemId;
		this.menuClicked.emit({ clicked: true });
	}
	childMenuClicked() {
		this.menuClicked.emit({ clicked: true });
	}
}
