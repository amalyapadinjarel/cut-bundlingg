import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { RoleUsers } from '../models/role-users';
import { BehaviorSubject } from 'rxjs';
import { RolesOrgAccess } from '../models/roles-org-access';
import { DateUtilities } from 'app/shared/utils';
import { RolesAppAccess } from '../models/roles-application-access';
import { RolesTaskFlowAccess } from '../models/roles-taskflow-access';
import { JSONUtils } from 'app/shared/utils/json.utility';

@Injectable(
  // {  providedIn: 'root'}
)
export class RolesSharedService {

  //setting app variables
  appKey = 'roles';
  apiBase = 'roles';
  taskFlowName = 'ROLES'

  //variable to control editing
  editMode = false;

  id: number = 0;
  formData: any = {};
  refreshVariable = true;

  //expansion panel related
  orgAccessList: any = [];
  divisionList: any = [];
  facilityList: any = [];

  saveOrgAccessData: any = [];
  saveIndex: any = [];
  saveFacilityIndex: any = [];
  removedAll = false


  //copy
  copy=false;

  //defining array to store lines
  linesData: any = [];
  roleUsers: any = [];
  rolesOrgAccess: any = [];
  roleAppAccess: any[];
  rolesTaskFlowAccess: any[];

  //defining loading
  loading = true;
  headerLoading = true;
  linesLoading = false; //----??---
  roleUsersLoading = true;
  rolesOrgAccessLoading = true;
  rolesAppAccessLoading = true;
  // rolesTaskFlowAccessLoading = false;
  rolesTaskFlowAccessLoading = true;

  //defining primary key
  primaryKey = 'roleId';
  roleUsersPrimaryKey = 'roleUserAssignmentId';
  rolesOrgAccessPrimaryKey = 'orgAccessId';
  //rolesAppAccessPrimaryKey = 'applicationId';
  rolesAppAccessPrimaryKey = 'roleAppAssignmentId';

  rolesTaskFlowAccessPrimaryKey = 'roleTaskFlowAssignmentId';
  rolesRootTaskFlowAccessPrimaryKey = 'roleTaskFlowAssignmentId';

  //variables for attributes
  roleUsersAttributes = Object.keys(new RoleUsers());
  rolesOrgAccessAttributes = Object.keys(new RolesOrgAccess());
  rolesAppAccessAttributes = Object.keys(new RolesAppAccess());
  rolesTaskFlowAccessAttributes = Object.keys(new RolesTaskFlowAccess());

  selectedLines = {}; //??

  roleSaveAttributeMap = {}; //????

  //sequence
  _roleUsersSeq = 1;
  roleUsersSeqIncBy = 1;


  //defining BehaviourSubject
  refreshHeaderData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshData: BehaviorSubject<Boolean> = new BehaviorSubject(false);
  refreshRoleUsersData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshOrgAccessData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshAppAccessData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshTaskFlowAccessData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  fetchAppData: BehaviorSubject<boolean> = new BehaviorSubject(false);

  //define line sections
  lineKeys = ['roleUsers', 'rolesOrgAccess', 'rolesAppAccess', 'rolesTaskFlowAccess'];


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
  params; //?

  //newly added for application access
  changeEmitted$: any;
  selectedIndex: number = 0;
  get selectedApplicationCode(): string {
    return this.formData['rolesAppAccess'] ? this.formData['rolesAppAccess'][this.selectedIndex].applicationShortCode : "";
  }
  get selectedAppAccess(): string {
    return this.inputService.getInputValue(this.getRolesAppAccessPath(this.selectedIndex, 'isAllowed')) || (this.formData['rolesAppAccess'] ? this.formData['rolesAppAccess'][this.selectedIndex]?.isAllowed : "");
  }


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

    this.refreshAppAccessData = new BehaviorSubject(false);
    this.refreshTaskFlowAccessData = new BehaviorSubject(false);

    this.refreshOrgAccessData = new BehaviorSubject(false);
    this.refreshRoleUsersData = new BehaviorSubject(false);

