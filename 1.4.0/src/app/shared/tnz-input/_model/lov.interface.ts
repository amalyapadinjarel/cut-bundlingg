export const FacilityLovConfig: any = {
    title: 'Select Facility',
    url: 'tnzmain/tnz/0.1/userallowedfacility?finder=list;<userId>',
    returnKey: 'FacilityId',
    displayKey: 'FacilityShortCode',
    displayFields: [{
        key: 'FacilityShortCode',
        title: 'Facility Short Code'
    }, {
        key: 'FacilityName',
        title: 'Facility Name'
    }]
};

export const DocTypeLovconfig: any = {
    url: 'tnzmain/tnz/0.1/documentype?finder=list;<userId>,pDivision=${TOKEN:division},pDocBaseType=',
    returnKey: 'DocTypeId',
    displayKey: 'DocName'
};

export const ExchangeTypeLOVConfig: any = {
    url: 'finmain/fin/0.1/exchangeratetype',
    returnKey: 'TypeId',
    displayKey: 'TypeName'
};

export const ProductGroupLovConfig: any = {
    url: 'pdmmain/pdm/0.1/productcategory?finder=list;pGroupId=',
    returnKey: 'ProdCategoryId',
    displayKey: 'CategoryName',
    displayFields: [{
        key: 'CategoryCode',
        title: 'Group Code'
    }, {
        key: 'CategoryName',
        title: 'Group Name'
    }, {
        key: 'ProductGroupHirarchy',
        title: 'Hierarchy'
    }],
    setters: 'CategoryName'
};

export const ProductLovConfig: any = {
    title: 'Select Product',
    url: 'pdmmain/pdm/0.1/products',
    returnKey: 'ProductId',
    displayKey: 'ProductNum',
    displayFields: [{
        key: 'ProductNum',
        title: 'Product#'
    }, {
        key: 'ProductTitle',
        title: 'Name'
    }, {
        key: 'AttributeDesc',
        title: 'Attributes'
    }, {
        key: 'ProductGroupTr',
        title: 'Group'
    }, {
        key: 'ProdClassificationTr',
        title: 'Classification'
    }]
};

export const StyleFamilyLovConfig: any = {
    title: 'Select Style',
    url: 'pdmmain/pdm/0.1/products',
    filter: 'ConfigCode=2;MakeOrBuy=M',
    returnKey: 'ProductId',
    displayKey: 'ProductNum',
    displayFields: [{
        key: 'ProductNum',
        title: 'Style#'
    }, {
        key: 'ProductTitle',
        title: 'Style'
    }, {
        key: 'ProductGroupTr',
        title: 'Group'
    }, {
        key: 'ProdClassificationTr',
        title: 'Classification'
    }]
};

export const ComponentByGroupLovConfig: any = {
    title: 'Select Component',
    url: 'pdmmain/pdm/0.1/productbygroup?finder=list;pGroupId=',
    filter: 'ConfigCode=1 OR 2',
    returnKey: 'ProductId',
    displayKey: 'ProductNum',
    displayFields: [{
        key: 'ProductNum',
        title: 'Component#'
    }, {
        key: 'ProductTitle',
        title: 'Component'
    }, {
        key: 'ProductGroupTr',
        title: 'Component Group'
    }]
};

export const ProductColorLovConfig: any = {
    title: 'Select Attribute',
    url: 'pdmmain/pdm/0.1/productattributes?finder=list;pAttributeCode=COLOR,pProductId=',
    returnKey: 'ValueId',
    displayKey: 'AttributeValue',
    displayFields: [{
        key: 'AttributeCode',
        title: 'Attibute Code'
    }, {
        key: 'AttributeValue',
        title: 'Attibute Value'
    }]
};

export const UomLovConfig: any = {
    title: 'Select UOM',
    url: 'pdmmain/pdm/0.1/uom',
    returnKey: 'UomId',
    displayKey: 'UomCode',
    displayFields: [{
        key: 'UomCode',
        title: 'UOM Code'
    }, {
        key: 'CategoryName',
        title: 'Category'
    }, {
        key: 'Symbol',
        title: 'Symbol'
    }]
};

export const ProductUomLovConfig: any = {
    title: 'Select UOM',
    url: 'pdmmain/pdm/0.1/uom?finder=productuoms;pProductId=',
    returnKey: 'UomId',
    displayKey: 'UomCode',
    displayFields: [{
        key: 'UomCode',
        title: 'UOM Code'
    }, {
        key: 'CategoryName',
        title: 'Category'
    }, {
        key: 'Symbol',
        title: 'Symbol'
    }]
};
export const CurrencyLovConfig: any = {
    title: 'Select Currency',
    url: 'tnzmain/tnz/0.1/currency',
    returnKey: 'CurrencyId',
    displayKey: 'CurrencyCode',
    displayFields: [{
        key: 'CurrencyCode',
        title: 'Currency Code'
    },
    {
        key: 'CurrencyName',
        title: 'Currency'
    },
    {
        key: 'MinorCode',
        title: 'Precision'
    }],
    setters: 'MinorCode'
};

export const LookupLOVConfig: any = {
    title: 'Select Value',
    url: 'tnzmain/tnz/0.1/lookup?q=Active=Y;LookupType=',
    returnKey: 'LookupCode',
    displayKey: 'Meaning',
    displayFields: [{
        key: 'LookupCode',
        title: 'Code'
    },
    {
        key: 'Meaning',
        title: 'Meaning'
    }]
};

export const IncoTermsLOVConfig: any = {
  title: 'Select ShipmentMode',
  url: 'tnzmain/tnz/0.1/incoterms',
  returnKey: 'Meaning',
  displayKey: 'Meaning',
  displayFields: [{
      key: 'Meaning',
      title: 'Code'
  }]
};

export const PaymentMethodLOVConfig: any = {
  title: 'Select ShipmentMode',
  url: 'tnzmain/tnz/0.1/paymentmethod',
  returnKey: 'Meaning',
  displayKey: 'Meaning',
  displayFields: [{
      key: 'Meaning',
      title: 'Code'
  }]
};

export const ShipmentModeLOVConfig: any = {
  title: 'Select ShipmentMode',
  url: 'tnzmain/tnz/0.1/shipmentmode',
  returnKey: 'Meaning',
  displayKey: 'Meaning',
  displayFields: [{
      key: 'Meaning',
      title: 'Code'
  }]
};

export const VendorLOVConfig: any = {
  title: 'Select Vendor',
  url: 'bpmmain/bpm/0.1/businesspartner;Isvendor=Y',
  returnKey: 'PartnerId',
  displayKey: 'PartnerName',
  displayFields: [{
      key: 'PartnerId',
      title: 'Partner Id'
  },{
    key: 'PartnerNumber',
    title: 'Partner Number'
  },
  {
      key: 'PartnerName',
      title: 'Partner Name'
  }]
};

export const UNLOCODELOVConfig: any = {
  title: 'Select UnLocode',
  url: 'tnzmain/tnz/0.1/unlocode',
  returnKey: 'Locode',
  displayKey: 'Locode',
  displayFields: [{
      key: 'Locode',
      title: 'LoCode'
  },{
    key: 'LocodeName',
    title: 'Locode Name'
  },
  {
    key: 'CountryCode',
    title: 'Country Code'
}]
};

export const PaymentTermsLOVConfig: any = {
  title: 'Select PaymentTerms',
  url: 'finmain/fin/0.1/paymentterms',
  returnKey: 'TermName',
  displayKey: 'TermName',
  displayFields: [{
      key: 'TermName',
      title: 'Payment Terms'
  },
  {
    key: 'Description',
    title: 'Description'
  }]
};
