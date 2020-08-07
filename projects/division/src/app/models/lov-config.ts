
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

//country lov
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


