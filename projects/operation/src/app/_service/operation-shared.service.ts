import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
//import { UserRoles } from '../models/user-roles';
import { BehaviorSubject } from 'rxjs';
//import { UserOrgAccess } from '../models/user-org-access';
import { DateUtilities } from 'app/shared/utils';
import { Operation } from '../models/operations.model';

@Injectable(
)
export class OperationSharedService {

  //setting app variables
  appKey = 'operations';
  apiBase = 'operations';
  taskFlowName = 'OPERATION'

  //variable to control editing
  editMode = false;

  id = 0;
  //variable to identify newLine
  newLine = false;

  formData: any = {};
  //operationData: any;

  // //defining array to store lines
  linesData: any = [];
  operations: any = [];


  //defining loading
  loading = true;
  headerLoading = true;
  linesLoading = false; 
 

  //defining primary key
  primaryKey = 'opId';
  operationsPrimaryKey = 'opId';

  //variables for attributes
  operationsAttributes = Object.keys(new Operation());

  selectedLines = {}; 


  //sequence
  _operationsSeq = 1;
  operationsSeqIncBy = 1;


  //defining BehaviourSubject
  refreshHeaderData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshData: BehaviorSubject<Boolean> = new BehaviorSubject(false);
  refreshOperationData: BehaviorSubject<boolean>;

  //define line sections
  lineKeys = ['operations'];


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
  codeFlag: boolean;

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
    this.refreshOperationData = new BehaviorSubject(false);

    this.linesData = [];
    this.operations = [];

    //variable for nav
    this.listData = null;


    //variables for seq
    this._operationsSeq = 1;
    this.operationsSeqIncBy = 1;

  }

  //destroy or clear variables
  clear() {

    this.id = 0;
    this.editMode = false;

    this.refreshData.unsubscribe();
    this.refreshHeaderData.unsubscribe();

    this.refreshOperationData.unsubscribe();

    this.formData = {};

    this.operations = [];
    this.linesData = [];
  }

  //method to setListData
  setListData(data) {
    this.listData = data.operations;
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
    return this.appKey;
  }

  setFormData(data) {
    this.formData = data;
  }

  //getter for operationsPath
  get operationsPath() {
    return this.appPath + '.operations.operations'; //added twice because the first two(lookup,primarykey,key) is removed in tnz_input component
  }

  //getter for operationsRemovedKeysPath
  get operationsRemovedKeysPath() {
    return this.appPath + '.operationsRemovedKeys';
  }


  // accessor for operationsSeq
  get operationsSeq() {
    this._operationsSeq += this.operationsSeqIncBy;
    return this._operationsSeq - this.operationsSeqIncBy;
  }

  // accessor for operationsSeq
  set operationsSeq(value) {
    this._operationsSeq = value + this.operationsSeqIncBy;
  }

 
  //initializing localcache
  initLocalCache() {
    this._cache.setLocalCache('operations', {});
  }


  getOperationsPath(line, attr) {
    return this.operationsPath + '[' + line + '].' + attr;
  }


  //method to reset lines
  resetLines() {
    this.formData["operations"] = null;
    this.refreshOperationData.next(true);
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


  getOperationsEditable(attr = null, id=null) {
    let editable = this.editMode;
    let value = this.inputService.getInputValue(this.getOperationsPath(0, 'shortCode'));
    if (attr == 'shortCode') {
      if (id != 0) editable = false;
    }
    return editable;
  }


  isLoading() {
    return this.loading || this.headerLoading || this.linesLoading
  }

  //method to add new Lines
  addLine(key, model = null) {
    let newLine = model ? new Operation(model) : new Operation();
    let data = this.formData['operations'];
    let attributes = this['operationsAttributes'];
    let path = this['operationsPath'];
    let primaryKey = this['operationsPrimaryKey'];
    let newIndex = 0;
    let cache=this.inputService.getCache(path) || [];
    cache.unshift({});
    this.inputService.updateInputCache(path, cache);

    attributes.forEach(attr => {
      let value;
      if (model) value = model[attr];
      if (attr == primaryKey) value = 0;
      if(attr=='active') value='Y';
      if (typeof value == 'undefined' || value === '')
       newLine[attr] = '';
      else {
        newLine[attr] = value;
        this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
      }

    });
    data.unshift(newLine); //unshift is used to add a line at beginning of Array
    this.refreshOperationData.next(true);
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
      this.refreshOperationData.next(true);
    }

  }


}
