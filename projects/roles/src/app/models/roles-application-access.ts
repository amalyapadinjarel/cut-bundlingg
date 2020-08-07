export class RolesAppAccess {

    applicationId: string;
    applicationName: string;
    isAllowed: string;
    roleAppAssignmentId: string;
    constructor(model = null) {

        this.applicationId=model?model.applicationId:"0";
        this.roleAppAssignmentId=model?model.roleAppAssignmentId:"0";
        this.applicationName=model?model.applicationName:"";
        this.isAllowed=model?model.isAllowed:"";

    }

    equals(model:any){
        let flag = true
        Object.keys(new RolesAppAccess()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag;
    }
}
