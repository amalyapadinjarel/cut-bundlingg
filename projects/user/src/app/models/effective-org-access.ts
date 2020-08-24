export class EffectiveOrgAccess {
    orgAccessId:number;
    division:string;
    facility:string;
    access:string;
    default:string;
    active:string;
    userId:number;

    // divisionId: number;
    // divisionName: string;
    // divisionShortCode: string;


    // facilityId: number;
    // facilityName: string;
    // facilityShortCode: string;
   

    constructor(model = null) {

        // this.divisionId = model ? model.divisionId : "";
        // this.divisionName = model ? model.divisionName : "";
        // this.divisionShortCode = model ? model.divisionShortCode : "";

        // this.facilityId = model ? model.facilityId : "";
        // this.facilityName = model ? model.facilityName : "";
        // this.facilityShortCode = model ? model.facilityShortCode : "";
        
        this.division=model?model.division:"";
        this.facility=model?model.facility:"";

        this.default = model ? model.default : "";

        this.active = model ? model.active : "";
        this.userId = model ? model.userId : 0;
    }
    equals(model: any) {
        let flag = true
        Object.keys(new EffectiveOrgAccess()).forEach(key => {
            if (this[key] != model[key])
                flag = false;
        })
        return flag;
    }
}
