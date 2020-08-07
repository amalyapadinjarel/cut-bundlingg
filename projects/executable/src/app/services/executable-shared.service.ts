import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ExecutableModel } from '../models/executable.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ExecutableSharedService {

    editMode = false;
    apiBase = 'executable';
    appKey = 'executable';
    taskFlowName = 'EXECUTABLE';
    id: number;
    primaryKey = 'exeId';
    executablePrimaryKey = 'exeId';
    count;
    newLine = false;
    formData: any = {};
    listData;
    status;
    params;
    selectDataforPrint: any = [];
    selectedModelData: any = [];
    exePrintId;
    columnFilterValues;
    selectedPage = 1;
    refreshExecutbleData: BehaviorSubject<boolean>;
    executableAttributes = Object.keys(new ExecutableModel());
    lineKeys = ['executable'];
    constructor(
        private _cache: LocalCacheService,
        private inputService: TnzInputService
    ) { }

    init() {
        this.editMode = false;
        this.refreshExecutbleData = new BehaviorSubject(false);
    }

    setListData(data) {
        this.listData = data.executable;
        this.count = data.count;
    }

    get appPath() {
        return this.appKey;
    }

    initLocalCache() {
        this._cache.setLocalCache(this.appKey, {});
    }

    getExeEditable(attr, idv = 0) {
        let editable = this.editMode;
        const nonEditableAttrs = ['shortCode'];
        if (idv != 0 && nonEditableAttrs.indexOf(attr) > -1) {
            editable = false
        }
        return editable;
    }
    get executablePath() {
        return this.appPath + '.executable.executable'
    }
    getExecutableAttrPath(line, attr) {
        return this.executablePath + '[' + line + '].' + attr;
    }
    resetLines() {
        this.formData['executable'] = null;
        this.refreshLines('executable');
    }
    refreshLines(key) {
        this.refreshExecutbleData.next(true);
    }


    getLineModel(key, model = null) {
        let newLine;
        newLine = model ? new ExecutableModel(model) : new ExecutableModel();

        return newLine;
    }
    setFormData(data) {
        this.formData = data;
    }

    clear() {

        this.id = 0;
        this.editMode = false;
        this.refreshExecutbleData.unsubscribe();
        this.formData = {};
    }

    addLine(key, model = null) {
        const newLine = this.getLineModel(key, model);
        const data = this.formData['executable'];
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
            if (typeof value == 'undefined' || value === '') {
                newLine[attr] = '';
            }
            else {
                newLine[attr] = value;
                this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
            }

        });
        data.unshift(newLine);
        this.refreshExecutbleData.next(true);
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

}