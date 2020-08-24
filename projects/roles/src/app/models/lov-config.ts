export var CopyFromUsersLovConfig: any = {
    title: 'Select Users',
    url: 'roles/copyFromUsers',
    dataHeader: 'users',
    filterAttributes: [
        ''
    ],
    displayFields: [
        {
            title: 'Username',
            key: 'userName'
        },
        {
            title: 'Known As',
            key: 'knownAs'
        },
        {
            title: 'Name',
            key: 'name'
        }
    ],
    allowMultiple: true,
    preFetchPages: 10,
    primaryKey: ['userId']
}

export var CopyFromTaskFlowLovConfig: any = {
    title: 'Select Menu',
    url: 'roles/copyFromTaskFlows/',
    dataHeader: 'taskFlows',
    returnKey: 'taskFlowId',
    filterAttributes: [
        ''
    ],
    displayFields: [
        {
            title: 'Name',
            key: 'taskFlowName'
        },
        {
            title: 'Description',
            key: 'description'
        }
        // ,
        // {
        //     title: 'Application Code',
        //     key: 'applicationCode'
        // }

    ],
    allowMultiple: true,
    preFetchPages: 10,
    primaryKey: ['taskFlowId']
}

export var CopyFromDivisionLovConfig: any = {
    title: 'Select Division',
    url: 'roles/copyFromDivision',
    dataHeader: 'division',
    returnKey: 'divisionId',
    filterAttributes: [
        ''
    ],
    displayFields: [
        {
            title: 'Short Code',
            key: 'divisionShortCode'
        },
        {
            title: 'Name',
            key: 'divisionName'
        }
    ],
    allowMultiple: true,
    preFetchPages: 10,
    primaryKey: ['divisionId']
}

export var CopyFromFacilityLovConfig: any = {
    title: 'Select Facility',
    url: 'roles/copyFromFacility/',
    dataHeader: 'facility',
    filterAttributes: [
        ''
    ],
    displayFields: [

        {
            title: 'Short Code',
            key: 'facilityShortCode'
        },
        {
            title: 'Name',
            key: 'facilityName'
        }

    ],
    allowMultiple: true,
    preFetchPages: 10,
    primaryKey: ['facilityId']
}

// export var CopyFromOrgAccessLovConfig: any = {
//     title: 'Select Division/Facility',
//     url: 'user-app/copyFromOrgAccess',
//     dataHeader: 'orgAccess',
//     filterAttributes: [
//         ''
//     ],
//     displayFields: [
//         {
//             title: 'Division',
//             key: 'divisionShortCode'
//         },
//         {
//             title: 'Facility',
//             key: 'facilityName'
//         }

//     ],
//     allowMultiple: true,
//     preFetchPages: 10,
//     primaryKey: ['facilityId']
// }

