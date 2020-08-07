import { OnInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ApiService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { DocumentStatusService } from '../services/document-status.service';
import { Subscription } from 'rxjs';
import { DocumentStatusSharedService } from '../services/document-status-shared.service';
import { SmdDataTable } from 'app/shared/component';
import { docstatusLovConfig } from '../models/lov-config';


@Component({
    selector: 'document-status-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']

})
export class ListComponent implements OnInit {
    @ViewChild(SmdDataTable, { static: true }) datatable: SmdDataTable;
    private refStatusList: Subscription;
    statusLov = JSON.parse(JSON.stringify(docstatusLovConfig));
    constructor(
        public _shared: DocumentStatusSharedService,
        private router: Router,
        public _service: DocumentStatusService,
        public _inputService: TnzInputService,
        public apiService: ApiService,
        private alertUtils: AlertUtilities) { }

    ngOnInit() {
        this.refStatusList = this._shared.refreshDocStatusRefData.subscribe(
            change => { this.datatable.refresh(this._shared.formData['docStatusRef']) }
        );
    }

    pageChanged(event) {
        this._shared.selectedPage = event.page;
    }

    _onDataChange(dataChange: any) {
        if (dataChange.data && dataChange.data.docStatusRef) {
            this._shared.formData = dataChange.data;
            this._shared.setFormData(dataChange.data);
            this._shared.setListData(dataChange.data);
            this._shared.columnFilterValues = dataChange.columnFilterValues;
        }
    }

    _onPageChange(pageChangeEvent: any) {
        this._shared.selectedPage = pageChangeEvent.page;
    }

    deleteLine(index) {
        this._shared.deleteLine('docStatusRef', index)
    }

    validateData(event, index, attr, combinationValue = null) {
        let attrValue = '';
        let upperValue = '';
        if (attr == 'refKey') {
            attrValue = event.value.trim();
            upperValue = attrValue.toUpperCase();
        }
        else {
            attrValue = event.value;
        }
        if (attr == 'status' && combinationValue != null && combinationValue.length > 0) {
            upperValue = combinationValue.toUpperCase();
        }
        const descriptionLen = 120;
        const codeLen = 30;
        if (attrValue.length > codeLen && (attr == 'refKey' || attr == 'status')) {
            this._inputService.setError(this._shared.getdocStatusRefAttrPath(index, attr), 'Length exceeded 30 characters!');
        }
        if (attrValue.length > descriptionLen && (attr == 'description')) {
            this._inputService.setError(this._shared.getdocStatusRefAttrPath(index, attr), 'Length exceeded 120 characters!');
        }
        if (attrValue == '' || attrValue == ' ' || attrValue == null) {
            switch (attr) {
                case 'refKey':
                    this._inputService.setError(this._shared.getdocStatusRefAttrPath(index, attr), 'Reference key cannot be left blank!');
                    break;
                case 'status':
                    this._inputService.setError(this._shared.getdocStatusRefAttrPath(index, attr), 'Status cannot be left blank!');
                    break;
            }
        }
        if (attr == 'refKey' && attrValue.length > 0 && combinationValue.length > 0) {
            this._service.duplicateCombinationCheck(upperValue, combinationValue).then(data => {
                if (data) {
                    this._inputService.setError(event.path, 'Duplicate combination of Reference key and status code  !');
                }
            }).catch(err => {
            });
        }
        if (attr == 'status' && attrValue.length > 0 && upperValue.length > 0) {
            this._service.duplicateCombinationCheck(attrValue, upperValue).then(data => {
                if (data) {
                    this._inputService.setError(event.path, 'Duplicate combination of Reference key and status code  !');
                }
            }).catch(err => {
            });
        }
    }
}