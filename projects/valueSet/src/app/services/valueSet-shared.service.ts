import { Injectable, ViewChild } from '@angular/core';
import { LocalCacheService, ApiService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { BehaviorSubject } from 'rxjs';
import { SmdDataTable } from 'app/shared/component';
import { ValidValue } from '../model/valueSet.model';
import { ExportImportService } from 'app/shared/services/export-import.service';
import { AlertUtilities } from 'app/shared/utils';

// import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ValueSetSharedService {
 
  selectedListLinesId = [];
  appKey = 'valueSet';
  apiBase = 'valueSet';
  taskFlowName = 'VALUESET'
  editMode = false;
  valueSet:string='--';
  id: number;
  formData: any = {};
  count;
  listData;
  validationType;
  dateType;
  params;
  save;
  columnFilterValues;
  selectedPage: number =1;
  primaryKey = 'setId';
  validDetailsPrimaryKey = 'valueId';
  loading = true;
  reviseMode: boolean;
  validDetailsAttributes = Object.keys(new ValidValue());
 
  refreshOpertionTable: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  _validDetailsSeq = 10;
  validDetailsSeqIncBy = 5;
  headerLoading = true;
  validDetailsLoading = true;
  selectedLines = {};
  lineKeys = ['validDetails'];
  importFileDetails: any = [];
  newimportLines: any = [];
  duplicateLines: any = [];
//   addressLoading =false;
  constructor(private _cache: LocalCacheService ,
    private inputService: TnzInputService,
    private exportImportService: ExportImportService,
    private apiService: ApiService,
    private alertutils: AlertUtilities) { }
  init() {
    this.editMode = false;
    this.id = 0;
    this.formData = {};
    this.validationType = 'N';
    this.importFileDetails = [];
 }

  setListData(data) {
    this.listData = data.valueSet;
    this.count = data.count;
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

get validDetailsRemovedKeysPath() {
  return this.appPath + '.validDetailsRemovedKeys';
}
getHeaderEditable(attr, primaryKey) {
  let editable = this.editMode;
 
  let nonEditableAttrs = ['division','facility','setName','listType','dataType','setAuthor','validationType','shortCode'];// attributes that cannot be edited after creation
  // if (this.division != '--' && nonEditableAttrs.indexOf(attr) > -1) {
    if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
      editable = false
  }
  // let editableAttrs = ['description','active'];// attributes that can be edited 

  return editable;
}
get validDetailsSeq() {
  this.validDetailsSeq += this.validDetailsSeqIncBy;
  return this.validDetailsSeq - this.validDetailsSeqIncBy;
}

//setter for roleUsersSeq
set validDetailsSeq(value) {
  this.validDetailsSeq = value + this.validDetailsSeqIncBy;
}
getValidValueEditable(attr = null) {
  let editable = this.editMode || this.id == 0;
  return editable;
}

setFormData(data) {
  this.formData = data;
}

setFormHeader(data) {
  this.formData['header'] = data;
}

resetAll() {
  this.inputService.resetSharedData();
}
setSelectedLines(key, models) {
  this.selectedLines[key] = models;
}
getValidDetailsPath(line, attr) {
  return this.validDetailsPath + '[' + line + '].' + attr;
}
get validDetailsPath() {
  return this.appPath + '.validDetails';
}
setLines(key, data) {
  if (!data || !data.length)
      this.formData[key] = this[key] = [];
  else {
      this[key] = JSON.parse(JSON.stringify(data));
      this.formData[key] = data;
  }
}
// setLinesFromCache(key, data) {
//   console.log('setLinesFromCache-----')
//   let cache;
//   // let linePrimaryKey = this[key + 'PrimaryKey'];
//   let linePrimaryKey = this.validDetailsPrimaryKey;
//   console.log('linePrimaryKey---'+linePrimaryKey)
//   console.log('key ----RemovedKeysPath---',key + 'RemovedKeysPath');
//   cache = this.inputService.getCache(this[key + 'RemovedKeysPath']);
//   console.log('cache---'+cache)
//   if (cache) {
//       cache.forEach((line) => {
//           let i = data.findIndex(elem => { return elem[linePrimaryKey] == line });
//           if (i > -1) {
//               data.splice(i, 1);
//           }
//       });
//   }
//   console.log(this[key + 'Path'], key, 'jhhhhhhhhhhhhh');
  
//   cache = this.inputService.getCache(this[key + 'Path']);
//   console.log('cache---'+cache)
//   if (cache && cache.length) {
//       cache.forEach((line, lineIdx) => {
//           if (line) {
//               if (line[linePrimaryKey] == 0) {
//                   let newLine = this.getLineModel(key);
//                   Object.keys(this.getLineModel(key)).forEach(attr => {
//                       if (line[attr])
//                           newLine[attr] = line[attr];
//                       else
//                           newLine[attr] = ''
//                   });
//                   newLine[linePrimaryKey] = 0;
//                   data.splice(lineIdx, 0, newLine);
//               }
//           }
//       });
//   }
//   return data;
// }

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

  // switch (key) {
  //     case 'Validdetail':
          newLine = model ? new ValidValue(model) : new ValidValue();
          // console.log('newLine----'+newLine)
  //         break;
  //       default:
  //         break;
  // }
  return newLine;
}
//method to load data 
// refreshLines(key) {

//   switch (key) {

//     case 'validDetail':
//       this.refreshvaliddetail.next(true);
    
//     default:
//       break;
//   }
// }


