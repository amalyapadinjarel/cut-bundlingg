export class MachineModel {

    machineId: string;
    machineCode: string;
    machineType: string;
    facility: string;
    wc: string;
    operation: string;
    active: string;
    createdByName: string;
    lastUpdatedBy: string;
    creationDate: string;
    lastUpdateDate: string;
    // creationDateTr: string;
    // lastUpdatedDateTr: string;

    constructor(model = null) {
        this.machineId = model ? model.machineId : '0';
        this.machineCode = model ? model.machineCode : '';
        this.machineType = model ? model.machineType : '';
        this.facility = model ? model.facility : '';
        this.wc = model ? model.wc : '';
        this.operation = model ? model.operation : '';
        this.active = model ? model.active : '';
        this.createdByName = model ? model.createdByName : '';
        this.lastUpdatedBy = model ? model.lastUpdatedBy : '';
        this.creationDate = model ? model.creationDate : '';
        this.lastUpdateDate = model ? model.lastUpdateDate : '';
        // this.creationDateTr = model ? model.creationDateTr : '';
        // this.lastUpdatedDateTr = model ? model.lastUpdatedDateTr : '';
    }

    equals(model: any) {
        let flag = true
        Object.keys(new MachineModel()).forEach(key => {
            if (this[key] != model[key]) {
                flag = false;
            }
        })
        return flag;
    }
}