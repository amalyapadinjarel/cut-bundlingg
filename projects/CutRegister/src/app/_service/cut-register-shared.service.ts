import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Product, OrderDetails, LayerDetails, MarkerDetails, CutPanelDetails } from '../models/cut-register.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'app/shared/component';

@Injectable()
export class CutRegisterSharedService {

    appKey = 'cutRegister';
    apiBase = 'cut-register';
    taskFlowName = 'CUTREGISTER'
    editMode = false;
    id: number;
    formData: any = {};
    cutPanelDetails: any = [];
    layerDetails: any = [];
    markerDetails: any = [];
    orderDetails: any = [];
    cutBundle: any = [];
    linesData: any = [];


    loading = true;
    headerLoading = true;
    prodLoading = true;
    cutPanelDetailsLoading = true;
    layerDetailsLoading = true;
    markerDetailsLoading = true;
    orderDetailsLoading = true;
    cutBundleLoading = true;
    linesLoading = false;

    primaryKey = 'registerId';
    productPrimaryKey = 'productId';
    layerDetailsPrimaryKey = 'registerLineId';
    markerDetailsPrimaryKey = 'layMarkerId';
    orderDetailsPrimaryKey = 'layOrderRefId';
    cutBundlePrimaryKey = 'bundleId';
    cutPanelDetailsPrimaryKey = 'mcpId';

    prodAttributes = Object.keys(new Product());
    orderDetailsAttributes = Object.keys(new OrderDetails());
    layerDetailsAttributes = Object.keys(new LayerDetails());
    markerDetailsAttributes = Object.keys(new MarkerDetails());
    cutPanelDetailsAttributes = Object.keys(new CutPanelDetails());
    cutBundleAttributes = [];

    _orderDetailsSeq = 1;
    _layerDetailsSeq = 1;
    _markerDetailsSeq = 1;
    _cutPanelDetailsSeq = 1;

    orderDetailsSeqIncBy = 1;
    layerDetailsSeqIncBy = 1;
    markerDetailsSeqIncBy = 1;
    cutPanelDetailsSeqIncBy = 1;

    selectedLines = {};

    costingProductSaveAttributeMap = {};

    lineKeys = ['orderDetails', 'markerDetails', 'layerDetails', 'cutPanelDetails', 'cutBundle'];

    refreshOrderDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
    refreshMarkerDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
    refreshLayerDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
    refreshCutPanelDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
    refreshCutBundle: BehaviorSubject<boolean> = new BehaviorSubject(false);
    refreshHeaderData: BehaviorSubject<boolean> = new BehaviorSubject(false);
    refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);

    //variables for navigation
    selectedPage: number = 1;
    columnFilterValues;
    count;
    listData;
    params;

    constructor(
        private _cache: LocalCacheService,
        private inputService: TnzInputService,
    ) { }

    init() {
        this.id = 0;
        this.editMode = false;
        this.refreshOrderDetails = new BehaviorSubject(false);
        this.refreshMarkerDetails = new BehaviorSubject(false);
        this.refreshLayerDetails = new BehaviorSubject(false);
        this.refreshCutPanelDetails = new BehaviorSubject(false);
        this.refreshCutBundle = new BehaviorSubject(false);
        this.refreshData = new BehaviorSubject(false);
        this.formData = {};
        this.orderDetails = [];
        this.markerDetails = [];
        this.layerDetails = [];
        this.cutPanelDetails = [];
        this.cutBundle = [];
        this.linesData = [];

        this._orderDetailsSeq = 1;
        this._layerDetailsSeq = 1;
        this._markerDetailsSeq = 1;
        this._cutPanelDetailsSeq = 1;
        this.orderDetailsSeqIncBy = 1;
        this.layerDetailsSeqIncBy = 1;
        this.markerDetailsSeqIncBy = 1;
        this.cutPanelDetailsSeqIncBy = 1;

        this.listData = null;
    }

    clear() {
        this.id = 0;
        this.editMode = false;
        this.refreshOrderDetails.unsubscribe();
        this.refreshMarkerDetails.unsubscribe();
        this.refreshLayerDetails.unsubscribe();
        this.refreshCutPanelDetails.unsubscribe();
        this.refreshData.unsubscribe();
        this.formData = {};
        this.cutPanelDetails = [];
        this.layerDetails = [];
        this.markerDetails = [];
        this.orderDetails = [];
        this.cutBundle = [];
        this.linesData = [];
    }

    get appPath() {
        return this.appKey + '.' + this.id;
    }

    get headerPath() {
        return this.appPath + '.header';
    }

    get layerDetailsPath() {
        return this.appPath + '.layerDetails';
    }

    get layerDetailsRemovedKeysPath() {
        return this.appPath + '.layerDetailsRemovedKeys';
    }

    get markerDetailsPath() {
        return this.appPath + '.markerDetails';
    }

    get markerDetailsRemovedKeysPath() {
        return this.appPath + '.markerDetailsRemovedKeys';
    }

    get orderDetailsPath() {
        return this.appPath + '.orderDetails';
    }

    get orderDetailsRemovedKeysPath() {
        return this.appPath + '.orderDetailsRemovedKeys';
    }

    get cutPanelDetailsPath() {
        return this.appPath + '.cutPanelDetails';
    }

    get cutPanelDetailsRemovedKeysPath() {
        return this.appPath + '.cutPanelDetailsRemovedKeys';
    }

    get cutBundlePath() {
        return this.appPath + '.cutBundle';
    }

    get cutBundleRemovedKeysPath() {
        return this.appPath + '.cutBundleRemovedKeys';
    }

    get orderDetailsSeq() {
        this._orderDetailsSeq += this.orderDetailsSeqIncBy;
        return this._orderDetailsSeq - this.orderDetailsSeqIncBy;
    }

    set orderDetailsSeq(value) {
        this._orderDetailsSeq = value + this.orderDetailsSeqIncBy;
    }

    get layerDetailsSeq() {
        this._layerDetailsSeq += this.layerDetailsSeqIncBy;
        return this._layerDetailsSeq - this.layerDetailsSeqIncBy;
    }

    set layerDetailsSeq(value) {
        this._layerDetailsSeq = value + this.layerDetailsSeqIncBy;
    }

    get markerDetailsSeq() {
        this._markerDetailsSeq += this.markerDetailsSeqIncBy;
        return this._markerDetailsSeq - this.markerDetailsSeqIncBy;
    }

    set markerDetailsSeq(value) {
        this._markerDetailsSeq = value + this.markerDetailsSeqIncBy;
    }

    get cutPanelDetailsSeq() {
        this._cutPanelDetailsSeq += this.cutPanelDetailsSeqIncBy;
        return this._cutPanelDetailsSeq - this.cutPanelDetailsSeqIncBy;
    }

    set cutPanelDetailsSeq(value) {
        this._cutPanelDetailsSeq = value + this.cutPanelDetailsSeqIncBy;
    }

    getHeaderData() {
        return this.formData.header;
    }

    setFormData(data) {
        this.formData = data;
    }

    setFormHeader(data) {
        this.formData['header'] = data;
    }

    initLocalCache() {
        this._cache.setLocalCache('cutRegister', {});
    }

    getHeaderAttrPath(attr) {
        return this.headerPath + '.' + attr;
    }

    getProductAttrPath(line, attr) {
        return this.cutPanelDetailsPath + '[' + line + '].' + attr;
    }

    getOrderDetailsPath(line, attr) {
        return this.orderDetailsPath + '[' + line + '].' + attr;
    }

    getMarkerDetailsPath(line, attr) {
        return this.markerDetailsPath + '[' + line + '].' + attr;
    }

    getLayerDetailsPath(line, attr) {
        return this.layerDetailsPath + '[' + line + '].' + attr;
    }

    getCutPanelDetailsPath(line, attr) {
        return this.cutPanelDetailsPath + '[' + line + '].' + attr;
    }

    getCutBundlePath(line, attr) {
        return this.cutPanelDetailsPath + '[' + line + '].' + attr;
    }

    getHeaderEditable(attr, primaryKey) {
        let editable = this.editMode;
        let nonEditableAttrs = ['docType'];// attributes that cannot be edited after creation
        if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
            editable = false
        }
        let editableBundleAttrs = ['markerNameMethod', 'cutDate', 'layYardage', 'length', 'width', 'shrinkage','description'];// attributes that can be edited even when cut bundles exist
        if (this.formData.cutBundle && this.formData.cutBundle.length && editableBundleAttrs.indexOf(attr) == -1) {
            editable = false
        }
        nonEditableAttrs = ['attributeSet'];// attributes that cannot be edited if order lines exist
        if (this.formData.orderDetails && this.formData.orderDetails.length && nonEditableAttrs.indexOf(attr) > -1) {
            editable = false
        }
        // if (editable)
        //     switch (attr) {
        //         case 'attributeSet':
        //             editable = !this.formData.orderDetails.length;
        //             break;
        //     }
        return editable;
    }

    getProductEditable(attr, primaryKey) {
        let editable = this.editMode;
        if (editable && this.costingProductSaveAttributeMap[attr]) {
            editable = (this.costingProductSaveAttributeMap[attr].allowChanges == 'always' || (this.costingProductSaveAttributeMap[attr].allowChanges == 'inCreate' && !primaryKey));
        }
        return editable;
    }

    getOrderDetailsEditable(attr = null) {
        let editable = this.editMode;
        if (this.formData.cutBundle && this.formData.cutBundle.length)
            editable = false;
        return editable;
    }

    getMarkerDetailsEditable(attr = null) {
        let editable = this.editMode;
        if (this.formData.cutBundle && this.formData.cutBundle.length)
            editable = false;
        return editable;
    }

    getLayerDetailsEditable(attr = null) {
        let editable = this.editMode && this.id !== 0;
        if (!this.formData.orderDetails || !this.formData.orderDetails.length)
            editable = false;
        if (this.formData.cutBundle && this.formData.cutBundle.length)
            editable = false;
        return editable;
    }

    getCutPanelDetailsEditable(attr = null) {
        let editable = this.editMode && this.id !== 0;
        return editable;
    }

    getCutBundleEditable(attr = null) {
        let editable = this.editMode && this.id !== 0;
        return editable;
    }

    getHeaderAttributeValue(key) {
        let val = this.inputService.getInputValue(this.getHeaderAttrPath(key));
        val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
        return val;
    }

    getProdAttributeValue(index, key) {
        let val = this.inputService.getInputValue(this.getProductAttrPath(index, key));
        return typeof val != 'undefined' ? val : this.formData.products ? this.formData.products[index][key] : null;
    }

    getCurencyRoundedValue(value) {
        let minor = this.getHeaderAttributeValue('CurrencyMcTr') || 0;
        return this.toFixedPrecision(Math.round((value + Number.EPSILON) * 10 ** minor) / (10 ** minor), minor);
    }

    toFixedPrecision(value, precision) {
        return value.toFixed(precision);
    }

    isLoading() {
        return this.loading || this.headerLoading || this.linesLoading || this.prodLoading
            || this.layerDetailsLoading || this.markerDetailsLoading || this.orderDetailsLoading
            || this.cutPanelDetailsLoading;
    }

    addLine(key, model = null) {
        let newLine;
        newLine = this.getLineModel(key, model);
        let seqKey = this.getSeqKey(key);
        let data = this.formData[key];
        let attributes = this[key + 'Attributes'];
        let path = this[key + 'Path'];
        let primaryKey = this[key + 'PrimaryKey'];
        let newIndex = data.length;
        if (newIndex == 0) {
            this.resetSeq(key);
        }
        let seq = this[key + 'Seq'];
        attributes.forEach(attr => {
            let value;
            if (model) {
                value = model[attr];
            }
            if (attr == primaryKey) {
                value = 0;
            } else if (attr == seqKey) {
                value = seq.toString();
            }
            if (typeof value == 'undefined' || value === '')
                newLine[attr] = '';
            else {
                newLine[attr] = value;
                this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
            }
        });
        data.push(newLine);
        this.refreshLines(key);
    }

    deleteLine(key, index) {
        let linePrimaryKey = this[key + 'PrimaryKey'];
        let data = this.formData[key];
        let path = this[key + 'Path'];
        let cache = this._cache.getCachedValue(path)
        if (cache && cache.length > index)
            cache.splice(index, 1);
        this._cache.setLocalCache(path, cache);
        let model = data[index];
        data.splice(index, 1);
        if (model[linePrimaryKey]) {
            let removedPath = this[key + 'RemovedKeysPath'];
            cache = this._cache.getCachedValue(removedPath)
            if (!cache) {
                cache = [];
            }
            cache.push(model[linePrimaryKey])
            this._cache.setLocalCache(removedPath, cache);
        }
        if (data.length == 0) {
            this.resetSeq(key)
        }
        this.refreshLines(key);
    }

    resetSeq(key) {
        this['_' + key + 'Seq'] = 1;
    }

    resetLines() {
        this.lineKeys.forEach(key => {
            if (this[key].length)
                this.formData[key] = JSON.parse(JSON.stringify(this[key]));
            else
                this.formData[key] = [];
            this.refreshLines(key);
        })
    }

    setLinesFromCache(key, data) {
        let cache;
        let linePrimaryKey = this[key + 'PrimaryKey'];
        cache = this.inputService.getCache(this[key + 'RemovedKeysPath']);
        if (cache) {
            cache.forEach((line) => {
                let i = data.findIndex(elem => { return elem[linePrimaryKey] == line });
                if (i > -1) {
                    data.splice(i, 1);
                }
            });
        }
        cache = this.inputService.getCache(this[key + 'Path']);
        if (cache && cache.length) {
            cache.forEach((line, lineIdx) => {
                if (line) {
                    if (line[linePrimaryKey] == 0) {
                        let newLine = this.getLineModel(key);
                        Object.keys(this.getLineModel(key)).forEach(attr => {
                            if (line[attr])
                                newLine[attr] = line[attr];
                            else
                                newLine[attr] = ''
                        });
                        newLine[linePrimaryKey] = 0;
                        data.splice(lineIdx, 0, newLine);
                    }
                }
            });
        }
        return data;
    }

    getLineModel(key, model = null) {
        let newLine;
        switch (key) {
            case 'orderDetails':
                newLine = model ? new OrderDetails(model) : new OrderDetails();
                break;
            case 'layerDetails':
                newLine = model ? new LayerDetails(model) : new LayerDetails();
                break;
            case 'markerDetails':
                newLine = model ? new MarkerDetails(model) : new MarkerDetails();
                break;
            case 'cutPanelDetails':
                newLine = model ? new CutPanelDetails(model) : new CutPanelDetails();
                break;
            default:
                break;
        }
        return newLine;
    }

    refreshLines(key) {
        switch (key) {
            case 'orderDetails':
                this.refreshOrderDetails.next(true);
                break;
            case 'layerDetails':
                this.refreshLayerDetails.next(true);
                break;
            case 'markerDetails':
                this.refreshMarkerDetails.next(true);
                break;
            case 'cutPanelDetails':
                this.refreshCutPanelDetails.next(true);
                break;
            case 'cutBundle':
                this.refreshCutBundle.next(true);
                break;
            default:
                break;
        }
    }

    setLines(key, data) {
        if (!data || !data.length)
            this.formData[key] = this[key] = [];
        else {
            this[key] = JSON.parse(JSON.stringify(data));
            this.formData[key] = data;
        }
    }

    getSeqKey(key) {
        let seq = "displayOrder"
        switch (key) {
            case 'orderDetails':
                break;
            case 'layerDetails':
                seq = "lineNo"
                break;
            case 'markerDetails':
                break;
            case 'cutPanelDetails':
                break;
            default:
                break;
        }
        return seq;
    }

    setSelectedLines(key, models) {
        this.selectedLines[key] = models;
    }

    setListData(data) {
        this.listData = data.registers;
        this.count = data.count;
    }

    resetAllInput(){
        this.inputService.resetSharedData();
    }

    onNewDocumentCreated(){
        this.listData = null;
        this.params = null;
    }



}