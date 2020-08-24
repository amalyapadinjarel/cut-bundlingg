import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { CutPanelDetails } from '../../../../CutRegister/src/app/models/cut-register.model';
import { ParametersDetails, TemplatesDetails, StyleSheetDetails, RolesDetails } from '../models/concurrent-programs-models';
import { ExportImportService } from 'app/shared/services/export-import.service';

@Injectable({
  providedIn: 'root'
})
export class ConcurrentProgramSharedService {

  appKey = 'concurrentPrograms';
  apiBase = 'concurrent-programs';
  taskFlowName = 'CONCURRENT_PROGRAMS'
  editMode = false;
  id: number;
  formData: any = [];
  parametersDetails: any = [];
  templatesDetails: any = [];
  styleSheetDetails: any = [];
  rolesDetails: any = [];
  idlist: any[] = [];

  loading = true;
  headerLoading = true;
  linesLoading = false;
  parametersDetailsLoading = true;
  templatesDetailsLoading = true;
  styleSheetDetailsLoading = true;
  rolesDetailsLoading = true;

  primaryKey = 'pgmId';
  concurrentProgramsPrimaryKey = 'pgmId';
  parametersDetailsPrimaryKey = 'paramId';
  templatesDetailsPrimaryKey = 'fileId';
  styleSheetDetailsPrimaryKey = 'fileId';
  rolesDetailsPrimaryKey = 'securityId';

  lineKeys = ['parametersDetails','templatesDetails','styleSheetDetails','rolesDetails'];
  selectedLines = {};
  selectedListLinesId = [];
  parametersDetailsAttributes = ['displayOrder','parameter','valueSet','defaultValue','tfParam','fieldWidth','exclude','required','display','active','validation','pgmId','paramId'];
  templatesDetailsAttributes = ['active','company','division','facility','fileId','pgmId','fileName'];
  styleSheetDetailsAttributes = ['active','company','division','facility','fileId','pgmId','fileName'];
  rolesDetailsAttributes = ['securityId','roleName','startDate','endDate','active'];

  _parameterDetailsSeq = 1;
  parameterDetailsSeqIncBy = 1;
  _templatesDetailsSeq = 1;
  templatesDetailsSeqIncBy = 1;
  _styleSheetDetailsSeq = 1;
  styleSheetDetailsSeqIncBy = 1;
  _rolesDetailsSeq = 1;
  rolesDetailsSeqIncBy = 1;

  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshparametersDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshtemplatesDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshstyleSheetDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshrolesDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
  eventEmitter: EventEmitter<any> = new EventEmitter();
  templatesFiles: any = [];
  styleSheetFiles: any = [];

  selectedPage: number = 1;
  columnFilterValues;
  count;
  listData;
  params;
  importFileDetails: any = [];
  newimportLines: any = [];
  duplicateLines: any = [];
  parametersCount = 0;

  constructor(private _cache: LocalCacheService,
    private inputService: TnzInputService,
    private exportImportService: ExportImportService) {

  }

  init() {
    this.id = 0;
    this.editMode = false;
    this.refreshData = new BehaviorSubject(false);
    this.refreshparametersDetails = new BehaviorSubject(false);
    this.refreshtemplatesDetails = new BehaviorSubject(false);
    this.refreshstyleSheetDetails = new BehaviorSubject(false);
    this.refreshrolesDetails = new BehaviorSubject(false);
    this.formData = {};
    this.parametersDetails = [];
    this.templatesDetails = [];
    this.styleSheetDetails = [];
    this.rolesDetails = [];
    this.templatesFiles = [];
    this.styleSheetFiles = [];
    this.importFileDetails = [];
    this.newimportLines = [];
    this.duplicateLines = [];

    this._parameterDetailsSeq = 1;
    this._templatesDetailsSeq = 1;
    this._styleSheetDetailsSeq = 1;
    this._rolesDetailsSeq = 1;
  }

  clear() {
      this.id = 0;
      this.editMode = false;
      this.refreshData.unsubscribe();
      this.refreshparametersDetails.unsubscribe();
      this.refreshtemplatesDetails.unsubscribe();
      this.refreshstyleSheetDetails.unsubscribe();
      this.refreshrolesDetails.unsubscribe();
      this.formData = {};
      this.parametersDetails = [];
      this.templatesDetails = [];
      this.styleSheetDetails = [];
      this.rolesDetails = [];
      this.templatesFiles = [];
      this.styleSheetFiles = [];
      this.clearImportData();
  
      this._parameterDetailsSeq = 1;
      this._templatesDetailsSeq = 1;
      this._styleSheetDetailsSeq = 1;
      this._rolesDetailsSeq = 1;
  }
    get appPath() {
      return this.appKey + '.' + this.id;
    }

