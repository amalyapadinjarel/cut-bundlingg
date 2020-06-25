export class User {

    userId:number;
    userName:string;
    personnelNum:string;
    firstName:string;
    middleName:string;
    lastName:string;
    knownAs:string;

    startDate:Date;
    endDate:Date;
    lastLoginDate:Date;
    passwordLifeSpanDays:number;
    maxAttempts:number;
    attemptsLeft:number;
    countryCode:number;
    phoneNumber:number;
    phoneNumWithCode:string;
    emailAddress:string;
    description:string;
    active:string;

    createdBy:number;
    createdByUser:string;
    creationDate:Date;
    lastUpdatedBy:number;
    modifiedByUser:string;
    lastUpdateDate:Date;

    constructor(model=null){
        this.userId = model?model.userId:"0";
        this.userName=model?model.userName:"";
        this.personnelNum=model?model.personnelNum:"";
        this.firstName=model?model.firstName:"";
        this.middleName=model?model.middleName:"";
        this.lastName=model?model.lastName:"";
        this.knownAs=model?model.knownAs:"";

        this.startDate=model?model.startDate:"";
        this.endDate=model?model.endDate:"";
        this.lastLoginDate=model?model.lastLoginDate:"";
        this.passwordLifeSpanDays=model?model.passwordLifeSpanDays:"";
        this.maxAttempts=model?model.maxAttempts:"";
        this.attemptsLeft=model?model.attemptsLeft:"";
        this.countryCode=model?model.countryCode:"";
        this.phoneNumber=model?model.phoneNumber:"";
        this.phoneNumWithCode=model?model.phoneNumWithCode:"";
        this.emailAddress=model?model.emailAddress:"";
        this.description=model?model.description:"";
        this.active=model?model.active:"";

        this.createdBy=model?model.createdBy:"";
        this.createdByUser=model?model.createdByUser:"";
        this.creationDate=model?model.creationDate:"";
        this.lastUpdatedBy=model?model.lastUpdatedBy:"";
        this.modifiedByUser=model?model.modifiedByUser:"";
        this.lastUpdateDate=model?model.lastUpdateDate:"";

    }

}
