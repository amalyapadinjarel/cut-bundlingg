export class UserProfile {

    userId:string;
    userName:string;
    firstName:string;
    middleName:string;
    lastName: string;
    knownAs:string;
    lastLoginDate:Date;
    personnelNum:string;
    countryCode:string;

    countryPhCode:string;
    phoneNumber:number;
    phoneNumWithCode:string;
    emailAddress:string;
    description:string;
    attemptsLeft:number;
    passwordAccessLeft:number;
    constructor(model=null){
        this.userId=model?model.userId:0;
        this.firstName=model.firstName?model.firstName:"";
        this.middleName=model.middleName?model.middleName:"";
        this.lastName=model.lastName?model.lastName:"";
        this.knownAs=model.knownAs?model.knownAs:"";
        this.lastLoginDate=model.lastLoginDate?model.lastLoginDate:"";

        this.countryCode=this.countryPhCode;
        this.countryPhCode=model.countryPhCode?model.countryPhCode:"";
        this.attemptsLeft=model?model.attemptsLeft:"3";
        this.passwordAccessLeft=model?model.passwordAccessLeft:"3";

        this.phoneNumber=model.phoneNumber?model.phoneNumber:"";
        this.phoneNumWithCode=model.phoneNumWithCode?model.phoneNumWithCode:"";
        this.emailAddress=model.emailAddress?model.emailAddress:"";
        this.description=model.description?model.description:"";
        this.userName=model?model.userName:"";
        this.personnelNum=model?model.personnelNum:"";
     

   }

}
