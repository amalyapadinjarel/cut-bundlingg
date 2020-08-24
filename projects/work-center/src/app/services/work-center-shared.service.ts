import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { WorkCenterModel } from '../model/work-center.model';

@Injectable()
export class WorkCenterSharedService {


    editMode = false;
    apiBase = 'work-center';
    appKey = 'workCenter';
    taskFlowName = 'workCenter';
    id: number;
    workCenterPrimaryKey = 'wcId';
    count;
    newLine = false;
    formData: any = {};
    listData;
    status;
    params;
    selectedModelData: any = [];
    selectedPage = 1;
    refreshWorkCenterData: BehaviorSubject<boolean>;
    workCenterAttributes = Object.keys(new WorkCenterModel());
    lineKeys = ['workCenter'];
    productionProcessMap = {};
    productionProcessMapCopy: {};
    constructor(
        private _cache: LocalCacheService,
        private inputService: TnzInputService
    ) { }

    init() {
        this.productionProcessMap = {};
        this.editMode = false;
        this.refreshWorkCenterData = new BehaviorSubject(false);
    }

    setListData(data) {
        this.listData = data.workCenter;
        this.count = data.count;
    }

    get appPath() {
        return this.appKey;
    }

    initLocalCache() {
        this._cache.setLocalCache(this.appKey, {});
    }

    get workCenterPath() {
        return this.appPath + '.workCenter.workCenter'
    }
    getWorkCenterAttrPath(line, attr) {
        return this.workCenterPath + '[' + line + '].' + attr;
    }
    resetLines() {
        this.formData['workCenter'] = null;
        this.refreshLines('workCenter');
    }
    refreshLines(key) {
        this.refreshWorkCenterData.next(true);
    }


    getLineModel(key, model = null) {
        let newLine;
        newLine = model ? new WorkCenterModel(model) : new WorkCenterModel();
        return newLine;
    }
    setFormData(data) {
        this.formData = data;
    }

    clear() {

        this.id = 0;
        this.editMode = false;
        this.refreshWorkCenterData.unsubscribe();
        this.formData = {};
    }

    addLine(key, model = null) {
        const newLine = this.getLineModel(key, model);
        const data = this.formData['workCenter'];
        let attributes = this[key + 'Attributes'];
        const path = this[key + 'Path'];
        const primaryKey = this[key + 'PrimaryKey'];
        const newIndex = 0;
        const cache = this.inputService.getCache(path) || [];
        cache.unshift({});
        this.inputService.updateInputCache(path, cache);
        attributes.forEach(attr => {
            let value;
            if (model) { value = model[attr]; }
            if (attr == primaryKey) { value = 0; }
            if (attr == 'active') { value = 'Y' };
            if (typeof value == 'undefined' || value === '') {
                newLine[attr] = '';
            }
            else {
                newLine[attr] = value;
                this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
            }

        });
        data.unshift(newLine);
        this.refreshWorkCenterData.next(true);
    }

    deleteLine(key, index) {
        const primaryKey = this[key + 'PrimaryKey'];
        const data = this.formData[key];
        const path = this[key + 'Path'];
        const cache = this.inputService.getCache(path) || [];
        if (cache && cache.length > index) {
            cache.splice(index, 1);
        }
        this._cache.setLocalCache(path, cache);
        data.splice(index, 1);
        this.refreshLines(key);
    }

    getWCAttrEditable(attr, idv = 0) {
        let editable = this.editMode;
        const nonEditableAttrs = ['shortCode', 'facilityCode', 'wcTypeMeaning'];
        if (idv != 0 && nonEditableAttrs.indexOf(attr) > -1) {
            editable = false
        }
        return editable;
    }

    processProductionProcess() {
      
            this.formData.workCenter.map(wc => {
                if (wc.process) {
                    const processLabels = wc.process.split(",")
                    const processValues = wc.processId.split(",")
                    const processShortCode = wc.processShortCode.split(",")
                    const processes = processLabels.map((label, index) => {
                        return {
                            label: label.replace(' ',''),
                            value: +processValues[index],
                            shortCode: processShortCode[index].replace(' ','')
                        }
                    });
                    this.productionProcessMap[wc.wcId + ':' + wc.shortCode] = processes
                }

            })

            this.productionProcessMapCopy = {...this.productionProcessMap}
    }
}