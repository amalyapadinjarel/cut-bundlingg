export class UserRoles {
    roleUserAssignmentId:string;
  //  roleUserAssignmentId:number;
  userId:number;
	//userId: string;
	roleId: string;
    roleName:string;
    roleShortCode:string;
    roleStartDate:string;
    roleEndDate:string;
    active:string;

    constructor(model=null){
        this.roleUserAssignmentId=model?model.roleUserAssignmentId:"";
        this.roleId=model?model.roleId:"";
        this.userId=model?model.userId:"";
        this.roleName=model?model.roleName:"";
        this.roleShortCode=model?model.roleShortCode:"";
        this.roleStartDate=model?model.roleStartDate:"";
        this.roleEndDate=model?model.roleEndDate:"";
        this.active=model?model.active:"";
    }
    equals(model:any){
        let flag = true
        Object.keys(new UserRoles()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag;
    }
}
