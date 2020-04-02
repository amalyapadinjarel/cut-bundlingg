export const FacilityLovConfig: any = {
    title: 'Select Facility',
    url: 'lovs/facility',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'shortCode',
        title: 'Facility Short Code'
    }, {
        key: 'label',
        title: 'Facility Name'
    }]
};

export const DocTypeLovconfig: any = {
    title: 'Select Facility',
    url: 'lovs/doc-type/CUT',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label']
};

export const OddBundleLovConfig: any = {
    title: 'Select Odd Bundle Accounting',
    url: 'lovs/lookup?lookupType=MFG_ODD_BUNDLE_AC',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label']
};

export const AttributeSetLovConfig: any = {
    title: 'Select Attribute',
    url: 'lovs/lookup?lookupType=MFG_ATTRIBUTE_SET',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'label',
        title: 'Attribute Name'
    }]
};

export const CopyFromSOLovConfig: any = {
    title: 'Select SO',
    url: 'cut-register/copy-from-so',
    dataHeader: 'orders',
    filterAttributes: [
        'productTitle'
    ],
    displayFields: [
        {
            title: 'PO#',
            key: 'poNum'
        },
        {
            title: 'Old Order Ref',
            key: 'oldOrderRef'
        },
        {
            title: 'Product Title',
            key: 'productTitle'
        },
        {
            title: 'Attributes',
            key: 'prdAttribute'
        },
        {
            title: 'Order Qty.',
            key: 'orderQty'
        },
        {
            title: 'UOM',
            key: 'uomCode'
        },
        {
            title: 'SO#',
            key: 'documentNo'
        },
        {
            title: 'Customer',
            key: 'customer'
        },
        {
            title: 'Order Date',
            key: 'orderDate'
        },
        {
            title: 'Promised Date',
            key: 'promisedDate'
        },
        {
            title: 'OlDescription',
            key: 'olDescription'
        },
        {
            title: 'Season',
            key: 'season'
        },
        {
            title: 'Label',
            key: 'label'
        },
        {
            title: 'Kit',
            key: 'kit'
        },
        {
            title: 'Combo',
            key: 'comboTitle'
        },
       
    ],
    allowMultiple: true
};

export const CutTypeLovConfig: any = {
    title: 'Select Cut Type',
    url: 'lovs/lookup?lookupType=MFG_CUT_TYPE',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label'],
    displayFields: [{
        key: 'label',
        title: 'Type'
    }]
};

export class FabricLovConfig {
    title: 'Select Fabric';
    url: 'lovs/fabric--and-attributes?cutRegister=';
    dataHeader: 'data';
    returnKey: 'productId';
    displayKey: 'productTitleNum';
    filterAttributes: ['productTitleNum'];
    displayFields: [
        {
            key: 'productTitleNum',
            title: 'Fabric Name'
        }
        , {
            key: 'prdAttribute',
            title: 'Attribute'
        }
        , {
            key: 'Lot#',
            title: 'lotNum'
        }
        , {
            key: 'Shade',
            title: 'shade'
        }
        , {
            key: 'Sl#',
            title: 'slNum'
        }
    ];
    constructor(id) {
        this.url += id;
    }
};


