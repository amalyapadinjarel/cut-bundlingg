import {
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils/alert.utility';

@Component({
	selector: 'peoplez-nav',
	templateUrl: './peoplez-nav.component.html'
})

export class PeoplezNavComponent implements OnInit, OnChanges, OnDestroy {
	fousedMenu = -1;

	public menuItems;
	public menuFilterd;
	@Input() menu;

	@ViewChild('subMenuList') subMenuItems: ElementRef;
	@ViewChild('subMenuFilter', { static: true }) subMenuFilter: ElementRef;

	@Output() menuSelected: EventEmitter<any> = new EventEmitter<any>();
	private menuDup;
	private filterdMenu = [];
	public subFilter = '';
	private ngUnsubscribe: Subject<any> = new Subject<any>();
	constructor(
		private navService: NavigationService
		, private alertUtility: AlertUtilities
	) {
	}
	ngOnInit() {
		if (!this.menu) {
			//this.fetchMenuData();
		}
	}
	ngOnChanges() {
		if (this.menu) {
			this.menuDup = JSON.parse(JSON.stringify(this.menu));
		}
	}
	fetchMenuData() {
		this.navService.fetchMenuData().then(data => {
			this.menu = data.filter(option => option.applicationShortCode === 'FLM')[0];
		}, () => {
			this.alertUtility.showAlerts('Failed to fetch menu items')
		});
	}
	search($event) {
		if ($event) {
			this.filterdMenu = [];
			if (!this.menuDup) {
				this.menuDup = JSON.parse(JSON.stringify(this.menu));
			}
			this.menuDup.childList.forEach(menu => {
				this.filterMenu(menu)
			});
			this.menuDup.childList = this.filterdMenu;
			this.menuFilterd = true;
		}
		if (this.menuFilterd && !$event) {
			this.menuDup = JSON.parse(JSON.stringify(this.menu));
			this.menuFilterd = false;
		}
	}
	filterMenu(menu, parent = []) {
		if (menu && menu.menuItemName) {
			if (menu.menuItemName.toLowerCase().includes(this.subFilter.toLowerCase())) {
				this.pushLeafNodes(menu, parent);
			} else {
				if (menu.childList.length > 0) {
					parent.push(menu.menuItemName);
					const subMenus = (menu.childList.filter(menuItem => this.filterMenu(menuItem, parent)));
					if (subMenus.length > 0) {
						menu.childList = subMenus;
					}
				}
			}
		}
	}
	pushLeafNodes(menu, parent) {
		if (menu.childList.length > 0) {
			parent.push(menu.menuItemName);
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
		if (this.subMenuItems && this.filterdMenu) {
			if (direction === 'up' && this.fousedMenu <= 0) {
				this.fousedMenu = this.filterdMenu.length;
			}
			if (direction === 'down' && this.fousedMenu == this.filterdMenu.length - 1) {
				this.fousedMenu = -1;
			}
			direction == 'up' ? this.fousedMenu-- : this.fousedMenu++;
			if (-1 < this.fousedMenu && this.fousedMenu < this.filterdMenu.length) {
				this.subMenuItems.nativeElement.getElementsByClassName('sub-menu-button')[this.fousedMenu].focus();
			}
		}
	}
	ngOnDestroy() {
		this.ngUnsubscribe.next(); this.ngUnsubscribe.complete();
	}
	menuClicked() {
		this.menuSelected.emit({ clicked: true });
	}
}
