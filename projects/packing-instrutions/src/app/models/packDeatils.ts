export class PacksDetails {
    noOfCartons: Number
    orderId: Number
    orderLineId: Number
    orderQty: Number
    parentProduct: Number
    po: String
    productId: Number
    qntyPerCtn: Number
    sequence: Number
    styleVariant: String
    packType: String
    short: String
    excess: String
    packedQty: Number
    uom : Number
    packingMethod: any;
    activeCarton: Number; 
    constructor(model = null) {
        this.noOfCartons = model ? model.noOfCartons : 0;
        this.orderId = model ? model.orderId : 0;
        this.orderLineId = model ? model.orderLineId : 0;
        this.orderQty = model ? model.orderQty : 0;
        this.parentProduct = model ? model.parentProduct : 0;
        this.po = model ? model.po : "";
        this.productId = model ? model.productId : 0;
        this.qntyPerCtn = model ? model.qntyPerCtn : 0;
        this.sequence = model ? model.sequence : 0;
        this.styleVariant = model ? model.styleVariant : "";
        this.short = model ? model.short : "";
        this.excess = model ? model.excess : "";
        this.packedQty = model ? model.packedQty : 0;
        this.uom = model ? model.uom : 0;
        this.packingMethod = model ? model.packingMethod: {};
        this.activeCarton = model ? model.activeCarton : 0;
    }

    equals(model: any) {
        let flag = true
        Object.keys(new PacksDetails()).forEach(key => {
            if(key != 'sequence'){
                if (this[key] != model[key])
                    flag = false;
            }
        })
        return flag;
    }
}

export class ratioDetails {
    colorCode: String
    colorValue: String
    inseamCode: String
    inseamValue: String
    orderId: Number
    parentProduct: Number
    po: String
    size: any
    csId: Number;
    uom : Number;
    qntyPerCtn: Number;
    noOfCartons: Number;
    quantity: Number;
    packQty: Number;
    prePack: Number;
    packingMethod: any;
    activeCarton: Number; 
    constructor(model = null) {
        this.colorCode = model ? model.colorCode : "";
        this.colorValue = model ? model.colorValue : "";
        this.inseamCode = model ? model.inseamCode : "";
        this.inseamValue = model ? model.inseamValue : "";
        this.orderId = model ? model.orderId : 0;
        this.parentProduct = model ? model.parentProduct : 0;
        this.po = model ? model.po : "";
        this.size = model ? model.size : [];
        this.csId = model ? model.csId : 0;
        this.uom = model ? model.uom : 0;
        this.qntyPerCtn = model ? model.qntyPerCtn : 0;
        this.noOfCartons = model ? model.noOfCartons: 0;
        this.quantity = model ? model.quantity: 0;
        this.packQty = model ? model.packQty: 0;
        this.prePack = model ? model.prePack: 0;
        this.packingMethod = model ? model.packingMethod: {};
        this.activeCarton = model ? model.activeCarton : 0;
    }

    equals(model: any) {
        let flag = true
        Object.keys(new ratioDetails()).forEach(key => {
            if (this[key] != model[key])
                flag = false;
        })
        return flag;
    }
}

export class StyleVarient{
    productId: Number;
    productName: String;
    packQnty: Number;
    orderQty: Number;
    constructor(model = null){
        this.productName = model ? model.productName : "";
        this.productId = model ? model.productId : 0;
        this.packQnty = model ? model.packQnty : 0;
        this.orderQty = model ? model.orderQty : 0;
    }
}