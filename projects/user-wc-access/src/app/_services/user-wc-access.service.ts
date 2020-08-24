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

    loadData() {
        this._shared.Loading = true;
        this.fetchData().then(
            (data: any) => {

                this._shared.setListData(data);
                this._shared.refreshLines();
                this._shared.Loading = false;
            },
            (err) => {
                this._shared.refreshLines();
                this._shared.Loading = false;
            }
        );
    }

    fetchData(id?: number) {

        return new Promise((resolve, reject) => {

             this.apiService.get('/'+this._shared.apiBase+'?limit=1500')
                .subscribe(data => {
                    if (data) {

                        if (data.userWcAccess) {
                            resolve(data);
                   
                        }
                        else {
                            reject();
                        }
                    } else {
                        reject();
                    }
                }, err => reject(err));

        });
    }
    save(exit): Promise<any> {
        this._shared.Loading = true;
        return new Promise((resolve, reject) => {
            this.saveData(this._shared.id)
                .then(res => {
                    this.inputService.resetInputCache(this._shared.appPath);

                    this._shared.refreshData.next(true);
                    this._shared.Loading = false;
                    resolve(true);
                }, err => {
                    if (err) {
                        this.alertUtils.showAlerts('Failed to save document. ' + err);
                    }
                    this._shared.Loading = false;
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

    getCopyUserData(fromUser, toUser) {
        return new Promise((resolve, reject) => {
            let toUserName = toUser.userName

            this.apiService.get('/' + this._shared.apiBase + '/user-lines/' + fromUser.userId + '/' + toUser.userId)
                .subscribe(data => {

                    if (data.CopyData && data.CopyData.length) {
                        resolve(data.CopyData);

                        if (data.InvalidCount) {

                            let cnt = data.InvalidCount.totalCount - data.InvalidCount.resultCount
                            let msg = cnt + ' line(s) are not copied as the '
                            if (data.InvalidCount.totalValidCount != data.InvalidCount.totalCount &&
                                data.InvalidCount.totalValidCount != data.InvalidCount.resultCount) {
                                this.alertUtils.showAlerts(msg + "User " + toUserName + " has no access to some of the copied facility or Similar lines exists !")
                            }

                            else if (data.InvalidCount.totalValidCount != data.InvalidCount.totalCount) {
                                this.alertUtils.showAlerts(msg + "User " + toUserName + " has no access to some of the copied facility !")
                            }
                            else if (data.InvalidCount.totalValidCount != data.InvalidCount.resultCount) {
                                this.alertUtils.showAlerts(msg + "Similar lines exists !")
                            }
                        }
                    } else {
                        if (data.InvalidCount.totalValidCount != data.InvalidCount.totalCount &&
                            data.InvalidCount.totalValidCount != data.InvalidCount.resultCount) {
                            this.alertUtils.showAlerts("No lines Copied.User " + toUserName + " has no access to the copying facility or Similar lines exists !")
                        }

                        else if (data.InvalidCount.totalValidCount != data.InvalidCount.totalCount) {
                            this.alertUtils.showAlerts("No lines Copied.User " + toUserName + " has no access to the copying facility !")
                        }
                        else if (data.InvalidCount.totalValidCount != data.InvalidCount.resultCount) {
                            this.alertUtils.showAlerts("Similar lines exists !")
                        }
                        else {
                            reject('NODATA');
                        }
                    }
                }, err => reject(err));

        });
    }
}
