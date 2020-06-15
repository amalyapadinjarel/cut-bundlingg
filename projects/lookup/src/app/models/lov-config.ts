
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

