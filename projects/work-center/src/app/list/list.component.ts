import { OnInit, Component, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { WorkCenterSharedService } from '../services/work-center-shared.service';
import { Router } from '@angular/router';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ApiService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { WorkCenterService } from '../services/work-center.service';
import { WorkCenterTypeLovConfigurationModel, FacilityLovConfigurationModel } from '../model/lov-config';

@Component({
    selector: 'work-center-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    @ViewChild(SmdDataTable, { static: true }) datatable: SmdDataTable;
    private refreshListData: Subscription;
    typeLovList = JSON.parse(JSON.stringify(WorkCenterTypeLovConfigurationModel));
    facilityLovList =  JSON.parse(JSON.stringify(FacilityLovConfigurationModel));
    constructor(
        public _shared: WorkCenterSharedService,
        private router: Router,
        public _service: WorkCenterService,
        public _inputService: TnzInputService,
        public apiService: ApiService,
        private alertUtils: AlertUtilities) { }

    ngOnInit() {
        this.refreshListData = this._shared.refreshWorkCenterData.subscribe(
            change => { this.datatable.refresh(this._shared.formData['workCenter']) }
        );
    }

    pageChanged(event) {
        this._shared.selectedPage = event.page;
    }

    _onDataChange(dataChange: any) {
        if (dataChange.data && dataChange.data.workCenter) {
            this._shared.formData = dataChange.data;
            this._shared.setFormData(dataChange.data);
            this._shared.setListData(dataChange.data);
        }
    }

    _onPageChange(pageChangeEvent: any) {
        this._shared.selectedPage = pageChangeEvent.page;
    }

    deleteLine(index) {
        this._shared.deleteLine('workCenter', index)
      }

      validateData(event, index, attr) {
        const attrValue = event.value.trim();
        const upperValue = attrValue.toUpperCase();
        const descriptionLen = 120;
        const codeLen = 30;
        if (attrValue.length > codeLen && (attr == 'wcName' || attr == 'shortCode')) {
            this._inputService.setError(this._shared.getWorkCenterAttrPath(index, attr), 'Length exceeded 30 characters!');
        }
        if (attrValue.length > descriptionLen && (attr == 'description' )) {
            this._inputService.setError(this._shared.getWorkCenterAttrPath(index, attr), 'Length exceeded 120 characters!');
        }
        if (attrValue == '' || attrValue == ' ' || attrValue == null) {
            switch (attr) {
                case 'wcName':
                    this._inputService.setError(this._shared.getWorkCenterAttrPath(index, attr), 'Work Center name cannot be left blank!');
                    break;
                case 'shortCode':
                    this._inputService.setError(this._shared.getWorkCenterAttrPath(index, attr), 'Work Center code cannot be left blank!');
                    break;
                case 'facilityCode':
                    this._inputService.setError(this._shared.getWorkCenterAttrPath(index, attr), 'Facility cannot be left blank!');
                    break;
                    case 'wcTypeMeaning':
                    this._inputService.setError(this._shared.getWorkCenterAttrPath(index, attr), 'Work Center type cannot be left blank!');
                    break;
                }
        }
        if (attr == 'shortCode' && attrValue.length > 0) {
            this._service.duplicateWCCodeCheck(upperValue).then(data => {
                if (data) {
                    this._inputService.setError(event.path, 'Duplicate  code -' + upperValue + ' !');
                }
            }).catch(err => {
            });
        }
    }
}