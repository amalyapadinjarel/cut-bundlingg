import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { OperationGroupSharedService } from '../services/operationGroup-shared.service';
import { Router } from '@angular/router';
import { OperationGroupService } from '../services/operationGroup.service';
import { Subscription } from 'rxjs';
import { json } from 'app/shared/directives/validators/json';
import { OperationGroup } from '../models/operationGroup.model';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ApiService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';


@Component({
  selector: 'operationGroup-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})


export class ListComponent implements OnInit {
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

  private refreshSub: Subscription;
  private refreshOpGrp: Subscription;

  constructor(public _shared: OperationGroupSharedService, private router: Router, public _service: OperationGroupService,
    public _inputService: TnzInputService,
    public apiService: ApiService,
    private alertUtils: AlertUtilities) { }
  ngOnInit(): void {
    this.refreshSub = this._shared.refreshOperationGroupData.subscribe(
      change => {
        this.dataTable.refresh(this._shared.formData['operationGroup'])
      }
    );
  }

  rowSelected(event) {
  }

  pageChanged(event) {
    this._shared.selectedPage = event.page;
  }

  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.operationGroup) {
      this._shared.formData = dataChange.data;
      this._shared.setFormData(dataChange.data);
      this._shared.setListData(dataChange.data);
      this._shared.listConfig.offset = dataChange.offset;
      this._shared.listConfig.limit = dataChange.limit;
      this._shared.columnFilterValues = dataChange.columnFilterValues;
    }
  }

  _onPageChange(pageChangeEvent: any) {
    this._shared.selectedPage = pageChangeEvent.page;
  }

  validateData(event, index, attr) {
    const attrValue = event.value.trim();
    const upperValue = attrValue.toUpperCase();
    const descriptionLen = 60;
    const codeLen = 30;

    if (attrValue.length > codeLen && (attr == 'opName' || attr == 'shortCode')) {
      this._inputService.setError(this._shared.getOperationGroupAttrPath(index, attr), 'Length exceeded 30 characters!');
    }
    if (attrValue.length > descriptionLen && attr == 'description') {
      this._inputService.setError(this._shared.getOperationGroupAttrPath(index, attr), 'Length exceeded 60 characters!');
    }
    if (attrValue == '' || attrValue == ' ' || attrValue == null) {
      switch (attr) {
        case 'opName':
          this._inputService.setError(this._shared.getOperationGroupAttrPath(index, attr), 'Operation group name cannot be left blank!');
          break;
        case 'shortCode':
          this._inputService.setError(this._shared.getOperationGroupAttrPath(index, attr), 'Operation group code cannot be left blank!');
          break;
      }
    }
    if (attr == 'shortCode' && attrValue.length > 0) {
      this._service.duplicateOpGrpCodeCheck(upperValue).then(data => {
        if (data) {
          this._inputService.setError(event.path, 'Duplicate operation group code -' + upperValue + ' !');
        }
      }).catch(err => {
      });
    }
  }

  deleteLine(index) {
    this._shared.deleteLine('operationGroup', index)
  }

}
