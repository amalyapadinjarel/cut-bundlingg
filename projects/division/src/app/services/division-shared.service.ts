import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { BehaviorSubject } from 'rxjs';
import { Address } from '../models/division.model';


@Injectable({
  providedIn: 'root'
})
export class DivisionSharedService {
 
  
  appKey = 'division';
  apiBase = 'division';
  taskFlowName = 'DIVISION'
  editMode = false;
  division:string='--';
  id: number;
  formData: any = {};
  count;
  listData;
  params;
  columnFilterValues;
  selectedPage: number =1;
  primaryKey = 'divisionId';
  loading = true;
  reviseMode: boolean;
   
  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  headerLoading = true;
  addressLoading =false;
  constructor(  private _cache: LocalCacheService) { }
  init() {
    this.editMode = false;
    //this.division = '--';
    this.formData = {};
    this.id=0;
}

  setListData(data) {
    this.listData = data.divisions;
    this.count = data.count;
}

get appPath() {
  return this.appKey + '.' + this.id;
}

initLocalCache() {
  this._cache.setLocalCache(this.appKey, {});
}
getHeaderAttrPath(attr) {
  return this.headerPath + '.' + attr;
}

get headerPath() {
  return this.appPath + '.header';
}
getHeaderEditable(attr, primaryKey) {
  let editable = this.editMode;
 
  let nonEditableAttrs = ['shortCode','company'];// attributes that cannot be edited after creation
  // if (this.division != '--' && nonEditableAttrs.indexOf(attr) > -1) {
    if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
      editable = false
  }
  let editableAttrs = ['division','description','location'];// attributes that can be edited 

  return editable;
}

setFormData(data) {
  this.formData = data;
}

setFormHeader(data) {
  this.formData['header'] = data;
}

setAddress(address: Address) {
  this.formData['address'] = address;
}
get addressPath() {
  return this.appPath + '.address';
}
getAddressAttrPath(attr) {
  return this.addressPath + '.' + attr;
}

get locationPath() {
  return this.appPath + '.location';
}

getlocationPath(attr) {
  return this.locationPath + '.' + attr;
}

}
