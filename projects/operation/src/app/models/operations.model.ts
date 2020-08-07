export class Operation {

    opId: string;
    shortCode: string;
    opName:string;
    parentOp: string;
    active: string;
    description: string;
    createdBy: string;
    createdUser: string;
    lastUpdatedBy: string;
    lastUpdatedUser: string;
    creationDate: Date;
    lastUpdatedDate: Date;
   
    parentOpName:string;
     
    constructor(model=null) {
       this.opId = model?model.opId:"0";
        this.shortCode = model?model.shortCode:"";
        this.opName=model?model.opName:"";
        this.parentOp = model?model.parentOp:"";
        this.active=model?model.active:"Y";
        this.createdBy =model?model.createdBy:"";
        this.createdUser=model?model.createdUser:"";
        this.creationDate = model?model.creationDate:"";
        this.lastUpdatedDate = model?model.lastUpdatedDate:"";
        this.lastUpdatedBy =model? model.lastUpdatedBy:"";
        this.lastUpdatedUser=model?model.lastUpdatedUser:"";
        this.description = model?model.description:"";

        this.parentOpName=model?model.parentOpName:"";

      }

      equals(model:any){
        let flag = true
        Object.keys(new Operation()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag;
    }

}




