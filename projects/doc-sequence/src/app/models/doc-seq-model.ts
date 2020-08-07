export class DocSeqHeaderModel {
    shortCode: string;
    docSeqName : string;
    appName : string;
    docSeqId: number;
    division: string;
    active: string;
    author: string;
    authorCode: string;
    createdBy: string;
    creationDate: Date;
    lastUpdatedDate: Date;
    lastUpdatedBy: string;
    description: string;
    nextNum: String;
   incrementBy: number;
    decPattern: string;

    resetYear: string;
    useCustPgm: string;
    autoReset: number;
    prefix: string;
    suffix: string;
    

    constructor(model) {
        this.shortCode = model.shortCode;
        this.docSeqName = model.docSeqName;
        this.appName = model.appName;
        this.docSeqId = model.docSeqId;
        this.division = model.division;
        this.active = model.active;
        this.author = model.author;
        this.authorCode = model.authorCode;
        this.createdBy = model.createdBy;
      
        this.creationDate = model.creationDate;
        this.lastUpdatedDate = model.lastUpdatedDate;
        this.lastUpdatedBy = model.lastUpdatedBy;
        this.description = model.description;
        this.nextNum = model.nextNum;
        this.incrementBy = model.incrementBy;
        this.decPattern = model.decPattern;
        this.resetYear= model.resetYear;
        this.useCustPgm= model.useCustPgm;
        this.autoReset= model.autoReset;
        this.prefix= model.prefix;
        this.suffix= model.suffix;
        
    }
    
}
export class SeqLineDetails {
    seqLineId: number;
    docSeqID: number;
    year : string;
    nextNum: number; 
    
    constructor(model = null) {
        this.seqLineId = model?.seqLineId || '';
        this.docSeqID = model?.docSeqID || '';
        this.year = model?.year || '';
        this.nextNum = model?.nextNum || '';
      
        
    }
    
    equals(model:any){
        let flag = true
        Object.keys(new SeqLineDetails()).forEach(key => {
            if(this[key]!=model[key])
                flag = false;
        })
        return flag;
    }
}