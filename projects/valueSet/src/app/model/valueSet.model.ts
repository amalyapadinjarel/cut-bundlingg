import { ChoiceList } from 'app/shared/models';
import { Application } from 'app/models/application.model';


export class ValueSet {

    setName: string;
    division: string;
    facility: string;
    facilityId: string;
    shortCode: String;
    description: String;
    active: String;
    listType: String;
    dataType: String;
    validationType: String;
    setAuthor: String;
    createdByName: String;
    lastUpdatedBy: String;
    creationDate: Date;
    lastUpdateDate: Date;
    returnFieldName: String;
    displayFieldName: String;
    selectFieldName: String;
    querySelect: String;
    queryWhere: String;
    queryOrderBy: String;
    tnztable: String;
    // lastUpdateDate: Date;

    constructor(valueSet = null) {
        this.setName = valueSet.setName;
        this.division = valueSet.division;
        this.facility = valueSet.facility;
        this.facilityId = valueSet.facilityId;
        this.shortCode = valueSet.shortCode;
        this.description = valueSet.description;
        this.active = valueSet.active;
        this.listType = valueSet.listType;
        this.validationType = valueSet.validationType;
        this.dataType = valueSet.dataType;
        this.setAuthor = valueSet.setAuthor;
        this.createdByName = valueSet.createdBy;
        this.lastUpdatedBy = valueSet.lastUpdatedBy;
        this.creationDate = valueSet.creationDate;
        this.lastUpdateDate= valueSet.lastUpdateDate;
        this.returnFieldName= valueSet.returnFieldName;
        this.displayFieldName= valueSet.displayFieldName;
        this.selectFieldName= valueSet.selectFieldName;
        this.querySelect= valueSet.querySelect;
        this.queryWhere= valueSet.queryWhere;
        this.queryOrderBy= valueSet.queryOrderBy;
        this.tnztable= valueSet.tnztable;

}
   
    
equals(model: any) {
    let flag = true
    Object.keys(new ValueSet()).forEach(key => {
        if (this[key] != model[key])
            flag = false;
    })
    return flag;
}

}
export class ValidValue {
   //active: string;
    //lookupCode: any;
    sequence: string;
    valueId: Number;
    numValue: string;
    charValue: string;
    dateValue: Date;
    valueDesc: string;

   
   
    constructor(model = null) {
        //this.active = model ? model.active : "";
        //console.log('model.active====='+model.active)
        this.sequence = model ? model.sequence : "";
        this.valueId=model?model.valueId:"0";
        this.numValue = model ? model.numValue : "";
        this.charValue = model ? model.charValue : "";

        this.dateValue = model ? model.dateValue : "";
        this.valueDesc = model ? model.valueDesc : "";
        
    }


}


