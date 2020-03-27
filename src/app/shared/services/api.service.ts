
import { throwError as observableThrowError, Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { JwtService } from './jwt.service';


@Injectable()
export class ApiService {

	private emitChangeSource = new Subject<any>();
	changeEmitted$ = this.emitChangeSource.asObservable();

	constructor(
		private http: HttpClient,
		private jwtService: JwtService,
	) { }

	private setHeaders(): HttpHeaders {
		let headersConfig = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		};
		if (this.jwtService.getToken()) {
			headersConfig['Authorization'] = `${this.jwtService.getToken()}`;
		}
		return new HttpHeaders(headersConfig);
	}

	private getMultipartHeaders(): HttpHeaders {
		let headersConfig = {
		};
		if (this.jwtService.getToken()) {
			headersConfig['Authorization'] = `${this.jwtService.getToken()}`;
		}
		return new HttpHeaders(headersConfig);
	}

	private formatErrors(error: any, path) {
		if (path != '/user/login') {
			this.emitChangeSource.next(error);
		}
		return observableThrowError(error);
	}

	get(path: string, params: HttpParams = new HttpParams(), token = Math.random()): Observable<any> {
		return this.http.get(`${environment.api_url}${path}`, { headers: this.setHeaders(), params: params }).pipe(
			catchError((err) => { return this.formatErrors(err, path) }),
			map((res: HttpResponse<JSON>) => {
				let json: any = res;
				json.token = token;
				return json;
			}));
	}

	put(path: string, body: Object = {}): Observable<any> {
		return this.http.put(
			`${environment.api_url}${path}`,
			JSON.stringify(body),
			{ headers: this.setHeaders() }
		).pipe(
			catchError((err) => { return this.formatErrors(err, path) }),
			map((res: HttpResponse<JSON>) => res));
	}

	post(path: string, body: Object = {}): Observable<any> {
		return this.http.post(
			`${environment.api_url}${path}`,
			JSON.stringify(body),
			{ headers: this.setHeaders() }
		).pipe(catchError((err) => { return this.formatErrors(err, path); }),
			map((res: HttpResponse<JSON>) => res));
	}

	postMultipart(path: string, body): Observable<any> {
		return this.http.post(
			`${environment.api_url}${path}`, body, { headers: this.getMultipartHeaders() }
		).pipe(
			catchError((err) => { return this.formatErrors(err, path) }),
			map((res: HttpResponse<JSON>) => res));
	}

	delete(path): Observable<any> {
		return this.http.delete(
			`${environment.api_url}${path}`,
			{ headers: this.setHeaders() }
		).pipe(
			catchError((err) => { return this.formatErrors(err, path) }),
			map((res: HttpResponse<JSON>) => res));
	}

	getImage(path: string, params: HttpParams = new HttpParams()): Observable<any> {
		const headersConfig = {
			'Content-Type': 'image/jpeg',
			'Accept': 'image/jpeg',
		};
		if (this.jwtService.getToken()) {
			headersConfig['Authorization'] = `${this.jwtService.getToken()}`;
		}
		return this.http.get(`${environment.api_url}${path}`, { headers: new HttpHeaders(headersConfig), params: params }).pipe(
			catchError((err) => { return this.formatErrors(err, path) }),
			map((res: HttpResponse<JSON>) => res));
	}

	testLogin(path: string, body: Object = {}): Observable<any> {
		return this.http.post(
			`${environment.api_url}${path}`,
			JSON.stringify(body),
			{ headers: this.setHeaders() }
		).pipe(catchError((err) => { return this.formatErrors(err, path); }),
			map((res: HttpResponse<JSON>) => res));
	}

	testGet(path: string, params: HttpParams = new HttpParams(), token = Math.random()): Observable<any> {
		return this.http.get(`${environment.api_url}${path}`, { headers: this.setHeaders(), params: params }).pipe(
			catchError((err) => { return this.formatErrors(err, path) }),
			map((res: HttpResponse<JSON>) => {
				let json: any = res;
				json.token = token;
				return json;
			}));
	}

}
