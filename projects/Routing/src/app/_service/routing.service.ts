import { Injectable } from "@angular/core";
import { RoutingSharedService } from "./routing-shared.service";
import { ApiService, LocalCacheService } from "app/shared/services";
import { TnzInputService } from "app/shared/tnz-input/_service/tnz-input.service";
import { AlertUtilities, CommonUtilities } from "app/shared/utils";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Location } from '@angular/common';
import { ConfirmPopupComponent } from 'app/shared/component';


@Injectable({
    providedIn: "root",
})
export class RoutingService {

    constructor(
        private apiService: ApiService,
        private _shared: RoutingSharedService,
        public inputService: TnzInputService,
        private _cache: LocalCacheService,
        private alertUtils: AlertUtilities,
        public router: Router,
        private _dialog: MatDialog,
        private location: Location
    ) { }

    fetchFormData(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService
                    .get("/" + this._shared.apiBase + "/" + this._shared.id)
                    .subscribe(
                        (data) => {
                            if (data.routing) {
                                if (data.cuttingStepId) this._shared.stepId = data.cuttingStepId;
                                resolve(data.routing);
                            }
                            else reject();
                        },
                        (err) => reject(err)
                    );
            } else {
                resolve({});
            }
        });
    }

    loadData(key) {
        this._shared[key + "Loading"] = true;
        this._shared.setLines(key, []);
        if (this._shared.id == 0) {
            let data = this._shared.setLinesFromCache(key, []);
            this._shared.formData[key] = data;
            this._shared[key + "Loading"] = false;
            this._shared.refreshCutPanelDetails.next(true);
        } else {
            this.fetchLinesData(key).then(
                (data: any) => {
                    this._shared.setLines(key, data);
                    data = this._shared.setLinesFromCache(key, data);
                    this._shared.formData[key] = data;
                    this._shared.refreshCutPanelDetails.next(true);
                    this._shared[key + "Loading"] = false;
                },
                (err) => {
                    this._shared.refreshCutPanelDetails.next(true);
                    this._shared[key + "Loading"] = false;
                    if (err) this.alertUtils.showAlerts(err.message, true);
                }
            );
        }
    }

    fetchLinesData(key, id?) {
        switch (key) {
            case 'cutPanelDetails':
                return this.fetchCutPanelDetails(id);
            default:
                break;
        }
    }

    fetchCutPanelDetails(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get('/' + this._shared.apiBase + '/cutting-steps/' + this._shared.id)
                    .subscribe(data => {
                        if (data.cuttingDetails) {
                            if (data.maxSequence) {
                                this._shared.cutPanelDetailsSeq = data.maxSequence
                            }
                            resolve(data.cuttingDetails);
                        }
                        else
                            reject();
                    }, err => reject(err));
            }
            else {
                resolve([]);
            }
        });
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

            //Checking if inputs are valid in header
            let inputs = this.inputService.getInput(this._shared.cutPanelDetailsPath);
            if (inputs) {
                inValid = Object.keys(inputs).some(key => {
                    let temp = inputs[key];
                    Object.keys(temp).some(keys => {
                        if (temp[keys] && temp[keys].status != 'ok' && temp[keys].status != 'changed') {
                            return true;
                        }
                    })
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
                if (saveData) {
                    // Reordering seq # in all details tables
                    this._shared.lineKeys.forEach(key => {
                        saveData = this.reOrderLines(saveData, key);
                    })
                    // Adding the removedkeys as active - N to remove them
                    this._shared.lineKeys.forEach(key => {
                        if (!saveData[key]) {
                            saveData[key] = [];
                        }
                        let removedPath = this._shared[key + 'RemovedKeysPath'];
                        let linePrimaryKey = this._shared[key + 'PrimaryKey']
                        let cache = this._cache.getCachedValue(removedPath)
                        if (cache && cache.length) {
                            cache.forEach(removedPrimaryKey => {
                                let json = { 'active': 'N' };
                                json[linePrimaryKey] = removedPrimaryKey;
                                saveData[key].push(json)
                            });
                        }
                    });
                    let observable;
                    observable = this.apiService.post('/routing/cutting-steps', saveData);
                    observable
                        .catch(err => {
                            reject(err);
                            // return err;
                        })
                        .subscribe(res => {
                            if (res && res.success) {
                                this._shared.id = res.data && res.data.routingId ? res.data.routingId : this._shared.id;
                                resolve(res)
                            } else {
                                reject(res && res.message ? res.message : 'Unknown error');
                            }
                        })
                } else {
                    reject('No changes detected');
                }
            }
        });
    }

    deleteDetailsLine(key, index, model) {
        this._shared.deleteLine(key, index);
    }

    deleteLines(key) {
        if (this._shared.selectedLines[key] && this._shared.selectedLines[key].length) {
            let primaryKey = this[key + 'PrimaryKey'];
            let dialogRef = this._dialog.open(ConfirmPopupComponent);
            dialogRef.componentInstance.dialogTitle = 'Delete selected record(s)';
            dialogRef.componentInstance.message = 'Are you sure you want to delete the selected ' + this._shared.selectedLines[key].length + ' record(s)'
            dialogRef.afterClosed().subscribe(flag => {
                if (flag) {
                    this._shared.selectedLines[key].forEach(line => {
                        let index = this._shared.formData[key].findIndex(data => {
                            let model = this._shared.getLineModel(key, data)
                            return model.equals(line)
                        });
                        this.deleteDetailsLine(key, index, line);
                    });
                    this._shared.setSelectedLines(key, [])
                }
            })
        }
    }

    getSavedCacheData() {
        let saveData = this._cache.getCachedValue(this._shared.appPath);
        // Adding the removedkeys as active - N to remove them
        if (saveData) {

            this._shared.lineKeys.forEach(key => {
                if (!saveData[key]) {
                    saveData[key] = [];
                }
                let removedPath = this._shared[key + 'RemovedKeysPath'];
                let linePrimaryKey = this._shared[key + 'PrimaryKey']
                let cache = this._cache.getCachedValue(removedPath)
                if (cache && cache.length) {
                    cache.forEach(removedPrimaryKey => {
                        let json = { 'active': 'N' };
                        json[linePrimaryKey] = removedPrimaryKey;
                        saveData[key].push(json)
                    });
                }
            });
        }
        return saveData;
    }

    reOrderLines(saveData, key) {
        console.log(saveData)
        const sortKey = this._shared.getSeqKey(key);
        let detailsLines = this._shared.formData[key];
        let removedKeys = saveData[key + 'RemovedKeys'];
        let editedLines = saveData[key];
        let primaryKey = this._shared[key + 'PrimaryKey']
        if (editedLines || removedKeys) {
            if (!editedLines)
                editedLines = []
            detailsLines.forEach((line, index) => {
                if (!editedLines[index]) {
                    editedLines[index] = {};
                    editedLines[index][primaryKey] = line[primaryKey]
                    editedLines[index][sortKey] = line[sortKey]
                } else if (!editedLines[index][sortKey]) {
                    editedLines[index][sortKey] = line[sortKey]
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