addLine(key, model = null) {
//   console.log('addLine---'+key)

//   let newLine;
//   newLine = this.getLineModel(key, model);
//   //let seqKey = this.getSeqKey(key);
//   let data = this.formData[key];
//   let attributes = this[key + 'Attributes'];
//   let path = this[key + 'Path'];
//   let primaryKey = this[key + 'PrimaryKey'];
//   let newIndex = data.length;
//   // newIndex = newIndex+10;
//   // if (newIndex == 0) {
//   //     this.resetSeq(key);
//   // }
//  //let seq = this[key + 'Seq'];
//   attributes.forEach(attr => {
//       let value;
//       if (model) {
//           value = model[attr];
//       }
//     //  commented by shery
//       if (attr == primaryKey) {
//           value = 0;
//       } 
//       if (attr == this.validDetailsPrimaryKey) {
//         value = 0;
//     } 
//       // else if (attr == 'sequence') {
//       //     value = newIndex+10;
//       // }
//       if (typeof value == 'undefined' || value === '')
//           newLine[attr] = '';
//       else {
//           newLine[attr] = value;
//           this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
//       }
//   });
//   data.push(newLine);
//   this.refreshLines(key);

const newLine = this.getLineModel(key, model);
        let seqKey = 'sequence';
        let data = this.formData[key];
        let attributes = this[key + 'Attributes'];
        let path = this[key + 'Path'];
        let primaryKey = this[key + 'PrimaryKey'];
        let newIndex = data.length;
        let operationSequenceList = data.map(model => model.sequence);
        let maxopSequence = operationSequenceList.length ? Math.max(...operationSequenceList) : 0;
        attributes.forEach(attr => {
            let value;
            if (model) {
                // value = model[attr];
            }
            //       if (attr == primaryKey) {
//           value = 0;
//       } 
            if (attr == this.validDetailsPrimaryKey) {
                      value = 0;
                  } 
            if (attr == primaryKey) {
                value = 0;
            } else if (attr == 'sequence') {
                value = maxopSequence + 1
            } else if (attr == 'routingId') {
                value = this.id;
            } else if (attr == 'inOutType') {
                value = 'O';
            }
            if (typeof value == 'undefined' || value === '') {
                newLine[attr] = '';
            } else {
                newLine[attr] = value;
                this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
            }
        });
        data.push(newLine);
        this.refreshOpertionTable.next(true);
}

resetSeq(key) {
  this['_' + key + 'Seq'] = 1;
}

refreshLines(key) {
  
          this.refreshOpertionTable.next(true);
      
  
}

  //method to delete lines
  deleteLine(key, index) {
    // let linePrimaryKey = this[key + 'PrimaryKey'];
    // let data = this.formData[key];
    // let path = this[key + 'Path'];
    // let model = data[index];

   // if (model[linePrimaryKey] == 0) { // delte enabled only when id=0(create before save)
      // data.splice(index, 1);
      // let cache = this._cache.getCachedValue(path)

      // if (cache && cache.length > index) {
      //   cache.splice(index, 1);
      //   this._cache.setLocalCache(path, cache);
      // }
      // if (data.length == 0) 
      // this.refreshLines(key);
   // }
   if (key != -1) {
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
    this.refreshOpertionTable.next(true);
}

  }
  
resetLines() {
  this.lineKeys.forEach(key => {
      if (this[key].length)
          this.formData[key] = JSON.parse(JSON.stringify(this[key]));
      else
          this.formData[key] = [];
          this.refreshOpertionTable.next(true);
  })
}

exportDataToFile(isAll: Boolean,data?){
  if(!isAll)
    this.exportImportService.writeToFile(data,"TRENDZ-Value-Set-Export","","tnzdat");
  else{
    this.exportImportService.writeToFile(data,"TRENDZ-Value-Set-Export",this.id,"tnzdat");
  }
}

clearImportData(){
  this.importFileDetails = [];
  this.newimportLines = [];
  this.duplicateLines = [];
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
    console.log('res--------------------     ',res);
    


    res.forEach(shortCode=>{
      // const division =  this.setLovData(shortCode['division'], '2');
      // shortCode['division'] = division;
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



 updateFinalImportData(data) : Promise<any>
{
  return new Promise(async (resolve, reject) => {
  for(let i= 0;i< data.length; i++)
  {

    if(data[i].header.division==''
     || data[i].header.facility =='' || data[i].header.shortCode =='' || data[i].header.setName==''||
      data[i].header.listType==''|| data[i].header.dataType=='' || data[i].header.validationType==''
      ){
        this.alertutils.showAlerts("Please fill mandatory fields !")
     
    }else{
    const division  =   await this.setLovData(data[i].header.division, '1')
    data[i].header.division = division;


    const facility  =   await this.setLovData(data[i].header.facility, '2')
    data[i].header.facility = facility;


    const table  =   await this.setLovData(data[i].header.tnztable, '3')
    data[i].header.tnztable = table;
    }

 }

   resolve(data);
  }); 
}


setLovData(element, val): Promise<any> {
  return new Promise(async (resolve, reject) => {
      let observableValue;
      let value;
      if (val == '1') {
          observableValue = this.apiService.get('/lovs/division')
          observableValue.subscribe(retData => {
              value = retData.data.find(item => item.label === element)

              resolve(value);
          })
      }
      if (val == '2') {
        observableValue = this.apiService.get('/lovs/facility?facilityFromDivision=2')
        observableValue.subscribe(retData => {
            value = retData.data.find(item => item.label === element)
            resolve(value);
        })
    }
    if (val == '3') {
      observableValue = this.apiService.get('/lovs/table')
      observableValue.subscribe(retData => {
          value = retData.data.find(item => item.label === element)
          resolve(value);
      })
  }

  })

}
}
