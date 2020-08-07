import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { BehaviorSubject } from 'rxjs';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { RoleDetails, StatusDetails } from '../models/document-type.model';

@Injectable()
export class DocumentTypeSharedService {
  appKey = 'documentType';
  apiBase = 'document-type';
  taskFlowName = 'DOCUMENTTPYE'

  editMode = false;
  id: number;
  formData: any = {};

  loading = true;
  headerLoading = true;
  RoledetailLoading = true;
  StatusDetailLoading = true;

  primaryKey = 'docTypeId';
  RoledetailPrimaryKey = 'roleDocId';
  StatusDetailPrimaryKey = 'statusId';

  lineKeys = ['Roledetail', 'StatusDetail'];

  RoledetailAttributes = Object.keys(new RoleDetails());
  StatusDetailAttributes = Object.keys(new StatusDetails());
  selectedLines = {};

  statusList: any = [];
  saveStatusData: any = [];
  saveIndex: any = [];
  saveRoleIndex: any = [];
  removedAll = false
  refreshHeaderData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshRoledetail: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshStatusDetail: BehaviorSubject<boolean> = new BehaviorSubject(false);
  //inputService: TnzInputService;
  //Navigation variable
  params
  columnFilterValues: any;
  count;
  listData;
  selectedPage = 1;
  constructor(
    private _cache: LocalCacheService,
    private inputService: TnzInputService
  ) { }
  init() {
    this.id = 0;
    this.editMode = false;
  }
  clear() {
    this.id = 0;
    this.editMode = false;
    this.formData = {};
  }
  get appPath() {
    return this.appKey + '.' + this.id;
  }
  get headerPath() {
    return this.appPath + '.header';
  }
  setSelectedLines(key, models) {
    this.selectedLines[key] = models;
  }

  setFormData(data) {
    this.formData = data;


  }
  setFormHeader(data) {
    this.formData['header'] = data;

  }

  initLocalCache() {
    this._cache.setLocalCache('documentType', {});
    this.resetSaveStausData();

  }
  resetSaveStausData() {
    this.saveStatusData = [];
    this.saveIndex = [];
    this.saveRoleIndex = [];
  }
  getHeaderAttrPath(attr) {

    return this.headerPath + '.' + attr;
  }

  getRoledetailPath(line, attr) {
    return this.RoledetailPath + '[' + line + '].' + attr;
  }
  get RoledetailPath() {
    return this.appPath + '.Roledetail';
  }
  getStatusDetailPath(line, attr) {
    return this.StatusDetailPath + '[' + line + '].' + attr;
  }
  get StatusDetailPath() {
    return this.appPath + '.StatusDetail';
  }
  getHeaderAttributeValue(key) {
    let val = this.inputService.getInputValue(this.getHeaderAttrPath(key));
    val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
    return val;
  }

  getHeaderEditable(attr, primaryKey) {
    let editable = this.editMode;

    let nonEditableAttrs = ['shortCode', 'docBase'];// attributes that cannot be edited after creation
    if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
      editable = false
    }

    return editable;
  }

  getRoleDetailsEditable(attr = null) {
    let editable = this.editMode || this.id == 0;

    return editable;
  }
  getStatusDetailsEditable(attr = null) {
    let editable = this.editMode || this.id == 0;
    return editable;
  }
  addLine(key, model = null) {

    const newLine = this.getLineModel(key, model);

    let data = this.formData[key];

    let attributes = this[key + 'Attributes'];

    let path = this[key + 'Path'];

    let primaryKey = this[key + 'PrimaryKey'];
    let newIndex = data.length;
    // if (newIndex == 0) {
    //  this.resetSeq(key);
    //}
    let seq = this[key + 'Seq'];
    attributes.forEach(attr => {

      let value;
      if (model) {
        value = model[attr];
      }
      if (attr == primaryKey) {
        value = 0;
      }

      if (typeof value == 'undefined' || value === '')
        newLine[attr] = '';
      else {
        newLine[attr] = value;
        this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
      }
    });
    data.push(newLine);
    this.refreshLines(key);


  }

  // resetSeq(key) {
  // this['_' + key + 'Seq'] = 1;
  //}
  //method to reset lines
  resetLines() {

    this.lineKeys.forEach(key => {
      if (key == 'Roledetail') {


        if (this[key].length) {

          this.formData[key] = JSON.parse(JSON.stringify(this[key]));

        }

        else {

          this.formData[key] = [];

        }
      }
      this.refreshLines(key);
    })

  }

  //method to load data 
  refreshLines(key) {

    switch (key) {

      case 'Roledetail':
        this.refreshRoledetail.next(true);

        break;
      case 'StatusDetail':
        this.refreshStatusDetail.next(true);
        break;
      default:
        break;
    }
  }

  setLines(key, data) {
    if (!data || !data.length) {
      this.formData[key] = this[key] = [];

    } else {

      this[key] = JSON.parse(JSON.stringify(data));
      this.formData[key] = data;

      this.getLineModel(key);
    }
  }
  getLineModel(key, model = null) {

    let newLine;
    switch (key) {

      case 'Roledetail':
        newLine = model ? new RoleDetails(model) : new RoleDetails({});


        break;
      case 'StatusDetail':
        newLine = model ? new StatusDetails(model) : new StatusDetails({});
        break;

      default:
        break;
    }
    return newLine;
  }
  setLinesFromCache(key, data) {

    let cache;
    let linePrimaryKey = this[key + 'PrimaryKey'];



    cache = this.inputService.getCache(this[key + 'Path']);

    if (cache && cache.length) {
      cache.forEach((line, lineIdx) => {
        if (line) {

          if (line[linePrimaryKey] == 0) {

            let newLine = this.getLineModel(key);
            Object.keys(this.getLineModel(key)).forEach(attr => {
              if (line[attr]) {
                newLine[attr] = line[attr];
              } else {
                newLine[attr] = ''
              }
            });
            newLine[linePrimaryKey] = 0;
            data.splice(lineIdx, 0, newLine);
          }
        }
      });
    }
    return data;
  }

  getSavedCacheData(key) {
    //let data = this.formData[key];
    let path = this[key + 'Path'];
    let cache = this._cache.getCachedValue(path)
    return cache
  }
  setListData(data) {
    this.listData = data.documentType;
    this.count = data.count;

  }
  resetAll() {
    this.inputService.resetSharedData();
  }
  onNewDocumentCreated() {
    this.listData = null;
    this.params = null;
  }
  //method to delete lines
  deleteRoleLine(key, index) {
    let linePrimaryKey = this[key + 'PrimaryKey'];
    let data = this.formData[key];
    let path = this[key + 'Path'];
    let model = data[index];

    if (model[linePrimaryKey] == 0) { // delte enabled only when id=0(create before save)
      data.splice(index, 1);
      let cache = this._cache.getCachedValue(path)

      if (cache && cache.length > index) {
        cache.splice(index, 1);
        this._cache.setLocalCache(path, cache);
      }
      //if (data.length == 0) this.resetSeq(key)
      this.refreshLines(key);
    }

  }

}