    get headerPath() {
        return this.appPath + '.header';
    }
   
    get concurrentProgramsDetailsPath() {
      return this.appPath + '.concurrentProgramsDetails';
    }

    get parametersDetailsPath() {
      return this.appPath + '.parametersDetails'
    }

    get templatesDetailsPath() {
      return this.appPath + '.templatesDetails'
    }

    get styleSheetDetailsPath() {
      return this.appPath + '.styleSheetDetails'
    }

    get rolesDetailsPath() {
      return this.appPath + '.rolesDetails'
    }

    get parametersDetailsSeq() {
      this._parameterDetailsSeq += this.parameterDetailsSeqIncBy;
      return this._parameterDetailsSeq - this.parameterDetailsSeqIncBy;
    }

    get templatesDetailsSeq() {
      this._templatesDetailsSeq += this.templatesDetailsSeqIncBy;
      return this._templatesDetailsSeq - this.templatesDetailsSeqIncBy;
    }

    get styleSheetDetailsSeq() {
      this._styleSheetDetailsSeq += this.styleSheetDetailsSeqIncBy;
      return this._styleSheetDetailsSeq - this.styleSheetDetailsSeqIncBy;
    }

    get rolesDetailsSeq() {
      this._rolesDetailsSeq += this.rolesDetailsSeqIncBy;
      return this._rolesDetailsSeq - this.rolesDetailsSeqIncBy;
    }
    
    set parametersDetailsSeq(value) {
      this._parameterDetailsSeq = value + this.parameterDetailsSeqIncBy;
    }

    set parametersDetailsSeqIncBy(value){
      this.parameterDetailsSeqIncBy = value;
    }

    set templatesDetailsSeq(value) {
      this._templatesDetailsSeq = value + this.templatesDetailsSeqIncBy;
    }

    set styleSheetDetailsSeq(value) {
      this._styleSheetDetailsSeq = value + this.styleSheetDetailsSeqIncBy;
    }

    set rolesDetailsSeq(value) {
      this._rolesDetailsSeq = value + this.rolesDetailsSeqIncBy;
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
      this._cache.setLocalCache('concurrentPrograms', {});
    }

    resetLines() {
      this.lineKeys.forEach(key => {
          if (this[key].length)
              this.formData[key] = JSON.parse(JSON.stringify(this[key]));
          else
              this.formData[key] = [];
          this["refresh" + key].next(true);
      })
    }

    clearImportData(){
      this.importFileDetails = [];
      this.newimportLines = [];
      this.duplicateLines = [];
    }

    get concurrentProgramsRemovedKeysPath() {
      return this.appPath + '.concurrentProgramsRemovedKeys';
    }

    get parametersDetailsRemovedKeysPath() {
      return this.appPath + '.parametersDetailsRemovedKeys';
    }

    get templatesDetailsRemovedKeysPath() {
      return this.appPath + '.templatesDetailsRemovedKeys';
    }

    get styleSheetDetailsRemovedKeysPath() {
      return this.appPath + '.styleSheetDetailsRemovedKeys';
    }

    get rolesDetailsRemovedKeysPath() {
      return this.appPath + '.rolesDetailsRemovedKeys';
    }

    getHeaderAttributeValue(key) {
      let val = this.inputService.getInputValue(this.getHeaderAttrPath(key));
      val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
      return val;
    } 
   
    getConcurrentProgramsDetailsEditable(attr = null) {
      let editable = this.editMode && this.id !== 0;
      return editable;
    }

    getParametersEditable(attr = null) {
      let editable = this.editMode;
      return editable;
    }

    getTemplatesEditable(attr = null) {
      let editable = this.editMode;
      return editable;
    }

    getStyleSheetEditable(attr = null) {
      let editable = this.editMode;
      return editable;
    }

    getRolesEditable(attr = null) {
      let editable = this.editMode;
      return editable;
    }

    getConcurrentProgramsDetailsPath(line, attr) {
      return this.concurrentProgramsDetailsPath + '[' + line + '].' + attr;
    }

    getParameterDetailsPath(line, attr) {
      return this.parametersDetailsPath + '[' + line + '].' + attr;
    }

    getTemplatesDetailsPath(line, attr) {
      return this.templatesDetailsPath + '[' + line + '].' + attr;
    }

