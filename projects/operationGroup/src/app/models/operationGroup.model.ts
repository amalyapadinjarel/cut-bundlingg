
export class OperationGroup {

    opId: string;
    shortCode: string;
    opName: string;
    parentOp: string;
    description: string;
    active: string;
    createdBy: string;
    lastUpdatedBy: string;
    parentOpName: string;
    lastUpdatedUser: string;
    createdUser: string;
    creationDate: string;
    lastUpdatedDate: string;
    creationDateTr: string;
    lastUpdatedDateTr: string;
    constructor(model = null) {
        this.opId = model ? model.opId : '0';
        this.shortCode = model ? model.shortCode : '';
        this.opName = model ? model.opName : '';
        this.parentOp = model ? model.parentOp : '';
        this.description = model ? model.description : '';
        this.active = model ? model.active : '';
        this.createdBy = model ? model.createdBy : '';
        this.lastUpdatedBy = model ? model.lastUpdatedBy : '';
        this.parentOpName = model ? model.parentOpName : '';
        this.lastUpdatedUser = model ? model.lastUpdatedUser : '';
        this.createdUser = model ? model.createdUser : '';
        this.creationDate = model ? model.creationDate : '';
        this.lastUpdatedDate = model ? model.lastUpdatedDate : '';
        this.creationDateTr = model ? model.creationDateTr : '';
        this.lastUpdatedDateTr = model ? model.lastUpdatedDateTr : '';
    }
    equals(model: any) {
        let flag = true
        Object.keys(new OperationGroup()).forEach(key => {
            if (this[key] != model[key])
                flag = false;
        })
        return flag;
    }

}



