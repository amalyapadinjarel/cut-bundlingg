export class ProductionProcessesModel {

    processId: String;
    seq: String;
    shortCode: String;
    name: String;
    active: String;
    lastUpdateDate: String;
    lastUpdatedBy: String;
    creationDate: String;
    createdByName: String;

    constructor(model = null) {
        this.processId = model ? model.processId : '0';
        this.seq = model ? model.seq : '';
        this.shortCode = model ? model.shortCode : '';
        this.name = model ? model.name : '';
        this.active = model ? model.active : 'Y';
        this.lastUpdateDate = model ? model.lastUpdateDate : '';
        this.lastUpdatedBy = model ? model.lastUpdatedBy : '';
        this.creationDate = model ? model.creationDate : '';
        this.createdByName = model ? model.createdByName : '';
    }

    equals(model: any) {
        let flag = true
        Object.keys(new ProductionProcessesModel()).forEach(key => {
            if (this[key] != model[key]) {
                flag = false;
            }
        })
        return flag;
    }
}