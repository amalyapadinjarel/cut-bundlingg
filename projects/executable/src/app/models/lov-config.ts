export const ApplicationLovConfigurationModel: any = {
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

export const ExeMethodLovConfigurationModel: any = {
    title: 'Select Execution Method',
    url: 'lovs/lookup?lookupType=EXECUTION_METHOD',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'label',
        title: 'Type'
    }]
};

