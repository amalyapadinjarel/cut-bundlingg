import { Injectable,EventEmitter } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PacksDetails, ratioDetails, StyleVarient } from '../models/packDeatils';
import { AlertUtilities } from 'app/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class PackingInstructionsSharedService {

  appKey = 'po';
  apiBase = 'packing-instructions';
  taskFlowName = 'PACKINGINSTRUCTIONS'
  editMode = false;
  id: number;
  poId: any;
  orderId: any;
  parentProductId: any;
  formData: any = {};
  solidPackData: any = {};
  ratioPackData: any = {};
  stepId: number;
  idlist: any[] = [];

  loading = true;
  headerLoading = true;
  linesLoading = false;
  packsDetailsLoading = true;
  solidPackLoading = true;
  ratioPackLoading = true;

  primaryKey = 'po';
  packsDetailsPrimaryKey = 'csPackId';
  cartonPrimaryKey = 'csPackId';
  solidPackPrimaryKey = 'orderLineId';
  lineKeys = ['packsDetails','carton'];
  selectedLines = {};
  packDetailsAttributes = ['sequence'];

  _packsDetailsSeq = 1;
  packsDetailsSeqIncBy = 1;

  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshCartonData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshpacksDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshcarton: BehaviorSubject<boolean> = new BehaviorSubject(false);
  validationEmitter: EventEmitter<any> = new EventEmitter<any>();

  selectedPage: number = 1;
  columnFilterValues;
  count;
  listData;
  params;

  cartonLoading = true;
  isCartonGenerated = false;

  styleVarientDetails: any;
  styleVarientDetailsCopy: any;
  constructor(private _cache: LocalCacheService,
    private inputService: TnzInputService,
    private _dialog: MatDialog,
    private alterUtil: AlertUtilities) {

    }

    init() {
      this.id = 0;
      this.editMode = false;
      this.refreshData = new BehaviorSubject(false);
      this.refreshpacksDetails = new BehaviorSubject(false);
      this.refreshcarton = new BehaviorSubject(false);
      this.formData = {};
      this.isCartonGenerated = false;
  }

  clear() {
      this.id = 0;
      this.editMode = false;
      this.refreshData.unsubscribe();
      this.refreshpacksDetails.unsubscribe();
      this.refreshcarton.unsubscribe();
      this.formData = {};
      this.isCartonGenerated = false;
  }
    get appPath() {
      return this.appKey + '.' + this.id;
    }

    get headerPath() {
        return this.appPath + '.header';
    }
   
    get packsDetailsPath() {
      return this.appPath + '.packsDetails';
    }

    get addPackPath() {
      return this.appPath + '.addPack';
    }

    get solidPackPath() {
      return this.appPath + '.solidPack';
    }

    get ratioPackPath() {
      return this.appPath + '.ratioPack';
    }

    get ratioPackHeaderPath() {
      return this.appPath + '.ratioPackHeader';
    }

    get cartonPath() {
      return this.appPath + '.carton';
    }

    get packsDetailsSeq() {
      this._packsDetailsSeq += this.packsDetailsSeqIncBy;
      return this._packsDetailsSeq - this.packsDetailsSeqIncBy;
    }

    get packsDetailsAttributes() {
      return ['noOfCartons','orderId','orderLineId', 'orderQty','parentProduct','po','productId','qntyPerCtn'
      ,'sequence','styleVariant','packType','short','excess','packedQty','uom','size','colorCode','colorValue','csId','color']
    }
    
    set packsDetailsSeq(value) {
      this._packsDetailsSeq = value + this.packsDetailsSeqIncBy;
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
      this._cache.setLocalCache('po', {});
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

    get packsDetailsRemovedKeysPath() {
      return this.appPath + '.packDetailsRemovedKeys';
    }

    get solidPackRemovedKeysPath() {
      return this.appPath + '.solidPackRemovedKeys'
    }

    get cartonRemovedKeysPath() {
      return this.appPath + '.cartonRemovedKeys';
    }

    getHeaderAttributeValue(key) {
      let val = this.inputService.getInputValue(this.getHeaderAttrPath(key));
      val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
      return val;
    } 
   
    getPacksDetailsEditable(attr = null) {
      let editable = this.editMode && this.poId && this.orderId && this.parentProductId;
      return editable;
    }

    getPacksDetailsPath(mainIndex,line, attr) {
      return this.appPath + '.' + mainIndex + '[' + line + '].' + attr; 

    }

    getAddPacksDetailsPath(line,attr) {
      return this.addPackPath + '[' + line + '].' + attr;
    }

    getSolidPackDetailsPath(line,attr){
      return this.solidPackPath + '[' + line + '].' + attr;
    }

    getRatioPackDetailsPath(line,attr){
      return this.ratioPackPath + '[' + line + '].' + attr;
    }

    getRatioPacksHeaderPath(line,attr){
      return this.ratioPackHeaderPath + '[' + line + '].' + attr;
    }

    getRatioHeaderFromKey(mainIndex,attr){
      return this.appPath + '.' + mainIndex + '.' + attr;
    }

    getHeaderEditable(attr, primaryKey) {
      let editable = this.editMode;
      let nonEditableAttrs = ['partnerName', 'so', 'style','po','delivery','orderQnty','packedQnty','totalQnty','cartons','description'];// attributes that cannot be edited after creation
      if (this.poId && this.orderId && this.parentProductId && nonEditableAttrs.indexOf(attr) > -1) {
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

    deleteSolidLine(key, index, mainIndex) {
      let linePrimaryKey = this[key + 'PrimaryKey'];
      let data = this.formData[key].grpData[mainIndex];
      let path = this.appPath + '.' + mainIndex;
      //  + '[' + index + ']' ; 
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
      this.refreshpacksDetails.next(true);
    }

  deleteRatioLine(key, index, mainIndex) {
    let linePrimaryKey = this[key + 'PrimaryKey'];
    let data = this.formData[key].grpData;
    let path = this.appPath + '.' + mainIndex;
    let cache = this._cache.getCachedValue(path)
    if (cache && cache.length > index)
        cache.splice(index, 1);
    this._cache.setLocalCache(path, cache);
    let model = data[index];
    data.splice(index, 1);
    let keyData = this.formData[key].grpKey;
    keyData.splice(index,1)
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
    this.refreshpacksDetails.next(true);
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
      case 'packsDetails':
          newLine = model ? new PacksDetails(model) : new PacksDetails({});
          break;
      case 'ratioDetails':
        newLine = model ? new ratioDetails(model) : new ratioDetails({});
        break;
      default:
          break;
  }
  return newLine;
}



setListData(data) {
  this.listData = data.packingInstructions;
  this.count = data.count;
}


addLineWithData(key, model = null,modelData,length,keyIndex) {
  let newLine;
  newLine = this.getLineModel(key, model);
  let seqKey = "sequence";
  // let data = this.formData[key];
  let attributes = this[key + 'Attributes'];
  let path = this.appPath;
  let primaryKey = this[key + 'PrimaryKey'];
  // let newIndex = keyIndex;
  if (length == 0 && keyIndex == 0) {
      this.resetSeq(key);
  }
  let seq = this[key + 'Seq'];
  attributes.forEach(attr => {
      let value;
      if (model) {
          value = model[attr];
      }
      if(modelData) {
        value = modelData[attr];
      }
      if (attr == primaryKey) {
          value = null;
      } else if (attr == seqKey) {
          value = seq.toString();
      } 
      if(attr == 'csId' && modelData.packType == 'Ratio') {
        value = this.id;
      }
      if (typeof value == 'undefined' || value === '')
          newLine[attr] = '';
      else {
          newLine[attr] = value;
          this.inputService.updateInput(path + '.' + keyIndex + '[' + length + '].' + attr, value);
      }
  });
  // data.push(newLine);
}

addNewRatioLine(key, model = null,modelData) {
  let newLine;
  newLine = this.getLineModel(key, model);
  let seqKey = "sequence";
  // let data = this.formData[key];
  this.formData[key].grpKey.push(modelData);
  this.formData[key].grpData.push(modelData);
  let length = this.formData[key].grpData.length -1 ;
  let attributes = this[key + 'Attributes'];
  let path = this.appPath;
  let primaryKey = this[key + 'PrimaryKey'];
  // let newIndex = keyIndex;
  if (this.formData[key].grpKey.length == 0) {
      this.resetSeq(key);
  }
  let seq = this[key + 'Seq'];
  attributes.forEach(attr => {
      let value;
      if (model) {
          value = model[attr];
      }
      if(modelData) {
        value = modelData[attr];
      }
      if (attr == primaryKey) {
          value = null;
      } else if (attr == seqKey) {
          value = seq.toString();
      } 
      if(attr == 'csId' && modelData.packType == 'Ratio') {
        value = this.id;
      }
      if (typeof value == 'undefined' || value === '')
          newLine[attr] = '';
      else {
          newLine[attr] = value;
          this.inputService.updateInput(path + '.' + length + '.' + attr, value);
      }
  });
  // data.push(newLine);
}

grpNewLines(modelData,key){
  modelData.forEach(elem=>{
    let flag = false;
    this.formData[key].grpKey.forEach(val=>{
      if(elem.packType == 'SOLID' && val.packType == elem.packType && val.qntyPerCtn == elem.qntyPerCtn){
        flag = true;
      }
    })
    if(!flag){
      this.formData[key].grpKey.push({packType: elem.packType, qntyPerCtn: elem.qntyPerCtn, noOfCartons: elem.noOfCartons, csPackId: elem.csPackId, orderQty: elem.orderQty});
      this.formData[key].grpData.push([]);
    }
  })
  this.formData[key].grpKey.forEach((val,index)=>{
    modelData.forEach(elem=>{
      if(elem.packType == 'SOLID' && val.packType == elem.packType && val.qntyPerCtn == elem.qntyPerCtn){
        this.formData[key].grpData[index].push(elem);
        this.addLineWithData(key,key,elem,this.formData[key].grpData[index].length -1,index);
      }
    });
  });
  this.formData[key].length = this.formData[key].grpKey.length;
}

setIsCartonGenerated(cartonCount){
  if(cartonCount > 0){
    this.isCartonGenerated = true; 
  }
  else{
    this.isCartonGenerated = false;
  }
}

validateQuantity(saveData) : any{
  let isValid = true;
  this.styleVarientDetailsCopy = this.generateNewCopy(this.styleVarientDetails);
  saveData.packsDetails.forEach(elem=>{
    if(elem.active){
      null;
    }
    else{
      if(elem.csPack && (elem.orderQty || elem.noOfCartons)){
        let csPackId = elem.csPackId;
        let qtyDiff = 0;
        let pId = 0
        let flag = false;
        pId = this.formData['packsDetails'].grpData.forEach(x=>{
          if(flag){
            return pId;
          }
          if(x.packType && x.csPackId == csPackId){
            flag = true;
            qtyDiff = Number(elem.noOfCartons) - Number(x.noOfCtn)
            x.color.forEach(y=>{
              y.forEach(z=>{
                z.size.forEach(a=>{
                    if(a.value){
                      this.calcQuantity(a.productId,Number(a.value)*qtyDiff);
                    }
                })
              })
            })
          }
          else{
            x.forEach(y=>{
              if(y.csPackId == csPackId){
                qtyDiff = Number(elem['csPackId'])-Number(x.orderQty);
                flag = true;
                pId = y.productId;
                this.calcQuantity(y.productId,qtyDiff)
              }
            })
          }
        })
      }
      else{
        if(elem.packType == 'SOLID'){
          this.calcQuantity(elem.productId,Number(elem.orderQty));
        }
        else{
          let noOfCtn = elem.noOfCartons;
          elem.size.forEach(x=>{
            this.calcQuantity(x.productId,Number(noOfCtn)*Number(x.value))
          })
        }
      }

    }
  })
  let msg = ""
  let productIdArray = [];
  this.styleVarientDetails.forEach(element => {
    if(Number(element.packQnty) > Number(element.orderQty)){
      msg = (msg != "" ? msg + '  ': '') + element.productName;
      isValid = false;
      productIdArray.push(element.productId);
    }
  });
  this.styleVarientDetails = this.generateNewCopy(this.styleVarientDetailsCopy)
  if(!isValid){
    msg = 'Failed to save. Entered quantity is more than order quantity for '+msg;
    this.validationEmitter.emit({'error': productIdArray});
    return msg;
  }
  return true;
}

calcQuantity(productId,value){
  this.styleVarientDetails.forEach(elem=>{
    if(elem.productId == productId){
      elem.packQnty = Number(elem.packQnty) + value
    }
  })
}

generateNewCopy(model){
  let data = [];
  model.forEach(elem=>{
    data.push(new StyleVarient(elem));
  });
  return data;
}


}