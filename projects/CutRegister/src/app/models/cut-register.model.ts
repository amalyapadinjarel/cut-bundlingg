import { Facility } from 'app/models/facility.model';
import { ChoiceList } from 'app/shared/models';

export class CutRegister {
    registerId: number;
    documentNo: string;
    cutFacility: Facility;
    sewingFacility: Facility;
    bundleSize: number = 14;
    cutType: string;
    markerNameMethod: string;
    groupingCriteria: string;
    oddBundleAcc: string;
    oddBundlePer: string;
    cutNo: number;
    cutDate: Date;
    cutAllowance: string;
    cutExtra: string = 'Y';
    attributeSet: string;
    layYardage: number = 5;
    length: number = 10;
    width: number = 15;
    shrinkage: number = 20;

    createdBy: string;
    createdByName: string;
    creationDate: Date;
    lastUpdateDate: Date;
    lastUpdatedBy: string;
    lastUpdateByName: string;
    processInstncId: string;
    token: string;

    division: ChoiceList;
    docStatus: string;
    docStatusName: string;
    docType: ChoiceList;
    layItem: string;
    operationCode: string;
    revisionNo: string;
    workStation: string;
    fabric: string;
    description: string;
    layNo: string;

    constructor(model) {
        this.registerId = model.registerId;
        this.documentNo = model.documentNo;
        this.cutFacility = model.cutFacility;
        this.sewingFacility = model.sewingFacility;
        this.bundleSize = model.bundleSize;
        this.cutType = model.cutType;
        this.markerNameMethod = model.markerNameMethod;
        this.groupingCriteria = model.groupingCriteria;
        this.oddBundleAcc = model.oddBundleAcc;
        this.oddBundlePer = model.oddBundlePer;
        this.cutNo = model.cutNo;
        this.cutDate = model.cutDate;
        this.cutAllowance = model.cutAllowance;
        this.cutExtra = model.cutExtra;
        this.attributeSet = model.attributeSet;
        this.layYardage = model.layYardage;
        this.length = model.length;
        this.width = model.width;
        this.shrinkage = model.shrinkage;
        this.createdBy = model.createdBy;
        this.creationDate = model.creationDate;
        this.lastUpdateDate = model.lastUpdateDate;
        this.lastUpdatedBy = model.lastUpdatedBy;
        this.processInstncId = model.processInstncId;
        this.token = model.token;
        this.division = model.division;
        this.docStatus = model.docStatus;
        this.docStatusName = model.docStatusName;
        this.docType = model.docType;
        this.layItem = model.layItem;
        this.operationCode = model.operationCode;
        this.revisionNo = model.revisionNo;
        this.workStation = model.workStation;
        this.fabric = model.fabric;
        this.description = model.description;
        this.layNo = model.layNo;
        this.createdByName = model.createdByName;
        this.lastUpdateByName = model.lastUpdateByName;
    }
}

export class Product {
    productId: number;
    productName: string;
    productNum: string;
    productType: ChoiceList;
    productGroup: ChoiceList;

    constructor(productId = 0, productName = "", productNum = "") {
        this.productId = productId;
        this.productName = productName;
        this.productNum = productNum;
    }

}

export class OrderDetails {
	routingId: string;
    layOrderRefId: string;
    bpartName: string;
    lastUpdateDate: string;
    ordQtyUom: string;
    comboTr: string;
    division: string;
    refProdAttr: string;
    lastUpdatedBy: string;
    excQty: string;
    active: string;
    refDocLineId: string;
    lineQty: string;
    combo: string;
    prevqty: string;
    creationDate: string;
    attribute9: string;
    attribute8: string;
    cutAllowancePercent: string;
    attribute5: string;
    attribute4: string;
    attribute7: string;
    layRegstrId: string;
    attribute6: string;
    attribute1: string;
    attribute3: string;
    refDocId: string;
    attribute2: string;
    attribute10: string;
    totCutQty: string;
    bpartnerDocNo: string;
    refDocRevNo: string;
    refBaseDoc: string;
    crtdByName: string;
    color: string;
    displayOrder: string;
    allowedPcs: string;
    refProductId: string;
    luByName: string;
    allwdQty: string;
    kit: string;
    refDocTypeId: string;
    refDocNo: string;
    refDocDate: string;
    refDoc: string;
    refProduct: string;
    cutAllowanceQty: string;
    createdBy: string;
    bpartnerId: string;
    facility: string;
    orderRefNo: string;
    markerAttrVal: string;

