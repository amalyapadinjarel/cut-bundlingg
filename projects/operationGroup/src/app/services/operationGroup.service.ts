import { OperationGroupSharedService } from './operationGroup-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ApiService, LocalCacheService } from 'app/shared/services/';
import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { OperationGroup } from '../models/operationGroup.model';
import { Subscription } from 'rxjs';

@Injectable()
export class OperationGroupService {

    public apiSubscribe: Subscription;

    constructor(private apiService: ApiService,
        private _shared: OperationGroupSharedService,
        public inputService: TnzInputService,
        private _cache: LocalCacheService,
        private alertUtils: AlertUtilities,
        public router: Router
    ) { }


    save(exit): Promise<any> {
        this._shared.opGrploading = true;
        return new Promise((resolve, reject) => {
            this.saveData(this._shared.id)
                .then(res => {
                    this.inputService.resetInputCache(this._shared.appPath);
                    this._shared.opGrploading = false;
                    this._shared.listData = null;
                    this._shared.refreshOperationGroupData.next(true);
                    resolve(true);
                }, err => {
                    if (err) {
                        this.alertUtils.showAlerts('Failed to save document. ' + err);
                    }
                    this._shared.opGrploading = false;
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
                const saveData = this.inputService.getCache(this._shared.appPath)['operationGroup'];
                if (saveData) {
                    let observable;
                    observable = this.apiService.post('/operation-group', saveData);
                     observable
                        .catch(err => {
                            reject(err);
                        })
                        .subscribe(res => {
                            if (res.data != '') {
                                reject(res && 'Duplicate operation group code found .');
                            } else {
                                if (res && res.success) {
                                    this._shared.id = res.data && res.data.opId ? res.data.opId : this._shared.id;
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

    duplicateOpGrpCodeCheck(upperValue) {
        return new Promise((resolve, reject) => {
            this.apiSubscribe = this.apiService.get('/' + this._shared.apiBase + '/duplicateOpGrpCode/' + upperValue)
                .catch(err => {
                    reject(err);
                    return err;
                })
                .subscribe(data => {
                    if (data.duplicate == true) {
                        this.alertUtils.showAlerts('Duplicate operation group code -' + upperValue + ' !');
                        resolve(true);
                    } else { resolve(false); }
                })
        })
    }
}
