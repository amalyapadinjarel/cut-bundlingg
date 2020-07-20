import { Injectable } from '@angular/core';
import { MfgRoutingSharedService } from './mfg-routing-shared.service';
import { ApiService, LocalCacheService } from '../../../../../src/app/shared/services';
import { MfgRouting } from '../models/routing.model';
import { TnzInputService } from '../../../../../src/app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from '../../../../../src/app/shared/utils';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConfirmPopupComponent } from '../../../../../src/app/shared/component/confirm-popup';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class MfgRoutingService {

    constructor(public _shared: MfgRoutingSharedService, private apiService: ApiService, public inputService: TnzInputService,
        private alertUtils: AlertUtilities, private _cache: LocalCacheService, private _dialog: MatDialog,
    ) {
    }

    fetchFormData(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get(`/${this._shared.apiBase}/${this._shared.id}`)
                    .subscribe(data => {
                        if (data.routing) {
                            resolve(new MfgRouting(data.routing));
                        } else {
                            reject();
                        }
                    }, err => reject(err));
            } else {
                resolve({});
            }
        });
    }

    fetchOperations(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get(`/${this._shared.apiBase}/routing-steps?routingId=${this._shared.id}`)
                    .subscribe(data => {
                        if (data.data) {
                            // if (data.maxSequence) {
                            //     this._shared.cutPanelDetailsSeq = data.maxSequence
                            // }
                            resolve(data.data);
                        } else {
                            reject();
                        }
                    }, err => reject(err));
            } else {
                resolve([]);
            }
        });
    }

    loadData(key) {
        this._shared[key + 'Loading'] = true;
        this._shared.setLines(key, []);
        if (this._shared.id == 0) {
            const data = this._shared.setLinesFromCache(key, []);
            this._shared.formData[key] = data;
            this._shared[key + 'Loading'] = false;
            this._shared.refreshOpertionTable.next(true);
        } else {
            this.fetchOperations(key).then(
                (data: any) => {
                    this._shared.setLines(key, data);
                    // data = this._shared.setLinesFromCache(key, data);
                    this._shared.formData[key] = data;
                    this._shared.refreshOpertionTable.next(true);
                    this._shared[key + 'Loading'] = false;
                },
                (err) => {
                    this._shared.refreshOpertionTable.next(true);
                    this._shared[key + 'Loading'] = false;
                    // if (err) this.alertUtils.showAlerts(err.message, true);
                }
            );
        }
    }

    save(id?: number): Promise<any> {
        this._shared.loading = true;
        return new Promise((resolve, reject) => {
            this.saveData(id || this._shared.id)
                .then(res => {
                    this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
                    this._shared.loading = false;
                    this._shared.refreshData.next(true);
                    resolve(true);
                }, err => {
                    if (err) {
                        this.alertUtils.showAlerts('Failed to ' + 'edit' + ' document. ' + err);
                    }
                    this._shared.loading = false;
                    resolve(false);
                })
        });

    }

    saveData(id): Promise<any> {
        return new Promise((resolve, reject) => {
            let inValid;

            // Checking if inputs are valid in header
            let inputs = this.inputService.getInput(this._shared.headerPath);
            if (inputs) {
                inValid = Object.keys(inputs).some(key => {
                    if (inputs[key] && inputs[key].status != 'ok' && inputs[key].status != 'changed') {
                        return true;
                    }
                });
            }
            // Checking if inputs are valid in lines
            if (!inValid) {
                this._shared.lineKeys.forEach(key => {
                    if (!inValid) {
                        inputs = this.inputService.getInput(this._shared[key + 'Path']);

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
                    }
                });
            }
            if (inValid) {
                reject('Please fill mandatory fields.');
            } else {

                const saveData = this._cache.getCachedValue(this._shared.appPath);
                if (saveData) {
                    inValid = this.validateOperations(saveData.operationDetails)
                    if (inValid) {
                        reject('Same operation cannot be added more than once.')
                    } else {

                        // Adding the removedkeys as active - N to remove them
                        this._shared.lineKeys.forEach(key => {
                            if (!saveData[key]) {
                                saveData[key] = [];
                            }
                            const removedPath = this._shared[key + 'RemovedKeysPath'];
                            const linePrimaryKey = this._shared[key + 'PrimaryKey']
                            const cache = this._cache.getCachedValue(removedPath)
                            if (cache && cache.length) {
                                cache.forEach(removedPrimaryKey => {
                                    const json = { 'active': 'N' };
                                    json[linePrimaryKey] = removedPrimaryKey;
                                    saveData[key].push(json)
                                });
                            }
                        });
                        let observable;
                        // console.log(this._shared.getHeaderAttributeValue('revisionNo'))

                        if (id == 0) {
                            observable = this.apiService.post('/routing', saveData)
                        } else {
                            observable = this.apiService.put('/routing/' + id, saveData)
                        }
                        observable
                            .catch(err => {
                                reject(err);
                            })
                            .subscribe(res => {
                                if (res && res.success) {
                                    this._shared.id = res.data && res.data.routingId ? res.data.routingId : this._shared.id;
                                    resolve(res)
                                } else {
                                    reject(res && res.message ? res.message : 'Unknown error');
                                }
                            })
                    }

                } else {
                    reject('No changes detected');
                }
            }
        });
    }

    processUploadedRouting(fileName: string): Observable<any> {
        const params = new HttpParams().set('fileName', fileName)
        return this.apiService.get(`/routing/parse-excel`, params);
    }

    processUploadedRoutingSteps(fileName: string): Observable<any> {
        const params = new HttpParams().set('fileName', fileName).set('routingId', this._shared.id + '')
        return this.apiService.get(`/routing/parse-excel`, params);
    }

    approve() {
        const defaultMsg = 'Unknown Error. Failed to approve document.';
        let params: HttpParams = new HttpParams();
        params = params.set('routingId', this._shared.id.toString())
        return new Promise((resolve, reject) => {
            this.apiService.get('/' + this._shared.apiBase + '/approve-routing/', params)
                .subscribe(ret => {
                    if (ret.success) {
                        if (ret.data.returnCode && ret.data.returnCode == 1) {
                            resolve(ret.data.message);
                        } else if (ret.data.message) {
                            reject(ret.data.message)
                        }
                    }
                    reject(defaultMsg);
                }, err => reject(defaultMsg));
        });
    }


    copyRouting() {
        const defaultMsg = 'Unknown Error. Failed to generate next cut.';
        let params: HttpParams = new HttpParams();
        params = params.set('docNum', this._shared.getHeaderAttributeValue('documentNo'))
        return new Promise((resolve, reject) => {
            this.apiService.get('/' + this._shared.apiBase + '/copy-routing', params)
                .subscribe(ret => {
                    if (ret.data) {
                        if (ret.data.returnCode && ret.data.returnCode == 1) {
                            resolve(ret.data);
                        } else if (ret.data.message) {
                            reject(ret.data.message)
                        }
                    }
                    reject(defaultMsg);
                }, err => reject(defaultMsg));
        });
    }

    deleteLines(key: string) {
        if (this._shared.selectedLines[key] && this._shared.selectedLines[key].length) {
            const primaryKey = this[key + 'PrimaryKey'];
            const dialogRef = this._dialog.open(ConfirmPopupComponent);
            dialogRef.componentInstance.dialogTitle = 'Delete selected record(s)';
            dialogRef.componentInstance.message = 'Are you sure you want to delete the selected ' + this._shared.selectedLines[key].length + ' record(s)'
            dialogRef.afterClosed().subscribe(flag => {
                if (flag) {
                    this._shared.selectedLines[key].forEach(line => {
                        const index = this._shared.formData[key].findIndex(data => {
                            const model = this._shared.getLineModel(key, data)
                            let value = model.equals(line)
                            return value
                        });
                        this.deleteDetailsLine(key, index, line);
                    });
                    this._shared.setSelectedLines(key, [])
                }
            })
        }
    }

    deleteDetailsLine(key, index, model) {
        if (!model ?.activeInOut) {
            this._shared.deleteLine(key, index);
        } else {
            this.alertUtils.showAlerts('Cannot delete active in IN_OUT ')
        }
    }


    reviseDocument() {
        if (this._shared.reviseMode || this._shared.getHeaderAttributeValue('docStatus') == 'APPROVED') {
            let saveData = {
                header: {
                    revisionNo: +this._shared.getHeaderAttributeValue('revisionNo') + 1,
                    docStatus: 'REVISING'
                }
            };
            return this.apiService.put('/routing/' + this._shared.id, saveData)

        } else {
            return of(null);
        }

    }

    validateOperations(operationsData) {

        let key = 'operationDetails'
        let sharedData = this._shared.formData[key];
        let invalid = false;
        let operationIds = []
        if (operationsData) {
            operationsData.forEach((operationLine, index) => {
                let operationId;
                if (operationLine && operationLine.opLabel) {
                    operationId = operationLine.opLabel.value;
                } else {
                    if (sharedData[index]) {
                        operationId = sharedData[index].opId;
                    }
                }
                if (operationId) {
                    if (operationIds.indexOf(operationId) == -1)
                        operationIds.push(operationId)
                    else {
                        invalid = true;
                        return;
                    }
                }

            })
        }
        return invalid
    }
}
