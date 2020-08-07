import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { BehaviorSubject } from 'rxjs';
import { DocumentStatusModel } from '../models/document-status.model';

@Injectable()
export class DocumentStatusSharedService {

    editMode = false;
    apiBase = 'document-status';
    appKey = 'docStatusRef';
    taskFlowName = 'docStatusRef';
    id: number;
    primaryKey = 'statusRefId';
    docStatusRefPrimaryKey = 'statusRefId';
    count;
    newLine = false;
    formData: any = {};
    listData;
    status;
    params;
    selectedModelData: any = [];
    columnFilterValues;
    selectedPage = 1;
    refreshDocStatusRefData: BehaviorSubject<boolean>;
    docStatusRefAttributes = Object.keys(new DocumentStatusModel());
    lineKeys = ['docStatusRef'];
    constructor(
        private _cache: LocalCacheService,
        private inputService: TnzInputService
    ) { }

    init() {
        this.editMode = false;
        this.refreshDocStatusRefData = new BehaviorSubject(false);
    }

    setListData(data) {
        this.listData = data.docStatusRef;
        this.count = data.count;
    }

    get appPath() {
        return this.appKey;
    }

    initLocalCache() {
        this._cache.setLocalCache(this.appKey, {});
    }

    get docStatusRefPath() {
        return this.appPath + '.docStatusRef.docStatusRef'
    }
    getdocStatusRefAttrPath(line, attr) {
        return this.docStatusRefPath + '[' + line + '].' + attr;
    }
    resetLines() {
        this.formData['docStatusRef'] = null;
        this.refreshLines('docStatusRef');
    }
    refreshLines(key) {
        this.refreshDocStatusRefData.next(true);
    }


    getLineModel(key, model = null) {
        let newLine;
        newLine = model ? new DocumentStatusModel(model) : new DocumentStatusModel();
        return newLine;
    }
    setFormData(data) {
        this.formData = data;
    }

    clear() {

        this.id = 0;
        this.editMode = false;
        this.refreshDocStatusRefData.unsubscribe();
        this.formData = {};
    }

    addLine(key, model = null) {
        const newLine = this.getLineModel(key, model);
        const data = this.formData['docStatusRef'];
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
            if (attr == 'active') {value = 'Y'};
            if (typeof value == 'undefined' || value === '') {
                newLine[attr] = '';
            }
            else {
                newLine[attr] = value;
                this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
            }

        });
        data.unshift(newLine);
        this.refreshDocStatusRefData.next(true);
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