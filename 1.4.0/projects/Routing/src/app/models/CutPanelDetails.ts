export class CutPanelDetails {
    seq : string;
    inOutType: string;
    routingId: string;
    inOutId: string;
    stepId: string;
    semiProdId: string;
    panelCode: string;
    panelName : string
    constructor(model = null) {
        this.seq = model ? model.seq : "";
        this.inOutType = model ? model.inOutType : "";
        this.routingId = model ? model.routingId : "";
        this.inOutId = model ? model.inOutId : "";
        this.stepId = model ? model.stepId : "";
        this.semiProdId = model ? model.semiProdId : "";
        this.panelCode = model ? model.panelCode : "";
        this.panelName = model ? model.panelName : "";

    }

    equals(model: any) {
        let flag = true
        Object.keys(new CutPanelDetails()).forEach(key => {
            if (this[key] != model[key])
                flag = false;
        })
        return flag;
    }
}