    this.linesData = [];
    this.roleUsers = [];
    this.rolesOrgAccess = [];

    this.roleAppAccess = [];
    this.rolesTaskFlowAccess = [];

    //variable for nav
    this.listData = null;

    //variables for seq
    this._roleUsersSeq = 1;
    this.roleUsersSeqIncBy = 1;

    this.selectedIndex = 0;

  }

  //destroy or clear variables
  clear() {

    this.id = 0;
    this.editMode = false;

    this.refreshData.unsubscribe();
    this.refreshHeaderData.unsubscribe();

    this.refreshRoleUsersData.unsubscribe();
    this.refreshOrgAccessData.unsubscribe();

    this.refreshAppAccessData.unsubscribe();
    this.refreshTaskFlowAccessData.unsubscribe();

    this.formData = {};

    this.roleUsers = [];
    this.rolesOrgAccess = [];

    this.roleAppAccess = [];
    this.rolesTaskFlowAccess = [];

    this.linesData = [];

    this.selectedIndex = 0;

  }

  //method to setListData
  setListData(data) {
    this.listData = data.roles;
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

  //getter for roleUsersPath
  get roleUsersPath() {
    return this.appPath + '.roleUsers';
  }

  //getter for roleUsersRemovedKeysPath
  get roleUsersRemovedKeysPath() {
    return this.appPath + '.roleUsersRemovedKeys';
  }

  //getter for rolesAppAccessPath
  get rolesAppAccessPath() {
    return this.appPath + '.rolesAppAccess';
  }

  //getter for rolesAppAccessRemovedKeysPath
  get rolesAppAccessRemovedKeysPath() {
    return this.appPath + '.rolesAppAccessRemovedKeys';
  }

  //getter for rolesTaskFlowAccessPath
  get rolesRootTaskFlowAccessPath() {
    return this.appPath + '.rolesTaskFlowAccess';
  }

  //getter for rolesTaskFlowAccessRemovedKeysPath
  get rolesRootTaskFlowAccessRemovedKeysPath() {
    return this.appPath + '.rolesTaskFlowAccessRemovedKeys';
  }

  get rolesTaskFlowAccessPath() {
    // return this.appPath + '.rolesTaskFlowAccess';
    // return this.appPath + '.rolesAppAccess['+this.selectedIndex+'].taskflows';
    return this.appPath + '.rolesAppAccess[' + this.selectedIndex + '].rolesTaskFlowAccess';


  }

  //getter for rolesTaskFlowAccessRemovedKeysPath
  get rolesTaskFlowAccessRemovedKeysPath() {
    // return this.appPath + '.rolesTaskFlowAccessRemovedKeys';
    // return this.appPath + '.rolesAppAccess['+this.selectedIndex+'].taskflowsRemovedKeys';
    return this.appPath + '.rolesAppAccess[' + this.selectedIndex + '].rolesTaskFlowAccessRemovedKeys';

  }


  //getter for rolesOrgAccessPath
  get rolesOrgAccessPath() {
    return this.appPath + '.rolesOrgAccess';
  }

  //getter for rolesOrgAccessRemovedKeysPath
  get rolesOrgAccessRemovedKeysPath() {
    return this.appPath + '.rolesOrgAccessRemovedKeys';
  }
  //getter for roleUsersSeq
  get roleUsersSeq() {
    this._roleUsersSeq += this.roleUsersSeqIncBy;
    return this._roleUsersSeq - this.roleUsersSeqIncBy;
  }

  //setter for roleUsersSeq
  set roleUsersSeq(value) {
    this._roleUsersSeq = value + this.roleUsersSeqIncBy;
  }

  //setFormHeader() method
  setFormHeader(data) {
    this.formData['header'] = data;
  }

  //initializing localcache
  initLocalCache() {
    this._cache.setLocalCache('roles', {});
  }


  getHeaderAttrPath(attr) {
    return this.headerPath + '.' + attr;
  }

  getRoleUsersPath(line, attr) {
    return this.roleUsersPath + '[' + line + '].' + attr;
  }

  getRolesOrgAccessPath(line, attr) {
    return this.rolesOrgAccessPath + '[' + line + '].' + attr;
  }
  getRolesAppAccessPath(line, attr) {
    return this.rolesAppAccessPath + '[' + line + '].' + attr;
  }
  getRolesTaskFlowAccessRootPath(line, attr) {
    return this.appPath + '.rolesTaskFlowAccess' + '[' + line + '].' + attr;
  }
  getRolesTaskFlowAccessPath(line, attr) {
    return this.rolesTaskFlowAccessPath + '[' + line + '].' + attr;
  }
  getFullRolesTaskFlowAccessPath(app, line, attr) {
    return this.appPath + '.rolesAppAccess[' + app + '].rolesTaskFlowAccess' + '[' + line + '].' + attr;
  }
  getHeaderEditable(attr, id) {
    let editable = this.editMode;
    let nonEditableAttrs = ['roleShortCode', 'author'];// attributes that cannot be edited after creation

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
      case 'roleUsers':
        this.refreshRoleUsersData.next(true);
        break;
      case 'rolesOrgAccess':
        this.refreshOrgAccessData.next(true);
        break;
      case 'rolesAppAccess':
        this.refreshAppAccessData.next(true);
        break;
      case 'rolesTaskFlowAccess':
        this.refreshTaskFlowAccessData.next(true);
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
      case 'roleUsers':
        newLine = model ? new RoleUsers(model) : new RoleUsers();
        break;
      case 'rolesAppAccess':
        newLine = model ? new RolesAppAccess(model) : new RolesAppAccess();
        break;
      case 'rolesRootTaskFlowAccess':
        newLine = model ? new RolesTaskFlowAccess(model) : new RolesTaskFlowAccess();
        break;
      case 'rolesTaskFlowAccess':
        newLine = model ? new RolesTaskFlowAccess(model) : new RolesTaskFlowAccess();
        break;
      case 'rolesOrgAccess':
        newLine = model ? new RolesOrgAccess(model) : new RolesOrgAccess();
        break;
      default:
        break;
    }
    return newLine;
  }


  getRoleUsersEditable(attr = null) {
    let editable = this.editMode;
    return editable;
  }

  getRolesOrgAccessEditable(attr = null) {
    let editable = this.editMode;
    return editable;
  }
  getRolesAppAccessEditable(attr = null) {
    let editable = this.editMode;
    return editable;
  }

  getRolesTaskFlowAccessEditable(attr = null) {
    let editable = this.editMode;
    return editable;
  }
  getHeaderAttributeValue(key) {

    let val = this.inputService.getInputValue(this.getHeaderAttrPath(key));
    val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
    return val;
  }

  isLoading() {
    return this.loading || this.headerLoading || this.linesLoading || this.roleUsersLoading || this.rolesOrgAccessLoading
    // ||this.rolesTaskFlowAccessLoading;
  }

  //method to add new Lines
  addLine(key, model = null, refreshVariable) {

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
      if (typeof value == 'undefined' || value == '') newLine[attr] = '';
      else {
        newLine[attr] = value;
        this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
      }

    });

    data.push(newLine);
    this.refreshLines(key);
  }


  //method to add taskflows

  addTaskflows(model) {


  }


  //method to reset seq
  resetSeq(key) {
    this['_' + key + 'Seq'] = 1;
  }

  //method to delete lines
  deleteLine(key, index) {
    let linePrimaryKey = this[key + 'PrimaryKey'];
    let data = key == 'rolesTaskFlowAccess' ? this.formData.rolesAppAccess[this.selectedIndex][key] : this.formData[key];
    let path = this[key + 'Path'];
    let model = data[index];

    if (model[linePrimaryKey] == 0) { // delte enabled only when id=0(create before save)
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

  //to refresh data
  onNewDocumentCreated() {
    this.listData = null;
    this.params = null;
  }


  resetAllInput() {
    //   this.inputService.resetSharedData();
  }

  updateInput(path, value) {
    this.inputService.updateInput(path, value);
  }

}
