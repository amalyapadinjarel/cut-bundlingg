
import { OnInit, ViewChild, Component } from '@angular/core';
import { ExecutableSharedService } from '../services/executable-shared.service';
import { ExecutableService } from '../services/executable.service';
import { Router } from '@angular/router';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ApiService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { ApplicationLovConfigurationModel, ExeMethodLovConfigurationModel } from '../models/lov-config';
import { json } from 'app/shared/directives/validators/json';

@Component({
    selector: 'executable-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

    private refreshExeList: Subscription;
    applicationLovList = JSON.parse(JSON.stringify(ApplicationLovConfigurationModel));
    exeMethodLovList = JSON.parse(JSON.stringify(ExeMethodLovConfigurationModel));
    constructor(
        public _shared: ExecutableSharedService,
        private router: Router,
        public _service: ExecutableService,
        public _inputService: TnzInputService,
        public apiService: ApiService,
        private alertUtils: AlertUtilities) { }

    ngOnInit() {
        this.refreshExeList = this._shared.refreshExecutbleData.subscribe(
            change => {
                this.dataTable.refresh(this._shared.formData['executable'])
            }
        );
    }

    pageChanged(event) {
        this._shared.selectedPage = event.page;
    }

    _onDataChange(dataChange: any) {
        if (dataChange.data && dataChange.data.executable) {
            this._shared.formData = dataChange.data;
            this._shared.setFormData(dataChange.data);
            this._shared.setListData(dataChange.data);
            this._shared.columnFilterValues = dataChange.columnFilterValues;
        }
    }

    _onPageChange(pageChangeEvent: any) {
        this._shared.selectedPage = pageChangeEvent.page;
    }

    validateData(event, index, attr) {
        const attrValue = event.value.trim();
        const upperValue = attrValue.toUpperCase();
        const descriptionLen = 120;
        const codeLen = 60;
        if (attrValue.length > codeLen && (attr == 'exeName' || attr == 'shortCode')) {
            this._inputService.setError(this._shared.getExecutableAttrPath(index, attr), 'Length exceeded 60 characters!');
        }
        if (attrValue.length > descriptionLen && (attr == 'description' || attr == 'exeFile')) {
            this._inputService.setError(this._shared.getExecutableAttrPath(index, attr), 'Length exceeded 120 characters!');
        }
        if (attrValue == '' || attrValue == ' ' || attrValue == null) {
            switch (attr) {
                case 'exeName':
                    this._inputService.setError(this._shared.getExecutableAttrPath(index, attr), 'Executable name cannot be left blank!');
                    break;
                case 'shortCode':
                    this._inputService.setError(this._shared.getExecutableAttrPath(index, attr), 'Executable code cannot be left blank!');
                    break;
                case 'exeFile':
                    this._inputService.setError(this._shared.getExecutableAttrPath(index, attr), 'Executable file cannot be left blank!');
                    break;
            }
        }
        if (attr == 'shortCode' && attrValue.length > 0) {
            this._service.duplicateExeCodeCheck(upperValue).then(data => {
                if (data) {
                    this._inputService.setError(event.path, 'Duplicate executable code -' + upperValue + ' !');
                }
            }).catch(err => {
            });
        }
    }

    onRowSelected() {
        let selectedLines = this.dataTable.selectedModels();
        this._shared.selectedModelData = selectedLines;
    }

    deleteLine(index) {
        this._shared.deleteLine('executable', index)
      }

}