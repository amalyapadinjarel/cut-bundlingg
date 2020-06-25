export class UserOrgAccess {

    orgAccessId:number;
    division:string;
    facility:string;
    access:string;
    default:string;
    active:string;
    userId:number;
    
    roleId:string;
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
    this.userId=model?model.userId:0;
    this.roleId=model?model.roleId:"0";
    }
    equals(model:any){
        let flag = true
        Object.keys(new UserOrgAccess()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag;
    }
}
