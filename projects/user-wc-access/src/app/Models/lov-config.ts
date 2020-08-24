export const UserLovConfig: any = {
    title: 'Select Users',
    url: 'lovs/users',
    dataHeader: 'data',
    returnKey: 'userId',
    displayKey: 'userName',
    filterAttributes: ['userName'],
    displayFields: [
        {
            title: 'User Name',
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
            key: 'Description'
        }

    ],
    
};

export function facilityLovConfig(UserId) {
  let json =
    {
	title: 'Select Facility',
	url: 'lovs/facility?userAcessOnly=true&ignoreDivision=true&userId='+UserId,
  dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'shortCode',
	filterAttributes: ['shortCode'],
	displayFields: [
    {
      key: 'shortCode',
      title: 'Short Code'
      },
    {
		key: 'label',
		title: 'Name'
    }
   
  ]
}
return json
  }

  export function WorkcenterLovConfig(facilityId) {
    let json =
    {
	title: 'Select Workcenter',
  url: "lovs/work-center?facility="+facilityId ,
  dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'shortCode',
	filterAttributes: ['shortCode'],
	displayFields: [
    {
      key: 'shortCode',
      title: 'Short Code'
      },
    {
		key: 'label',
		title: 'Name'
    }
  
  ]
}
return json

  }

  export const CopyFromUserLovConfig: any = {
    title: 'Select Users',
    url: 'user-workcenter-access/CopyFromUsers',
    dataHeader: 'data',
    returnKey: 'userId',
    displayKey: 'userName',
    filterAttributes: ['userName'],
    displayFields: [
        {
            title: 'User Name',
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
            key: 'Description'
        }

    ],
    
};