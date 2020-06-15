import { ChoiceList } from 'app/shared/models';
import { Application } from 'app/models/application.model';

export class LookupType {

    lookupType: string;
    applicationShortCode: Application;
    applicationName:string;
    accessLevel: string;
    accessLevelText: string;
    description: string;
    createdBy: string;
    createdByUser: string;
    creationDate: Date;
    lastUpdateDate: Date;
    lastUpdatedBy: string;
    lastUpdatedByUser: string;
   
    constructor(model) {
       this.lookupType = model.lookupType;
        this.applicationShortCode = model.applicationShortCode;
        this.applicationName=model.applicationName;
        this.accessLevel = model.accessLevel;
        this.accessLevelText=model.accessLevelText;
        this.createdBy = model.createdBy;
        this.createdByUser=model.createdByUser;
        this.creationDate = model.creationDate;
        this.lastUpdateDate = model.lastUpdateDate;
        this.lastUpdatedBy = model.lastUpdatedBy;
        this.lastUpdatedByUser=model.lastUpdatedByUser;
        this.description = model.description;
      }

}
export class LookupValue {
    lookupValId: any;
    //lookupCode: any;
    lookupCode: string;
    meaning: string;
    description: string;
    header1: string;
    value1: string;
    header2: string;
    value2: string;
    header3: string;
    value3: string;
    header4: string;
    value4: string;
    header5: string;
    value5: string;
   // active:boolean;
    createdBy: string;
    creationDate: string;
    lastUpdatedBy: string;
    lastUpdateDate: string;
    createdByUser: string;
    division: string;
    facility: string;
    active: string;
    displayOrder: string;
    
    luByName: string;
   
    constructor(model = null) {
        this.lookupValId = model ? model.lookupValId : "0";
        this.lookupCode = model ? model.lookupCode : "";
        this.createdByUser=model?model.createdByUser:"";
        this.lastUpdatedBy = model ? model.lastUpdatedBy : "";
        this.createdBy = model ? model.createdBy : "";

        this.lastUpdateDate = model ? model.lastUpdateDate : "";
        this.creationDate = model ? model.creationDate : "";
        this.active = model ? model.active : "";

        this.meaning = model ? model.meaning : "";
        this.description = model ? model.description : "";
        this.division = model ? model.division : "";
        this.header1 = model ? model.header1 : "";
        this.value1 = model ? model.value1 : "";
        this.header2 = model ? model.header2 : "";
        this.value2 = model ? model.value2 : "";
        this.header3 = model ? model.header3 : "";
        this.value3 = model ? model.value3 : "";
        this.header4 = model ? model.header4 : "";
        this.value4 = model ? model.value4 : "";
        this.header5 = model ? model.header5 : "";
        this.value5 = model ? model.value5 : "";
        this.facility = model ? model.facility : "";
        
    }

    equals(model:any){
        let flag = true
        Object.keys(new LookupValue()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag;
    }
}



