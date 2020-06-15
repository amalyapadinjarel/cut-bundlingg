import {Component, OnInit} from '@angular/core';
import {MfgRoutingSharedService} from '../../../../services/mfg-routing-shared.service';
import {TnzInputService} from '../../../../../../../../src/app/shared/tnz-input/_service/tnz-input.service';

@Component({
    selector: 'document-details',
    templateUrl: './document-details.component.html',
    styleUrls: ['./document-details.component.scss'],
    host: {'class': 'form-header'}

})
export class DocumentDetailsComponent implements OnInit {

    docTypeLov = JSON.parse(JSON.stringify(DocTypeLovconfig));
    lovFilter = (res) => res.shortCode == 'CFAIJO_CBR_ROUTING_DOC'


    constructor(public _shared: MfgRoutingSharedService, private _inputService: TnzInputService) {
    }

    ngOnInit(): void {
    }

    valueChanged(change) {
        switch (change.key) {
            case 'docType':
                this._inputService.updateInput(this._shared.getHeaderAttrPath('docStatus'), 'DRAFT')
                break;
            default:
                break;
        }
    }

}


const DocTypeLovconfig: any = {
    title: 'Select Facility',
    url: 'lovs/doc-type/ROUT',
    dataHeader: 'data',
    returnKey: 'value',
    displayKey: 'label',
    filterAttributes: ['label']
};

const lovFilter = () => {
    res => res.shortCode == 'CFAIJO_CBR_ROUTING_DOC'
}
