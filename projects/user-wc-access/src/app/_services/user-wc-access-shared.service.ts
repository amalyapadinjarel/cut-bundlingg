import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { BehaviorSubject } from 'rxjs';
import { UserWcAccessModel } from '../Models/user-wc-access-model';

@Injectable()
export class UserWcAccessSharedService {
  appKey = 'userWcAccess';
  apiBase = 'user-workcenter-access';
  taskFlowName = 'USERWORKCENTERACCESS'
  editMode = false;
  id: number;
  selectedPage=1;
  formData: any = {};
  userWcAccessPrimaryKey = 'mapId';
  lineKeys = ['userWcAccess'];
  listData;
  count
  addFlag=false
  userWcAccessAttributes = Object.keys(new UserWcAccessModel());
  refreshUserWcAccessData: BehaviorSubject<boolean> =  new BehaviorSubject(false); 
  constructor(private _cache: LocalCacheService, private inputService: TnzInputService) { }
  initLocalCache() {
    this._cache.setLocalCache(this.appKey, {});
  }
  setListData(data) {
    this.formData = data;
    this.count=data.count
  }
  init() {
    this.editMode = false;
    this.refreshUserWcAccessData = new BehaviorSubject(false);
}
clear() {

  this.id = 0;
  this.editMode = false;
  this.refreshUserWcAccessData.unsubscribe();
  this.formData = {};
}

resetLines() {
  this.formData['userWcAccess'] = null;
  this.refreshLines();
}
refreshLines() {
  this.refreshUserWcAccessData.next(true);
}
  get appPath() {
    return this.appKey;
  }
  get userWcAccessPath() {
    return this.appPath + '.userWcAccess.userWcAccess'
}
getuserWcAccessAttrPath(line, attr) {
  return this.userWcAccessPath + '[' + line + '].' + attr;
}
get userPath() {
  return this.appPath + '.location';
}

getuserPath(attr) {
  return this.userPath + '.' + attr;
}
addLine(key, model = null) {
 this.addFlag=true
  const newLine = this.getLineModel(model);
  const data = this.formData['userWcAccess'];
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
  this.refreshUserWcAccessData.next(true);
}
getLineModel( model = null) {
  let newLine;
  newLine = model ? new UserWcAccessModel(model) : new UserWcAccessModel();
  return newLine;
}
deleteLine(key, index) {
  const data = this.formData[key];
  const path = this[key + 'Path'];
  const cache = this.inputService.getCache(path) || [];
  if (cache && cache.length > index) {
    cache.splice(index, 1);
  }
  this._cache.setLocalCache(path, cache);
  data.splice(index, 1);
  this.refreshLines();
}
}
