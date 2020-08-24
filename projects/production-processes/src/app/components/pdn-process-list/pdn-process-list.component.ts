import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PdnProcessSharedService } from '../../services/pdn-process-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ApiService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { PdnProcessService } from '../../services/pdn-process.service';
// import { WorkCenterService } from '../services/work-center.service';
// import { WorkCenterTypeLovConfigurationModel, FacilityLovConfigurationModel } from '../model/lov-config';

@Component({
  selector: 'app-pdn-process-list',
  templateUrl: './pdn-process-list.component.html',
  styleUrls: ['./pdn-process-list.component.scss']
})
export class PdnProcessListComponent implements OnInit {
  @ViewChild(SmdDataTable, { static: true }) datatable: SmdDataTable;
  private refreshListData: Subscription;
  constructor(
    public _shared: PdnProcessSharedService,
    private router: Router,
    public _service: PdnProcessService,
        public _inputService: TnzInputService,
        public apiService: ApiService,
        private alertUtils: AlertUtilities) { }

        ngOnInit() {
          this.refreshListData = this._shared.refreshData.subscribe(
              change => { this.datatable.refresh(this._shared.formData['productionProcesses']) }
          );
      }
 
  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.productionProcesses) {
        this._shared.formData = dataChange.data;
        this._shared.setFormData(dataChange.data);
        this._shared.setListData(dataChange.data);
    }
}
  pageChanged(event) {
    this._shared.selectedPage = event.page;
}
_onPageChange(pageChangeEvent: any) {
  this._shared.selectedPage = pageChangeEvent.page;
}
  deleteLine(index) {
    this._shared.deleteLine('productionProcesses', index)
  }
  validateData(event, index, attr) {
    const attrValue = event.value.trim();
    const upperValue = attrValue.toUpperCase();
    if (attrValue == '' || attrValue == ' ' || attrValue == null) {
        switch (attr) {
            case 'name':
                this._inputService.setError(this._shared.getProductionProcessesAttrPath(index, attr), 'Name cannot be left blank!');
                break;
            case 'shortCode':
                this._inputService.setError(this._shared.getProductionProcessesAttrPath(index, attr), 'Short Code cannot be left blank!');
                break;
            }
    }
    if (attr == 'shortCode' && attrValue.length > 0) {
        this._service.duplicatePPCodeCheck(upperValue).then(data => {
            if (data) {
                this._inputService.setError(event.path, 'Duplicate  code -' + upperValue + ' !');
            }
        }).catch(err => {
        });
    }
}
}
