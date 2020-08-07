export class UserProfile {

    userId:string;
    userName:string;
    firstName:string;
    middleName:string;
    lastName: string;
    knownAs:string;
    lastLoginDate:Date;
    personnelNum:string;

    countryCode:number;
    phoneNumber:number;
    phoneNumWithCode:string;
    emailAddress:string;
    description:string;

    constructor(model=null){
        this.userId=model?model.userId:0;
        this.firstName=model.firstName?model.firstName:"";
        this.middleName=model.middleName?model.middleName:"";
        this.lastName=model.lastName?model.lastName:"";
        this.knownAs=model.knownAs?model.knownAs:"";
        this.lastLoginDate=model.lastLoginDate?model.lastLoginDate:"";
        this.countryCode=model.countryCode?model.countryCode:"";
        this.phoneNumber=model.phoneNumber?model.phoneNumber:"";
        this.phoneNumWithCode=model.phoneNumWithCode?model.phoneNumWithCode:"";
        this.emailAddress=model.emailAddress?model.emailAddress:"";
        this.description=model.description?model.description:"";
        this.userName=model?model.userName:"";
        this.personnelNum=model?model.personnelNum:"";

   }

}
