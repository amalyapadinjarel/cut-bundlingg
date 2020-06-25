import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { UserRoles } from '../models/user-roles';
import { BehaviorSubject } from 'rxjs';
import { UserOrgAccess } from '../models/user-org-access';
import { DateUtilities } from 'app/shared/utils';

@Injectable(
  //  {  providedIn: 'root'}
)
export class UserSharedService {

  //setting app variables
  appKey = 'user';
  apiBase = 'user-app';
  taskFlowName = 'USER'

  //variable to control editing
  editMode = false;

  id: number;

  formData: any = {};

  //defining array to store lines
  linesData: any = [];
  userRoles: any = [];
  userOrgAccess: any = [];

  //defining loading
  loading = true;
  headerLoading = true;
  linesLoading = false; //----??---
  userRolesLoading = true;
  userOrgAccessLoading = true;

  //defining primary key
  primaryKey = 'userId';
  userRolesPrimaryKey = 'roleUserAssignmentId';
  userOrgAccessPrimaryKey = 'orgAccessId';

  //variables for attributes
  userRolesAttributes = Object.keys(new UserRoles());
  userOrgAccessAttributes = Object.keys(new UserOrgAccess());

  selectedLines = {}; //??

  userSaveAttributeMap = {}; //????

  //sequence
  _userRolesSeq = 1;
  userRolesSeqIncBy = 1;


  //defining BehaviourSubject
  refreshHeaderData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshData: BehaviorSubject<Boolean> = new BehaviorSubject(false);
  refreshUserRolesData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshOrgAccessData: BehaviorSubject<boolean> = new BehaviorSubject(false);

  //define line sections
  lineKeys = ['userRoles', 'userOrgAccess'];


  //variables for navigation
  idlist: any[] = [];
  listConfig = {
    offset: 1,
    limit: 20
  };
  selectedPage: number = 1;
  columnFilterValues;
  count;
  listData;

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
    this.refreshOrgAccessData = new BehaviorSubject(false);
    this.refreshUserRolesData = new BehaviorSubject(false);

    this.linesData = [];
    this.userRoles = [];
    this.userOrgAccess = [];

    //variable for nav
    this.listData = null;

