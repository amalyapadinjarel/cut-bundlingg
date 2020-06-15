import {Injectable} from '@angular/core';
import {LocalCacheService} from '../../../../../src/app/shared/services';
import {TnzInputService} from '../../../../../src/app/shared/tnz-input/_service/tnz-input.service';
import {BehaviorSubject} from 'rxjs';
import {RoutingSteps} from '../models/routing.model';

@Injectable()
export class MfgRoutingSharedService {

    editMode = false;
    appKey = 'mfgRouting';
    taskFlowName = 'ROUTING'
    apiBase = 'routing';
    id: number;
    formData: any = {};

    loading = true;
    headerLoading = false;

    primaryKey = 'routingId';
    operationDetailsPrimaryKey = 'routingStepId';
    operationDetailsLoading = false;

    refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
    refreshOpertionTable: BehaviorSubject<boolean> = new BehaviorSubject(false);
    lineKeys = ['operationDetails'];
    params: any;
    columnFilterValues: any;
    count;
    listData;
    selectedLines = {};
    reviseMode: boolean;
    selectedPage = 1;


    constructor(private _cache: LocalCacheService,
                private inputService: TnzInputService) {
    }

    initLocalCache() {
        this._cache.setLocalCache('mfgRouting', {});
    }

    get appPath() {
        return this.appKey + '.' + this.id;
    }

    get operationDetailsRemovedKeysPath() {
        return this.appPath + '.operationDetailsRemovedKeys';
    }

    get headerPath() {
        return this.appPath + '.header';
    }

    get operationDetailsPath() {
        return this.appPath + '.operationDetails';
    }


    getOperationDetailsPath(line, attr) {
        return this.operationDetailsPath + '[' + line + '].' + attr;
    }

    getHeaderAttrPath(attr) {
        return this.headerPath + '.' + attr;
    }

    get operationGroupPath() {
        return this.appPath + '.operationGroup';
    }

    getOperationGroupPath(attr) {
        return this.operationGroupPath + '.' + attr;
    }

    getHeaderAttributeValue(key) {
        let val = this.inputService.getInputValue(this.getHeaderAttrPath(key));
        val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
        return val;
    }

    getHeaderEditable(attr, primaryKey) {
        let editable = this.editMode;
        let nonEditableAttrs = ['docType', 'style', 'facility', 'smv'];// attributes that cannot be edited after creation
        if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
            editable = false
        }
        return editable;
    }


    setFormData(data) {
        this.formData = data;
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

    getOperationDetailsEditable(attr = null) {
        let editable = this.editMode || this.id == 0;
        return editable;
    }

    getLineModel(key, model = null) {
        let newLine;
        switch (key) {
            case 'operationDetails':
                newLine = model ? new RoutingSteps(model) : new RoutingSteps({});
                break;
            default:
                break;
        }
        return newLine;
    }

    setLinesFromCache(key, data) {
        let cache;
        let linePrimaryKey = this[key + 'PrimaryKey'];
        cache = this.inputService.getCache(this[key + 'RemovedKeysPath']);
        if (cache) {
            cache.forEach((line) => {
                let i = data.findIndex(elem => {
                    return elem[linePrimaryKey] == line
                });
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
                            if (line[attr]) {
                                newLine[attr] = line[attr];
                            } else {
                                newLine[attr] = ''
                            }
                        });
                        newLine[linePrimaryKey] = 0;
                        data.splice(lineIdx, 0, newLine);
                    }
                }
            });
        }
        return data;
    }

    operationDetailsAttributes = ['opSequence']

    addLine(key, model = null) {
        const newLine = this.getLineModel(key, model);
        let seqKey = 'sequence';
        let data = this.formData[key];
        let attributes = this[key + 'Attributes'];
        let path = this[key + 'Path'];
        let primaryKey = this[key + 'PrimaryKey'];
        let newIndex = data.length;
        let operationSequenceList = data.map(model => model.opSequence);
        let maxopSequence = operationSequenceList.length ? Math.max(...operationSequenceList) : 0;
        attributes.forEach(attr => {
            let value;
            if (model) {
                // value = model[attr];
            }
            if (attr == primaryKey) {
                value = null;
            } else if (attr == 'opSequence') {
                value = maxopSequence + 1
            } else if (attr == 'routingId') {
                value = this.id;
            } else if (attr == 'inOutType') {
                value = 'O';
            }
            if (typeof value == 'undefined' || value === '') {
                newLine[attr] = '';
            } else {
                newLine[attr] = value;
                this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
            }
        });
        data.push(newLine);
        this.refreshOpertionTable.next(true);
    }

    addBulkLines(numberOfLines, key, model = null) {
        for (let i = 0; i < 10; i++) {
            this.addLine(key)
        }
    }

    resetLines() {
        this.lineKeys.forEach(key => {
            if (this[key].length) {
                this.formData[key] = JSON.parse(JSON.stringify(this[key]));
            } else {
                this.formData[key] = [];
            }
            this.refreshOpertionTable.next(true);
        })
    }

    deleteLine(key, index) {
        if (key != -1) {
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
            this.refreshOpertionTable.next(true);
        }
    }

    setListData(data) {
        this.listData = data.routing;
        this.count = data.count;
    }

    setSelectedLines(key, models) {
        this.selectedLines[key] = models;
    }
}
