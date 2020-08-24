export const PersonnelNumLOVConfig:any={
    title:'Select Person',
    url:'lovs/person',
    dataHeader:'data',
    returnKey: 'personId',
    displayKey:'personnelNum',
    filterAttributes:['personnelNum'],
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
    filterAttributes:['countryPhCode'],
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
            title: 'Short Code',
            key: 'roleShortCode'
        },
        
        {
            title: 'Name',
            key: 'roleName'
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
    url: 'user-app/copyFromFacility/',
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

