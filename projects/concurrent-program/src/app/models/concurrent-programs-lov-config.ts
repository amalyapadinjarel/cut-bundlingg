export const FacilityLovConfig: any = {
    title: 'Select Facility',
    url: 'lovs/facility',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'shortCode',
        title: 'Facility Short Code'
    }, {
        key: 'label',
        title: 'Facility Name'
    }]
};

export const ApplicationLovConfig: any = {
    title: 'Select Application',
    url: 'lovs/application',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'shortCode',
        title: 'Application Short Code'
    }, {
        key: 'label',
        title: 'Application Name'
    }]
};

export const DivisionLovConfig: any = {
    title: 'Select Division',
    url: 'lovs/divisions',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [
    {
        key: 'label',
        title: 'Division Short Code'
    }, 
    {
        key: 'name',
        title: 'Division Name'
    }]
};

export const TaskFlowLovConfig: any = {
    title: 'Select Form',
    url: 'lovs/taskflow',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [
    {
        key: 'shortCode',
        title: 'Short Code'
    }, 
    {
        key: 'label',
        title: 'Task Flow Name'
    },
    {
        key: 'module',
        title: 'Module'
    }]
};

export const ExecutablesLovConfig: any = {
    title: 'Select Executable',
    url: 'lovs/executables',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [
    {
        key: 'label',
        title: 'Executable Name'
    },
    {
        key: 'shortCode',
        title: 'Executable Code'
    }]
};

export const ValueSetLovConfig: any = {
    title: 'Select Value Set',
    url: 'lovs/value-set',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [
    {
        key: 'label',
        title: 'Value Set Name'
    },
    {
        key: 'shortCode',
        title: 'Short Code'
    }]
};

export const RolesLovConfig: any = {
    title: 'Select Role',
    url: 'lovs/roles',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [
    {
        key: 'label',
        title: 'Role Name'
    },
    {
        key: 'shortCode',
        title: 'Short Code'
    }]
};