    getStyleSheetDetailsPath(line, attr) {
      return this.styleSheetDetailsPath + '[' + line + '].' + attr;
    }

    getRolesDetailsPath(line, attr) {
      return this.rolesDetailsPath + '[' + line + '].' + attr;
    }

    getHeaderEditable(attr, primaryKey) {
      let editable = this.editMode;
      let nonEditableAttrs = ['shortCode'];// attributes that cannot be edited after creation
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
      this["refresh" + key].next(true);
    }

    resetSeq(key) {
      this['_' + key + 'Seq'] = 1;
      this[key + 'SeqIncBy'] = 1;
    }

    setSelectedLines(key, models) {
      this.selectedLines[key] = models;
  }

  setLines(key, data) {
    if (!data || !data.length) 
      this.formData[key] = this[key] = [];
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
      case 'parametersDetails':
          newLine = model ? new ParametersDetails(model) : new ParametersDetails({});
          break;
      case 'templatesDetails':
          newLine = model ? new TemplatesDetails(model) : new TemplatesDetails({});
          break;
      case 'styleSheetDetails':
          newLine = model ? new StyleSheetDetails(model) : new StyleSheetDetails({});
          break;
      case 'rolesDetails':
          newLine = model ? new RolesDetails(model) : new RolesDetails({});
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
      } else if (attr == 'pgmId'){
         value = this.id;
      } else if (attr == 'active'){
        value = 'Y'
      }
      if (typeof value == 'undefined' || value === '')
          newLine[attr] = '';
      else {
          newLine[attr] = value;
          this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
      }
  });
  newLine['newLine'] = true;
  this.inputService.updateInput(path + '[' + newIndex + '].' + 'newLine', true);
  data.push(newLine);
  this["refresh" + key].next(true);
}

setListData(data) {
  this.listData = data.concurrentPrograms;
  this.count = data.count;
}

resetAllInput() {
  this.inputService.resetSharedData();
}

exportDataToFile(isAll: Boolean,data?){
  if(isAll)
    this.exportImportService.writeToFile(data,"TRENDZ-Concurrent-program-export","","tnzdat");
  else{
    this.exportImportService.writeToFile(data,"TRENDZ-Concurrent-program-export",this.id,"tnzdat");
  }
}

fetchShortCodeFromImportDetails(){
  let importShortCode = [];
  if(this.importFileDetails){
    this.importFileDetails.forEach(element => {
      const header = element.header;
      if(header && header.shortCode){
        importShortCode.push(header.shortCode);
      }
    });
  }
  return importShortCode;
}

filterData(res){
  if(res && this.importFileDetails){
    const newLines = res.newShortCodes;
    if(newLines){
      newLines.forEach(newShortCode=>{
        this.findAndAddToArray(newShortCode,true)
      })
    }
    const duplicateLines = res.duplicates;
    if(duplicateLines){
      duplicateLines.forEach(duplicateShortCode=>{
        this.findAndAddToArray(duplicateShortCode,false)
      })
    }
  }
}

private findAndAddToArray(sc,isNew){
  let index = this.importFileDetails.findIndex((src)=>{
    return src.header.shortCode === sc;
  });
  if(index >= 0 && isNew){
    this.newimportLines.push(this.importFileDetails[index]);
  }
  if(index >= 0 && !isNew){
    this.duplicateLines.push(this.importFileDetails[index]);
  }
}

filterHeaderDetailsFromImportView(data){
  let headerData = [];
  if(data){
    data.forEach(res=>{
      if(res.header){
        headerData.push(res.header);
      }
    })
  };
  return headerData;
}

filterSelectedData(res){
  let finalImportData = [];
  if(res && this.importFileDetails){
    res.forEach(shortCode=>{
      let index = this.importFileDetails.findIndex((src)=>{
        return src.header.shortCode === shortCode;
      });
      if(index >= 0){
        finalImportData.push(this.importFileDetails[index]);
      }
    })
  }
  return finalImportData;
}

customValidation(){
  //Validate Required parameter
  let reqdParameter = this.inputService.getInputValue(this.getHeaderAttrPath('reqdParamCount'));
  let flag = false;
  if(Number(reqdParameter) > this.parametersCount){
    this.inputService.setError(this.getHeaderAttrPath('reqdParamCount'),"Required Parameter count cannot be greater than number of parameters(" + this.parametersCount+")");
    flag = true;
  }
  return flag;
}

onNewDocumentCreated() {
  this.listData = null;
  this.params = null;
}

}
