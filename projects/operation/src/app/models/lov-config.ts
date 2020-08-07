export const ParentOperationLovconfig: any = {
    title: 'Select operation',
    url: 'lovs/parentOperation?opId=',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [
        {
            key: 'label',
            title: 'Operation'
        },
        {
            key: 'shortCode',
            title: 'Operation Code'

        }
    ]
};