    //variables for seq
    this._userRolesSeq = 1;
    this.userRolesSeqIncBy = 1;

  }

  //destroy or clear variables
  clear() {

    this.id = 0;
    this.editMode = false;

    this.refreshData.unsubscribe();
    this.refreshHeaderData.unsubscribe();
    this.refreshUserRolesData.unsubscribe();
    this.refreshOrgAccessData.unsubscribe();

    this.formData = {};

    this.userRoles = [];
    this.userOrgAccess = [];
    this.linesData = [];
  }

  //method to setListData
  setListData(data) {
    this.listData = data.users;
    this.count = data.count;
    this.idlist = [];
    this.listData.forEach(line => {
      this.idlist.push(Number(line[this.primaryKey]));
    })
  }

  setSelectedLines(key, models) {
    this.selectedLines[key] = models;
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

  //getter for userRolesPath
  get userRolesPath() {
    return this.appPath + '.userRoles';
  }

  //getter for userRolesRemovedKeysPath
  get userRolesRemovedKeysPath() {
    return this.appPath + '.userRolesRemovedKeys';
  }

  //getter for userOrgAccessPath
  get userOrgAccessPath() {
    return this.appPath + '.userOrgAccess';
  }

  //getter for userOrgAccessRemovedKeysPath
  get userOrgAccessRemovedKeysPath() {
    return this.appPath + '.userOrgAccessRemovedKeys';
  }
  //getter for userRolesSeq
  get userRolesSeq() {
    this._userRolesSeq += this.userRolesSeqIncBy;
    return this._userRolesSeq - this.userRolesSeqIncBy;
  }

  //setter for userRolesSeq
  set userRolesSeq(value) {
    this._userRolesSeq = value + this.userRolesSeqIncBy;
  }

  //setFormHeader() method
  setFormHeader(data) {
    this.formData['header'] = data;
  }

  //initializing localcache
  initLocalCache() {
    this._cache.setLocalCache('user', {});
  }


  getHeaderAttrPath(attr) {
    return this.headerPath + '.' + attr;
  }

  getUserRolesPath(line, attr) {
    return this.userRolesPath + '[' + line + '].' + attr;
  }

  getUserOrgAccessPath(line, attr) {
    return this.userOrgAccessPath + '[' + line + '].' + attr;
  }

  getHeaderEditable(attr, id) {
    let editable = this.editMode;
  //  let nonEditableAttrs = ['userName', 'attemptsLeft','startDate','personnelNum'];// attributes that cannot be edited after creation
    let nonEditableAttrs = ['userName','startDate'];// attributes that cannot be edited after creation

    if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
      editable = false;
    }
        return editable;
  }

  //method to reset lines
  resetLines() {
    this.lineKeys.forEach(key => {

      if (this[key].length) {
        this.formData[key] = JSON.parse(JSON.stringify(this[key]));
      }
      else
        this.formData[key] = [];
      this.refreshLines(key);
    })
  }

  //method to load data 
  refreshLines(key) {
    switch (key) {
      case 'userRoles':
        this.refreshUserRolesData.next(true);
        break;
      case 'userOrgAccess':
        this.refreshOrgAccessData.next(true);
        break;
      default:
        break;
    }
  }

  //method to setLines
  setLines(key, data) {
    if (!data || !data.length)
      this.formData[key] = this[key] = [];
    else {
      this[key] = JSON.parse(JSON.stringify(data));
      this.formData[key] = data;
    }
  }

  //method to setLinesFromCache
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

  //method to get Line from model
  getLineModel(key, model = null) {
    let newLine;
    switch (key) {
      case 'userRoles':
        newLine = model ? new UserRoles(model) : new UserRoles();
        break;
      case 'userOrgAccess':
        newLine = model ? new UserOrgAccess(model) : new UserOrgAccess();
        break;
      default:
        break;
    }
    return newLine;
  }


  getUserRolesEditable(attr = null) {
    // let editable = this.editMode && this.id !== 0;
    let editable = this.editMode;
    return editable;
  }

  getUserOrgAccessEditable(attr = null) {
    // let editable = this.editMode && this.id !== 0;
    let editable = this.editMode;
    return editable;
  }


  getHeaderAttributeValue(key) {

    let val = this.inputService.getInputValue(this.getHeaderAttrPath(key));
    val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
    return val;
  }

  isLoading() {
    return this.loading || this.headerLoading || this.linesLoading || this.userRolesLoading || this.userOrgAccessLoading;
  }

  //method to add new Lines
  addLine(key, model = null) {

    let newLine = this.getLineModel(key, model);
    //let seqKey = this.getSeqKey(key);

    let data = this.formData[key];
    let attributes = this[key + 'Attributes'];
    let path = this[key + 'Path'];
    let primaryKey = this[key + 'PrimaryKey']; 

    let newIndex = data.length;

    if (newIndex == 0) {
      this.resetSeq(key);
    }

    attributes.forEach(attr => {
      let value;
      if (model) value = model[attr];
      if (attr == primaryKey) value = 0;
      // else if (attr==seqKey) value=seq.tostring();
      if (typeof value == 'undefined' || value == '') newLine[attr] = '';
      else {
        newLine[attr] = value;
        this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
      }

    });

    data.push(newLine);
    this.refreshLines(key);
  }

  //method to reset seq
  resetSeq(key) {
    this['_' + key + 'Seq'] = 1;
  }

  //method to delete lines
  deleteLine(key, index) {
    let linePrimaryKey = this[key + 'PrimaryKey'];
    let data = this.formData[key];
    let path = this[key + 'Path'];
    let model = data[index];

    if (model[linePrimaryKey] == 0) {
      data.splice(index, 1);
      let cache = this._cache.getCachedValue(path)

      if (cache && cache.length > index) {
        cache.splice(index, 1);
        this._cache.setLocalCache(path, cache);
      }
      if (data.length == 0) this.resetSeq(key)
      this.refreshLines(key);
    }

  }


}
