import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';

import { UserService } from './user.service';
import { NavigationService } from './navigation.service';

@Injectable()
export class AuthGuard implements CanActivate {

	private isMenuAllowedSubject = new ReplaySubject<boolean>(1);
	public isMenuAllowed = this.isMenuAllowedSubject.asObservable();

	constructor(
		private userService: UserService,
		private navService: NavigationService,
		private router: Router
	) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Promise<boolean> {
		return new Promise((resolve) => {
			this.isValidUrl(state).then(res => {
				this.userService.redirectUrl = state.url;
				if (res) {
					if (this.userService.authenticated) {
						resolve(true);
					} 
				} else if (this.userService.authenticated) {
					const menu = this.navService.allowedUrls.find(item => {
						return state.url.startsWith(item);
					})
					if(!(menu ? true : (state.url == '/'))){
						this.redirectToInsufficientPrivilage();
					}
					resolve(menu ? true : (state.url == '/'));
				}
				else {
					resolve(false);
				}
			}, () => {
				resolve(false)
			});
		});
	}

	private isValidUrl(state): Promise<boolean> {
		return new Promise((resolve) => {
			this.navService.fetchMenuData().then(data => {
				const menu = data;
				if (menu && menu.length > 0) {
					let keepGoing = true;

					menu.forEach(app => {
						if (keepGoing && this.leafNodes(app, state)) {
							keepGoing = false;
						}
					});
					resolve((!keepGoing));
				} else {
					resolve(false);
				}
			}, () => {
				resolve(false)
			});
		})
	}

	leafNodes(menu, state): boolean {
		if (menu.childList.length > 0) {
			let keepGoing = true;
			menu.childList.forEach(element => {
				if (keepGoing && this.leafNodes(element, state)) {
					keepGoing = false;
				}
			});
			return (!keepGoing);
		} else if (state.url.slice(1).indexOf(menu.url) == 0) {
			return true;
		} else {
			return false;
		}
	}

	private redirectToInsufficientPrivilage(){
		this.router.navigate(['/insufficient-privilage']);
	}
}