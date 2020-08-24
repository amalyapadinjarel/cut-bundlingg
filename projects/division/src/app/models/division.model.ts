import { ChoiceList } from 'app/shared/models';
import { Application } from 'app/models/application.model';


export class Division {

    shortCode: string;
    divisionName: string;
    company: string;
    active: String;
    description: String;
    location: String;
    address: Address;
    createdByName: String;
    lastUpdatedBy: String;
    creationDate: Date;
    lastUpdateDate: Date;

    constructor(division: any) {
        this.shortCode = division.shortCode;
        this.divisionName = division.divisionName;
        this.company = division.company;
        this.active = division.active;
        this.description = division.description;
        this.location = division.location;
        this.createdByName = division.createdByName;
        this.lastUpdatedBy = division.lastUpdatedBy;
        this.creationDate = division.creationDate;
        this.lastUpdateDate= division.lastUpdateDate;
        let address = {
            AddressLine1 : division.addressLine1,
            AddressLine2 : division.addressLine2,
            AddressLine3 : division.addressLine3,
            City : division.city,
            State : division.state,
            CountryName : division.countryName,
            PostalCode : division.postalCode,
            TelephoneNumber : division.telephoneNumber,
            TelephoneNumber2 : division.telephoneNumber2,
            Email : division.email,
            WebsiteUrl : division.websiteUrl

        }
        this.address = new Address(address)
    }

    get getAddress(){
        return this.address;
    }
    

}
    export class Address {

        addressLine1: string;
        addressLine2: string;
        addressLine3: string;
        city: string;
        state: String;
        countryName: String;
        postalCode: String;
        telephoneNumber: String;
        telephoneNumber2: String;
        email: String;
        websiteUrl: String;
     
    
        constructor(address: any) {
            
            this.addressLine1 = address.AddressLine1;
            this.addressLine2 = address.AddressLine2;
            this.addressLine3 = address.AddressLine3;
            this.city = address.City;
            this.state = address.State;
            this.countryName = address.CountryName;
            this.postalCode = address.PostalCode;
            this.telephoneNumber = address.TelephoneNumber;
            this.telephoneNumber2 = address.TelephoneNumber2;
            this.email = address.Email;
            this.websiteUrl = address.WebsiteUrl;
        }
    
    

}



