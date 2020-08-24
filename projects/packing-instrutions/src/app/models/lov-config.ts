export const packingMethodLovconfig: any = {
    title: 'Select Packing Method',
    url: 'lovs/lookup?lookupType=MFG_PACKING_METHOD',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'label',
        title: 'Name'
    }]
};

export const rePackReasonLovconfig: any = {
    title: 'Select Repack Reason',
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
    title: 'Select Facility',
    url: 'lovs/facility?userAcessOnly=true',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'shortCode',
    filterAttributes: ['shortCode'],
    displayFields: [{
        key: 'shortCode',
        title: 'Short Code'
    },
    {
        key: 'label',
        title: 'Name'
    }
    ]
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
                key: 'shortCode',
                title: 'Short Code'
            },
            {
                key: 'label',
                title: 'Name'
            },
            ]
        }
    return json
}