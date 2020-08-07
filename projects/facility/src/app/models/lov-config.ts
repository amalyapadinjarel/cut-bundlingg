//company lov
export const CompanyLovConfig: any = {
    title: 'Select Company',
    url: 'lovs/company',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
   
    displayFields: [
        {
       
        key: 'shortCode',
        title: 'Company Short Code'
    }, 
    {
        key: 'label',
        title: 'Company Name'
    }
    ]
    
};
//company lov
export const DivisionLovConfig: any = {
    title: 'Select Division',
    url: 'lovs/division',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
   
    displayFields: [
  
    {
        key: 'label',
        title: 'Division Name'
    }
    ]
    
};
//location lov
export const LocationLovConfig: any = {
    title: 'Select Location',
    url: 'lovs/location',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
   
    displayFields: [
    //     {
       
    //     key: 'value',
    //     title: 'Location Id'
    // }, 
    {
        key: 'label',
        title: 'Location Name'
    }
    ]
   
};


export const FacilityGroupLovConfig: any = {
    title: 'Select Facility Group',
    url: 'lovs/lookup?lookupType=FACILITY_GROUP',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'label',
        title: 'Type'
    }]
};
//company lov
export const CountryLovConfig: any = {
    title: 'Select Country',
    url: 'lovs/countryCode',
    dataHeader: 'data',
    returnKey: 'countryCode',
    displayKey: 'countryName',
   
   
    displayFields: [
        {
       
        key: 'countryCode',
        title: 'Country Code'
    }, 
    {
        key: 'countryName',
        title: 'Country Name'
    }
    ]
    
};