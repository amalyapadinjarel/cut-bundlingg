export class Roles {

    roleId: number;
    // roleId: string;

    roleShortCode: string;
    roleName: string;
    startDate: Date;
    endDate: Date;
    author: string;
    description: string;
    active: string;

    createdBy: number;
    createdByUser: string;
    creationDate: Date;
    lastUpdatedBy: number;
    modifiedByUser: string;
    lastUpdateDate: Date;

    constructor(model = null) {
        this.roleId = model ? model.roleId : 0;
        this.author = model ? model.author : "";

        this.roleShortCode = model ? model.roleShortCode : "";
        this.roleName = model ? model.roleName : "";
        this.startDate = model ? model.startDate : "";
        this.endDate = model ? model.endDate : "";
        this.description = model ? model.description : "";
        this.active = model ? model.active : "";

        this.createdBy = model ? model.createdBy : "";
        this.createdByUser = model ? model.createdByUser : "";
        this.creationDate = model ? model.creationDate : "";
        this.lastUpdatedBy = model ? model.lastUpdatedBy : "";
        this.modifiedByUser = model ? model.modifiedByUser : "";
        this.lastUpdateDate = model ? model.lastUpdateDate : "";
    }


}
