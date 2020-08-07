import { ChoiceList } from 'app/models/common.model';

export class ParametersDetails{
    active: String;
    defaultValue: String;
    display: String;
    displayOrder: Number;
    exclude: String;
    fieldWidth: String;
    paramId: Number;
    parameter: String;
    pgmId: Number;
    promt: String;
    required: String;
    tfParam: String;
    validation: String;
    valueSet: any;
    constructor(model = null){
        this.active = model ? model.active : "";
        this.defaultValue = model ? model.defaultValue : "";
        this.display = model ? model.display : "";
        this.displayOrder = model ? model.displayOrder : 0;
        this.exclude = model ? model.exclude : "";
        this.fieldWidth = model ? model.fieldWidth : "";
        this.paramId = model ? model.paramId : "";
        this.parameter = model ? model.parameter : "";
        this.pgmId = model ? model.pgmId : 0;
        this.promt = model ? model.promt : "";
        this.required = model ? model.required : "";
        this.tfParam = model ? model.tfParam : "";
        this.validation = model ? model.validation : "";
        this.valueSet  = model ? model.valueSet : ""; 
    }
}

export class TemplatesDetails{
    active: String;
    company: String;
    division: String;
    facility: String;
    fileId: String;
    fileName: String;
    fileType: String;
    isSubReport: String;
    pgmId: String;
    revisionNumber: String;
    styleSheet: String;
    trendzRptFlag: String;
    constructor(model = null){
        this.active = model ? model.active : "";
        this.company = model ? model.company : "";
        this.division = model ? model.division : "";
        this.facility = model ? model.facility : "";
        this.fileId = model ? model.fileId : "";
        this.fileName = model ? model.fileName : "";
        this.fileType = model ? model.fileType : "";
        this.isSubReport = model ? model.isSubReport : "";
        this.pgmId = model ? model.pgmId : "";
        this.revisionNumber = model ? model.revisionNumber : "";
        this.styleSheet = model ? model.styleSheet : "";
        this.trendzRptFlag = model ? model.trendzRptFlag : "";
    }
}

export class StyleSheetDetails{
    active: String;
    company: String;
    createdBy: String;
    creationDate: String;
    division: String;
    facility: String;
    fileId: String;
    fileName: String;
    fileType: String;
    isSubReport: String;
    lastUpdateDate: String;
    lastUpdatedBy: String;
    pgmId: String;
    revisionNumber: String;
    styleSheet: String;
    trendzRptFlag: String;
    constructor(model = null){
        this.active = model ? model.active : "";
        this.company = model ? model.company : "";
        this.createdBy = model ? model.createdBy : "";
        this.creationDate = model ? model.creationDate : "";
        this.division = model ? model.division : "";
        this.facility = model ? model.facility : "";
        this.fileId = model ? model.fileId : "";
        this.fileName = model ? model.fileName : "";
        this.fileType = model ? model.fileType : "";
        this.isSubReport = model ? model.isSubReport : "";
        this.lastUpdateDate = model ? model.lastUpdateDate : "";
        this.lastUpdatedBy = model ? model.lastUpdatedBy : "";
        this.pgmId = model ? model.pgmId : "";
        this.revisionNumber = model ? model.revisionNumber : "";
        this.styleSheet = model ? model.styleSheet : "";
        this.trendzRptFlag = model ? model.trendzRptFlag : "";
    }
}

export class RolesDetails{
    securityId: String;
    roleName: String;
    startDate: String;
    endDate: String;
    active: String;
    constructor(model = null){
        this.securityId = model ? model.securityId : "";
        this.roleName = model ? model.roleName : "";
        this.startDate = model ? model.startDate : "";
        this.endDate = model ? model.endDate : "";
        this.active = model ? model.active : "";
    }
}