    constructor(model = null) {
        this.layOrderRefId = model ? model.layOrderRefId : "0";
        this.bpartName = model ? model.bpartName : "";
        this.lastUpdateDate = model ? model.lastUpdateDate : "";
        this.ordQtyUom = model ? model.ordQtyUom : "";
        this.comboTr = model ? model.comboTr : "";
        this.division = model ? model.division : "";
        this.refProdAttr = model ? model.refProdAttr : "";
        this.lastUpdatedBy = model ? model.lastUpdatedBy : "";
        this.excQty = model ? model.excQty : "";
        this.active = model ? model.active : "";
        this.refDocLineId = model ? model.refDocLineId : "";
        this.lineQty = model ? model.lineQty : "";
        this.combo = model ? model.combo : "";
        this.prevqty = model ? model.prevqty : "";
        this.creationDate = model ? model.creationDate : "";
        this.attribute9 = model ? model.attribute9 : "";
        this.attribute8 = model ? model.attribute8 : "";
        this.cutAllowancePercent = model ? model.cutAllowancePercent : "";
        this.attribute5 = model ? model.attribute5 : "";
        this.attribute4 = model ? model.attribute4 : "";
        this.attribute7 = model ? model.attribute7 : "";
        this.layRegstrId = model ? model.layRegstrId : "";
        this.attribute6 = model ? model.attribute6 : "";
        this.attribute1 = model ? model.attribute1 : "";
        this.attribute3 = model ? model.attribute3 : "";
        this.refDocId = model ? model.refDocId : "";
        this.attribute2 = model ? model.attribute2 : "";
        this.attribute10 = model ? model.attribute10 : "";
        this.totCutQty = model ? model.totCutQty : "";
        this.bpartnerDocNo = model ? model.bpartnerDocNo : "";
        this.refDocRevNo = model ? model.refDocRevNo : "";
        this.refBaseDoc = model ? model.refBaseDoc : "";
        this.crtdByName = model ? model.crtdByName : "";
        this.color = model ? model.color : "";
        this.displayOrder = model ? model.displayOrder : "";
        this.allowedPcs = model ? model.allowedPcs : "";
        this.refProductId = model ? model.refProductId : "";
        this.luByName = model ? model.luByName : "";
        this.allwdQty = model ? model.allwdQty : "";
        this.kit = model ? model.kit : "";
        this.refDocTypeId = model ? model.refDocTypeId : "";
        this.refDocNo = model ? model.refDocNo : "";
        this.refDocDate = model ? model.refDocDate : "";
        this.refDoc = model ? model.refDoc : "";
        this.refProduct = model ? model.refProduct : "";
        this.cutAllowanceQty = model ? model.cutAllowanceQty : "";
        this.createdBy = model ? model.createdBy : "";
        this.bpartnerId = model ? model.bpartnerId : "";
        this.facility = model ? model.facility : "";
        this.orderRefNo = model ? model.orderRefNo : "";
        this.routingId = model ? model.routingId : "";        
        this.markerAttrVal = model ? model.markerAttrVal : "";        
        }
}

export class LayerDetails {
    registerLineId: string;
    createdByName: string;
    colorName: string;
    color: string;
    colorFilter: string;
    productInstanceId: string;
    viewAttr: string;
    attrValueFilter: string;
    rollNo: string;
    slNo: string;
    division: string;
    attributeId: string;
    lineNo: string;
    lotNo: string;
    registerId: string;
    prodName: string;
    layNo: string;
    lastUpdatedBy: string;
    layerCount: string;
    productId: string;
    shade: string;
    active: string;
    creationDate: string;
    createdBy: string;
    grade: string;
    attrValue: string;
    prodAttr: string;
    facility: string;
    shrinkage: string;
    lastUpdateBy: string;
    lastUpdatedByName: string;

