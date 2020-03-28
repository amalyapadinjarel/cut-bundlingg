import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services/';
import { CutRegisterSharedService } from './cut-register-shared.service';
import { CutRegister, Product } from '../models/cut-register.model';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Router } from '@angular/router';
import { AlertUtilities } from 'app/shared/utils';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class CutRegisterService {

    constructor(private apiService: ApiService,
        private _shared: CutRegisterSharedService,
        public inputService: TnzInputService,
        private _cache: LocalCacheService,
        private alertUtils: AlertUtilities,
        public router: Router,
    ) {
    }

    fetchListData() {
        return new Promise((resolve, reject) => {
            this.apiService.get(this._shared.apiBase)
                .subscribe(data => {
                    if (data.count > 0)
                        resolve(data.registers);
                    else
                        reject();
                }, err => reject(err));
            // resolve([new CutRegister()]);
        });
    }

    fetchFormData(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get(this._shared.apiBase + '/' + this._shared.id)
                    .subscribe(data => {
                        if (data.register)
                            resolve( new CutRegister(data.register) );
                        else
                            reject();
                    }, err => reject(err));
            }
            else {
                resolve({});
            }
        });
    }

    fetchCostingApprovals(costingId?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get(this._shared.apiBase + 'costinglinestatus?limit=20&q=CostingId=' + (costingId ? costingId : this._shared.id))
                    .subscribe(data => {
                        if (data.count > 0)
                            resolve(data.items);
                        else
                            reject();
                    }, err => reject(err));
            }
            else {
                resolve([]);
            }
        });
    }

    fetchLayerDetails(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get(this._shared.apiBase + '/layer-details/' + this._shared.id)
                    .subscribe(data => {
                        if (data.register) {
                            resolve(data.register);
                            if(data.maxDisplayOrder){
                                this._shared.layerDetailsSeq = data.maxDisplayOrder
                            }
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

    fetchMarkerDetails(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get(this._shared.apiBase + '/marker-details/' + this._shared.id)
                    .subscribe(data => {
                        if (data.register){
                            resolve(data.register);
                            if (data.maxDisplayOrder) {
                                this._shared.markerDetailsSeq = data.maxDisplayOrder
                            }
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

    fetchOrderDetails(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get(this._shared.apiBase + '/order-details/' + this._shared.id)
                    .subscribe(data => {
                        if (data.register){
                            resolve(data.register);
                            console.log(data.maxDisplayOrder)
                            if (data.maxDisplayOrder) {
                                this._shared.orderDetailsSeq = data.maxDisplayOrder
                            }
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

    fetchCutPanelDetails(id?: number) {
        return new Promise((resolve, reject) => {
            // if (this._shared.id > 0) {
            //     this.apiService.get(this._shared.apiBase + '/cut-panel-details/' + this._shared.id)
            //         .subscribe(data => {
            //             if (data.register) {
            //                 resolve(data.register);
            //                 if (data.maxDisplayOrder) {
            //                     this._shared.cutPanelDetailsSeq = data.maxDisplayOrder
            //                 }
            //             }
            //             else
            //                 reject();
            //         }, err => reject(err));
            // }
            // else {
            resolve([]);
            // }
        });
    }

    fetchCutBundle(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                this.apiService.get(this._shared.apiBase + '/garment-cut-bundles/' + this._shared.id)
                    .subscribe(data => {
                        if (data.data)
                            resolve(data.data);
                        else
                            reject();
                    }, err => reject(err));
            }
            else {
                resolve([]);
            }
        });
    }

    generateNextCut() {
        let defaultMsg = "Unknown Error. Failed to generate next cut.";
        let params:HttpParams = new HttpParams();
        params = params.set('docNum', this._shared.getHeaderAttributeValue('documentNo'))
        return new Promise((resolve, reject) => {
            this.apiService.get(this._shared.apiBase + '/generate-next-cut',params)
                .subscribe(ret => {
                    if (ret.data) {
                        if (ret.data.returnCode && ret.data.returnCode == 1)
                            resolve(ret.data);
                        else if (ret.data.message)
                            reject(ret.data.message)
                    }
                    reject(defaultMsg);
                }, err => reject(defaultMsg));
        });
    }

    generateBundleLines(id: number) {
        let defaultMsg = "Unknown Error. Failed to generate bundle.";
        return new Promise((resolve, reject) => {
            this.apiService.get(this._shared.apiBase + '/generate-bundle/' + this._shared.id)
                .subscribe(ret => {
                    if (ret.data) {
                        if (ret.data.returnCode && ret.data.returnCode == 1)
                            resolve(ret.data);
                        else if (ret.data.message)
                            reject(ret.data.message)
                    }
                    reject(defaultMsg);
                }, err => reject(defaultMsg));
        });
    } 

    deleteBundleLines(id: number) {
        let defaultMsg = "Unknown Error. Failed to delete bundle.";
        return new Promise((resolve, reject) => {
            this.apiService.delete(this._shared.apiBase + '/garment-cut-bundles/' + this._shared.id)
                .subscribe(ret => {
                    if (ret.data) {
                        if (ret.data.returnCode && ret.data.returnCode == 1)
                            resolve(ret.data);
                        else if (ret.data.message)
                            reject(ret.data.message)
                    }
                    reject(defaultMsg);
                }, err => reject(defaultMsg));
        });
    }

    fetchProducts(id?: number) {
        return new Promise((resolve, reject) => {
            if (this._shared.id > 0) {
                // this.apiService.get(this._shared.apiBase + 'costingproductinfo?limit=100&q=CostingId=' + (costingId ? costingId : this._shared.costingId))
                //     .subscribe(data => {
                //         if (data.count > 0) {
                //             resolve(data.items);
                //         } else {
                //             reject();
                //         }
                //     }, err => reject(err));
                resolve([
                    new Product(44, 'CAMO HYBRID SWIM SHORT', 'GM20122-0014'),
                    new Product(45, 'UNDER ARMOR JACKET', 'GM20122-02234'),
                    new Product(50, 'AMERICAN EAGLE JEANS', 'FM20132-0034'),
                ]);
            } else {
                resolve([]);
            }
        });
    }

    fetchProductAttributes() {
        return new Promise((resolve, reject) => {
            resolve(this._shared.prodAttributes);
        });
    }

    fetchCostingLines(costingId?: number) {
        return new Promise((resolve, reject) => {
            this.apiService.get(this._shared.apiBase + 'costlinegroups?limit=1000&expand=Lines&finder=list;pCostingId=' + (costingId ? costingId : this._shared.id))
                .subscribe(data => {
                    if (data.count > 0)
                        resolve(data.items);
                    else
                        reject();
                }, err => reject(err));
        });
    }

    save(id?: number): Promise<any> {
        this._shared.loading = true;
        let isCreate = this._shared.id == 0;
        return new Promise((resolve, reject) => {
            this.saveData(id || this._shared.id)
                .then(res => {
                    if (isCreate) {
                        this.inputService.resetInputService(this._shared.appKey + '.0');
                        this._shared.loading = false;
                        this.router.navigateByUrl('cut-register/' + this._shared.id);
                    } else {
                        this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
                        this._shared.loading = false;
                        this._shared.refreshData.next(true);
                    }
                    resolve();
                }, err => {
                    if (err) {
                        this.alertUtils.showAlerts('Failed to ' + (isCreate ? 'save' : 'edit' + ' document. ') + err);
                    }
                    this._shared.loading = false;
                    resolve();
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
                    let observable;
                    if (id == 0) {
                        observable = this.apiService.post('/cut-register/lay-register', saveData)
                    } else {
                        observable = this.apiService.put('/cut-register/lay-register/' + id, saveData)
                    }
                    observable
                        .catch(err => {
                            reject(err);
                            // return err;
                        })
                        .subscribe(res => {
                            if (res && res.success) {
                                this._shared.id = res.data && res.data.registerId ? res.data.registerId : this._shared.id;
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

    fetchLinesData(key, id?) {
        switch (key) {
            case 'orderDetails':
                return this.fetchOrderDetails(id);
            case 'layerDetails':
                return this.fetchLayerDetails(id)
            case 'markerDetails':
                return this.fetchMarkerDetails(id);
            case 'cutPanelDetails':
                return this.fetchCutPanelDetails(id);
            case 'cutBundle':
                return this.fetchCutBundle(id)
            default:
                break;
        }
    }

    loadData(key) {
        this._shared[key + 'Loading'] = true;
        this._shared.setLines(key, []);
        if (this._shared.id == 0) {
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

}