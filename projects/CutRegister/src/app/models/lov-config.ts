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
    filterAttributes: ['label'],
    setters: 'openingStatus,openingStatusLabel'
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

export var CopyFromSOLovConfig: any = {
    title: 'Select SO',
    url: 'cut-register/copy-from-so?attributeSet=',
    dataHeader: 'orders',
    filterAttributes: [
        'productTitle'
    ],
    displayFields: [
        {
            title: 'SO#',
            key: 'documentNo'
        },
        {
            title: 'Style',
            key: 'productNum'
        },
        {
            title: 'Style Attributes',
            key: 'prdAttribute'
        },
        {
            title: 'Order Ref.',
            key: 'orderReference'
        },
        {
            title: 'Order Qty.',
            key: 'orderQty'
        },
        {
            title: 'Max Cut Qty.',
            key: 'maxAllowQty'
        },
        {
            title: 'Prev Cut Qty.',
            key: 'prevCutQty'
        },
        {
            title: 'UOM',
            key: 'uomCode'
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
            title: 'Delivery Date',
            key: 'promisedDate'
        },
        {
            title: 'Season',
            key: 'season'
        },
        {
            title: 'Kit',
            key: 'kit'
        },
        {
            title: 'Combo',
            key: 'comboTitle'
        },
        {
            title: 'Style Name',
            key: 'productTitle'
        },
        {
            title: 'SO Description',
            key: 'description'
        },

    ],
    allowMultiple: true,
    preFetchPages: 10,
    primaryKey: ['orderLineId']
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

export function FabricLovConfig(id) {
    let json =
        {
            title: 'Select Fabric',
            url: 'lovs/fabric--and-attributes?cutRegisterId=' + id,
            dataHeader: 'data',
            returnKey: 'productId',
            displayKey: 'productTitleNum',
            filterAttributes: ['productTitleNum'],
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
                    key: 'lotNum',
                    title: 'Lot#',
                }
                , {
                    key: 'shade',
                    title: 'Shade',
                }
                , {
                    key: 'slNum',
                    title: 'Sl#',
                }
            ]
        }
    return json
}

export function StyleColorLovConfig(id) {
    let json =
        {
            title: 'Select Style Color',
            url: 'lovs/style-color?cutRegisterId=' + id,
            dataHeader: 'data',
            returnKey: 'valueId',
            displayKey: 'value',
            filterAttributes: ['value'],
            displayFields: [
                {
                    title: 'Color',
                    key: 'value'
                }
                // , {
                // 	title: 'Style',
                // 	key: 'styleName'
                // }
            ]
        }
    return json
}

export const StickerColorLovConfig: any = {
    title: 'Select Sticker Color',
    url: 'lovs/sticker-color',
    dataHeader: 'data',
    returnKey: 'valueId',
    displayKey: 'attrNameCode',
    filterAttributes: ['attrNameCode'],
    displayFields: [
        {
            key: 'attributeCode',
            title: 'Code'
        },
        {
            key: 'attributeValue',
            title: 'Value'
        },
        {
            key: 'attrName',
            title: 'Attribute'
        },
        {
            key: 'description',
            title: 'Description'
        },
    ]
};

export const UserFacilityLovConfig: any = {
    title: 'Select Facility',
    url: 'lovs/facility?userAcessOnly=true',
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


export function CutWorkCenterLovConfig(facilityId) {
    let json =
        {
            title: 'Select Work Center',
           url: "lovs/cr-work-center?facility="+facilityId ,
            dataHeader: 'data',
            returnKey: 'value',
            displayKey: 'label',
            filterAttributes: ['shortCode'],
            displayFields: [{
                key: 'label',
                title: 'Name'
            },
            {
                key: 'shortCode',
                title: 'Short code'
            }]
        }
    return json
  }
  


