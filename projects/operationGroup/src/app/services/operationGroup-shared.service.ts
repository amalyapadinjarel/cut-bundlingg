import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { BehaviorSubject } from 'rxjs';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { OperationGroup } from '../models/operationGroup.model';
@Injectable()
export class OperationGroupSharedService {
  editMode = false;
  apiBase = 'operation-group';
  appKey = 'operationGroup';
  taskFlowName = 'OPERATIONGROUP';
  id: number;
  opGrploading = true;
  primaryKey = 'opId';
  opGrpPrimaryKey = 'opId';
  operationGroupPrimaryKey = 'opId';
  count;
  newLine = false;
  formData: any = {};
  listData;
  status;
  params;
  columnFilterValues;
  selectedPage = 1;
  refreshOperationGroupData: BehaviorSubject<boolean>;
  operationGroupAttributes = Object.keys(new OperationGroup());
  lineKeys = ['operationGroup'];
  listConfig =
    {
      limit: 20,
      offset: 1
    };
  constructor(private _cache: LocalCacheService, private inputService: TnzInputService) { }

  init() {
    this.editMode = false;
    this.refreshOperationGroupData = new BehaviorSubject(false);
  }

  setListData(data) {
    this.listData = data.operationGroup;
    this.count = data.count;
  }

  get appPath() {
    return this.appKey;
  }

  initLocalCache() {
    this._cache.setLocalCache(this.appKey, {});
  }

  getOpGrpEditable(attr, idv = 0) {
    let editable = this.editMode;
    const nonEditableAttrs = ['shortCode'];
    if (idv != 0 && nonEditableAttrs.indexOf(attr) > -1) {
      editable = false
    }
    return editable;
  }
  get operationGroupPath() {
    return this.appPath + '.operationGroup.operationGroup'
  }
  getOperationGroupAttrPath(line, attr) {
    return this.operationGroupPath + '[' + line + '].' + attr;
  }
  resetLines() {
    this.formData.operationGroup = null;
    this.refreshLines('operationGroup');
  }
  refreshLines(key) {
    if (key == 'operationGroup') {
      this.refreshOperationGroupData.next(true);
    }
  }

  getLineModel(key, model = null) {
    let newLine;
    newLine = model ? new OperationGroup(model) : new OperationGroup();
    return newLine;
  }
  setFormData(data) {
    this.formData = data;
  }

  clear() {

    this.id = 0;
    this.editMode = false;
    this.refreshOperationGroupData.unsubscribe();
    this.formData = {};
  }

  addLine(key, model = null) {
    const newLine = this.getLineModel(key, model);
    const data = this.formData['operationGroup'];
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
    this.refreshOperationGroupData.next(true);
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