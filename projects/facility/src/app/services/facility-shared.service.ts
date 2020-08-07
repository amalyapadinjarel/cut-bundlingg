import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalCacheService } from 'app/shared/services';
import { Address } from '../models/facility.model';

@Injectable({
  providedIn: 'root'
})
export class FacilitySharedService {

  appKey = 'facility';
  apiBase = 'facility';
  taskFlowName = 'FACILITY'
  editMode = false;
  facility:string='--';
  id: number;
  formData: any = {};
  count;
  listData;
  params;
  columnFilterValues;
  selectedPage: number =1;
  primaryKey = 'facilityId';
  loading = true;
  reviseMode: boolean;
 refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
 headerLoading = true;
  addressLoading =true;

  constructor(private _cache: LocalCacheService) { }
  init() {
    this.editMode = false;
    this.id = 0;
    this.formData = {};
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
   
    let nonEditableAttrs = ['shortCode','company','divisionName'];// attributes that cannot be edited after creation
    
      if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
        editable = false
    }
    let editableAttrs = ['facility','facilityGroup','description','location'];// attributes that can be edited 
  
    return editable;
  }
  setListData(data) {
    this.listData = data.facility;
    this.count = data.count;
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
