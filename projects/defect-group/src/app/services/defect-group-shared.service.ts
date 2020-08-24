import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { DefectsModel } from '../model/defect-group.model';

@Injectable()
export class DefectGroupSharedService {

    apiBase = 'defect-group';
    appKey = 'defectGroup';
    taskFlowName = 'defectGroup';
    editMode = false;
    id: number;
    defectGroupPrimaryKey = 'defGroupId';
    defectPrimaryKey = 'defectId';
    count;
    formData: any = [];
    status;
    refreshdefectGroupHeaderData: BehaviorSubject<boolean> = new BehaviorSubject(false);
    refreshDefectData: BehaviorSubject<boolean> = new BehaviorSubject(false);
    headerLoading = false;
    params;
    lineKeys = ['defect']

    constructor(
        private _cache: LocalCacheService,
        private inputService: TnzInputService
    ) { }

    init() {
        this.editMode = false;
        this.refreshdefectGroupHeaderData = new BehaviorSubject(false);
        this.refreshDefectData = new BehaviorSubject(false);
        this.id = 0;
        this.formData = {};
        this.inputService.resetInputService(this.appPath)
    }
    get appPath() {
        return this.appKey + '.' + this.id;
    }

    initLocalCache() {
        this._cache.setLocalCache(this.appKey, {});
    }

    get defectGroupHeaderPath() {
        return this.appPath + '.header';
    }

    get defectPath() {
        return this.appPath + '.defect';
    }
    getdefectGroupHeaderAttrPath(attr) {
        return this.defectGroupHeaderPath + '.' + attr;
    }
    resetLines() {
        this.formData['defectGroup'] = null;
        this.refreshLines('defectGroup');
    }
    refreshLines(key) {
        switch (key) {
            case 'defect': {
                this.refreshDefectData.next(true);
                break;
            }
            // default: {
            //     this.refreshdefectGroupHeaderData.next(true);
            //     break;
            // }
        }
    }
    setFormData(data) {
        this.formData = data;
    }
    clear() {
        this.id = 0;
        this.editMode = false;
        this.refreshdefectGroupHeaderData.unsubscribe();
        this.refreshDefectData.unsubscribe();
        this.formData = {};
    }
    getHeaderAttributeValue(key) {
        let val = this.inputService.getInputValue(this.getdefectGroupHeaderAttrPath(key));
        val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
        return val;
    }
    setFormHeader(data) {
        this.formData['header'] = data;
    }
    setLines(key, data) {
        if (!data || !data.length) {
            this.formData[key] = this[key] = [];
        } else {
            this[key] = JSON.parse(JSON.stringify(data));
            this.formData[key] = data;
        }
    }
    get defectDetailsPath() {
        return this.appPath + '.defect';
    }

    getdefectDetailsPath(line, attr) {
        return this.defectDetailsPath + '[' + line + '].' + attr;
    }
    getDefectGrpEditable(attr, idv) {
        let editable = this.editMode;
        const nonEditableAttrs = ['shortCode', 'defectType'];
        if (idv && idv != 0 && nonEditableAttrs.indexOf(attr) > -1) {
            editable = false
        }
        return editable;
    }

    getLineModel(key, model = null) {
        let newLine;
        switch (key) {
            case 'defect':
                newLine = model ? new DefectsModel(model) : new DefectsModel({});
                break;
            default:
                break;
        }
        return newLine;
    }

    defectAttributes = Object.keys(new DefectsModel({}));
    addLine(isCopy, key, model = null) {
        const newLine = this.getLineModel(key, model);
        let seqKey = 'sequence';
        let data;
        data = this.formData[key];
        let attributes = this[key + 'Attributes'];
        let path = this[key + 'Path'];
        let primaryKey = this[key + 'PrimaryKey'];
        const newIndex = 0;
        const cache = this.inputService.getCache(path) || [];
        cache.unshift({});
        this.inputService.updateInputCache(path, cache);
        let sequenceList = data.map(model => model.sequence);
        let maxSequence = sequenceList.length ? Math.max(...sequenceList) : 0;
        attributes.forEach(attr => {
            let value;
            if (model) {
                value = model[attr];
            }
            if (attr == primaryKey) {
                value = 0;
            } else if (attr == 'sequence') {
                value = (maxSequence + 1).toString()
            } else if (attr == 'defectId') {
                value = "0";
            } else if (attr == 'active') {
                value = 'Y';
            }
            if (typeof value == 'undefined' || value === '') {
                newLine[attr] = '';
            } else {
                newLine[attr] = value;
                this.inputService.updateInput(path + '[' + newIndex  + '].' + attr, value);
            }
        });
        data.unshift(newLine);
        this.refreshDefectData.next(true);
    }

    resetAll() {
        this.inputService.resetSharedData();
        this.inputService.resetInputService(this.appKey)
    }

    deleteLine(key, index) {

        let linePrimaryKey = this[key + 'PrimaryKey'];
        let data = this.formData[key];
        let path = this[key + 'Path'];
        let cache = this._cache.getCachedValue(path)
        if (cache && cache.length > index) {
            cache.splice(index, 1);
        }
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
        this.refreshDefectData.next(true);


    }
    get defectRemovedKeysPath() {
        return this.appPath + '.defectRemovedKeys';
    }
    setLinesFromCache(key, data) {
        let cache;
        let linePrimaryKey = this[key + 'PrimaryKey'];
        cache = this.inputService.getCache(this[key + 'RemovedKeysPath']);
        if (cache) {
            cache.forEach((line) => {
                let i = data.findIndex(elem => { return elem[linePrimaryKey] == line });
                if (i > -1) {
                    data.splice(i, 1); //removing data retrieved from removedkeyspath
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
                        newLine[linePrimaryKey] = 0; //setting primarykey of newline to 0
                        data.splice(lineIdx, 0, newLine); //??
                    }
                }
            });
        }
        return data;
    }
}