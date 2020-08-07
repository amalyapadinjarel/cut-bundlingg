import { Injectable } from '@angular/core';
import { EmbeddedURLUsers } from '../models/embedded-url-users';
import { BehaviorSubject } from 'rxjs';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { LocalCacheService } from 'app/shared/services';

@Injectable(
)
export class EmbeddedURLSharedService {

  appKey = 'embeddedURL';
  apiBase = 'embeddedURL';
  taskFlowName = 'EMBEDDEDURL';
 
  editMode = false;

  id = 0;
  formData: any = {};

  embeddedURLUsers: any = [];
  linesData: any = [];

  loading = true;
  headerLoading = true;
  linesLoading = false;
  embeddedURLUsersLoading = true;

  primaryKey = 'urlId';
  embeddedURLUsersPrimaryKey = 'embedId';
  embeddedURLUsersAttributes = Object.keys(new EmbeddedURLUsers());

  _embeddedURLUsersSeq = 1;
  _embeddedURLUsersSeqIncBy = 1;
  selectedLines = {};
  lineKeys = ['embeddedURLUsers'];

  refreshEmbeddedURLUsersData: BehaviorSubject<boolean> = new BehaviorSubject(false);

  refreshHeaderData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);


  //variables for navigation
  selectedPage: number = 1;
  columnFilterValues;
  count;
  listData;
  params;

   constructor(private _cache: LocalCacheService,
    private _inputService: TnzInputService,) { }

  init() {
    this.id = 0;
    this.editMode = false;
    this.refreshEmbeddedURLUsersData = new BehaviorSubject(false);
    this.refreshData = new BehaviorSubject(false);
    this.formData = {};
    this.embeddedURLUsers = [];
    this.linesData = [];
    this._embeddedURLUsersSeq = 1;
    this._embeddedURLUsersSeqIncBy = 1;
  }


  clear() {
    this.id = 0;
    this.editMode = false;
    this.refreshEmbeddedURLUsersData.unsubscribe();
    this.embeddedURLUsers = [];
    this.refreshData.unsubscribe();
    this.formData = {};
    this.linesData = [];
  }

  get appPath() {
    return this.appKey + '.' + this.id;
  }

  get headerPath() {
    return this.appPath + '.header';
  }

  get embeddedURLUsersPath() {
    return this.appPath + '.embeddedURLUsers';
  }

  get embeddedURLUsersSeq() {
    this._embeddedURLUsersSeq += this._embeddedURLUsersSeqIncBy;
    return this._embeddedURLUsersSeq - this._embeddedURLUsersSeqIncBy;
  }

  set embeddedURLUsersSeq(value) {
    this._embeddedURLUsersSeq = value + this._embeddedURLUsersSeqIncBy;
  }

  getHeaderData() {
    return this.formData.header;
  }

  setFormData(data) {

    this.formData = data;
  }

  setFormHeader(data) {
    this.formData['header'] = data;

  }

  initLocalCache() {
    this._cache.setLocalCache('embeddedURL', {});
  }

  getHeaderAttrPath(attr) {
    return this.headerPath + '.' + attr;
  }

  get embeddedURLUsersRemovedKeysPath() {
    return this.appPath + '.embeddedURLUsersRemovedKeys';
  }

  getEmbeddedURLUsersPath(line, attr) {
    return this.embeddedURLUsersPath + '[' + line + '].' + attr;
  }
  getHeaderEditable(attr, primaryKey) {
    let editable = this.editMode;
    return editable;
  }

  getEmbeddedURLUsersEditable(attr = null) {
    let editable = this.editMode;
    let nonEditableAttrs = ['createdByUser', 'creationDate', 'lastUpdatedByUser', 'lastUpdateDate'];// attributes that cannot be edited after creation
    if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
      editable = false
    }
    return editable;
  }

  getHeaderAttributeValue(key) {
    let val = this._inputService.getInputValue(this.getHeaderAttrPath(key));
    val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
    return val;
  }

  getLookupAttributeValue(index, key) {
    let val = this._inputService.getInputValue(this.getEmbeddedURLUsersPath(index, key));
    val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
    return val;
  }
  isLoading() {
    return this.loading || this.headerLoading || this.linesLoading || this.embeddedURLUsersLoading
  }

  addLine(key, model = null, refreshValue) {
    let newLine;
    //embeddedURLUsers
    newLine = this.getLineModel(key, model);
    let data = this.formData[key];
    let attributes = this[key + 'Attributes'];
    let path = this[key + 'Path'];
    let primaryKey = this[key + 'PrimaryKey'];
    let newIndex = data.length;
    if (newIndex == 0) {
        this.resetSeq(key);
    }
    let seq = this[key + 'Seq'];
    attributes.forEach(attr => {
        let value;
        if (model) {
            value = model[attr];
        }
        if (attr == primaryKey) {
            value = 0;
        }
        //  else if (attr == seqKey) {
        //     value = seq.toString();
        // }
        if (typeof value == 'undefined' || value === '')
            newLine[attr] = '';
        else {
            newLine[attr] = value;
            this._inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
        }
    });
    data.push(newLine);
    if(refreshValue)   this.refreshLines(key);

}



resetSeq(key) {
    this['_' + key + 'Seq'] = 1;
}

resetLines() {
    this.lineKeys.forEach(key => {
        if (this[key].length)
            this.formData[key] = JSON.parse(JSON.stringify(this[key]));
        else
            this.formData[key] = [];
        this.refreshLines(key);
    })
}

setLinesFromCache(key, data) {
  let cache;
  let linePrimaryKey = this[key + 'PrimaryKey'];
  cache = this._inputService.getCache(this[key + 'RemovedKeysPath']);
  if (cache) {
      cache.forEach((line) => {
          let i = data.findIndex(elem => { return elem[linePrimaryKey] == line });
          if (i > -1) {
              data.splice(i, 1);
          }
      });
  }
  cache = this._inputService.getCache(this[key + 'Path']);
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
      case 'embeddedURLUsers':
          newLine = model ? new EmbeddedURLUsers(model) : new EmbeddedURLUsers();
          break;
        default:
          break;
  }
  return newLine;
}

refreshLines(key) {
  switch (key) {
      case 'embeddedURLUsers':
          this.refreshEmbeddedURLUsersData.next(true);
          break;
     default:
          break;
  }
}

setLines(key, data) {
  if (!data || !data.length)
      this.formData[key] = this[key] = [];
  else {
      this[key] = JSON.parse(JSON.stringify(data));
      this.formData[key] = data;
  }
}

setSelectedLines(key, models) {
  this.selectedLines[key] = models;
}

setListData(data) {
  this.listData = data.embeddedURL;
  this.count = data.count;
}

  //method to delete lines
  deleteLine(key, index) {
    
      let linePrimaryKey = this[key + 'PrimaryKey'];
      let data = this.formData[key];
      let path = this[key + 'Path'];
      let cache = this._cache.getCachedValue(path)
      if (cache && cache.length > index)
          cache.splice(index, 1);
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
      if (data.length == 0) {
          this.resetSeq(key)
      }
      this.refreshLines(key);

  }

  //to refresh data
  onNewDocumentCreated() {
    this.listData = null;
    this.params = null;
  }



}
