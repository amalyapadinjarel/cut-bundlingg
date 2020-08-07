import { Injectable } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { BehaviorSubject } from 'rxjs';
import { CutPanelDetails } from '../../../../Routing/src/app/models/CutPanelDetails';

@Injectable({
  providedIn: 'root'
})
export class RoutingSharedService {

  appKey = 'routing';
  apiBase = 'routing';
  taskFlowName = 'ROUTING'
  editMode = false;
  id: number;
  formData: any = {};
  stepId: number;
  idlist: any[] = [];

  loading = true;
  headerLoading = true;
  linesLoading = false;
  cutPanelDetailsLoading = true;

  primaryKey = 'routingId';
  cutPanelDetailsPrimaryKey = 'inOutId';
  lineKeys = ['cutPanelDetails'];
  selectedLines = {};
  cutPanelDetailsAttributes = ['sequence','semiProdId','stepId','routingId','inOutType'];

  _cutPanelDetailsSeq = 1;
  cutPanelDetailsSeqIncBy = 1;

  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshCutPanelDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);

  selectedPage: number = 1;
  columnFilterValues;
  count;
  listData;
  params;

  constructor(private _cache: LocalCacheService,
    private inputService: TnzInputService) {

    }

    init() {
      this.id = 0;
      this.editMode = false;
      this.refreshData = new BehaviorSubject(false);
      this.refreshCutPanelDetails = new BehaviorSubject(false);
      this.formData = {};
  }

  clear() {
      this.id = 0;
      this.editMode = false;
      this.refreshData.unsubscribe();
      this.refreshCutPanelDetails.unsubscribe();
      this.formData = {};
  }
    get appPath() {
      return this.appKey + '.' + this.id;
    }

    get headerPath() {
        return this.appPath + '.header';
    }
   
    get cutPanelDetailsPath() {
      return this.appPath + '.cutPanelDetails';
    }

    get semiProdPath() {
      return this.appPath + '.semiProd';
    }

    get cutPanelDetailsSeq() {
      this._cutPanelDetailsSeq += this.cutPanelDetailsSeqIncBy;
      return this._cutPanelDetailsSeq - this.cutPanelDetailsSeqIncBy;
    }
    
    set cutPanelDetailsSeq(value) {
      this._cutPanelDetailsSeq = value + this.cutPanelDetailsSeqIncBy;
    }

    setFormHeader(data) {
      this.formData['header'] = data;
    }
    
    setFormData(data) {
      this.formData = data;
    }

    getHeaderAttrPath(attr) {
      return this.headerPath + '.' + attr;
    }

    initLocalCache() {
      this._cache.setLocalCache('routing', {});
    }

    resetLines() {
      this.lineKeys.forEach(key => {
          if (this[key].length)
              this.formData[key] = JSON.parse(JSON.stringify(this[key]));
          else
              this.formData[key] = [];
              this.refreshCutPanelDetails.next(true);
      })
    }

    get cutPanelDetailsRemovedKeysPath() {
      return this.appPath + '.cutPanelDetailsRemovedKeys';
    }

    getHeaderAttributeValue(key) {
      let val = this.inputService.getInputValue(this.getHeaderAttrPath(key));
      val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
      return val;
    } 
   
    getCutPanelDetailsEditable(attr = null) {
      let editable = this.editMode && this.id !== 0;
      return editable;
    }

    getCutPanelDetailsPath(line, attr) {
      return this.cutPanelDetailsPath + '[' + line + '].' + attr;
    }

    getSemiProdPath(attr) {
      return this.semiProdPath + '.' + attr;
    }

    getHeaderEditable(attr, primaryKey) {
      let editable = this.editMode;
      let nonEditableAttrs = ['docType', 'documentTypeFTR', 'productFTR','facility','routingName','smv','description','docTypeId'];// attributes that cannot be edited after creation
      if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
          editable = false
      }
      return editable;
    } 

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
      this.refreshCutPanelDetails.next(true);
    }

    resetSeq(key) {
      this['_' + key + 'Seq'] = 1;
    }

    setSelectedLines(key, models) {
      this.selectedLines[key] = models;
  }

  setLines(key, data) {
    if (!data || !data.length) this.formData[key] = this[key] = [];
    else {
      this[key] = JSON.parse(JSON.stringify(data));
      this.formData[key] = data;
    }
  }

  setLinesFromCache(key, data) {
    let cache;
    let linePrimaryKey = this[key + 'PrimaryKey'];
    cache = this.inputService.getCache(this[key + 'RemovedKeysPath']);
    if (cache) {
        cache.forEach((line) => {
            let i = data.findIndex(elem => { return elem[linePrimaryKey] == line });
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
      case 'cutPanelDetails':
          newLine = model ? new CutPanelDetails(model) : new CutPanelDetails({});
          break;
      default:
          break;
  }
  return newLine;
}

getRouterEditable(){
  let editable = this.formData['header'].cuttingSteps;
  return editable != '0';
}

addLine(key, model = null) {
  let newLine;
  newLine = this.getLineModel(key, model);
  let seqKey = "sequence";
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
          value = null;
      } else if (attr == seqKey) {
          value = seq.toString();
      } else if (attr == 'stepId'){
         value = this.stepId;
      } else if ( attr == 'routingId'){
        value = this.id;
      } else if (attr == 'inOutType'){
        value = "O";
      }
      if (typeof value == 'undefined' || value === '')
          newLine[attr] = '';
      else {
          newLine[attr] = value;
          this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
      }
  });
  data.push(newLine);
 this.refreshCutPanelDetails.next(true);
}

setListData(data) {
  this.listData = data.routing;
  this.count = data.count;
}

}
