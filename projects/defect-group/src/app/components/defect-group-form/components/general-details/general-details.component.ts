import { OnInit, OnDestroy, Component } from '@angular/core';
import { DefectGroupSharedService } from '../../../../services/defect-group-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { DefectGroupService } from '../../../../services/defect-group.service';
import { AlertUtilities } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
    selector: 'general-details',
    templateUrl: './general-details.component.html',
    styleUrls: ['./general-details.component.scss'],
    host: { 'class': 'header-card' }
})
export class GeneralDetailsComponent implements OnInit, OnDestroy {
    private subs = new SubSink();
    DefectTypeOptions = [
        {
            label: 'Rework',
            value: 'RWK'
        },
        {
            label: 'Rejected',
            value: 'REJ'
        }
    ];
    constructor(public _shared: DefectGroupSharedService, public _inputService: TnzInputService,
        private _service: DefectGroupService,
        private alertUtils: AlertUtilities) { }
    ngOnInit() {
        this.subs.sink = this._shared.refreshdefectGroupHeaderData.subscribe(change => {
			this.loadData();
		  })
    }
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
    getIfEditable(key) {
        return this._shared.getDefectGrpEditable(key, this._shared.id);
    }
    validateData(event, attr) {
        const attrValue = event.value.trim();
        if (attrValue.length > 60) {
            this._inputService.setError(this._shared.getdefectGroupHeaderAttrPath(attr), 'Length exceeded 60 characters!');
        }
    }

    private loadData() {
        this.setLoading(true);
        this._service.fetchFormData(this._shared.id).then((data: any) => {
            this._shared.setFormHeader(data);
            this.setLoading(false);
        }, err => {
            this.setLoading(false);
            if (err) {
                this.alertUtils.showAlerts(err, true)
            }
        });
    }

    setLoading(flag: boolean) {
        this._shared.headerLoading = flag;
    }
}


export function defectGroupLovconfig(idVal) {
    let json = {
        title: 'Select Defect group',
        url: 'lovs/defect-group-lov?defGrpId=' + idVal,
        dataHeader: 'data',
        returnKey: 'value',
        displayKey: 'label',
        filterAttributes: ['label'],
        displayFields: [
            {
                key: 'label',
                title: 'Name'
            }]
    }
    return json;
};