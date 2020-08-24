import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services';
import { DefectGroupSharedService } from './defect-group-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Router } from '@angular/router';
import { DefectGroupModel } from '../model/defect-group.model';
import { AlertUtilities, CommonUtilities } from 'app/shared/utils';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class DefectGroupService {

    constructor(private apiService: ApiService,
        private _shared: DefectGroupSharedService,
        public inputService: TnzInputService,
        private alertUtils: AlertUtilities,
        private _cache: LocalCacheService,
        public router: Router
    ) { }

    fetchFormData(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get(`/${this._shared.apiBase}/${this._shared.id}`)
                    .subscribe(data => {
                        if (data.defectGroup) {
                            resolve(new DefectGroupModel(data.defectGroup));
                        } else {
                            reject();
                        }
                    }, err => reject(err));
            } else {
                resolve({});
            }
        });
    }

    loadData(key) {
        this._shared.headerLoading = true;
        this._shared.setLines(key, []);
        if (this._shared.id == 0) {
            let data = this._shared.setLinesFromCache(key, [])
            this._shared.formData[key] = data;
            this._shared.headerLoading = false;
            this._shared.refreshLines(key);
        }
        else{
        this.fetchDefects(key).then(
            (data: any) => {
                this._shared.setLines(key, data);
                data = this._shared.setLinesFromCache(key, data);
                this._shared.formData[key] = data;
                this._shared.refreshDefectData.next(true);
                this._shared.headerLoading = false;
            }
        );
    }
    }

    fetchDefects(key: String) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get(`/${this._shared.apiBase}/defects?defectGrpId=${this._shared.id}`)
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


    fetchDefectsforCopy(key) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get(`/${this._shared.apiBase}/defects?defectGrpId=` + key)
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

    save(exit): Promise<any> {
        this._shared.headerLoading = true;
        let isCreate = this._shared.id == 0;
        return new Promise((resolve, reject) => {
            this.saveData(this._shared.id)
                .then(res => {
                    this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
                    this._shared.headerLoading = false;
                    if (isCreate) {
                        this.router.navigateByUrl('defect-group/' + this._shared.id + (exit ? '' : '/edit'))
                        this._shared.refreshdefectGroupHeaderData.next(true);
                    } else {
                        if (exit)
                            this.router.navigateByUrl('/defect-group/' + this._shared.id);
                        else
                            this._shared.refreshdefectGroupHeaderData.next(true);
                    }
                    resolve(true);
                }, err => {
                    if (err) {
                        this.alertUtils.showAlerts('Failed to ' + ((isCreate ? 'save' : 'edit') + ' document. ') + err);
                    }
                    this._shared.headerLoading = false;
                    resolve(false);
                })
        });

    }

    saveData(id): Promise<any> {
        return new Promise((resolve, reject) => {
            let inValid;

            //Checking if inputs are valid in header
            let inputs = this.inputService.getInput(this._shared.defectGroupHeaderPath);
            if (inputs) {
                inValid = Object.keys(inputs).some(key => {
                    if (inputs[key] && inputs[key].isEdit && inputs[key].status != 'ok' && inputs[key].status != 'changed') {
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
                let saveData = this._cache.getCachedValue(this._shared.appPath);
                if (this._shared.id == 0) {
                    if (!saveData.header.shortCode || !saveData.header.groupName || !saveData.header.defectType || !saveData.header.active) {
                        inValid = true;
                    }
                }
                if (saveData) {
                    if (inValid) {
                        reject('Please fill mandatory fields.');
                    }
                    else {
                        
                        saveData = this.reOrderLines(saveData, 'defect');
                        let observable;
                        if (id == 0) {
                            observable = this.apiService.post('/defect-group', saveData)
                        } else {
                            observable = this.apiService.put('/defect-group/' + id, saveData)


                        }
                        observable
                            .catch(err => {
                                reject(err);
                                // return err;
                            })
                            .subscribe(res => {
                                if (res && res.data[0] != "") {
                                    if (res.data[0] === 'duplicateHeader') {
                                        reject(res && 'Duplicate defect group code ' + res.data[1] + ' found. Please check.');
                                    }
                                    if (res.data[0] === 'duplicateDefect') {
                                        let val = res.data[1];
                                        reject(res && 'Duplicate defect code ' + val.split(",", 3)[0] + ' found at seq # ' + val.split(",", 3)[1] + ' and ' + val.split(",", 3)[2] + '. Please check.');
                                    }
                                    if (res.data[0] === 'duplicateDefectI') {
                                        let val = res.data[1];
                                        let valI = val.split(",", 3)[2].split("^",2)[1]
                                      
                                        reject(res && 'Duplicate defect code ' + val.split(",", 3)[0] + ' found at seq # ' + val.split(",", 3)[1] + ' and ' + valI+ '. Please check.');
                         
                                    }
                                }
                                if (res && res.success) {
                                    this._shared.id = res.data && res.data[2] ? Number(res.data[2]) : this._shared.id;

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

    reOrderLines(saveData, key) {
        const sortKey = 'sequence';
        let detailsLines = this._shared.formData[key];
        let editedLines = saveData[key];
        let primaryKey = this._shared[key + 'PrimaryKey']
        if (editedLines) {
            detailsLines.forEach((line, index) => {
                if (!editedLines[index]) {
                    editedLines[index] = {};
                    editedLines[index][primaryKey] = line[primaryKey]
                    editedLines[index][sortKey] = line[sortKey].toString()
                    editedLines[index]['name'] = line['name'].toString()
                    editedLines[index]['active'] = line['active'].toString()
                } else if (!editedLines[index][sortKey]) {
                    editedLines[index][sortKey] = line[sortKey].toString()
                }
            })
            let sortedModel = [];
            sortedModel = CommonUtilities.sortByKey(editedLines, sortKey);
            sortedModel.forEach((line, index) => {
                line[sortKey] = index + 1
            })
            saveData[key] = sortedModel;
        }
        return saveData;
    }
}