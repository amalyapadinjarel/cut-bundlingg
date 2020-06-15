import {map, distinctUntilChanged} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable ,  BehaviorSubject ,  ReplaySubject ,  Subject } from "rxjs";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { JwtService } from "./jwt.service";
import { User } from "../models";
import { ApiService } from './api.service';

@Injectable()
export class UserService {

	public currentUserSubject = new BehaviorSubject<User>(new User());
	public currentUser = this.currentUserSubject
		.asObservable().pipe(
		distinctUntilChanged());
	public isAuthenticatedSubject = new ReplaySubject<boolean>(1);
	public isAuthenticated = this.isAuthenticatedSubject.asObservable();
	public redirectUrl;
	public authenticated = false;
	private emitChangeSource = new Subject<any>();
	changeEmitted$ = this.emitChangeSource.asObservable();

	constructor(
		private apiService: ApiService,
		private router: Router,
		private jwtService: JwtService
	) { }

	populate() {
		if (this.jwtService.getToken()) {
			this.apiService
				.get("/user")
				.subscribe(data => this.setAuth(data.user), () => { });
		} else {
			this.purgeAuth();
		}
	}

	setAuth(user: User) {
		if (user.resetToken) {
			this.authenticated = false;
			this.jwtService.saveResetToken(user.resetToken);
		} else {
			this.jwtService.saveToken(user.token);
			localStorage.setItem('trendzBIAuthentication', user.trendzBIAuthentication);
			this.currentUserSubject.next(user);
			this.isAuthenticatedSubject.next(true);
			this.authenticated = true;
		}
	}

	purgeAuth() {
		this.jwtService.destroyToken();
		this.currentUserSubject.next(new User());
		this.isAuthenticatedSubject.next(false);
		this.authenticated = false;
		this.router.navigateByUrl("/login", {
			queryParams: { returnUrl: this.redirectUrl }
		});
	}

	attemptAuthentication(credentials): Observable<User> {
		return this.apiService.post("/user/login", credentials).pipe(map(data => {
			this.setAuth(data.user);
			return data;
		}));
	}

	getCurrentUser(): User {
		return this.currentUserSubject.value;
	}

	update(user): Observable<User> {
		return this.apiService.put("/user", { user }).pipe(map(data => {
			this.currentUserSubject.next(data.user);
			return data.user;
		}));
	}

	createOrgPref(tnzOrgPref, userId): Observable<any> {
		return this.apiService
			.post("/trendz/settings/" + userId, { tnzUserOrgPreference: tnzOrgPref }).pipe(
			map(data => data));
	}

	updateOrgPref(tnzOrgPref, userId): Observable<any> {
		return this.apiService
			.put("/trendz/settings/" + userId, { tnzUserOrgPreference: tnzOrgPref }).pipe(
			map(data => data));
	}

	emitChange(change: any) {
		this.emitChangeSource.next(change);
	}

	checkPrevilage(uniqueId): Observable<any> {
		return this.apiService
			.get("/trendz/user-permission?url=" + uniqueId).pipe(
			map(data => {
				return data.userPermissions;
			}));
  }

  testLogin(credentials): Observable<any> {
		return this.apiService.testLogin("/poc/login", credentials).pipe(map(data => {
			let user = new User();
			user.token = Math.random().toString();
			user.userId = '1';
			user.knownAs = 'Gokul';
			this.setAuth(user);
			return data;
		}));
	}
}
