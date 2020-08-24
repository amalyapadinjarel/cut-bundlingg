import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ProductionProcessesModel } from '../model/production-processes.model';

@Injectable()
export class PdnProcessSharedService {
  editMode = false;
  apiBase = 'production-processes';
  appKey = 'productionProcesses';
  taskFlowName = 'productionProcesses'
  id: number;
  primaryKey = 'processId';
  count;
  newLine = false;
  formData: any = {};
  listData;
  status;
  para;
  selectedModelData: any = [];ms;
  selectedPage: number =1;
  refreshData: BehaviorSubject<boolean> ;
  productionProcessesAttributes = Object.keys(new ProductionProcessesModel());
  lineKeys = ['productionProcesses'];

  constructor
  (private _cache: LocalCacheService,
    private inputService: TnzInputService) 
  { }
  init() {
    this.editMode = false;
    this.refreshData = new BehaviorSubject(false);
}
setListData(data) {
  this.listData = data.productionProcesses;
  this.count = data.count;
}
get appPath() {
  return this.appKey;
}
  initLocalCache() {
    this._cache.setLocalCache(this.appKey, {});
  }
  get productionProcessesPath() {
    return this.appPath + '.productionProcesses.productionProcesses'
}
getProductionProcessesAttrPath(line, attr) {
    return this.productionProcessesPath + '[' + line + '].' + attr;
}
resetLines() {
    this.formData['productionProcesses'] = null;
    this.refreshLines('productionProcesses');
}
refreshLines(key) {
    this.refreshData.next(true);
}
getLineModel(key, model = null) {
  let newLine;
  newLine = model ? new ProductionProcessesModel(model) : new ProductionProcessesModel();
  return newLine;
}
setFormData(data) {
  this.formData = data;
}
clear() {

  this.id = 0;
  this.editMode = false;
  this.refreshData.unsubscribe();
  this.formData = {};
}
addLine(key, model = null) {
 const newLine = this.getLineModel(key, model);
  const data = this.formData['productionProcesses'];
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
  this.refreshData.next(true);
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
getPPAttrEditable(attr, idv = 0) {
  let editable = this.editMode;
  const nonEditableAttrs = ['shortCode'];
  if (idv != 0 && nonEditableAttrs.indexOf(attr) > -1) {
    editable = false
  }
  return editable;
}
}
