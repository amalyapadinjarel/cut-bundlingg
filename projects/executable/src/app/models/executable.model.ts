export class ExecutableModel {

    exeId: string;
    shortCode: string;
    exeName: string;
    application: string;
    applicationName: string;
    description: string;
    active: string;
    createdBy: string;
    lastUpdatedBy: string;
    exeMethod: string;
    exeMethodName: string;
    exeFile: string;
    lastUpdatedUser: string;
    createdUser: string;
    creationDate: string;
    lastUpdatedDate: string;
    creationDateTr: string;
    lastUpdatedDateTr: string;

    constructor(model = null) {
        this.exeId = model ? model.exeId : '0';
        this.shortCode = model ? model.shortCode : '';
        this.application = model ? model.application : '';
        this.applicationName = model ? model.applicationName : '';
        this.exeName = model ? model.exeName : '';
        this.description = model ? model.description : '';
        this.active = model ? model.active : '';
        this.createdBy = model ? model.createdBy : '';
        this.lastUpdatedBy = model ? model.lastUpdatedBy : '';
        this.exeMethod = model ? model.exeMethod : '';
        this.exeMethodName = model ? model.exeMethodName : '';
        this.exeFile = model ? model.exeFile : '';
        this.lastUpdatedUser = model ? model.lastUpdatedUser : '';
        this.createdUser = model ? model.createdUser : '';
        this.creationDate = model ? model.creationDate : '';
        this.lastUpdatedDate = model ? model.lastUpdatedDate : '';
        this.creationDateTr = model ? model.creationDateTr : '';
        this.lastUpdatedDateTr = model ? model.lastUpdatedDateTr : '';
    }

    equals(model: any) {
        let flag = true
        Object.keys(new ExecutableModel()).forEach(key => {
            if (this[key] != model[key]) {
                flag = false;
            }
        })
        return flag;
    }
}