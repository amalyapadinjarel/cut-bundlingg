
export class EmbeddedURL {

    // URLId: number;
    urlId:number;
    location: string;
    biVendor: string;
    secretKey: string;
    taskflowId:string;

    taskFlowName: string;
    active: string;
    title: string;
    url: string;
    // URL: string;
    baseSiteURL: string;
    isDefault: string;
    payload: string;

    description: string;
    createdBy: string;
    createdByUser: string;
    creationDate: Date;
    creationDateTr: string;

    lastUpdateDate: Date;
    lastUpdateDateTr: string;

    lastUpdatedBy: string;
    modifiedByUser: string;

    constructor(model) {
        this.urlId=model.urlId;
        //this.URLId = model.URLId;
        this.location = model.location;
        this.biVendor = model.biVendor;
        this.title = model.title;
        //this.URL = model.URL;
        this.url = model.url;

        this.baseSiteURL = model.baseSiteURL;
        this.isDefault = model.isDefault;
        this.payload=model.payload;
        
        this.secretKey = model.secretKey;
        this.taskflowId=model.taskflowId;

        this.taskFlowName = model.taskFlowName;
        this.active = model.active;

        this.createdBy = model.createdBy;
        this.createdByUser = model.createdByUser;
        this.creationDate = model.creationDate;
        this.lastUpdateDate = model.lastUpdateDate;
        this.lastUpdatedBy = model.lastUpdatedBy;
        this.modifiedByUser = model.modifiedByUser;
        this.description = model.description;
    }
}
