export const UserLovConfig: any = {
    title: 'Select Users',
    url: 'lovs/users',
    dataHeader: 'data',
    returnKey: 'userId',
    displayKey: 'knownAs',
    filterAttributes: ['knownAs'],
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
            key: 'Description'
        }

    ],
    
};

export const facilityLovConfig: any = {
	title: 'Select Facility',
	url: 'lovs/facility-for-user',
  dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'shortCode',
	filterAttributes: ['label'],
	displayFields: [
	  {
		key: 'label',
		title: 'Name'
    },
    {
      key: 'shortCode',
      title: 'Short Code'
      }
  ]
  
  }

  export const WorkcenterLovConfig: any = {
	title: 'Select Workcenter',
	url: 'lovs/work-center',
  dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'label',
	filterAttributes: ['label'],
	displayFields: [
	  {
		key: 'label',
		title: 'Name'
    },
    {
      key: 'shortCode',
      title: 'Short Code'
      }
  ]
  

  }

  export const CopyFromUserLovConfig: any = {
    title: 'Select Users',
    url: 'user-workcenter-access/CopyFromUsers',
    dataHeader: 'data',
    returnKey: 'userId',
    displayKey: 'knownAs',
    filterAttributes: ['knownAs'],
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
            key: 'Description'
        }

    ],
    
};