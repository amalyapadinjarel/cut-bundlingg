
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';


@Injectable()
export class DataService {

	constructor(
		private apiService: ApiService,
	) { }

	getLookup(lookupCode, extra = ''): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this.apiService.get('tnzmain/tnz/0.1/lookup?q=LookupType=' + lookupCode + ';' + extra).subscribe(res => {
				if (res) {
					resolve(res.items);
				} else {
					reject(false);
				}
			}, reject);
		});
	}
}
