export const PersonnelNumLOVConfig:any={
    title:'Select Person',
    url:'lovs/person',
    dataHeader:'data',
    returnKey: 'personId',
    displayKey:'personnelNum',
    filterAttributes:[''],
    displayFields:[
        {

            key: 'personnelNum',
            title: 'Personnel Number'
        }, {
            key: 'name',
            title: 'Person Name'
        }, {
            key: 'personType',
            title: 'Person Type'
        }
    ]
    ,
    preFetchPages: 10,
    primaryKey: ['personId']

}

export const CountryCodeLOVConfig:any={
    title:'Select Country Code',
    url:'lovs/countryCode',
    dataHeader:'data',
    returnKey: 'countryPhCode',
    displayKey:'countryPhCode',
    filterAttributes:['countryPhCode','countryCode'],
    displayFields:[
        {

            key: 'countryCode',
            title: 'Country Code'
        }, {
            key: 'countryPhCode',
            title: 'Country Phone Code'
        }, {
            key: 'countryName',
            title: 'Country'
        }
    ]
    ,
    preFetchPages: 10,
    primaryKey: ['countryCode']

}
export var CopyFromRolesLovConfig: any = {
    title: 'Select Roles',
    url: 'user-app/copyFromRoles',
    dataHeader: 'roles',
    filterAttributes: [
        ''
    ],
    displayFields: [
        {
            title: 'Role Name',
            key: 'roleName'
        },
        {
            title: 'Role Short Code',
            key: 'roleShortCode'
        },
        {
            title: 'Role Description',
            key: 'description'
        }

    ],
    allowMultiple: true,
    preFetchPages: 10,
    primaryKey: ['roleId']
}

export var CopyFromDivisionLovConfig: any = {
    title: 'Select Division',
    url: 'user-app/copyFromDivision',
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
    url: 'user-app/copyFromFacility/',
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

;