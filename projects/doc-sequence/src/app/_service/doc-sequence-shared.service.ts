import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { SeqLineDetails } from '../models/doc-seq-model';


@Injectable()
export class DocSequenceSharedService {

  appKey = 'docSequence';
  apiBase = 'doc-sequence';
  taskFlowName = 'DOCUMENTTPYE'

  editMode = false;
  id: number;

  selectedPage = 1;
  listData
  count
  params
  columnFilterValues: any;

  formData: any = {};
  selectedLines = {};
  primaryKey = 'docSeqId';
  SeqLineDetailPrimaryKey = 'seqLineId'
  loading = true;
  headerLoading = true;
  SeqLineDetailLoading = true;
  lineKeys = ['SeqLineDetail'];
  resetyearFlag = false
  customFlag = false
  notresetyearFlag = false
  SeqLineDetailAttributes = Object.keys(new SeqLineDetails());
  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshLinedetail: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private _cache: LocalCacheService,
    private inputService: TnzInputService
  ) { }

  init() {
    this.id = 0;
    this.editMode = false;
    this.refreshData = new BehaviorSubject(false);
    this.formData = {};
  }
  clear() {
    this.id = 0;
    this.editMode = false;
    this.refreshData.unsubscribe();
    this.formData = {};
  }
  initLocalCache() {
    this._cache.setLocalCache('docSequence', {});

  }

  get appPath() {
    return this.appKey + '.' + this.id;
  }

  get headerPath() {
    return this.appPath + '.header';
  }

  get SeqLineDetailPath() {
    return this.appPath + '.SeqLineDetail';
  }

  get SeqLineDetailRemovedKeysPath() {
    return this.appPath + '.SeqLineDetailRemovedKeys';
  }
  getHeaderAttrPath(attr) {
    return this.headerPath + '.' + attr;
  }
  getSeqLineDetailPath(line, attr) {
    return this.SeqLineDetailPath + '[' + line + '].' + attr;
  }
  setListData(data) {
    this.listData = data.docSequence;
    this.count = data.count;
  }

  setFormData(data) {
    this.formData = data;
  }

  setFormHeader(data) {
    this.formData['header'] = data;
  }
  setLines(key, data) {
    if (!data || !data.length) {
      this.formData[key] = this[key] = [];

    } else {

      this[key] = JSON.parse(JSON.stringify(data));
      this.formData[key] = data;

      // this.getLineModel(key);
    }
  }
  setLinesFromCache(key, data) {

    let cache;
    let linePrimaryKey = this[key + 'PrimaryKey'];
    cache = this.inputService.getCache(this[key + 'RemovedKeysPath']);
    if (cache) {
      cache.forEach((line) => {
        let i = data.findIndex(elem => {
          return elem[linePrimaryKey] == line
        });
        if (i > -1) {
          data.splice(i, 1);
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
  getLineModel(key, model = null) {

    let newLine;
    switch (key) {
      case 'SeqLineDetail':
        newLine = model ? new SeqLineDetails(model) : new SeqLineDetails({});
      default:
        break;
    }
    return newLine;
  }
  setSelectedLines(key, models) {
    this.selectedLines[key] = models;
  }
  resetAll() {
    this.inputService.resetSharedData();
    this.inputService.resetInputService(this.appKey)
  }
  onNewDocumentCreated() {
    this.listData = null;
    this.params = null;
  }
  getHeaderEditable(attr) {
    let editable = this.editMode;
    let nonEditableAttrs = ['shortCode', 'author', "appName", "resetYear"];
    if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
      editable = false
    }
    return editable;
  }
  getLineDetailEditable() {
    let editable = this.editMode || this.id == 0;
    return editable;
  }
  addLine(key) {

    const newLine = this.getLineModel(key);

    let data = this.formData[key];

    let attributes = this[key + 'Attributes'];

    let path = this[key + 'Path'];

    let primaryKey = this[key + 'PrimaryKey'];
    let newIndex = data.length;

    attributes.forEach(attr => {

      let value;
      /* if (model) {
         value = model[attr];
       }*/
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
    this.refreshLinedetail.next(true);


  }
  deleteLine(key, index) {

    let linePrimaryKey = this[key + 'PrimaryKey'];
    let data = this.formData[key];
    let path = this[key + 'Path'];
    let cache = this._cache.getCachedValue(path)
    if (cache && cache.length > index) {
      cache.splice(index, 1);
    }
    this._cache.setLocalCache(path, cache);
    let model = data[index];
    data.splice(index, 1);
    if (model[linePrimaryKey]) {
      let removedPath = this[key + 'RemovedKeysPath'];
      cache = this._cache.getCachedValue(removedPath)
      if (!cache) {
        cache = [];
      }
      cache.push(model[linePrimaryKey])
      this._cache.setLocalCache(removedPath, cache);
    }
    this.refreshLinedetail.next(true);


  }
  getSavedCacheData(key) {

    let path = this[key + 'Path'];
    let cache = this._cache.getCachedValue(path)
    return cache
  }

  resetLines() {
    this.lineKeys.forEach(key => {
      if (this[key].length) {
        this.formData[key] = JSON.parse(JSON.stringify(this[key]));
      } else {
        this.formData[key] = [];
      }
      this.refreshLinedetail.next(true);
    })
  }
 

}
