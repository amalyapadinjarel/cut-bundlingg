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
            title: 'Name',
            key: 'name'
        },
        {
            title: 'Known As',
            key: 'knownAs'
        },
        {
            title: 'User Description',
            key: 'description'
        }

    ],
    allowMultiple: true,
    preFetchPages: 10,
    primaryKey: ['userId']
}

export var CopyFromTaskFlowLovConfig: any = {
    title: 'Select TaskFlow',
    url: 'roles/copyFromTaskFlows/',
    dataHeader: 'taskFlows',
    returnKey:'taskFlowId',
    filterAttributes: [
        ''
    ],
    displayFields: [
        {
            title: 'TaskFlow Name',
            key: 'taskFlowName'
        },
        {
            title: 'Description',
            key: 'description'
        },
        {
            title: 'Application',
            key: 'applicationCode'
        }

    ],
    allowMultiple: true,
    preFetchPages: 10,
    primaryKey: ['taskFlowId']
}

export var CopyFromDivisionLovConfig: any = {
    title: 'Select Division',
    url: 'roles/copyFromDivision',
    dataHeader: 'division',
    returnKey:'divisionId',
    filterAttributes: [
        ''
    ],
    displayFields: [
        {
            title: 'Division Name',
            key: 'divisionName'
        },
        {
            title: 'Division Short Code',
            key: 'divisionShortCode'
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
            title: 'Facility Name',
            key: 'facilityName'
        },
        {
            title: 'Facility Short Code',
            key: 'facilityShortCode'
        }

    ],
    allowMultiple: true,
    preFetchPages: 10,
    primaryKey: ['facilityId']
}

export var CopyFromOrgAccessLovConfig: any = {
    title: 'Select Division/Facility',
    url: 'user-app/copyFromOrgAccess',
    dataHeader: 'orgAccess',
    filterAttributes: [
        ''
    ],
    displayFields: [
        {
            title: 'Division',
            key: 'divisionShortCode'
        },
        {
            title: 'Facility',
            key: 'facilityName'
        }

    ],
    allowMultiple: true,
    preFetchPages: 10,
    primaryKey: ['facilityId']
}

