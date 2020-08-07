import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { DocumentStatusSharedService } from './document-status-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';

@Injectable()
export class DocumentStatusService{

    public apiSubscribe: Subscription;
    constructor(private apiService: ApiService,
        private _shared: DocumentStatusSharedService,
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
                    this._shared.refreshDocStatusRefData.next(true);
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
                const saveData = this.inputService.getCache(this._shared.appPath)['docStatusRef'];
                if (saveData) {
                    let observable;
                    observable = this.apiService.post('/document-status', saveData);
                    observable
                        .catch(err => {
                            reject(err);
                        })
                        .subscribe(res => {
                            if (res.data != null) {
                                reject(res && 'Duplicate combination of status and key found .');
                            } else {
                                if (res && res.success) {
                                    this._shared.id = res.data && res.data.statusRefId ? res.data.statusRefId : this._shared.id;
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

    duplicateCombinationCheck(refKey , status) {
        return new Promise((resolve, reject) => {
            this.apiSubscribe = this.apiService.get('/' + this._shared.apiBase + '/duplicateCheck/' + refKey + '/' + status)
                .catch(err => {
                    reject(err);
                    return err;
                })
                .subscribe(data => {
                    if (data.duplicate == true) {
                        this.alertUtils.showAlerts('Duplicate combination of reference key - ' + refKey + ' and status ' + status + ' found !');
                        resolve(true);
                    } else { resolve(false); }
                })
        })
    }
}