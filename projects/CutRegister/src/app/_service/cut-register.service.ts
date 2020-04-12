import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services/';
import { CutRegisterSharedService } from './cut-register-shared.service';
import { CutRegister, Product } from '../models/cut-register.model';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Router } from '@angular/router';
import { AlertUtilities } from 'app/shared/utils';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'app/shared/component';
import { Location } from '@angular/common';

@Injectable()
export class CutRegisterService {


    constructor(private apiService: ApiService,
        private _shared: CutRegisterSharedService,
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
                this.apiService.get('/' + this._shared.apiBase + '/' + this._shared.id)
                    .subscribe(data => {
                        if (data.register)
                            resolve(new CutRegister(data.register));
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
                this.apiService.get('/' + this._shared.apiBase + 'costinglinestatus?limit=20&q=CostingId=' + (costingId ? costingId : this._shared.id))
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
                this.apiService.get('/' + this._shared.apiBase + '/layer-details/' + this._shared.id)
                    .subscribe(data => {
                        if (data.register) {
                            resolve(data.register);
                            if (data.maxDisplayOrder) {
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
                this.apiService.get('/' + this._shared.apiBase + '/marker-details/' + this._shared.id)
                    .subscribe(data => {
                        if (data.register) {
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
                this.apiService.get('/' + this._shared.apiBase + '/order-details/' + this._shared.id)
                    .subscribe(data => {
                        if (data.register) {
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
            if (this._shared.id > 0) {
                this.apiService.get('/' + this._shared.apiBase + '/cut-panels/' + this._shared.id)
                    .subscribe(data => {
                        if (data.register) {
                            resolve(data.register);
                            if (data.maxDisplayOrder) {
                                this._shared.cutPanelDetailsSeq = data.maxDisplayOrder
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

    fetchCutBundle(id?: number) {
        return new Promise((resolve, reject) => {
            let params:HttpParams = new HttpParams();
            params = params.set("direction","ASC")
            if (this._shared.id > 0) {
                this.apiService.get('/' + this._shared.apiBase + '/garment-cut-bundles/' + this._shared.id, params)
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
        let params: HttpParams = new HttpParams();
        params = params.set('docNum', this._shared.getHeaderAttributeValue('documentNo'))
        return new Promise((resolve, reject) => {
            this.apiService.get('/' + this._shared.apiBase + '/generate-next-cut', params)
                .subscribe(ret => {
                    if (ret.data) {
                        if (ret.data.returnCode && ret.data.returnCode == 1 && ret.data.message)
                            resolve(ret.data.message);
                        else if (ret.data.message)
                            reject(ret.data.message)
                    }
                    reject(defaultMsg);
                }, err => reject(defaultMsg));
        });
    }

    approve() {
        let defaultMsg = "Unknown Error. Failed to approve document.";
        let params: HttpParams = new HttpParams();
        params = params.set('cutRegisterId', this._shared.id.toString())
        return new Promise((resolve, reject) => {
            this.apiService.get('/' + this._shared.apiBase + '/approve/' + this._shared.id)
                .subscribe(ret => {
                    console.log(ret)
                    if (ret.status && ret.status == 'S') {
                        if (ret.returnCode && ret.returnCode == 1)
                            resolve();
                        else if (ret.message)
                            reject(ret.message)
                    }
                    reject(defaultMsg);
                }, err => reject(defaultMsg));
        });
    }

    revise() {
        let defaultMsg = "Unknown Error. Failed to approve document.";
        let params: HttpParams = new HttpParams();
        params = params.set('cutRegisterId', this._shared.id.toString())
        return new Promise((resolve, reject) => {
            this.apiService.get('/' + this._shared.apiBase + '/revise/' + this._shared.id)
                .subscribe(ret => {
                    console.log(ret)
                    if (ret.status && ret.status == 'S') {
                        if (ret.returnCode && ret.returnCode == 1)
                            resolve();
                        else if (ret.message)
                            reject(ret.message)
                    }
                    reject(defaultMsg);
                }, err => reject(defaultMsg));
        });
    }

    generateBundleLines(id: number) {
        let defaultMsg = "Unknown Error. Failed to approve bundle.";
        return new Promise((resolve, reject) => {
            this.apiService.get('/' + this._shared.apiBase + '/generate-bundle/' + this._shared.id)
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
            this.apiService.delete('/' + this._shared.apiBase + '/garment-cut-bundles/' + this._shared.id)
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
                // this.apiService.get('/' + this._shared.apiBase + 'costingproductinfo?limit=100&q=CostingId=' + (costingId ? costingId : this._shared.costingId))
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
            this.apiService.get('/' + this._shared.apiBase + 'costlinegroups?limit=1000&expand=Lines&finder=list;pCostingId=' + (costingId ? costingId : this._shared.id))
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
                    this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
                    this._shared.loading = false;
                    if (isCreate) {
                        this.location.go('cut-register/' + this._shared.id + '/edit');
                    }
                    this._shared.refreshData.next(true);
                    resolve(true);
                }, err => {
                    if (err) {
                        this.alertUtils.showAlerts('Failed to ' + (isCreate ? 'save' : 'edit' + ' document. ') + err);
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

    calculateAllowedQty(orderQty, cutAllowance) {
        let qty = 0;
        if (orderQty && !isNaN(orderQty)) {
            qty = Number(orderQty);
            if (cutAllowance && !isNaN(cutAllowance))
                qty += qty * Number(cutAllowance) / 100;
        }
        return Math.round(qty);
    }

    getCutPanelsFromRoutingIds(routingIds: Array<any>) {
        return new Promise((resolve, reject) => {
            let errorMsg = 'Error while fetching cut panels from orders.';
            let params = new HttpParams();
            params = params.set('idList', routingIds.toString());
            this.apiService.get('/' + this._shared.apiBase + '/cut-panels-from-order', params)
                .catch(err => {
                    reject(errorMsg);
                    return err;
                })
                .subscribe(data => {
                    if (data && data.cutPanels)
                        resolve(data.cutPanels);
                    else
                        reject(errorMsg);
                })
        })
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
                            return data[primaryKey] == line[primaryKey]
                        });
                        this.deleteDetailsLine(key, index, line);
                    });
                    this._shared.setSelectedLines(key, [])
                }
            })
        }
    }   

    deleteDetailsLine(key, index, model) {
        let productId, orderDetails, orders;
        switch (key) {
            case 'markerDetails':
                productId = model['productId'];
                this._shared.deleteLine(key, index);
                orderDetails = this._shared.formData.orderDetails
                orders = orderDetails.filter(data => { return data.refProductId == productId });
                orders.forEach(order => {
                    let i = orderDetails.indexOf(order);
                    this._shared.deleteLine('orderDetails', i);
                })
                break;
            case 'orderDetails':
                productId = model['refProductId'];
                this._shared.deleteLine(key, index);
                orderDetails = this._shared.formData.orderDetails
                orders = orderDetails.filter(data => { return data.refProductId == productId });
                if (!orders || !orders.length) {
                    let markerDetails = this._shared.formData.markerDetails;
                    let i = markerDetails.findIndex(data => { return data.productId == productId });
                    if (i > -1) {
                        this._shared.deleteLine('markerDetails', i);
                    }
                }
                break;
            case 'layerDetails':
                if (this._shared.formData.cutBundle && this._shared.formData.cutBundle.length) {
                    this.alertUtils.showAlerts("Cannot delete layer details as one or more bundle lines exist. Please remove the lines and try again.")
                } else {
                    this._shared.deleteLine(key, index);
                    this.resetCutQty();
                }
                break;
            default:
                this._shared.deleteLine(key, index);
                break;
        }
    }

    calclateTotalPlyCount() {
        let count = 0;
        this._shared.formData.layerDetails.forEach((line, index) => {
            let value = this.inputService.getInputValue(this._shared.getLayerDetailsPath(index, 'layerCount'))
            if (value && !isNaN(value))
                count += Number(value);
        })
        return count;
    }

    resetCutQty() {
        let totalPlyCount = this.calclateTotalPlyCount();
        this._shared.formData.markerDetails.forEach((line, index) => {
            let value = this.inputService.getInputValue(this._shared.getMarkerDetailsPath(index, 'markerRatio'))
            if (typeof value != undefined && !isNaN(value)) {
                value = Number(value) * totalPlyCount;
                this.inputService.updateInput(this._shared.getMarkerDetailsPath(index, 'currcutqtysql'), value, this._shared.markerDetailsPrimaryKey);
            }
        })
    }

    checkIfEdited(){
        let saveData = this._cache.getCachedValue(this._shared.appPath);
        return !!saveData;        
    }

    getExtraCutValues(facility) {
        return new Promise((resolve, reject) => {
            let errorMsg = 'Failed to get extra cut values.';
            let params = new HttpParams();
            params = params.set('facility', facility);
            this.apiService.get('/' + this._shared.apiBase + '/extra-cut', params)
                .catch(err => {
                    reject(errorMsg);
                    return err;
                })
                .subscribe(data => {
                    if (data && data.status && data.status== 'S' && data.extraCut)
                        resolve(data.extraCut);
                    else if(data.status == 'F' && data.message)
                        reject(errorMsg + ' ' +  data.message);
                    else
                        reject(errorMsg);
                })
        })
    }


}