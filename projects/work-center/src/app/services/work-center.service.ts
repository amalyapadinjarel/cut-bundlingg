import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { WorkCenterSharedService } from './work-center-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';

@Injectable()
export class WorkCenterService {

    public apiSubscribe: Subscription;
    constructor(private apiService: ApiService,
        private _shared: WorkCenterSharedService,
        public inputService: TnzInputService,
        private _cache: LocalCacheService,
        private alertUtils: AlertUtilities,
        public router: Router
    ) { }

    save(exit): Promise<any> {
        return new Promise((resolve, reject) => {
            this.saveData(this._shared.id)
                .then(res => {
                    this.inputService.resetInputCache(this._shared.appPath);
                    this._shared.listData = null;
                    this._shared.refreshWorkCenterData.next(true);
                    resolve(true);
                }, err => {
                    if (err) {
                        this.alertUtils.showAlerts('Failed to save document. ' + err);
                    }
                    resolve(false);
                })
        });

    }

    saveData(id): Promise<any> {
        return new Promise((resolve, reject) => {
            let inValid;
            this._shared.lineKeys.forEach(key => {
                const inputs = this.inputService.getInput(this._shared[key + 'Path']);
                if (inputs) {
                    inValid = inputs.some(grp => {
                        if (grp) {
                            return Object.keys(grp).some(key => {
                                if (grp[key] && grp[key].status != 'ok' && grp[key].status != 'changed') {
                                    return true;
                                }
                            });
                        }
                    });
                }
            });
            if (inValid) {
                reject('Please fill mandatory fields.');
            } else {
                const saveData = this.inputService.getCache(this._shared.appPath)['workCenter'];
                if (saveData) {
                    let observable;
                    observable = this.apiService.post('/work-center', saveData);
                    observable
                        .catch(err => {
                            reject(err);
                        })
                        .subscribe(res => {
                            if (res.data != null) {
                                if (res.data != "duplicateCode") {
                                    reject(res && 'Duplicate sequence ' + res.data.split(",", 2)[0] + ' found in facility ' + res.data.split(",", 2)[1] + ' .');
                                } if (res.data == "duplicateCode") {
                                    reject(res && 'Duplicate short code found .');
                                }
                            } else {
                                if (res && res.success) {
                                    this._shared.id = res.data && res.data.wcId ? res.data.wcId : this._shared.id;
                                    resolve(res)
                                } else {
                                    reject(res && res.message ? res.message : 'Unknown error');
                                }
                            }
                        })
                } else {
                    reject('No changes detected');
                }
            }
        });
    }
    duplicateWCCodeCheck(upperValue) {
        return new Promise((resolve, reject) => {
            this.apiSubscribe = this.apiService.get('/' + this._shared.apiBase + '/duplicateWorkCenter/' + upperValue)
                .catch(err => {
                    reject(err);
                    return err;
                })
                .subscribe(data => {
                    if (data.duplicate == true) {
                        this.alertUtils.showAlerts('Duplicate code -' + upperValue + ' !');
                        resolve(true);
                    } else { resolve(false); }
                })
        })
    }

    duplicateWCSeqCheck(seq, shortCode) {
        return new Promise((resolve, reject) => {
            this.apiSubscribe = this.apiService.get('/' + this._shared.apiBase + '/duplicateSeq/' + shortCode + '/' + seq)
                .catch(err => {
                    reject(err);
                    return err;
                })
                .subscribe(data => {
                    if (data.duplicate == true) {
                        this.alertUtils.showAlerts('Duplicate sequence -' + seq + 'in facility ' + shortCode + ' !');
                        resolve(true);
                    } else { resolve(false); }
                })
        })
    }

}