    constructor(model = null) {
        this.registerLineId = model ? model.registerLineId : "0";
        this.createdByName = model ? model.createdByName : "";
        this.colorName = model ? model.colorName : "";
        this.color = model ? model.color : "";
        this.colorFilter = model ? model.colorFilter : "";
        this.productInstanceId = model ? model.productInstanceId : "";
        this.viewAttr = model ? model.viewAttr : "";
        this.attrValueFilter = model ? model.attrValueFilter : "";
        this.rollNo = model ? model.rollNo : "";
        this.slNo = model ? model.slNo : "";
        this.division = model ? model.division : "";
        this.attributeId = model ? model.attributeId : "";
        this.lineNo = model ? model.lineNo : "";
        this.lotNo = model ? model.lotNo : "";
        this.registerId = model ? model.registerId : "";
        this.prodName = model ? model.prodName : "";
        this.layNo = model ? model.layNo : "";
        this.lastUpdatedBy = model ? model.lastUpdatedBy : "";
        this.layerCount = model ? model.layerCount : "";
        this.productId = model ? model.productId : "";
        this.shade = model ? model.shade : "";
        this.active = model ? model.active : "";
        this.creationDate = model ? model.creationDate : "";
        this.createdBy = model ? model.createdBy : "";
        this.grade = model ? model.grade : "";
        this.attrValue = model ? model.attrValue : "";
        this.prodAttr = model ? model.prodAttr : "";
        this.facility = model ? model.facility : "";
        this.shrinkage = model ? model.shrinkage : "";
        this.lastUpdateBy = model ? model.lastUpdateBy : "";
        this.lastUpdatedByName = model ? model.lastUpdatedByName : "";
    }
}

export class MarkerDetails {
    layMarkerId: string;
    crtdByName: string;
    lastUpdateDate: string;
    displayOrder: string;
    luByName: string;
    division: string;
    prodName: string;
    attribute: string;
    lastUpdatedBy: string;
    currcutqtysql: string;
    productId: string;
    active: string;
    markerRatio: string;
    creationDate: string;
    created_by: string;
    attribute9: string;
    attribute8: string;
    attribute5: string;
    attribute4: string;
    attribute7: string;
    layRegstrId: string;
    attribute6: string;
    attribute1: string;
    attribute3: string;
    attribute2: string;
    prodAttr: string;
    attribute10: string;
    facility: string;
    constructor(model = null) {
        this.layMarkerId = model ? model.layMarkerId : "0";
        this.crtdByName = model ? model.crtdByName : "";
        this.lastUpdateDate = model ? model.lastUpdateDate : "";
        this.displayOrder = model ? model.displayOrder : "";
        this.luByName = model ? model.luByName : "";
        this.division = model ? model.division : "";
        this.prodName = model ? model.prodName : "";
        this.attribute = model ? model.attribute : "";
        this.lastUpdatedBy = model ? model.lastUpdatedBy : "";
        this.currcutqtysql = model ? model.currcutqtysql : "";
        this.productId = model ? model.productId : "";
        this.active = model ? model.active : "";
        this.markerRatio = model ? model.markerRatio : "";
        this.creationDate = model ? model.creationDate : "";
        this.created_by = model ? model.created_by : "";
        this.attribute9 = model ? model.attribute9 : "";
        this.attribute8 = model ? model.attribute8 : "";
        this.attribute5 = model ? model.attribute5 : "";
        this.attribute4 = model ? model.attribute4 : "";
        this.attribute7 = model ? model.attribute7 : "";
        this.layRegstrId = model ? model.layRegstrId : "";
        this.attribute6 = model ? model.attribute6 : "";
        this.attribute1 = model ? model.attribute1 : "";
        this.attribute3 = model ? model.attribute3 : "";
        this.attribute2 = model ? model.attribute2 : "";
        this.prodAttr = model ? model.prodAttr : "";
        this.attribute10 = model ? model.attribute10 : "";
        this.facility = model ? model.facility : "";
    }
}

export class CutPanelDetails {
    active: string;
    createdBy: string;
    creationDate: string;
    displayOrder: string;
    division: string;
    facility: string;
    lastUpdatedBy: string;
    lastUpdateDate: string;
    layRegstrId: string;
    mcpId: string;
    panelName: string;
    panelNameTr: string;
    mOpId: string;
    opSeq: string;
    refProdId: string;
    constructor(model = null) {
        this.active = model ? model.active : "";
        this.createdBy = model ? model.createdBy : "";
        this.creationDate = model ? model.creationDate : "";
        this.displayOrder = model ? model.displayOrder : "";
        this.division = model ? model.division : "";
        this.facility = model ? model.facility : "";
        this.lastUpdatedBy = model ? model.lastUpdatedBy : "";
        this.lastUpdateDate = model ? model.lastUpdateDate : "";
        this.layRegstrId = model ? model.layRegstrId : "";
        this.mcpId = model ? model.mcpId : "";
        this.panelName = model ? model.panelName : "";
        this.panelNameTr = model ? model.panelNameTr : "";
        this.mOpId = model ? model.mOpId : "";
        this.opSeq = model ? model.opSeq : "";
        this.refProdId = model ? model.refProdId : "";
    }
}
