export class UserWcAccessModel {

    mapId: number;
    userName: string;
    facility: string;
    workCenter: string;
    active: string;
    createdBy: string;
    lastUpdatedBy: string;
 
    creationDate: string;
    lastUpdatedDate: string;


    constructor(model = null) {
        this.mapId = model ? model.mapId : '0';
        this.userName = model ? model.userName : '';
        this.facility = model ? model.facility : '';
        this.workCenter = model ? model.workCenter : '';
        this.active = model ? model.active : 'Y';
        this.createdBy = model ? model.createdBy : '';
        this.lastUpdatedBy = model ? model.lastUpdatedBy : '';
        this.creationDate = model ? model.creationDate : '';
        this.lastUpdatedDate = model ? model.lastUpdatedDate : '';
       
    }

    equals(model: any) {
        let flag = true
        Object.keys(new UserWcAccessModel()).forEach(key => {
            if (this[key] != model[key]) {
                flag = false;
            }
        })
        return flag;
    }
}