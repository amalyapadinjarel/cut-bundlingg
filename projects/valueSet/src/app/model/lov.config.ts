//division lov
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
        title: 'Division'
    }
    ]
    
};


//table lov
export const TableLovConfig: any = {
    title: 'Select Table',
    url: 'lovs/table',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
   
    displayFields: [
      
    {
        key: 'label',
        title: 'Object Name'
    }
    ]
    
};


export var CopyFromFacilityLovConfig: any = {
    title: 'Select Facility',
    url: 'valueSet/copyFromFacility/',
    dataHeader: 'facility',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: [
        ''
    ],
    displayFields: [
        {
            title: 'Facility Name',
            key: 'facilityName'
        },
        {
            title: 'Facility Short Code',
            key: 'facilityShortCode'
        }

    ],
    // allowMultiple: true,
    // preFetchPages: 10,
    // primaryKey: ['facilityId']
   
};
export const ColumnLovConfig: any = {
    title: 'Select Column',
    url: 'lovs/columns',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'label',
        title: 'Column Name'
    }
    ]
};


