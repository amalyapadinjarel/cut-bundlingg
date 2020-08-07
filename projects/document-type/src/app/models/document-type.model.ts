import { Facility } from 'app/models/facility.model';
import { ChoiceList } from 'app/shared/models';
export class DocumentTypeModel {
    shortCode: string;
    docName : string;
    docBase : string;
    docTypeId: number;
    docSeq: string;
    active: string;
    status: string;
    createdBy: string;
    creationDate: Date;
    lastUpdatedDate: Date;
    lastUpdatedBy: string;
    description: string;
    openStatus: string;
    numControlled: string;
    override: string;
    roundMethod: string;
    backEntry: string;
    forwdEntry: string;
    revisionNo: string;
    division: number; 
    currConvType : string;
    workflow : string;
    allowOverride: string;

    constructor(model) {
        this.shortCode = model.shortCode;
        this.docName = model.docName;
        this.docBase = model.docBase;
        this.docTypeId = model.docTypeId;
        this.docSeq = model.docSeq;
        this.active = model.active;
        this.status = model.status;
        this.createdBy = model.createdBy;
      
        this.creationDate = model.creationDate;
        this.lastUpdatedDate = model.lastUpdatedDate;
        this.lastUpdatedBy = model.lastUpdatedBy;
        this.openStatus = model.openStatus;
        this.numControlled = model.numControlled;
        this.override = model.override;
        this.roundMethod = model.roundMethod;

        this.backEntry = model.backEntry;
        this.forwdEntry = model.forwdEntry;
        this.revisionNo = model.revisionNo;
        this.division = model.division;
        this.description = model.description;
        this.currConvType = model.currConvType;
       /// console.log("currConvType",this.currConvType)
        this.workflow = '';
        this.allowOverride=model.allowOverride;
        
    }

}
export class RoleDetails {
    role: string;
    roleDocId: number;
    roleId : number;
    isActive: string; 
    isInitiate: string;
    isChngeAssigne: string;
    docTypeId: number;
    constructor(Rolemodel = null) {
        this.role = Rolemodel?.role || '';
        this.roleId = Rolemodel?.roleId || '';
        this.roleDocId = Rolemodel?.roleDocId || '';
        this.isInitiate = Rolemodel?.isInitiate || '';
        this.isActive = Rolemodel?.isActive || '';
        this.isChngeAssigne = Rolemodel?.isChngeAssigne || '';
        this.docTypeId = Rolemodel?.docTypeId || '';
      
        
    }
    
    equals(model:any){
        let flag = true
        Object.keys(new RoleDetails()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag;
    }
}

export class StatusDetails {
    
    roledocStatusAssignmentId: number;
    docStatus: any;
    isRevisionAllowed: string;
    active: string;
    docTypeId: number;
    isEditAllowed : string;
    role : any;
    roles : any;

    constructor(model = null) {
        this.roledocStatusAssignmentId = model?.roledocStatusAssignmentId || '';
        this.docTypeId = model?.docTypeId || '';
        this.docStatus = model?.docStatus || '';
        this.isRevisionAllowed = model?.isRevisionAllowed || '';
        this.active = model?.active || '';
        this.isEditAllowed = model?.isEditAllowed || '';
        this.role = {label:'', value: 0, shortCode: ''}
        this.roles =[];
        
    }
    
    equals(model:any){
        let flag = true
        Object.keys(new StatusDetails()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag; 
    }
} 