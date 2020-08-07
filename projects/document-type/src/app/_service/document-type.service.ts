import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services';


import { AlertUtilities } from 'app/shared/utils';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DocumentTypeSharedService } from './document-type-shared.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { DocumentTypeModel } from '../models/document-type.model';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';



@Injectable()
export class DocumentTypeService {

    apiSubscription: Subscription;
    refreshOpertionTable: BehaviorSubject<boolean> = new BehaviorSubject(false);


    constructor(
        private apiService: ApiService,
        private _shared: DocumentTypeSharedService,
        public inputService: TnzInputService,
        private _cache: LocalCacheService,
        private alertUtils: AlertUtilities,
        public router: Router,
        private _dialog: MatDialog,
        //private location: Location
    ) {
    }

    fetchFormData(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id != 0) {
                this.apiService.get('/' + this._shared.apiBase + '/' + this._shared.id)
                    .subscribe(data => {
                        if (data.documentType) {

                            resolve(new DocumentTypeModel(data.documentType));
                        }
                        else {
                            reject();
                        }
                    }, err => reject(err));
            }
            else {
                resolve({});
            }
        }).catch((err) => {
            console.log('Caught Exception in Fetchformdata!');
        });
    }

    loadData(key) {
        this._shared[key + 'Loading'] = true;
        this._shared.setLines(key, []);
        if (this._shared.id == 0) {
            let data = this._shared.setLinesFromCache(key, []);

            this._shared.formData[key] = data;
            this._shared[key + 'Loading'] = false;
            this._shared.refreshLines(key);
        } else {
            this.fetchLinesData(key).then(
                (data: any) => {

                    this._shared.setLines(key, data);
                    data = this._shared.setLinesFromCache(key, data);
                    this._shared.formData[key] = data;
                    this._shared.refreshLines(key);
                    this._shared[key + 'Loading'] = false;
                },
                (err) => {
                    this._shared.refreshLines(key);
                    this._shared[key + 'Loading'] = false;

                }
            );
        }
    }
    fetchLinesData(key, id?) {

        switch (key) {
            case 'StatusDetail':
                return this.fetchStatusDetail(id);
            case 'Roledetail':
                return this.fetchRoledetail(id);
            default:
                break;
        }

    }
    fetchRoledetail(id?: number) {

        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {

                this.apiService.get(`/${this._shared.apiBase}/role-details?docTypeId=${this._shared.id}`)
                    .subscribe(data => {
                        if (data.data) {
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

    fetchStatusDetail(id?: number) {

        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {

                this.apiService.get('/' + this._shared.apiBase + '/status-details?docTypeId=' + this._shared.id)
                    .subscribe(data => {
                        if (data.data) {
                            let statuses = data.data;
                            //     statuses.filter((status:any) => status.role.value==0)

                            resolve(data.data);


                            reject();
                        }
                    }, err => reject(err));
            } else {
                resolve([]);
            }
        });
    }

    save(exit): Promise<any> {


        this._shared.loading = true;
        let isCreate = this._shared.id == 0;
        return new Promise((resolve, reject) => {
            this.saveData(this._shared.id)
                .then(res => {
                    this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
                    this._shared.removedAll = false
                    this._shared.resetSaveStausData();

                    this._shared.loading = false;
                    if (isCreate) {
                        this._shared.onNewDocumentCreated();
                        this.router.navigateByUrl('/document-type/' + this._shared.id + (exit ? '' : '/edit'))
                    } else {
                        if (exit)
                            this.router.navigateByUrl('/document-type/' + this._shared.id);
                        else
                            this._shared.refreshData.next(true);
                    }
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
                let saveData
                saveData = this._cache.getCachedValue(this._shared.appPath);



                //get status lines
                this.getStatusData()

                if (this._shared.saveStatusData.length || this._shared.removedAll == true) {

                    if (!saveData) {
                        saveData = {

                        };
                    }

                    saveData['StatusDetail'] = this._shared.saveStatusData
                    if (this._shared.removedAll == true) saveData['StatusDetail'] = null
                }


                if (saveData) {

                    let errorData
                    if (saveData.header) {
                        if (saveData.header.shortCode) {
                            saveData.header.shortCode = saveData.header.shortCode.toUpperCase();
                            errorData = saveData.header.shortCode

                        }
                        if (saveData.header.numControlled) {
                            if (saveData.header.numControlled == 'N') {
                                let seq = { label: '', shortCode: '', value: 0 };
                                saveData.header['docSeq'] = seq
                            }
                        }

                    }
                    this._shared.lineKeys.forEach(key => {
                        if (!saveData[key]) {
                            saveData[key] = [];
                        }


                        if (saveData[key]) {

                            let arr: any;
                            arr = saveData[key];
                            for (let index = 0; index < arr.length; index++) {
                                let element = arr[index];

                                if (element != null && element.isInitiate != null) {
                                    element.isInitiate = element.isInitiate == 'Y' ? 1 : 0;

                                }
                            }
                        }

                    });


                    let observable;


                    if (id == 0) {
                        observable = this.apiService.post('/document-type', saveData)
                    } else {
                        observable = this.apiService.put('/document-type/' + id, saveData)
                    }
                    observable
                        .catch(err => {
                            reject(err);
                        })
                        .subscribe(res => {
                            if (res.data == null) {


                                reject(res && 'Duplicate short code found ' + errorData);
                            }
                            else {

                                if (res && res.success) {
                                    this._shared.id = res.data && res.data.docTypeId ? res.data.docTypeId : this._shared.id;
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



    duplicateDocTypeCheck() {
        let shortCode = this._shared.formData.header.shortCode;

        return new Promise((resolve, reject) => {
            this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/checkDuplicate/' + shortCode)
                .catch(err => {
                    reject(err);
                    return err;
                })
                .subscribe(data => {
                    if (data.DupDocType == true) {

                        this.alertUtils.showAlerts('Duplicate Short Code-' + shortCode + ' !');
                        resolve(true);

                    } else {
                        resolve(false);
                    }
                })
        }
        )
    }
    setStatusData() {
        this._shared.statusList = []
        this.fetchStatusDetail()
            .then((data: any) => {

                data.forEach(row => {
                    row.active = row.active == 'Y'
                    row.isEditAllowed = row.isEditAllowed == 'Y'
                    row.isRevisionAllowed = row.isRevisionAllowed == 'Y'
                    if (row.role && row.role.value == 0)
                        this._shared.statusList.push(row)
                })
                this._shared.statusList.forEach(statusRow => {
                    statusRow['roles'] = []
                    data.forEach(row => {
                        if (row.docStatus && row.docStatus.value
                            && row.docStatus.value == statusRow.docStatus.value && row.role.value != 0)
                            statusRow['roles'].push(row)
                    })
                })
            })
    }
    getStatusData() {
        let flag = false
        this._shared.saveStatusData = [];


        if (this._shared.statusList) {

            if (this._shared.saveIndex) {
                this._shared.saveIndex.forEach(index => {




                    this._shared.saveStatusData.push(this._shared.statusList[index])
                    if (this._shared.saveRoleIndex && this._shared.saveRoleIndex.length) {
                        this._shared.saveRoleIndex.forEach(roleInd => {

                            if (roleInd.StatusIndex == index) {

                                this._shared.saveStatusData.push(this._shared.statusList[index].roles[roleInd.RoleIndex])
                            }
                        });
                    }
                });
            }

            if (this._shared.saveStatusData) {
                this._shared.saveStatusData.forEach(element => {
                    element.active = element.active == true ? 'Y' : 'N'
                    element.isEditAllowed = element.isEditAllowed == true ? 'Y' : 'N'
                    element.isRevisionAllowed = element.isRevisionAllowed == true ? 'Y' : 'N'

                });

            }
        }
    }



}
