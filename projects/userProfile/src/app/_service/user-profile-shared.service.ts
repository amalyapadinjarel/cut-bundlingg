import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { BehaviorSubject } from 'rxjs';
import { DateUtilities } from 'app/shared/utils';

@Injectable(
  //  {  providedIn: 'root'}
)
export class UserProfileSharedService {

  //setting app variables
  appKey = 'userProfile';
  apiBase = 'userProfile';
  taskFlowName = 'USERPROFILE'

  //variable to control editing
  editMode = false;

  id: any;

  formData: any = {};

  //defining array to store lines
  linesData: any = [];
  userRoles: any = [];
  userOrgAccess: any = [];

  //defining loading
  loading = true;
  headerLoading = true;


  //defining primary key
  primaryKey = 'userId';
   
  //defining BehaviourSubject
  refreshHeaderData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshData: BehaviorSubject<Boolean> = new BehaviorSubject(false);


  //define constructor
  constructor(
    private _cache: LocalCacheService,
    private inputService: TnzInputService
  ) { }

  //initialize variables
  init() {

    this.id = 0;
    this.editMode = false;
    this.formData = {};

    this.refreshHeaderData = new BehaviorSubject(false);
    this.refreshData = new BehaviorSubject(false);
    }

  //destroy or clear variables
  clear() {

    this.id = 0;
    this.editMode = false;

    this.refreshData.unsubscribe();
    this.refreshHeaderData.unsubscribe();
    this.formData = {};
  }

  //getter for appPath --get appPath()
  get appPath() {
    return this.appKey + '.' + this.id;
  }

  //getter for headerPath
  get headerPath() {
    return this.appPath + '.header';
  }

  //method-getHeaderData()
  getHeaderData() {
    return this.formData.header;
  }
  //method-setFormData()
  setFormData(data) {
    this.formData = data;
  }

  //setFormHeader() method
  setFormHeader(data) {
    this.formData['header'] = data;
  }

  //initializing localcache
  initLocalCache() {
    this._cache.setLocalCache('userProfile', {});
  }


  getHeaderAttrPath(attr) {
    return this.headerPath + '.' + attr;
  }

    getHeaderEditable(attr, id) {
    let editable = this.editMode;
    let nonEditableAttrs = ['userName'];

    if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
      editable = false;
    }
        return editable;
  }

 
  getHeaderAttributeValue(key) {
    let val = this.inputService.getInputValue(this.getHeaderAttrPath(key));
    val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
    return val;
  }

  isLoading() {
    return this.loading || this.headerLoading 
  }

 

}
