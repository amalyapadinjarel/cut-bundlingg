import { Component, OnInit, ViewChild } from '@angular/core';
import { UserSharedService } from '../../_service/user-shared.service';
import { UserAppService } from '../../_service/user.service';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { CopyFromFacilityLovConfig } from '../../models/lov-config';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { UserOrgAccess } from '../../models/user-org-access';
import { IfStmt } from '@angular/compiler';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { User } from 'app/shared/models';

@Component({
  selector: 'effective-org-access',
  templateUrl: './effective-org-access.component.html',
  //styleUrls: ['./user-org-access.component.scss']
})
export class EffectiveOrgAccessFromRolesComponent implements OnInit {

  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

  disabled: any = {};

  private refreshSub: Subscription;
  private refreshEffectiveOrgAccessSub: Subscription;

  // public key = 'rolesOrgAccess';
  public key = 'effectiveOrgAccess';

  constructor(
    public _shared: UserSharedService,
    private _service: UserAppService,
    private alertUtils: AlertUtilities,
    public dialog: MatDialog,
    private inputService: TnzInputService

  ) { }

  ngOnInit(): void {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
      this._service.loadData(this.key);
    })
    this.refreshEffectiveOrgAccessSub = this._shared.refreshEffectiveOrgAccessData.subscribe(change => {
      this.refreshTable();
    })
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
    if (this.refreshEffectiveOrgAccessSub) this.refreshEffectiveOrgAccessSub.unsubscribe();
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

 



}
