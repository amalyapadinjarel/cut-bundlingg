import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { LookupType, LookupValue} from '../models/lookup.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'app/shared/component';

@Injectable()
export class LookupSharedService {

    appKey = 'lookup';
    apiBase = 'lookup';
    taskFlowName = 'LOOKUP'
    editMode = false;

    lookupType:string='--';


    formData: any = {};
    lookupValue:any= [];
    linesData: any = [];
    loading = true;
    headerLoading = true;
    prodLoading = true;
    lookupValueLoading = true;
    linesLoading = false;

    primaryKey = 'lookupType';
    lookupValuePrimaryKey='lookupValueId'; //JSON value

    lookupValueAttributes= Object.keys(new LookupValue());
  
    _lookupValueSeq=1;
     lookupValueSeqIncBy=1;
    
    selectedLines = {};
   // lookupSaveAttributeMap = {}; //added on June 3


    lineKeys = ['lookupValue'];

    refreshLookupValue: BehaviorSubject<boolean> = new BehaviorSubject(false);
    refreshHeaderData: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);


    //variables for navigation
    selectedPage: number =1;
    columnFilterValues;
    count;
    listData;
    params;


    constructor(
        private _cache: LocalCacheService,
        private inputService: TnzInputService,
    ) { }

    init() {
       this.lookupType = '--';
      //  this.lookupType=null;
        this.editMode = false;
        this.refreshLookupValue= new BehaviorSubject(false);
        this.refreshData = new BehaviorSubject(false);
        this.formData = {};
        this.lookupValue=[];
        this.linesData = [];
        this._lookupValueSeq=1;
        this.lookupValueSeqIncBy=1;
         }

    clear() {
        this.lookupType='--';
        this.editMode = false;

        this.refreshLookupValue.unsubscribe();
        this.lookupValue=[];
        this.refreshData.unsubscribe();
        this.formData = {};
        this.linesData = [];
    }

    get appPath() {
        return this.appKey + '.' + this.lookupType;
    }

    get headerPath() {
        return this.appPath + '.header';
    }

    get lookupValuePath() {
        return this.appPath + '.lookupValue';
    }

    get lookupValueSeq() {
        this._lookupValueSeq += this.lookupValueSeqIncBy;
        return this._lookupValueSeq - this.lookupValueSeqIncBy;
    }

    set lookupValueSeq(value) {
        this._lookupValueSeq = value + this.lookupValueSeqIncBy;
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
        this._cache.setLocalCache('lookup', {});
    }

    getHeaderAttrPath(attr) {
        return this.headerPath + '.' + attr;
    }

    get lookupValueRemovedKeysPath() {
        return this.appPath + '.lookupValueRemovedKeys';
    }

      getLookupValuePath(line, attr) {
        return this.lookupValuePath + '[' + line + '].' + attr;
    }

    getHeaderEditable(attr, primaryKey) {
        let editable = this.editMode;
       
        let nonEditableAttrs = ['lookupType', 'applicationName', 'accessLevel'];// attributes that cannot be edited after creation
        if (this.lookupType != '--' && nonEditableAttrs.indexOf(attr) > -1) {
            editable = false
        }
        let editableAttrs = ['description'];// attributes that can be edited 
        
        let access=this.getHeaderAttributeValue('accessLevel');
        let noneditableDesc=['description']
        if(access=='S'&&this.lookupType!='--'&& noneditableDesc.indexOf(attr) > -1){
        editable=false;
        }
        return editable;
    }
 

    getLookupValueEditable(attr = null) {
        let editable = this.editMode;
        let nonEditableAttrs = ['lookupCode'];// attributes that cannot be edited after creation
        let access=this.getHeaderAttributeValue('accessLevel');
       if(access=='S'&&this.lookupType!='--') editable=false;
       else{
            let nonEditableAttrs = ['createdByUser', 'creationDate', 'lastUpdatedByUser','lastUpdateDate'];// attributes that cannot be edited after creation
            if (this.lookupType != '--' && nonEditableAttrs.indexOf(attr) > -1) {
            editable = false
            }

        }
       
        return editable;
    }
    
    getHeaderAttributeValue(key) {
        let val = this.inputService.getInputValue(this.getHeaderAttrPath(key));
        val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
        return val;
    }

    getLookupAttributeValue(index, key){
        let val = this.inputService.getInputValue(this.getLookupValuePath(index,key));
        val = typeof val != 'undefined' ? val : this.formData.header ? this.formData.header[key] : null;
        return val;
    }
     isLoading() {
        return this.loading || this.headerLoading || this.linesLoading ||this.lookupValueLoading
    }

    addLine(key, model = null) {
        let newLine;
        newLine = this.getLineModel(key, model);
        let seqKey = this.getSeqKey(key);
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
          //  commented by shery
            if (attr == primaryKey) {
                value = 0;
            } else if (attr == seqKey) {
                value = seq.toString();
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
            case 'lookupValue':
                newLine = model ? new LookupValue(model) : new LookupValue();
                break;
              default:
                break;
        }
        return newLine;
    }

    refreshLines(key) {
        switch (key) {
            case 'lookupValue':
                this.refreshLookupValue.next(true);
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

    getSeqKey(key) {
        let seq = "lineNum"
        switch (key) { 
            case 'lookupValue':
              //  seq = "lineNum"

                break;
            
            default:
                break;
        }
        return seq;
    }

    setSelectedLines(key, models) {
        this.selectedLines[key] = models;
    }

    setListData(data) {
        this.listData = data.lookups;
        this.count = data.count;
    }

}