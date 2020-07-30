import { Injectable,EventEmitter } from '@angular/core';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PacksDetails, ratioDetails, StyleVarient } from '../models/packDeatils';
import { AlertUtilities } from 'app/shared/utils';
import { number } from 'app/shared/directives/validators/number';

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
  styleId:any;
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
  lineKeys = ['packsDetails'];
  selectedLines = [];
  packDetailsAttributes = ['sequence'];

  _packsDetailsSeq = 1;
  packsDetailsSeqIncBy = 1;

  _addSolidPacksDetailsSeq = 1;
  addsolidPacksDetailsSeqIncBy = 1;

  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshCartonData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshpacksDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshcarton: BehaviorSubject<boolean> = new BehaviorSubject(false);
  updatePackDetails: BehaviorSubject<boolean> = new BehaviorSubject(false);
  validationEmitter: EventEmitter<any> = new EventEmitter<any>();

  selectedPage: number = 1;
  columnFilterValues;
  count;
  cartonCount;
  listData;
  params;

  cartonLoading = true;
  isCartonGenerated = false;

  styleVarientDetails: any;
  styleVarientDetailsCopy: any;
  refreshList: Boolean = false;

  totalPacks: any;
  constructor(private _cache: LocalCacheService,
    private inputService: TnzInputService,
    private _dialog: MatDialog,
    private alterUtil: AlertUtilities) {

    }

    init() {
      this.id = 0;
      this.styleId = 0;
      this.editMode = false;
      this.refreshData = new BehaviorSubject(false);
      this.refreshpacksDetails = new BehaviorSubject(false);
      this.refreshcarton = new BehaviorSubject(false);
      this.formData = {};
      this.isCartonGenerated = false;
      this.totalPacks = 0;
  }

  clear() {
      this.id = 0;
      this.styleId = 0;
      this.editMode = false;
      this.refreshData.unsubscribe();
      this.refreshpacksDetails.unsubscribe();
      this.refreshcarton.unsubscribe();
      this.formData = {};
      this.isCartonGenerated = false;
      this.totalPacks = 0;
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

    get rePackReasonPath() {
      return this.appPath + '.rePackReason';
    }

    get packsDetailsSeq() {
      this._packsDetailsSeq += this.packsDetailsSeqIncBy;
      return this._packsDetailsSeq - this.packsDetailsSeqIncBy;
    }

    get packsDetailsAttributes() {
      return ['noOfCartons','orderId','orderLineId', 'orderQty','parentProduct','po','productId','qntyPerCtn'
      ,'sequence','styleVariant','packType','short','excess','packedQty','uom','size','colorCode','colorValue','csId','color','packQty','prePack','packingMethod'];
    }
    
    set packsDetailsSeq(value) {
      this._packsDetailsSeq = value + this.packsDetailsSeqIncBy;
    }

    get addSolidPacksDetailsSeq() {
      this._addSolidPacksDetailsSeq += this.addsolidPacksDetailsSeqIncBy;
      return this._addSolidPacksDetailsSeq - this.addsolidPacksDetailsSeqIncBy;
    }

    set addSolidPacksDetailsSeq(value) {
      this._addSolidPacksDetailsSeq = value + this.addsolidPacksDetailsSeqIncBy;
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

    getPacksDetailsBasePath(mainIndex,line) {
      return this.appPath + '.' + mainIndex + '[' + line + ']'; 
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

    getRatioHeaderBasepath(mainIndex){
      return this.appPath + '.' + mainIndex ;
    }

    getRePackReasonBasePath(attr){
      return this.rePackReasonPath + '.' + attr ;
    }

    getHeaderEditable(attr, primaryKey) {
      let editable = this.editMode;
      let nonEditableAttrs = ['partnerName', 'so', 'style','po','delivery','orderQnty','packedQnty','totalPackQty','cartons'];// attributes that cannot be edited after creation
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
      let newLine = false;
      let data = this.formData[key].grpData[mainIndex];
      let model = data[index];
      this.reArrangeSequence(mainIndex,index,model.sequence,'SOLID');
      let linePrimaryKey = this[key + 'PrimaryKey'];
      let path = this.appPath + '.' + mainIndex;
      //  + '[' + index + ']' ; 
      let cache = this._cache.getCachedValue(path)
      if (cache && cache.length > index)
          cache.splice(index, 1);
      this._cache.setLocalCache(path, cache);
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
      else{
        newLine = true;
      }
      if (data.length == 0) {
          this.resetSeq(key)
      }
      this.refreshpacksDetails.next(true);
      
    }

  deleteRatioLine(key, index, mainIndex) {
    let data = this.formData[key].grpData;
    let model = data[index];
    this.reArrangeSequence(mainIndex+1,index,model.sequence,'RATIO');

    let linePrimaryKey = this[key + 'PrimaryKey'];
    let path = this.appPath + '.' + mainIndex;
    let cache = this._cache.getCachedValue(path)
    if (cache && cache.length > index)
        cache.splice(index, 1);
    this._cache.setLocalCache(path, cache);
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

  setSelectedLines(key, mainIndex, models) {
    this.selectedLines[mainIndex]= models;
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
          modelData.sequence = value;
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
  if (!this.formData[key].length) {
    this.formData[key].length = 1;
  }
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
  let notValidRatio = [];
  this.styleVarientDetailsCopy = this.generateNewCopy(this.styleVarientDetails);
  saveData.packsDetails.forEach(elem=>{
    if(elem.active){
      null;
    }
    else{
      if(elem.csPackId && (elem.orderQty || elem.noOfCartons || elem.packQty || elem.prePack)){
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
            qtyDiff = Number(elem.packQty) - Number(x.packQty);
            x.color.forEach(y=>{
              try{
                y.forEach(z=>{
                  z.size.forEach(a=>{
                    if(a.value){
                      this.calcQuantity(a.productId,(Number(a.value)/Number(x.sumOfRatios)) * qtyDiff);
                    }
                })
                })
              }
              catch(err){
                y.size.forEach(a=>{
                    if(a.value){
                      this.calcQuantity(a.productId,(Number(a.value)/Number(x.sumOfRatios)) * qtyDiff);
                    }
                })
              }
            })
            if((Number(elem.packQty) % Number(x.sumOfRatios)) != 0 || (Number(elem.packQty) < (Number(elem.prePack) * x.sumOfRatios))){
              notValidRatio.push(Number(x.sequence));
            }
          }
          else{
            try{
              x.forEach(y=>{
                if(y.csPackId == csPackId){
                  qtyDiff = Number(elem['orderQty'])-Number(y.orderQty);
                  flag = true;
                  pId = y.productId;
                  this.calcQuantity(y.productId,qtyDiff)
                }
              })
            }
            catch(err){
              if(x.csPackId == csPackId){
                qtyDiff = Number(elem['orderQty'])-Number(x.orderQty);
                flag = true;
                pId = x.productId;
                this.calcQuantity(x.productId,qtyDiff)
              }
            }
          }
        })
      }
      else if(elem.csPackId && ((elem.short || elem.short == "") || (elem.excess || elem.excess == "") || elem.sequence)){
        if(elem.short && elem.short != "" && elem.sumOfRatios && elem.sequence){
          if(Number(elem.short) % Number(elem.sumOfRatios) != 0)
            notValidRatio.push(Number(elem.sequence));
        }
        if(elem.excess && elem.excess != "" && elem.sumOfRatios && elem.sequence){
          if(Number(elem.excess) % Number(elem.sumOfRatios) != 0)
            notValidRatio.push(Number(elem.sequence));
        }
      }
      else{
        if(elem.packType == 'SOLID'){
          this.calcQuantity(elem.productId,Number(elem.orderQty));
        }
        else{
          let noOfCtn = elem.noOfCartons;
          let sumofRatios = Number(elem.qntyPerCtn)/Number(elem.prePack);
          try{
            elem.size.forEach(x=>{
              this.calcQuantity(x.productId,(Number(x.value)/sumofRatios)*Number(elem.packQty))
            })
            if((Number(elem.packQty) % sumofRatios != 0 ) || (Number(elem.packQty) < (Number(elem.prePack) * sumofRatios))){
              notValidRatio.push(Number(elem.sequence));
            }
          }
          catch(err){}
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
    if(notValidRatio.length != 0)
      this.validationEmitter.emit({'error': productIdArray,'packQtyNotValidSeq': notValidRatio});
    else
      this.validationEmitter.emit({'error': productIdArray});
    return msg;
  }
  if(notValidRatio.length != 0 ){
    msg = 'Enter valid Data'
    this.validationEmitter.emit({'packQtyNotValidSeq': notValidRatio});
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

reArrangeSequence(mainIndex,index,delSeq,type){
  this.formData['packsDetails'].grpKey.forEach((elem,index1)=>{
    if(index1 == mainIndex){
      if(elem && elem.packType == 'SOLID'){
        this.formData['packsDetails'].grpData[index1].forEach((element,index2)=>{
          if(index2 >= index && element.csPackId){
            element.sequence = Number(element.sequence)-1;
            this._cache.setLocalCache(this.getPacksDetailsBasePath(index1,index2), {'csPackId':element.csPackId,'sequence':element.sequence});
          }
          else if(index2 >= index){
            let seq = this.inputService.getInputValue(this.getPacksDetailsPath(index1,index2, 'sequence'));
            this.inputService.updateInputCache(this.getPacksDetailsPath(index1,index2, 'sequence'),seq-1)
          }
        })
      }
      if(elem && elem.packType == 'RATIO' && type == 'RATIO'){
        if(Number(elem.sequence) > Number(delSeq)){
          if(elem.csPackId){
            elem.sequence = Number(elem.sequence)-1;
            this._cache.setLocalCache(this.getRatioHeaderBasepath(index1-1), {'csPackId':elem.csPackId,'sequence':elem.sequence});
            this.updatePackDetails.next(true);
          }
          else{
            elem.sequence = Number(elem.sequence)-1;
            let seq = this.inputService.getInputValue(this.getRatioHeaderFromKey(index1, 'sequence'));
            this.inputService.updateInputCache(this.getRatioHeaderFromKey(index1, 'sequence'),Number(seq)-1);
            this.updatePackDetails.next(true);
          }
        }
      }
      if(elem && elem.packType == 'RATIO' && type == 'SOLID'){
        if(Number(elem.sequence) > Number(delSeq)){
          if(elem.csPackId){
            elem.sequence = Number(elem.sequence)-1;
            this._cache.setLocalCache(this.getRatioHeaderBasepath(index1), {'csPackId':elem.csPackId,'sequence':elem.sequence});
            this.updatePackDetails.next(true);
          }
          else{
            elem.sequence = Number(elem.sequence)-1;
            let seq = this.inputService.getInputValue(this.getRatioHeaderFromKey(index1, 'sequence'));
            this.inputService.updateInputCache(this.getRatioHeaderFromKey(index1, 'sequence'),Number(seq)-1);
            this.updatePackDetails.next(true);
          }
        }
      }
    }
    else if(index1 > mainIndex){
      if(elem && elem.packType == 'SOLID'){
        this.formData['packsDetails'].grpData[index1].forEach((element,index2)=>{
          if(Number(element.sequence) > Number(delSeq)){
            if(element.csPackId){
              element.sequence = Number(element.sequence)-1;
              this._cache.setLocalCache(this.getPacksDetailsBasePath(index1,index2), {'csPackId':element.csPackId,'sequence':element.sequence});
            }
            else{
              
              let seq = this.inputService.getInputValue(this.getPacksDetailsPath(index1,index2, 'sequence'));
              this.inputService.updateInputCache(this.getPacksDetailsPath(index1,index2, 'sequence'),seq-1);
              element.sequence = seq-1;
            }
          }
        })
      }
      if(elem && elem.packType == 'RATIO' && type == 'RATIO'){
        if(Number(elem.sequence) > Number(delSeq)){
          if(elem.csPackId){
            elem.sequence = Number(elem.sequence)-1;
            this._cache.setLocalCache(this.getRatioHeaderBasepath(index1-1), {'csPackId':elem.csPackId,'sequence':elem.sequence});
            this.updatePackDetails.next(true);
          }
          else{
            elem.sequence = Number(elem.sequence)-1;
            let seq = this.inputService.getInputValue(this.getRatioHeaderFromKey(index1, 'sequence'));
            this.inputService.updateInputCache(this.getRatioHeaderFromKey(index1, 'sequence'),Number(seq)-1);
            this.updatePackDetails.next(true);
          }

        }
      }
      if(elem && elem.packType == 'RATIO' && type == 'SOLID'){
        if(Number(elem.sequence) > Number(delSeq)){
          if(elem.csPackId){
            elem.sequence = Number(elem.sequence)-1;
            this._cache.setLocalCache(this.getRatioHeaderBasepath(index1), {'csPackId':elem.csPackId,'sequence':elem.sequence});
            this.updatePackDetails.next(true);
          }
          else{
            elem.sequence = Number(elem.sequence)-1;
            let seq = this.inputService.getInputValue(this.getRatioHeaderFromKey(index1, 'sequence'));
            this.inputService.updateInputCache(this.getRatioHeaderFromKey(index1, 'sequence'),Number(seq)-1);
            this.updatePackDetails.next(true);
          }

        }
      }
    }
    else if(index1 < mainIndex){
      if(elem && elem.packType == 'SOLID'){
        this.formData['packsDetails'].grpData[index1].forEach((element,index2)=>{
          if(Number(element.sequence) > Number(delSeq)){
            if(element.csPackId){
              element.sequence = Number(element.sequence)-1;
              this._cache.setLocalCache(this.getPacksDetailsBasePath(index1,index2), {'csPackId':element.csPackId,'sequence':element.sequence});
            }
            else{
              
              let seq = this.inputService.getInputValue(this.getPacksDetailsPath(index1,index2, 'sequence'));
              this.inputService.updateInputCache(this.getPacksDetailsPath(index1,index2, 'sequence'),seq-1);
              element.sequence = seq-1;
            }
          }
        })
      }
      if(elem && elem.packType == 'RATIO' && type == 'RATIO'){
        if(Number(elem.sequence) > Number(delSeq)){
          if(elem.csPackId){
            elem.sequence = Number(elem.sequence)-1;
            this._cache.setLocalCache(this.getRatioHeaderBasepath(index1-1), {'csPackId':elem.csPackId,'sequence':elem.sequence});
            this.updatePackDetails.next(true);
          }
          else{
            elem.sequence = Number(elem.sequence)-1;
            let seq = this.inputService.getInputValue(this.getRatioHeaderFromKey(index1, 'sequence'));
            this.inputService.updateInputCache(this.getRatioHeaderFromKey(index1, 'sequence'),Number(seq)-1);
            this.updatePackDetails.next(true);
          }

        }
      }
      if(elem && elem.packType == 'RATIO' && type == 'SOLID'){
        if(Number(elem.sequence) > Number(delSeq)){
          if(elem.csPackId){
            elem.sequence = Number(elem.sequence)-1;
            this._cache.setLocalCache(this.getRatioHeaderBasepath(index1), {'csPackId':elem.csPackId,'sequence':elem.sequence});
            this.updatePackDetails.next(true);
          }
          else{
            elem.sequence = Number(elem.sequence)-1;
            let seq = this.inputService.getInputValue(this.getRatioHeaderFromKey(index1, 'sequence'));
            this.inputService.updateInputCache(this.getRatioHeaderFromKey(index1, 'sequence'),Number(seq)-1);
            this.updatePackDetails.next(true);
          }

        }
      }
    }
  })
}

findMaxSequence(){
  let cache = this._cache.getCachedValue(this.packsDetailsRemovedKeysPath)
  let maxSeq = 0;
  this.formData['packsDetails'].grpData.forEach((x,index)=>{
    if(x && x.packType == 'RATIO'){
      if(x.csPackId){
        if(cache && cache.findIndex(a=> a = Number(x.csPackId))){
          if(maxSeq < Number(x.sequence)){
            maxSeq = Number(x.sequence);
          }
        }
        else{
          if(maxSeq < Number(x.sequence)){
            maxSeq = Number(x.sequence);
          }
        }
      }
      else{
        let seq = this.inputService.getInputValue(this.getRatioHeaderFromKey(index, 'sequence'));
        if(maxSeq < Number(seq)){
          maxSeq = Number(seq);
        }
      }
    }
    else{
      x.forEach((y,index2)=>{
        if(y.csPackId){
          if(cache && cache.findIndex(a=> a = Number(y.csPackId))){
            if(maxSeq < Number(y.sequence)){
              maxSeq = Number(y.sequence);
            }
          }
          else{
            if(maxSeq < Number(y.sequence)){
              maxSeq = Number(y.sequence);
            }
          }
        }
        else{
          let seq = this.inputService.getInputValue(this.getPacksDetailsPath(index,index2, 'sequence'));
          if(maxSeq < Number(seq)){
            maxSeq = Number(seq);
          }
        }
      })
    }
  })
  this.packsDetailsSeq = maxSeq;
}

setCartonListData(data,key){
  this.formData[key] = data.cartonDetails;
  this.cartonCount = data.count;
}

fetchAllPackIds(){
  let ids = [];
  const packDetails = this.formData['packsDetails'].grpData;
  if(packDetails){
    packDetails.forEach(elem=>{
      try{
        if(elem){
          elem.forEach(solid=>{
            if(solid.csPackId)
              ids.push(solid.csPackId);
          })
        }
      }
      catch(err){
        if(elem && elem.csPackId){
          ids.push(elem.csPackId);
        }
      }
    })
  }
  return ids;
}

}