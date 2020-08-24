import { Injectable, ViewChild } from '@angular/core';
import { LocalCacheService, ApiService } from 'app/shared/services';
import { BehaviorSubject } from 'rxjs';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { UomDetails, ConversionDetails } from '../model/uom.model';
import { UomService } from './uom.service';
import { SmdDataTable } from 'app/shared/component/smd/smd-datatable';



@Injectable({
  providedIn: 'root'
})
export class UomSharedService {
  @ViewChild(SmdDataTable) dataTable: SmdDataTable;
  
  appKey = 'uom';
  apiBase = 'uom';
  taskFlowName = 'UOM'
  editMode = false;
  
  id: number;
  formData: any = {};
  count;
  listData;
  params;
  columnFilterValues;
  selectedPage: number =1;
  primaryKey = 'uomId';
  UomdetailPrimaryKey = 'uomId';
  ConversiondetailPrimaryKey = 'conversionId';
  selectedLines = {};

  lineKeys = ['Uomdetail', 'Conversiondetail'];

  UomdetailAttributes = Object.keys(new UomDetails());
  ConversiondetailAttributes = Object.keys(new ConversionDetails());
  loading = true;
  reviseMode: boolean;
  refreshOpertionTable: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshUomdetail: BehaviorSubject<boolean> = new BehaviorSubject(false);
  refreshConversiondetail: BehaviorSubject<boolean> = new BehaviorSubject(false);
  headerLoading = true;
  addressLoading =false;
  UomdetailLoading = true;
  ConversiondetailLoading = true;
  filterUomLines = [];
  convlines = false;
  constructor(  private _cache: LocalCacheService,private inputService: TnzInputService,private apiService: ApiService) { }
  init() {
    this.editMode = false;
    //this.division = '--';
    this.formData = {};
    this.id=0;
    this.refreshUomdetail = new BehaviorSubject(false);
    this.refreshConversiondetail = new BehaviorSubject(false);
}
clear() {
  this.id = 0;
  this.editMode = false;
  this.formData = {};
  this.refreshUomdetail.unsubscribe();
}
  setListData(data) {
    this.listData = data.uom;
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
setSelectedLines(key, models) {
  this.selectedLines[key] = models;
}
get headerPath() {
  return this.appPath + '.header';
}
getHeaderEditable(attr, primaryKey) {
  let editable = this.editMode;
 
  let nonEditableAttrs = ['categoryName']; 
    if (this.id != 0 && nonEditableAttrs.indexOf(attr) > -1) {
      editable = false
  }

  return editable;
}

getUomdetailPath(line, attr) {
  return this.UomdetailPath + '[' + line + '].' + attr;
}
get UomdetailPath() {
  return this.appPath + '.Uomdetail';
}
getConversiondetailPath(line, attr) {
  return this.ConversiondetailPath + '[' + line + '].' + attr;
}
get ConversiondetailPath() {
  return this.appPath + '.Conversiondetail';
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
getUomdetailsEditable(attr, idv = 0) {
  // let editable = this.editMode || this.id == 0;

  // return editable;

  let editable = this.editMode;
  const nonEditableAttrs = ['uomCode','uomName','symbol','baseUomFlag'];
  if (idv != 0 && nonEditableAttrs.indexOf(attr) > -1) {
      editable = false
  }
  return editable;
}
getConversiondetailsEditable(attr = null) {
  let editable = this.editMode || this.id == 0;
  return editable;
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

    case 'Uomdetail':
      newLine = model ? new UomDetails(model) : new UomDetails({});


      break;
    case 'Conversiondetail':
     newLine = model ? new ConversionDetails(model) : new ConversionDetails({});
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

  //method to load data 
  refreshLines(key) {

    switch (key) {

      case 'Uomdetail':
        this.refreshUomdetail.next(true);
        
        break;
      case 'Conversiondetail':
        this.refreshConversiondetail.next(true);
        break;
      default:
        break;
    }
  }
  addLine(key, model = null) {

    const newLine = this.getLineModel(key, model);
  
    let seqKey = 'sequence';
    let data = this.formData[key];
    let attributes = this[key + 'Attributes'];
    let path = this[key + 'Path'];
    let primaryKey = this[key + 'PrimaryKey'];
    let newIndex = data.length;
    // let newIndex = 0;
    if(key == "Conversiondetail"){
      this.setDefaultValues(newIndex);
      }
    let sequenceList = data.map(model => model.sequence);
    let maxSequence = sequenceList.length ? Math.max(...sequenceList) : 0;
    attributes.forEach(attr => {
        let value;
        if (model) {
            value = model[attr];
        }
        if (attr == primaryKey) {
            value = 0;
        
        } else if (attr == 'routingId') {
            value = this.id;
        } else if (attr == 'inOutType') {
            value = 'O';
        }
        if (attr == 'active') {value = 'Y'};
        if (typeof value == 'undefined' || value === '') {
            newLine[attr] = '';
        } else {
            newLine[attr] = value;
            this.inputService.updateInput(path + '[' + newIndex + '].' + attr, value);
        }
    });

    
   data.push(newLine);
  //  data.unshift(newLine);
  this.refreshLines(key);
 

  }

  setDefaultValues(newIndex) {
		//if (this._shared.id == 0) {


			this.getDefaultBaseUom().then( (res:any) => {
				let json = {
					label: res.label,
					value: res.value,
					shortCode: res.shortCode
        }

        
				this.inputService.updateInput(this.getConversiondetailPath(newIndex,'uomToId'), json)				
				// this.disableInput('cutFacility');
				// this.disableInput('sewingFacility');
			})
		//}
  }
  getDefaultBaseUom() {
    return new Promise((resolve, reject) => {
        let errorMsg = 'Failed to fetch base Uom.';
        this.apiService.get('/lovs/base-uom?category='+this.id)
            .catch(err => {
                reject(errorMsg);
                return err;
            })
            .subscribe(data => {
                
                if (data && data.data && data.data.length)
                    resolve(data.data[0]);
                else
                    reject(errorMsg);
            })
    })
}
  // resetLines() {
  //   this.lineKeys.forEach(key => {
  //       if (this[key].length)
  //           this.formData[key] = JSON.parse(JSON.stringify(this[key]));
  //       else
  //           this.formData[key] = [];
  //           this.refreshOpertionTable.next(true);
  //   })
  // }

  resetLines() {
    this.lineKeys.forEach(key => {
        if (this[key].length)
            this.formData[key] = JSON.parse(JSON.stringify(this[key]));
        else
            this.formData[key] = [];
        this["refresh" + key].next(true);
    })
  }

  deleteLine(key, index) {
    const primaryKey = this[key + 'PrimaryKey'];
    const data = this.formData[key];
    const path = this[key + 'Path'];
    const cache = this.inputService.getCache(path) || [];
    if (cache && cache.length > index) {
        cache.splice(index, 1);
    }
    this._cache.setLocalCache(path, cache);
    data.splice(index, 1);
    this.refreshLines(key);
  }

}
