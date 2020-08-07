export const semiProductsLovconfig: any = {
    title: 'Select Cut Panels',
    url: 'lovs/mfg-semi-products',
    dataHeader: 'data',
    returnKey: 'semiProdId',
    displayKey: 'semiProdName',
    filterAttributes: ['semiProdName'],
    displayFields: [
    {
        key: 'semiProdName',
        title: 'Name'
    },
    {
        key: 'semiProdCode',
        title: 'Code'
    }]
};

export const DocTypeLovconfig: any = {
    title: 'Select Facility',
    url: 'lovs/doc-type/ROUT',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    setters: 'openingStatus,openingStatusLabel'
};