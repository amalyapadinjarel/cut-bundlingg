
import { Injectable, ɵConsole } from '@angular/core';

import { UserService, ApiService, LocalCacheService } from 'app/shared/services';
import { JSONUtils } from 'app/shared/utils/json.utility';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TnzInputService {
    

	private registeredInputs: any = {};
	private selectOptions: any = {};
	private selectObservables: any = {};
	private sharedData: any = {};

	constructor(
		private userService: UserService,
		private apiService: ApiService,
		private _cache: LocalCacheService,
	) { }

	resetInputService(key) {
		this.resetInputCache(key);
		this.registerInput(key, undefined);
		this.registerSelectOptions(key, undefined);
		this.registerSelectObserver(key, undefined);
	}

	resetInputCache(key) {
		this._cache.setLocalCache(key, undefined);
		this.setSharedData(key, undefined);
	}

	registerInput(path, data: any) {
		JSONUtils.setJSONPath(this.registeredInputs, path, data);
	}

	getInput(path): any {
		return JSONUtils.getJSONPath(this.registeredInputs, path);
	}

	registerSelectOptions(path, data: any) {
		JSONUtils.setJSONPath(this.selectOptions, path, data);
	}

	getRegSelectOptions(path) {
		return JSONUtils.getJSONPath(this.selectOptions, path);
	}

	registerSelectObserver(path, data: any) {
		JSONUtils.setJSONPath(this.selectObservables, path, data);
	}

	getRegSelectObserver(path) {
		return JSONUtils.getJSONPath(this.selectObservables, path);
	}

	setSharedData(path, data: any) {
		JSONUtils.setJSONPath(this.sharedData, path, data);
	}

	getSharedData(path) {
		return JSONUtils.getJSONPath(this.sharedData, path);
	}

	getCache(path) {
		return this._cache.getCachedValue(path);
	}


	getInputValue(path): any {
		let value = '';
		let input = JSONUtils.getJSONPath(this.registeredInputs, path);
		if (input) {
			value = input.value;
		}
		else {
			if (this.sharedData) {
				value = JSONUtils.getJSONPath(this.sharedData, path);
			}
			let cache: any = this._cache.getCachedValue(path);
			if (cache && cache != value) {
				value = cache;
			}
		}
		return value;
	}

	updateInput(path, value, primaryKey?) {
		this.updateInputCache(path, value, primaryKey);
		let input = JSONUtils.getJSONPath(this.registeredInputs, path);
		if (input) {
			input.setValue(value);
		}
	}

	updateInputCache(path, value, primaryKey?) {
		if (primaryKey) {
			let primaryPath = path.substring(0, path.lastIndexOf('.') + 1) + primaryKey;
			let primary: any = JSONUtils.getJSONPath(this.sharedData, primaryPath);
			if (!primary) {
				primary = 0;
			}
			this._cache.setLocalCache(primaryPath, primary);
		}
		this._cache.setLocalCache(path, value);
	}

	addLine(path, index) {
		let lines = this._cache.getCachedValue(path);
		if (lines)
			lines.splice(index, 0, {});
		else
			lines = [{}];
		this._cache.setLocalCache(path, lines);
	}

	removeLine(path, index, primaryKey, key = '') {
		let cache = this._cache.getCachedValue(path);
		if (cache) {
			cache.splice(index, 1);
			this._cache.setLocalCache(path, cache);
		}
		let lines = this.getSharedData(path);
		if (lines && lines.length > index) {
			let temp = path.substring(0, path.lastIndexOf('.') + 1) + key + 'Removed';
			let removed: any[] = this.getCache(temp) || [];
			removed.push(lines[index]);
			this._cache.setLocalCache(temp, removed);
			if (lines[index][primaryKey] != 0) {
				temp = path.substring(0, path.lastIndexOf('.') + 1) + key + 'RemovedKeys';
				removed = this.getCache(temp) || [];
				removed.push(lines[index][primaryKey]);
				this._cache.setLocalCache(temp, removed);
			}
			lines.splice(index, 1);
			this.setSharedData(path, lines);
		}
	}

	resolveUrl(url: string, path?): string {
		url = url.replace(/\$\{DATA:(.)*?\}/g, (match) => {
			let value = '';
			match = match.substring(7, match.length - 1);
			let matches = match.split(',');
			matches.some(match => {
				if (match.startsWith('<') && match.endsWith('>'))
					value = match.substring(1, match.length - 1);
				else {
					if (match.indexOf('.') == -1 && path)
						match = path.substring(0, path.lastIndexOf('.') + 1) + match;
					value = this.getInputValue(match);
				}
				if (value) {
					return true;
				}
			})
			return value;
		});
		url = url.replace(/\$\{TOKEN:(.)*?\}/g, (match) => {
			return this.resolveTokenParam(match)
		});
		return url == 'undefined' ? '' : url;
	}

	resolveTokenParam(match) {
		return this.userService.getCurrentUser()[match.substring(8, match.length - 1)];
	}

	getLovData(lovConfig, value, limit?): Promise<any> {
		return new Promise((resolve, reject) => {
			let url = "/" + lovConfig.url + (lovConfig.url.indexOf('?') == -1 ? '?' : '&');
			url += 'onlyData=true' + (limit ? ('&limit=' + limit) : '') + '&q=' + lovConfig.displayKey + ' LIKE ' + value + '%';
			url += (lovConfig.filter ? ';' + lovConfig.filter : '');
			this.apiService.get(url).subscribe(
				res => {
					resolve(res);
				},
				reject
			);
		});
	}

	getSelectOptions(app, url, dataHeader = 'items'): Promise<any> {
		let key = app + '.' + btoa(url);
		return new Promise((resolve, reject) => {
			let options = this.getRegSelectOptions(key);
			if (options) {
				resolve(options);
			}
			else {
				let observer: Observable<any>;
				if (this.getRegSelectObserver(key)) {
					observer = this.getRegSelectObserver(key);
				}
				else {
					observer = this.apiService.get('/' + url).pipe(shareReplay(1));
					this.registerSelectObserver(key, observer);
				}
				if (observer) {
					observer.subscribe(res => {
						this.registerSelectOptions(key, res[dataHeader]);
						resolve(res[dataHeader]);
					}, err => {
						resolve([]);
					});
				}
			}
		});
	}

	getSelectObserver(url) {
		return this.apiService.get(url).pipe(shareReplay(1));
	}

	setError(path, alert?) {
		let input = JSONUtils.getJSONPath(this.registeredInputs, path);
		if (input) {
			input.setErrors(alert);
		}
	}

	resetError(path){
		let input= JSONUtils.getJSONPath(this.registeredInputs, path);
		if(input)
		input.resetError();
	}

	getStatus(path){
		let input= JSONUtils.getJSONPath(this.registeredInputs, path);
		if(input)
		return input.getStatus();
	}

	resetSharedData(){
		this.sharedData = {};
	}
}
