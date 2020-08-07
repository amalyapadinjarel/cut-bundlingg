export class RolesTaskFlowAccess {

    roleTaskFlowAssignmentId:string;
    taskFlowId: string;
    taskFlowName: string;
    isAllowed: string;
    description: string;
    applicationCode:string;
    isRead:string;
    isEdit:string;
    isCreate:string;
    isDelete:string;
    roleId:number;
    active:string;
    constructor(model = null) {

        this.roleTaskFlowAssignmentId=model?model.roleTaskFlowAssignmentId:"0";
        this.taskFlowId=model?model.taskFlowId:"0";
        this.roleId=model?model.roleId:0;
        this.taskFlowName=model?model.taskFlowName:"";
        this.isAllowed=model?model.isAllowed:"";
        this.description=model?model.description:"";
        this.applicationCode=model?model.applicationCode:"";
        this.description=model?model.description:"";
        this.isRead=model?model.isRead:"";
        this.isEdit=model?model.isEdit:"";
        this.isCreate=model?model.isCreate:"";
        this.isDelete=model?model.isDelete:"";
        this.active=model?model.active:"Y";

    }

    equals(model:any){
        let flag = true
        Object.keys(new RolesTaskFlowAccess()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag;
    }
}
