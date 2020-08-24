export const WorkCenterTypeLovConfigurationModel: any = {
    title: 'Select Type',
    url: 'lovs/lookup?lookupType=WORK_CENTER_TYPE',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'label',
        title: 'Type'
    }]
};


export var FacilityLovConfigurationModel: any = {
    title: 'Select Facility',
    url: 'lovs/facility',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'shortCode',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'shortCode',
        title: 'Facility Short Code'
    }, {
        key: 'label',
        title: 'Facility Name'
    }]
};

export var ProcessLovConfigurationModel: any = {
    title: 'Select Processes',
    url: 'lovs/process',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'shortCode',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'shortCode',
        title: 'Process Short Code'
    }, {
        key: 'label',
        title: 'Process Name'
    }]
    
};