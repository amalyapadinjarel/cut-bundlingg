export const docstatusLovConfig: any = {
	title: 'Select Status',
	url: 'lovs/doc-status',
  dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'value',
	filterAttributes: ['label'],
	displayFields: [
	  {
		key: 'label',
		title: 'Name'
    },
    {
      key: 'value',
      title: 'Short Code'
      }
  ]
  
  }