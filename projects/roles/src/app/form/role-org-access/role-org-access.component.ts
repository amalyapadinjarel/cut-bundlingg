import { Component, OnInit, ViewChild } from '@angular/core';
import { RolesSharedService } from '../../_service/roles-shared.service';
import { RolesService } from '../../_service/roles.service';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { CopyFromFacilityLovConfig } from '../../models/lov-config';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { RolesOrgAccess } from '../../models/roles-org-access';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'role-org-access',
  templateUrl: './role-org-access.component.html',
  //styleUrls: ['./user-org-access.component.scss']
})
export class RolesOrgAccessComponent implements OnInit {

  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

  disabled: any = {};

  private refreshSub: Subscription;
  private refreshOrgAccessSub: Subscription;

  public key = 'rolesOrgAccess';

  constructor(
    public _shared: RolesSharedService,
    private _service: RolesService,
    private alertUtils: AlertUtilities,
    public dialog: MatDialog,
    private cache: LocalCacheService,
    private inputService: TnzInputService

  ) { }

  ngOnInit(): void {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
      this._service.loadData(this.key);
    })
    this.refreshOrgAccessSub = this._shared.refreshOrgAccessData.subscribe(change => {
      this.refreshTable();
    })
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
    if (this.refreshOrgAccessSub) this.refreshOrgAccessSub.unsubscribe();
  }

  onRowSelected() {
    this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
  }

  refreshTable() {
    this.dataTable.refresh(this._shared.formData[this.key]);
  }

  deleteLine(index, model) {
    this._service.deleteDetailsLine(this.key, index, model);
  }

  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);

  }

  copyFromFacility(model) {
    let lovConfig: any = {};
    lovConfig = JSON.parse(JSON.stringify(CopyFromFacilityLovConfig));
    lovConfig.url += model.divisionId;
    const dialogRef = this.dialog.open(TnzInputLOVComponent);
    dialogRef.componentInstance.lovConfig = lovConfig;
    dialogRef.afterClosed().subscribe(resArray => {
      let unAddedOrderLines = [];
      if (resArray && resArray.length) {
        resArray.forEach(res => {
          res = this.mapResToRolesOrgAccess(res);
          let orgAccessLineIndex = this._shared.formData.rolesOrgAccess.findIndex(data => {
            return res.facilityId == data.facilityId
          })
          if (orgAccessLineIndex == -1) {
            this._shared.addLine('rolesOrgAccess', res,false);
          } else {
            unAddedOrderLines.push(res)
          }
        });
        //--------------------------------------
        this.refreshTable(); //refresh
        //-------------------------------------
        if (unAddedOrderLines.length) {
          this.alertUtils.showAlerts(unAddedOrderLines.length + " line(s) are not copied as they already exist.")
        }
      }
    })

  }
  mapResToRolesOrgAccess(res: any): any {
    let model = new RolesOrgAccess();
    model.orgAccessId = 0;
    model.roleId = this._shared.id;
    model.userId = "0";

    model.division = res.divisionShortCode ? res.divisionShortCode : "";
    model.facility = res.facilityName ? res.facilityName : "";

    model.divisionId = res.divisionId ? res.divisionId : "";
    model.facilityId = res.facilityId ? res.facilityId : "";

    model.access = "Y";
    model.default = "N";
    model.active = "Y";
    return model;

  }

  //Method To Update Default Facility
  defaultFacilityCheck(event, model, index) {
    if (event.value == 'Y') {
      if (model.facilityId != 0) {
        let data = this._shared.formData['rolesOrgAccess'];
        let key = 'rolesOrgAccess';
        if (data && data.length) {
          data.forEach((element, idx) => {
            if (index != idx && element.facilityId != 0) {
              element.default = 'N';
              let path = this._shared.getRolesOrgAccessPath(idx, 'default');
              this.inputService.updateInput(path, 'N', element.orgAccessId)
            }
          });
        }
      }
    }
  }



}
