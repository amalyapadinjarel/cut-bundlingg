
export class Facility {

    shortCode: string;
    facilityName: string;
    company: string;
    active: String;
    divisionName: string;
    facilityGroup: string;
    description: String;
    location: String;
    address: Address;
    createdByName: String;
    lastUpdatedBy: String;
    creationDate: Date;
    lastUpdateDate: Date;
    sequence: String;

    constructor(facility: any) {
        this.shortCode = facility.shortCode;
        this.facilityName = facility.facilityName;
        this.company = facility.company;
        this.active = facility.active;
        this.divisionName = facility.divisionName;
        this.facilityGroup = facility.facilityGroup;
        this.description = facility.description;
        this.location = facility.location;
        this.createdByName = facility.createdByName;
        this.lastUpdatedBy = facility.lastUpdatedBy;
        this.creationDate = facility.creationDate;
        this.lastUpdateDate= facility.lastUpdateDate;
        this.sequence = facility.sequence;
        let address = {
            AddressLine1 : facility.addressLine1,
            AddressLine2 : facility.addressLine2,
            AddressLine3 : facility.addressLine3,
            City : facility.city,
            State : facility.state,
            CountryName : facility.countryName,
            PostalCode : facility.postalCode,
            TelephoneNumber1 : facility.telephoneNumber1,
            TelephoneNumber2 : facility.telephoneNumber2,
            Email : facility.email,
            WebsiteUrl : facility.websiteUrl

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
        telephoneNumber1: String;
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
            this.telephoneNumber1 = address.TelephoneNumber1;
            this.telephoneNumber2 = address.TelephoneNumber2;
            this.email = address.Email;
            this.websiteUrl = address.WebsiteUrl;
        }
    
    

}



