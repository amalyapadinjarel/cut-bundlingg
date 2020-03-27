
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError, Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../../../src/environments/environment';
import { JwtService } from 'app/shared/services';

@Injectable()
export class AuthService {

	public emitChangeSource = new Subject<any>();
	changeEmitted$ = this.emitChangeSource.asObservable();
	url: any;

	constructor(
		private http: HttpClient,
		private jwtService: JwtService,
	) { }


	private formatErrors(error: any) {
		if (this.url.url != '/user/login')
			return observableThrowError(error);
	}

	private setHeaders(config?: Object): HttpHeaders {
		let headersConfig = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		};
		if (config && config['token'] === 'resetToken') {
			headersConfig['Authorization'] = `${this.jwtService.getResetToken()}`;
		} else if (this.jwtService.getToken()) {
			headersConfig['Authorization'] = `${this.jwtService.getToken()}`;
		}
		return new HttpHeaders(headersConfig);
	}

	put(path: string, body: Object = {}, config: Object = {}): Observable<any> {
		this.url = {
			url: path,
			method: 'put'
		}
		return this.http.put(
			`${environment.api_url_v4}${path}`,
			JSON.stringify(body),
			{ headers: this.setHeaders(config) }
		).pipe(
			catchError(this.formatErrors.bind(this)),
			map((res: Response) => res));
	}


	changePassword(userPassword: any): Observable<any> {
		const config = {
			token: 'resetToken'
		}
		return this.put('/trendz/users/password/' + userPassword.userId, { user: userPassword }, config);
	}


}


