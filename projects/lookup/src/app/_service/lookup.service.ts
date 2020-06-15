import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services/';
import { LookupSharedService } from './lookup-shared.service';
import { LookupType } from '../models/lookup.model';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Router } from '@angular/router';
import { AlertUtilities } from 'app/shared/utils';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'app/shared/component';
import { Location } from '@angular/common';
import { rejects } from 'assert';
import { Observable, Subscription, fromEventPattern } from 'rxjs';



@Injectable()
export class LookupService {



    apiSubscription: Subscription;

    constructor(private apiService: ApiService,
        private _shared: LookupSharedService,
        public inputService: TnzInputService,
        private _cache: LocalCacheService,
        private alertUtils: AlertUtilities,
        public router: Router,
        private _dialog: MatDialog,
        private location: Location

    ) {
    }

    fetchListData() {
        return new Promise((resolve, reject) => {
            this.apiService.get('/' + this._shared.apiBase)
                .subscribe(data => {
                    if (data.count > 0){
                        resolve(data.lookup);

                    }
                    else
                        reject();
                }, err => reject(err));
        });
    }

    //Method for form view header

    fetchFormData(id?: string) {
        return new Promise((resolve, reject) => {
            if (this._shared.lookupType != '--') {
                this.apiService.get('/' + this._shared.apiBase + '/' + this._shared.lookupType)
                    .subscribe(data => {
                        if (data.lookup) {
                            resolve(new LookupType(data.lookup));
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

    //Method for form view lines--LookupValue

    fetchLookupValue(lookupType?: string) {
        return new Promise((resolve, reject) => {
            if (this._shared.lookupType != '--') {

                this.apiService.get('/' + this._shared.apiBase + '/lookupValue/' + this._shared.lookupType)
                    .subscribe(data => {
                        if (data.lookupValue) {
                            resolve(data.lookupValue);
                        }
                        else {
                            reject();

                        }
                    }, err => reject(err));
            }
            else {
                resolve([]);
            }
        });
    }

   
    //Method to check for duplicate lookup type
    duplicateLookupTypeCheck() {
        let tmp = this._shared.formData.header.lookupType;
      
        return new Promise((resolve, reject) => {
            this.apiSubscription = this.apiService.get('/' + this._shared.apiBase + '/duplicateCheck/' + tmp)
                .catch(err => {
                    reject(err);
                    return err;

                })
                .subscribe(data => {
                    if (data.duplicate==true) {
                       
                        this.alertUtils.showAlerts('Duplicate lookup type -' + tmp + ' !');
                        resolve(true);

                    } else {
                        resolve(false);
                    }
                })
        }
        )
    }



    fetchLinesData(key, id?) {

        switch (key) {

            case 'lookupValue':
                return this.fetchLookupValue(id);

            default:
                break;
        }
    }

    loadData(key) {
        this._shared[key + 'Loading'] = true;
        this._shared.setLines(key, []);

        if (this._shared.lookupType == '--') {

           let data = this._shared.setLinesFromCache(key, [])
            this._shared.formData[key] = data;
            this._shared[key + 'Loading'] = false;
            this._shared.refreshLines(key);
        } else {

            this.fetchLinesData(key).then((data: any) => {
                this._shared.setLines(key, data);
                data = this._shared.setLinesFromCache(key, data)
                this._shared.formData[key] = data;
                this._shared.refreshLines(key);
                this._shared[key + 'Loading'] = false;
            }, err => {
                this._shared.refreshLines(key);
                this._shared[key + 'Loading'] = false;
                if (err)
                    this.alertUtils.showAlerts(err.message, true)
            });
        }
    }

    checkIfEdited() {
        let saveData = this._cache.getCachedValue(this._shared.appPath);
        return !!saveData;
    }

    
    save(id?: number): Promise<any> {
        this._shared.loading = true;
        let isCreate = this._shared.lookupType == '--';
        return new Promise((resolve, reject) => {
            this.saveData(id || this._shared.lookupType)
                // this.saveData(this._shared.lookupType)

                .then(res => {
                    this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.lookupType);
                    this._shared.loading = false;
                    this._shared.listData=null; //to refresh list
                    if (this._shared.lookupType != '--') {
                        this.location.go('/lookup/' + this._shared.lookupType + '/edit');
                        this.location.replaceState('/lookup/' + this._shared.lookupType + '/edit');
                    }
                    this._shared.refreshData.next(true);
                    resolve(true);
                }, err => {
                    if (err) {
                        this.alertUtils.showAlerts('Failed to ' + ((this._shared.lookupType == '--' ? 'save' : 'edit') + ' document. ') + err);
                    }
                    this._shared.loading = false;
                    resolve(false);
                }).catch((err) => {
                    console.log('Caught Exception on saving data!');
                })
        });

    }

    saveData(id): Promise<any> {
        return new Promise((resolve, reject) => {
            let inValid;

            //Checking if inputs are valid in header
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
                let saveData = this._cache.getCachedValue(this._shared.appPath);
                
               //console.log("saveData=",saveData)
               
               // Adding the removedkeys as active - N to remove them

                if (saveData) {


                    this._shared.lineKeys.forEach(key => {

                    
                        if (!saveData[key]) {
                            saveData[key] = [];
                        }
                        //recently commented
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
                    if (id == '--') {
                        observable = this.apiService.post('/lookup/', saveData)
                    } else {
                        observable = this.apiService.put('/lookup/' + id, saveData)
                    }
                
                   observable
                        .catch(err => {

                           reject(err);
                            // return err;
                        })
                        .subscribe(res => {
                            if (res && res.success) {
                                this._shared.lookupType = res.data && res.data.lookupType ? res.data.lookupType : this._shared.lookupType;
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
}