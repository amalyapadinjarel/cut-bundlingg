export class WorkCenterModel {

    wcId: String;
    shortCode: String;
    wcName: String;
    wcType: String;
    seq: String;
    description: String;
    active: String;
    groupCode1: String;
    groupCode2: String;
    facilityCode: String;
    wcTypeMeaning: String;
    lastUpdatedUser: String;
    createdUser: String;
    creationDate: String;
    lastUpdatedDate: String;
    creationDateTr: String;
    lastUpdatedDateTr: String;

    constructor(model = null) {
        this.wcId = model ? model.wcId : '0';
        this.shortCode = model ? model.shortCode : '';
        this.wcName = model ? model.wcName : '';
        this.wcType = model ? model.wcType : '';
        this.seq = model ? model.seq : '';
        this.description = model ? model.description : '';
        this.active = model ? model.active : 'Y';
        this.groupCode1 = model ? model.groupCode1 : '';
        this.groupCode2 = model ? model.groupCode2 : '';
        this.facilityCode = model ? model.facilityCode : '';
        this.wcTypeMeaning = model ? model.wcTypeMeaning : '';
        this.lastUpdatedUser = model ? model.lastUpdatedUser : '';
        this.createdUser = model ? model.createdUser : '';
        this.creationDate = model ? model.creationDate : '';
        this.lastUpdatedDate = model ? model.lastUpdatedDate : '';
        this.creationDateTr = model ? model.creationDateTr : '';
        this.lastUpdatedDateTr = model ? model.lastUpdatedDateTr : '';
    }

    equals(model: any) {
        let flag = true
        Object.keys(new WorkCenterModel()).forEach(key => {
            if (this[key] != model[key]) {
                flag = false;
            }
        })
        return flag;
    }
}