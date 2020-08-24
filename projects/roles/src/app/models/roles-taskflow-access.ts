export class RolesTaskFlowAccess {

    roleTaskFlowAssignmentId:number;
    taskFlowId: string;
    taskFlowName: string;
   // description: string;
    applicationShortCode:string;
    isRead:string;
    isEdit:string;
    isCreate:string;
    isDelete:string;
    roleId:number;
    active:string;
    constructor(model = null) {

        //this.roleTaskFlowAssignmentId=model && model.roleTaskFlowAssignmentId?model.roleTaskFlowAssignmentId:"0";
        this.roleTaskFlowAssignmentId=model && model.roleTaskFlowAssignmentId?model.roleTaskFlowAssignmentId:0;

        this.taskFlowId=model && model.taskFlowId?model.taskFlowId:"0";
        this.roleId=model && model.roleId?model.roleId:0;
        this.taskFlowName=model && model.taskFlowName?model.taskFlowName:"";
        this.applicationShortCode=model && model.applicationShortCode?model.applicationShortCode:"";
        // this.description=model && model.description?model.description:"";
        this.isRead=model?(model.isRead?model.isRead:"N"):"N";
        this.isEdit=model?(model.isEdit?model.isEdit:"N"):"N";
        this.isCreate=model?(model.isCreate?model.isCreate:"N"):"N";
        this.isDelete=model?(model.isDelete?model.isDelete:"N"):"N";
        this.active=model?(model.active?model.active:"Y"):"Y";

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
