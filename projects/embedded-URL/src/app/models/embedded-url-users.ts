export class EmbeddedURLUsers {
    embedId:number;
    userId:number;
    urlId:number;
    active:string;
    default:string;
    user:string;
    taskflowId:number;
    taskflow:string;
    location:string;

    constructor(model=null){

        this.embedId=model?model.embedId:0;
        this.userId=model?model.userId:0;
        this.urlId=model?model.urlId:0;
        this.active=model?model.active:"Y";
        this.default=model?model.default:"N";
        this.user=model?model.user:"";
        this.taskflowId=model?model.taskflowId:0;
        this.taskflow=model?model.taskflow:"";
        this.location=model?model.location:"";
    }

    equals(model:any){
        let flag = true
        Object.keys(new EmbeddedURLUsers()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag;
    }
}
