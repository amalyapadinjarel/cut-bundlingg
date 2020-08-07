import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentTypeService } from '../../_service/document-type.service';
import { DocumentTypeSharedService } from '../../_service/document-type-shared.service';
import { SubSink } from 'subsink';
import { SmdDataTable } from 'app/shared/component';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Subscription } from 'rxjs';
import { AlertUtilities } from 'app/shared/utils';

@Component({
  selector: 'role-detail',
  templateUrl: './roles-details.component.html',
  styleUrls: ['./roles-details.component.scss']
})
export class RolesDetailsComponent implements OnInit {
  private subs = new SubSink();
  private refreshSub: Subscription;
  private refresDocRoles: Subscription;
  @ViewChild(SmdDataTable) dataTable: SmdDataTable;
  public key = "Roledetail";
  RolesLov = JSON.parse(JSON.stringify(RolesLovConfig));
  constructor(private _service: DocumentTypeService,
    public _shared: DocumentTypeSharedService,
    public inputService: TnzInputService
    , private alertUtils: AlertUtilities) { }

  ngOnInit(): void {
    this.subs.sink = this._shared.refreshData.subscribe(change => {
      this._service.loadData(this.key);

    });
    this.subs.sink = this._shared.refreshRoledetail.subscribe(change => {
      if (change) {
        this.refreshTable();

      }
    });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onRowSelected() {
    this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
  }

  refreshTable() {

    setTimeout(_ => this.dataTable.refresh(this._shared.formData[this.key]), 0)

  }

  deleteLine(index,model){
    this._shared.deleteRoleLine(this.key,index);

  }
  valueChangedFromUI(event) {
    let flag = false;
    let path = event.path;
    let dataFromForm = this._shared.formData[this.key];
    let cache = this._shared.getSavedCacheData(this.key);
    let temCache = this._shared.getSavedCacheData(this.key);


    cache.forEach((value, index) => {
      let cacheIndex = index

      if (value != null) {
        let role = value.role.value

        dataFromForm.forEach((value, index) => {
          if (value.roleId != null) {
            if (role == value.roleId) {
              flag = true;
            }
          }
        });
        temCache.forEach((value, index) => {
          if (value != null && cacheIndex != index) {
            if (role == value.role.value) { flag = true; }
          }
        });
      }

    });
    if (flag) {
      this.alertUtils.showAlerts('Selected Role already exist.');
      this.inputService.setError(path, 'Selected Role already exist.')
    }
  }

}




export var RolesLovConfig: any = {

  title: 'Select Role',
  url: 'lovs/roles',
  dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'label',
  filterAttributes: ['label'],
  displayFields: [
    {
      key: 'shortCode',
      title: 'Short Code'
    }
    , {
      key: 'label',
      title: 'Name'
    }]
};
