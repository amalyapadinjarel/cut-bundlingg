export const packingMethodLovconfig: any = {
    title: 'Select packing Method',
    url: 'lovs/lookup?lookupType=MFG_PACKING_METHOD',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'label',
        title: 'Packing method'
    }]
};

export const rePackReasonLovconfig: any = {
    title: 'Select repack reason',
    url: 'lovs/lookup?lookupType=MFG_CARTON_REPACK_REASON_TYPE',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'label',
        title: 'Reason'
    }]
};

export const facilityLovconfig: any = {
    title: 'Select packing Method',
    url: 'lovs/facility-for-user',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'shortCode',
    filterAttributes: ['shortCode'],
    displayFields: [{
        key: 'label',
        title: 'Facility Name'
    },
    {
        key: 'shortCode',
        title: 'Facility Short code'
    }]
};

export function workCenterLovConfig(facilityId) {
    let json =
        {
            title: 'Select Work Center',
            url: "lovs/work-center?facility="+facilityId ,
            dataHeader: 'data',
            returnKey: 'value',
            displayKey: 'shortCode',
            filterAttributes: ['shortCode'],
            displayFields: [{
                key: 'label',
                title: 'Work center Name'
            },
            {
                key: 'shortCode',
                title: 'Work center Short code'
            }]
        }
    return json
}