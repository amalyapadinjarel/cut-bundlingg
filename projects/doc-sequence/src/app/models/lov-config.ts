
//application lov
export const ApplicationLovConfig: any = {
    title: 'Select Application',
    url: 'lovs/application',
    dataHeader: 'data',
    returnKey: 'shortCode',
    displayKey: 'label',
    filterAttributes: ['label'],
   
    displayFields: [{
       
        key: 'shortCode',
        title: 'Application Short Code'
    }, {
        key: 'label',
        title: 'Application Name'
    }
    ]
    
};

export var YearLovConfigs: any = {
    title: 'Select Year',
    url: 'lovs/years',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
   
    displayFields: [{
       
        key: 'label',
        title: 'Year'
    }
    ]
    
};