import { ChoiceList } from 'app/shared/models';
import { Application } from 'app/models/application.model';


export class Uom {

    categoryName: string;
    description: String;
    active: String;
    createdByName: String;
    lastUpdatedBy: String;
    creationDate: Date;
    lastUpdateDate: Date;

    constructor(uom = null) {
        this.categoryName = uom.categoryName;
        this.description = uom.description;
        this.active = uom.active;
        this.createdByName = uom.createdByName;
        this.lastUpdatedBy = uom.lastUpdatedBy;
        this.creationDate = uom.creationDate;
        this.lastUpdateDate= uom.lastUpdateDate;
      
}
   
    
equals(model: any) {
    let flag = true
    Object.keys(new Uom()).forEach(key => {
        if (this[key] != model[key])
            flag = false;
    })
    return flag;
}

}
export class UomDetails {

    uomId: number;
    uomCode : number;
    uomName: string; 
    symbol: string;
    description: string;
    baseUomFlag: string;
    active: string; 

    constructor(UomDetails = null) {
        this.uomId = UomDetails?.uomId || '';
        this.uomCode = UomDetails?.uomCode || '';
        this.uomName = UomDetails?.uomName || '';
        this.symbol = UomDetails?.symbol || '';
        this.description = UomDetails?.description || '';
        this.baseUomFlag = UomDetails?.baseUomFlag || '';
        this.active = UomDetails?.active || '';

    }
    
    equals(model:any){
        let flag = true
        Object.keys(new UomDetails()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag;
    }
}

export class ConversionDetails {
    
    conversionId: number;
    uomId: string;
    srcCatId: number;
    active: string;
    multiplyRate: number;
    uomToId : number;
    destCatId : number;


    constructor(model = null) {
        this.conversionId = model?.conversionId || '';
        this.uomId = model?.uomId || '';
        this.srcCatId = model?.srcCatId || '';
        this.multiplyRate = model?.multiplyRate || '';
        this.active = model?.active || '';
        this.uomToId = model?.uomToId || '';
        this.destCatId = model?.destCatId || '';

        
    }
    
    equals(model:any){
        let flag = true
        Object.keys(new ConversionDetails()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag; 
    }
} 