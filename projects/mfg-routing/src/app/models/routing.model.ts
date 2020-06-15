import {Facility} from '../../../../../src/app/models/facility.model';
import {ChoiceList} from '../../../../../src/app/shared/models';

export class MfgRouting {

    style: string;
    facility: Facility;
    name: string;
    smv: number;

    createdBy: string;
    creationDate: Date;
    lastUpdateDate: Date;
    lastUpdatedBy: string;

    docStatus: string;
    docStatusName: string;
    docType: ChoiceList;
    revisionNo: string;
    description: string;
    documentNo: string;
    docTypeId: string;
    documentTypeFTR: any;

    constructor(routing: any) {
        this.style = routing.productNum;
        this.facility = {label: routing.facilityShortCode, value: routing.facility, shortCode: ''}
        this.name = routing.routingName;
        this.smv = routing.smv;
        this.description = routing.description;

        this.docStatusName = routing.docStatusTR
        this.docStatus = routing.docStatus
        this.revisionNo = routing.revisionNo;
        this.docType = {value: routing.docTypeId, label: routing.documentTypeFTR}
        this.documentNo = routing.documentNo;
        this.docTypeId = routing.docTypeId;

        this.creationDate = routing.creationDate;
        this.lastUpdateDate = routing.lastUpdateDate;
        this.createdBy = routing.createdByName;
        this.lastUpdatedBy = routing.lastUpdateByName;
        this.documentTypeFTR = routing.documentTypeFTR;

    }


}

export class RoutingSteps {
    routingStepId: string;

    nextOpSequence: string;

    nextOpId: string;
    nextOperationLabel: string;

    opGroupLabel: string;
    opGroupId: any;
    opGroup: any;

    opId: string;
    opLabel: string;

    opSequence: string;
    requireScanning: string;
    smv: string;

    constructor(routingStepModel = null) {
        this.routingStepId = routingStepModel?.routingStepId || '';
        this.nextOpId = routingStepModel?.nextOpId || '';
        this.nextOpSequence = routingStepModel?.nextOpSequence || '';
        this.nextOperationLabel = routingStepModel?.nextOperationLabel || '';
        this.opGroupLabel = routingStepModel?.opGroupLabel || '';
        this.opGroupId = routingStepModel?.opGroupId || '';
        this.opGroup = routingStepModel?.opGroupLabel || '';
        this.opId = routingStepModel?.opId || '';
        this.opLabel = routingStepModel?.opLabel || '';
        this.opSequence = routingStepModel?.opSequence || '';
        this.requireScanning = routingStepModel?.requireScanning || '';
        this.smv = routingStepModel?.smv || '';
    }

    equals(model: any) {
        let flag = true
        Object.keys(new RoutingSteps()).forEach(key => {
            if (model[key] && this[key] != model[key]) {
                flag = false;
            }
        })
        return flag;
    }
}
