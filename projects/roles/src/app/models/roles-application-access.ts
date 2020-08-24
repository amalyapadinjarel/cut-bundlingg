export class RolesAppAccess {

    applicationId: string;
    applicationName: string;
    applicationShortCode: string;
    isAllowed: string;
    roleAppAssignmentId: string;
    rolesTaskFlowAccess:any=[];

    constructor(model = null) {

        this.applicationId=model?model.applicationId:"0";
        this.roleAppAssignmentId=model?model.roleAppAssignmentId:"0";
        this.applicationName=model?model.applicationName:"";
        this.applicationShortCode=model?model.applicationShortCode:"";
        this.isAllowed=model?model.isAllowed:"";
       this.rolesTaskFlowAccess=model?model.rolesTaskFlowAccess:[];


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
