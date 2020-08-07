export class DocumentStatusModel {

    statusRefId: string;
    refKey: string;
    status: string;
    description: string;
    active: string;
    createdBy: string;
    lastUpdatedBy: string;
    lastUpdatedUser: string;
    createdUser: string;
    creationDate: string;
    lastUpdatedDate: string;
    creationDateTr: string;
    lastUpdatedDateTr: string;

    constructor(model = null) {
        this.statusRefId = model ? model.statusRefId : '0';
        this.refKey = model ? model.refKey : '';
        this.status = model ? model.status : '';
        this.description = model ? model.description : '';
        this.active = model ? model.active : 'Y';
        this.createdBy = model ? model.createdBy : '';
        this.lastUpdatedBy = model ? model.lastUpdatedBy : '';
        this.lastUpdatedUser = model ? model.lastUpdatedUser : '';
        this.createdUser = model ? model.createdUser : '';
        this.creationDate = model ? model.creationDate : '';
        this.lastUpdatedDate = model ? model.lastUpdatedDate : '';
        this.creationDateTr = model ? model.creationDateTr : '';
        this.lastUpdatedDateTr = model ? model.lastUpdatedDateTr : '';
    }

    equals(model: any) {
        let flag = true
        Object.keys(new DocumentStatusModel()).forEach(key => {
            if (this[key] != model[key]) {
                flag = false;
            }
        })
        return flag;
    }
}