import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
//import { ExecutableModel } from '../models/executable.model';
import { BehaviorSubject } from 'rxjs';
import { MachineModel } from '../model/machines.model';

@Injectable()
export class MachinesSharedService {

    editMode = false;
    apiBase = 'machines';
    appKey = 'machines';
    taskFlowName = 'MACHINES';
    id: number;
    primaryKey = 'machineId';
    machinesPrimaryKey = 'machineId';
    count;
    newLine = false;
    formData: any = {};
    listData;
    status;
    params;
    selectDataforPrint: any = [];
    selectedModelData: any = [];
    columnFilterValues;
    selectedPage = 1;
    refreshMachineData: BehaviorSubject<boolean>;
    machinesAttributes = Object.keys(new MachineModel());
    lineKeys = ['machines'];
    constructor(
        private _cache: LocalCacheService,
        private inputService: TnzInputService
    ) { }

    init() {
        this.editMode = false;
        this.refreshMachineData= new BehaviorSubject(false);
    }

    setListData(data) {
        this.listData = data.machines;
        this.count = data.count;
    }

    get appPath() {
        return this.appKey;
    }

    initLocalCache() {
        this._cache.setLocalCache(this.appKey, {});
    }

    getMachineEditable(attr, idv = 0) {
        let editable = this.editMode;
        const nonEditableAttrs = ['machineCode'];
        if (idv != 0 && nonEditableAttrs.indexOf(attr) > -1) {
            editable = false
        }
        return editable;
    }
    get machinesPath() {
        return this.appPath + '.machines.machines'
    }
    getMachinesAttrPath(line, attr) {
        return this.machinesPath + '[' + line + '].' + attr;
    }
    resetLines() {
        this.formData['machines'] = null;
        this.refreshLines('machines');
    }

    refreshLines(key) {
        this.refreshMachineData.next(true);
    }


    getLineModel(key, model = null) {
        let newLine;
       newLine = model ? new MachineModel(model) : new MachineModel();

        return newLine;
    }
    setFormData(data) {
        this.formData = data;
    }


    clear() {

        this.id = 0;
        this.editMode = false;
        this.refreshMachineData.unsubscribe();
        this.formData = {};
    }

    addLine(key, model = null) {
        const newLine = this.getLineModel(key, model);
        const data = this.formData['machines'];
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
        // this.refreshMachineData.next(true);
        this.refreshLines(key);
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