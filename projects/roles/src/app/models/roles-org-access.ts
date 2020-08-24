export class RolesOrgAccess {

    orgAccessId:number;
    division:string;
    facility:string;
    access:string;
    default:string;
    active:string;
    roleId:number;
    userId:string;
    divisionId: string;
    facilityId: string;

    constructor(model=null){
    this.orgAccessId=model?model.orgAccessId:0;
    this.division=model?model.division:"";
    this.divisionId=model?model.divisionId:"";
    this.facilityId=model?model.facilityId:"";

    this.facility=model?model.facility:"";
    this.access=model?model.access:"";
    this.default=model?model.default:"";
    this.active=model?model.active:"";
    this.userId=model?model.userId:"0";
    this.roleId=model?model.roleId:0;
    }


    // roledocStatusAssignmentId: number;
    // docStatus: any;
    // isRevisionAllowed: string;
    // active: string;
    // docTypeId: number;
    // isEditAllowed : string;
    // role : any;
    // roles : any;

    // constructor(model = null) {
    //     this.roledocStatusAssignmentId = model?.roledocStatusAssignmentId || '';
    //     this.docTypeId = model?.docTypeId || '';
    //     this.docStatus = model?.docStatus || '';
    //     this.isRevisionAllowed = model?.isRevisionAllowed || '';
    //     this.active = model?.active || '';
    //     this.isEditAllowed = model?.isEditAllowed || '';
    //     this.role = {label:'', value: 0, shortCode: ''}
    //     this.roles =[];
        
    // }
    equals(model:any){
        let flag = true
        Object.keys(new RolesOrgAccess()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag;
    }
}
