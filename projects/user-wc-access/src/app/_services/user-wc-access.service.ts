import { Injectable } from '@angular/core';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { LocalCacheService, ApiService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';
import { UserWcAccessSharedService } from './user-wc-access-shared.service';

@Injectable()
export class UserWcAccessService {

    constructor(
        public inputService: TnzInputService,
        private _cache: LocalCacheService,
        private alertUtils: AlertUtilities,
        public router: Router,
        private apiService: ApiService,
        private _shared: UserWcAccessSharedService
    ) { }
    save(exit): Promise<any> {
        return new Promise((resolve, reject) => {
            this.saveData(this._shared.id)
                .then(res => {
                    this.inputService.resetInputCache(this._shared.appPath);
                  
                    this._shared.refreshUserWcAccessData.next(true);
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
                const saveData = this.inputService.getCache(this._shared.appPath)['userWcAccess'];
                if (saveData) {
                    let observable;
                    observable = this.apiService.post('/user-workcenter-access', saveData);
                    observable
                        .catch(err => {
                            reject(err);
                        })
                        .subscribe(res => {
                            if (res.data != null) {
                                reject(res && 'Duplicate combination of User, Facility and Workcenter found .');
                            } else {
                                if (res && res.success) {
                                    this._shared.id = res.data && res.data.mapId ? res.data.mapId : this._shared.id;
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

    getCopyUserData(fromUserId, toUserId) {
        return new Promise((resolve, reject) => {


            this.apiService.get('/' + this._shared.apiBase + '/user-lines/' + fromUserId + '/' + toUserId)
                .subscribe(data => {
                
                    if (data && data.length) {
                        resolve(data);

                    } else {
                        reject('NODATA');
                    }
                }, err => reject(err));

        });
    }
}
