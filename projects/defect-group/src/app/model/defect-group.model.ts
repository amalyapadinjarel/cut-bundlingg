export class DefectGroupModel {
    defGroupId: string;
    shortCode: string;
    groupName: string;
    defectType: string;
    active: string;
    lastUpdatedUser: string;
    createdUser: string;
    creationDateTr: string;
    lastUpdatedDateTr: string;

    constructor(model: any) {
        this.defGroupId = model.defGroupId;
        this.shortCode = model.shortCode;
        this.groupName = model.groupName;
        this.defectType = model.defectType;
        this.active = model.active;
        this.lastUpdatedUser = model.lastUpdatedUser;
        this.createdUser = model.createdUser;
        this.creationDateTr = model.creationDateTr
        this.lastUpdatedDateTr = model.lastUpdatedDateTr;

    }
}

export class DefectsModel{

    defGroupId: string;
    shortCode: string;
    name: string;
    sequence: string;
    active: string;
    defectId: string;

    constructor(model: any) {
        this.defGroupId = model.defGroupId;
        this.shortCode = model.shortCode;
        this.name = model.name;
        this.sequence = model.sequence;
        this.active = model.active;
        this.defectId = model.defectId;
    }
}