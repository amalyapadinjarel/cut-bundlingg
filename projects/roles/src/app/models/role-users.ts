export class RoleUsers {
    roleUserAssignmentId: string;
    roleId: number;
    userId: string;
    userName: string;
    knownAs: string;
    userAssignmentStartDate: string;
    userAssignmentEndDate: string;
    active: string;
    userStatus: string;
    constructor(model = null) {
        this.roleUserAssignmentId = model ? model.roleUserAssignmentId : "";
        this.roleId = model ? model.roleId : "";
        this.userId = model ? model.userId : "";
        this.userName = model ? model.userName : "";
        this.knownAs = model ? model.knownAs : "";
        this.userAssignmentStartDate = model ? model.userAssignmentStartDate : "";
        this.userAssignmentEndDate = model ? model.userAssignmentEndDate : "";
        this.active = model ? model.active : "";
        this.userStatus = model ? model.userStatus : "";

    }
    equals(model: any) {
        let flag = true
        Object.keys(new RoleUsers()).forEach(key => {
            if (this[key] != model[key])
                flag = false;
        })
        return flag;
    }
}
