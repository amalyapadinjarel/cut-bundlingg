import { Injectable } from '@angular/core';
import { ApiService, LocalCacheService } from 'app/shared/services/';
import { CutRegisterSharedService } from './cut-register-shared.service';
import { CutRegister, Product, CutPanelDetails, OrderDetails, MarkerDetails } from '../models/cut-register.model';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Router } from '@angular/router';
import { AlertUtilities, CommonUtilities } from 'app/shared/utils';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'app/shared/component';
import { Location } from '@angular/common';
import { CopyFromSOLovConfig } from '../models/lov-config';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';

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
                        resolve(data);
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
            let params: HttpParams = new HttpParams();
            params = params.set("direction", "ASC")
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
                        if (ret.data.returnCode && ret.data.returnCode == 1)
                            resolve(ret.data);
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

    generateAllBundleLines(id: number) {
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

    deleteAllBundleLines(id: number) {
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

    save(exit): Promise<any> {
        this._shared.loading = true;
        let isCreate = this._shared.id == 0;
        return new Promise((resolve, reject) => {
            this.saveData(this._shared.id)
                .then(res => {
                    this.inputService.resetInputCache(this._shared.appKey + '.' + this._shared.id);
                    this._shared.loading = false;
                    if (isCreate) {
                        this._shared.onNewDocumentCreated();
                        this.router.navigateByUrl('/cut-register/' + this._shared.id + (exit ? '' : '/edit'))
                    } else {
                        if (exit)
                            this.router.navigateByUrl('/cut-register/' + this._shared.id);
                        else
                            this._shared.refreshData.next(true);
                    }
                    resolve(true);
                }, err => {
                    if (err) {
                        console.error(err)
                        this.alertUtils.showAlerts('Failed to ' + ((isCreate ? 'save' : 'edit') + ' document. ') + err);
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

                if (saveData) {
                    // Reordering seq # in all details tables
                    this._shared.lineKeys.forEach(key => {
                        // if (key != 'orderDetails')
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

                    // Choosing to edit or save based on id 
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
        return Math.ceil(qty);
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

    deleteAll(key) {
        while (this._shared.formData[key].length)
            this._shared.deleteLine(key, 0);
    }

    deleteById(productId, key) {
        let productKey = 'attrValId';
        switch (key) {
            case 'orderDetails':
                productKey = 'attrValId';
                break;
            case 'markerDetails':
                productKey = 'attrValId';
                break;
            case 'cutPanelDetails':
                productKey = 'refProdId';
                break;
            default:
                break;
        }
        let lineDetails = this._shared.formData[key]
        let lines = lineDetails.filter(data => { return data[productKey] == productId });
        lines.forEach(line => {
            let i = lineDetails.indexOf(line);
            this._shared.deleteLine(key, i);
        })
        return lines
    }

    deleteDetailsLine(key, index, model) {
        let attrValId, orderDetails, orders, styleId;
        switch (key) {
            case 'markerDetails':
                attrValId = model['attrValId'];
                this._shared.deleteLine(key, index);
                let lines = this.deleteById(attrValId, 'orderDetails')
                lines.forEach(data => {
                    let styleId = data['styleId']
                    orderDetails = this._shared.formData.orderDetails
                    orders = orderDetails.filter(data => { return data.styleId == styleId });
                    if (!orders || !orders.length) {
                        this.deleteById(styleId, 'cutPanelDetails')
                    }
                })
                if (!this._shared.formData.orderDetails.length) {
                    this.deleteAll('layerDetails');
                }

                break;
            case 'orderDetails':
                attrValId = model['attrValId'];
                let styleId = model['styleId']
                this._shared.deleteLine(key, index);
                orderDetails = this._shared.formData.orderDetails
                orders = orderDetails.filter(data => { return data.attrValId == attrValId });
                if (!orders || !orders.length) {
                    this.deleteById(attrValId, 'markerDetails')
                }
                orders = orderDetails.filter(data => { return data.styleId == styleId });
                if (!orders || !orders.length) {
                    this.deleteById(styleId, 'cutPanelDetails')
                }
                if (!this._shared.formData.orderDetails.length) {
                    this.deleteAll('layerDetails');
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

    checkIfEdited() {
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
                    if (data && data.status && data.status == 'S' && data.extraCut)
                        resolve(data.extraCut);
                    else if (data.status == 'F' && data.message)
                        reject(errorMsg + ' ' + data.message);
                    else
                        reject(errorMsg);
                })
        })
    }

    getDefaultFacility() {
        return new Promise((resolve, reject) => {
            let errorMsg = 'Failed to fetch default facility for the user.';
            this.apiService.get('/users/default-facility')
                .catch(err => {
                    reject(errorMsg);
                    return err;
                })
                .subscribe(data => {
                    if (data && data.defaultFacility && data.defaultFacility.length)
                        resolve(data.defaultFacility[0]);
                    else
                        reject(errorMsg);
                })
        })
    }

    reOrderLines(saveData, key) {
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
                } else if(!editedLines[index][sortKey]){
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

    copyFrom(op) {
        let lovConfig: any = {};
        if (op == 'SO') {
            lovConfig = JSON.parse(JSON.stringify(CopyFromSOLovConfig));
        }
        lovConfig.url += this._shared.getHeaderAttributeValue('attributeSet');
        const dialogRef = this._dialog.open(TnzInputLOVComponent);
        dialogRef.componentInstance.lovConfig = lovConfig;
        dialogRef.afterClosed().subscribe(resArray => {
            let routingIds = [];
            let unAddedOrderLines = [];
            if (resArray && resArray.length) {
                resArray.forEach(res => {
                    let routingId = res.routingId
                    res = this.mapResToOrderDetails(res);
                    let orderLineIndex = this._shared.formData.orderDetails.findIndex(data => {
                        return res.refDocLineId == data.refDocLineId
                    })
                    if (orderLineIndex == -1) {
                        routingIds.push(routingId);
                        this._shared.addLine('orderDetails', res);
                        let index = this._shared.formData.markerDetails.findIndex(data => {
                            return data.attrValId == res.attrValId;
                        });
                        if (index == -1) {
                            res = this.mapFromOrderToMarkerDetails(res);
                            this._shared.addLine('markerDetails', res);
                        }
                    } else {
                        unAddedOrderLines.push(res)
                    }
                });
                if (unAddedOrderLines.length) {
                    this.alertUtils.showAlerts(unAddedOrderLines.length + " line(s) are not coppied as they already exist.")
                }
                if (routingIds.length)
                    this.getCutPanelsFromRoutingIds(routingIds).then((cutPanels: any) => {
                        cutPanels.forEach(line => {
                            let index = this._shared.formData.cutPanelDetails.findIndex(data => {
                                return data.panelName == line.panelCode && data.refProdId == line.refProdId;
                            });
                            if (index == -1) {
                                let cutPanelLine = this.mapToCutPanelLine(line);
                                this._shared.addLine('cutPanelDetails', cutPanelLine)
                            }
                        })
                    })
            }
        })
    }

    mapResToOrderDetails(res) {
        let model = new OrderDetails();
        model.layRegstrId = this._shared.id ? this._shared.id.toString() : "0";
        model.bpartName = res.customer ? res.customer : "";
        model.bpartnerDocNo = res.bpartnerDocNo ? res.bpartnerDocNo : "";
        model.bpartnerId = res.bpartnerId ? res.bpartnerId : "";
        model.ordQtyUom = res.qtyUom ? res.qtyUom : "";
        model.lineQty = res.orderQty ? res.orderQty : "";
        model.kit = res.kit ? res.kit : "";
        model.allwdQty = res.maxAllowQty ? res.maxAllowQty : "";;

        model.refDocId = res.orderId ? res.orderId : "";
        model.refDocLineId = res.orderLineId ? res.orderLineId : "";
        model.refDocRevNo = res.revisionNo ? res.revisionNo : "";
        model.refBaseDoc = res.refBaseDoc ? res.refBaseDoc : "";
        model.refDocTypeId = res.docTypeId ? res.docTypeId : "";
        model.refDocNo = res.documentNo ? res.documentNo : "";
        model.refDocDate = res.orderDate ? res.orderDate : "";
        model.refDoc = res.docType ? res.docType : "";
        model.refProduct = res.productNum ? res.productNum : "";
        model.refProductId = res.productId ? res.productId : "";
        model.refProdAttr = res.prdAttribute ? res.prdAttribute : "";


        model.excQty = res.excQty ? res.excQty : "";
        model.color = res.color ? res.color : "";
        model.displayOrder = res.displayOrder ? res.displayOrder : "";
        model.cutAllowanceQty = res.cutAllowanceQty ? res.cutAllowanceQty : "";
        model.createdBy = res.createdBy ? res.createdBy : "";
        model.layOrderRefId = res.layOrderRefId ? res.layOrderRefId : "";
        model.facility = res.facility ? res.facility : "";
        model.orderRefNo = res.orderReference ? res.orderReference : "";
        model.bpartnerDocNo = res.orderReference ? res.orderReference : "";

        model.cutAllowancePercent = this._shared.getHeaderAttributeValue('cutAllowance');
        model.totalOrderQty = this.calculateAllowedQty(res.orderQty, model.cutAllowancePercent);
        model.attribute1 = res.attribute1 ? res.attribute1 : "";
        model.attribute2 = res.attribute2 ? res.attribute2 : "";
        model.attribute3 = res.attribute3 ? res.attribute3 : "";
        model.attribute4 = res.attribute4 ? res.attribute4 : "";
        model.attribute5 = res.attribute5 ? res.attribute5 : "";
        model.attribute6 = res.attribute6 ? res.attribute6 : "";
        model.attribute7 = res.attribute7 ? res.attribute7 : "";
        model.attribute8 = res.attribute8 ? res.attribute8 : "";
        model.attribute9 = res.attribute9 ? res.attribute9 : "";
        model.attribute10 = res.attribute10 ? res.attribute10 : "";
        model.totCutQty = res.totCutQty ? res.totCutQty : "";
        model.color = res.attribute1 ? res.attribute1 : "";

        model.prevqty = res.prevCutQty ? res.prevCutQty : "";
        model.comboTr = res.comboTitle ? res.comboTitle : "";
        model.combo = res.combo ? res.combo : "";
        model.routingId = res.routingId ? res.routingId : "";
        model.markerAttrVal = res.markerAttrVal ? res.markerAttrVal : "";
        model.attrValId = res.attrValId ? res.attrValId : "";
        model.styleId = res.parProdId ? res.parProdId : "";
        return model;
    }

    mapFromOrderToMarkerDetails(res: OrderDetails) {
        let model = new MarkerDetails();
        let headerAttrSet = this._shared.getHeaderAttributeValue('attributeSet');
        model.layRegstrId = res.layRegstrId;
        model.prodName = res.refProduct;
        // model.productId = res.refProductId; Commented for as marker details don't need to save prdt id
        model.prodAttr = res.markerAttrVal;
        model.facility = res.facility;
        model.attrValId = res.attrValId;
        if (headerAttrSet === 'SIZE') {
            model.attribute2 = res.attribute2;
        }
        if (headerAttrSet === 'COLOR_SIZE') {
            model.attribute1 = res.attribute1;
            model.attribute2 = res.attribute2;
        }
        if (headerAttrSet === 'COLOR_SIZE_INSEAM') {
            model.attribute1 = res.attribute1;
            model.attribute2 = res.attribute2;
            model.attribute3 = res.attribute3;
        }
        model.attribute4 = res.attribute4;
        model.attribute5 = res.attribute5;
        model.attribute6 = res.attribute6;
        model.attribute7 = res.attribute7;
        model.attribute8 = res.attribute8;
        model.attribute9 = res.attribute9;
        model.attribute10 = res.attribute10;
        return model;
    }

    mapToCutPanelLine(line) {
        let cutPanel = new CutPanelDetails();
        cutPanel.layRegstrId = this._shared.id.toString();
        cutPanel.panelName = line.panelCode;
        cutPanel.panelNameTr = line.panelName;
        cutPanel.mOpId = line.opId;
        cutPanel.opSeq = line.opSequence;
        cutPanel.refProdId = line.refProdId;
        cutPanel.facility = this._shared.getHeaderAttributeValue('cutFacility');
        return cutPanel;
    }

    generateBundleLines() {
        if (this.checkIfEdited()) {
            this.alertUtils.showAlerts('Changes detected. Please save the changes before generating bundle lines.')
        } else {
            this.generateAllBundleLines(this._shared.id).then(data => {
                this.loadData('cutBundle');
                this._shared.refreshHeaderData.next(true)
            }).catch(err => {
                this.alertUtils.showAlerts(err);
            })
        }
    }

    deleteBundleLines() {
        if (this._shared.formData.cutBundle && this._shared.formData.cutBundle.length) {
            if (this.checkIfEdited()) {
                this.alertUtils.showAlerts('Changes detected. Please save the changes before deleting bundle lines.')
            } else {
                let dialogRef = this._dialog.open(ConfirmPopupComponent);
                dialogRef.componentInstance.dialogTitle = 'Delete Bundle Line(s)';
                dialogRef.componentInstance.message = 'Are you sure you want to delete all the bundle lines '
                dialogRef.afterClosed().subscribe(flag => {
                    if (flag) {
                        this.deleteAllBundleLines(this._shared.id).then(data => {
                            this.loadData('cutBundle');
                        }).catch(err => {
                            this.alertUtils.showAlerts(err);
                        })
                    }
                })
            }

        }
    }

    compute() {
        let cutAllowance = this._shared.getHeaderAttributeValue('cutAllowance');
        let primaryKey = this._shared.orderDetailsPrimaryKey;
        if (typeof cutAllowance != 'undefined' && cutAllowance !== '') {
            this._shared.formData.orderDetails.forEach((data, index) => {
                this.inputService.updateInput(this._shared.getOrderDetailsPath(index, 'cutAllowancePercent'), cutAllowance, primaryKey)
                this.inputService.updateInput(this._shared.getOrderDetailsPath(index, 'cutAllowanceQty'), '', primaryKey)
                let allowQty = this.calculateAllowedQty(data.lineQty, cutAllowance);
                this.inputService.updateInput(this._shared.getOrderDetailsPath(index, 'allwdQty'), allowQty, primaryKey)
            });
        }
    }

    regenerateCutPanels() {
        this._shared.cutPanelDetailsLoading = true;
        let routingIds = [];
        this._shared.formData.orderDetails.forEach(line => {
            if (routingIds.indexOf(line.routingId) == -1)
                routingIds.push(line.routingId);
        })
        if (routingIds.length)
            this.getCutPanelsFromRoutingIds(routingIds).then((cutPanels: any) => {
                this.deleteAll('cutPanelDetails');
                cutPanels.forEach(line => {
                    let cutPanelLine = this.mapToCutPanelLine(line);
                    this._shared.addLine('cutPanelDetails', cutPanelLine)
                })
                this._shared.cutPanelDetailsLoading = false;
            })
    }
}