import { Component, OnInit, ViewChild } from '@angular/core';
import { RolesSharedService } from '../../_service/roles-shared.service';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { RolesService } from '../../_service/roles.service';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { CopyFromTaskFlowLovConfig } from '../../models/lov-config';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { RolesTaskFlowAccess } from '../../models/roles-taskflow-access';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
  //host: { 'class': 'form-view' }

})
export class ApplicationComponent implements OnInit {

  disabled: any = {};
  @ViewChild('rolesAppAccess', { static: true }) rolesAppAccessTable: SmdDataTable;
  @ViewChild('rolesTaskFlowAccess', { static: true }) rolesTaskFlowAccessTable: SmdDataTable;



  private refreshSub: Subscription;
  private refreshTFAccessSub: Subscription;
  private refreshAppAccessSub: Subscription;

  private fetchAppSub: Subscription;

  public key = 'rolesTaskFlowAccess';

  constructor(public _shared: RolesSharedService,
    private _service: RolesService,
    private alertUtils: AlertUtilities,
    public dialog: MatDialog,
    private cache: LocalCacheService,
    private inputService: TnzInputService) {

  }

  ngOnInit(): void {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
      this._service.loadData('rolesAppAccess');
      this._service.loadData(this.key);

    })

    this.refreshAppAccessSub = this._shared.refreshAppAccessData.subscribe(change => {
      this.rolesAppAccessTable.refresh(this._shared.formData['rolesAppAccess']);
    })
    this.refreshTFAccessSub = this._shared.refreshTaskFlowAccessData.subscribe(change => {
      this.rolesTaskFlowAccessTable.refresh(this._shared.formData[this.key]);
    })

    //---to fetch app data on create mode--------------
    // this.fetchAppSub = this._shared.fetchAppData.subscribe(change => {
    //   if (change)
   
    //   this._service.fetchRolesAppAccess(0).then((data: any[]) => {
    //     if (data?.length) {
    //       this._shared.setLines('rolesAppAccess', data);
    //       this._shared.refreshAppAccessData.next(true);
    //     }
    //   })
    // })
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
    if (this.refreshAppAccessSub) this.refreshAppAccessSub.unsubscribe();
    if (this.refreshTFAccessSub) this.refreshTFAccessSub.unsubscribe();
  }

  onRowSelected() {
    this._shared.setSelectedLines(this.key, this.rolesTaskFlowAccessTable.selectedModels())

  }

  deleteLine(index, model) {
    this._service.deleteDetailsLine('rolesTaskFlowAccess', index, model);
  }

  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);

  }

  valueChanged(index,model, event){
  this.inputService.updateInputCache(this._shared.getRolesAppAccessPath(index,'applicationId'), model.applicationId,model.roleAppAssignmentId)
  }
  rowSelected(event) {

    let index = this._shared.formData.rolesAppAccess.findIndex(data => {
      return event.model.applicationShortCode == data.applicationShortCode
    })
    let path = this._shared.getRolesAppAccessPath(index, 'isAllowed');
    this._shared.selectedApplicationCode = event.model.applicationShortCode;
    let val = this.inputService.getInputValue(path);
    this._shared.selectedAppAccess = val;
    this._service.loadData(this.key);
  }

  copyFromTaskFlow() {
    let lovConfig: any = {};
    lovConfig = JSON.parse(JSON.stringify(CopyFromTaskFlowLovConfig));
    lovConfig.url += this._shared.id + "?applicationCode=" + this._shared.selectedApplicationCode;
    const dialogRef = this.dialog.open(TnzInputLOVComponent);
    dialogRef.componentInstance.lovConfig = lovConfig;
    dialogRef.afterClosed().subscribe(resArray => {
      let unAddedOrderLines = [];
      if (resArray && resArray.length) {
        resArray.forEach(res => {
          res = this.mapResToRolesTaskFlowAccess(res);
          let taskFlowAccessLineIndex = this._shared.formData.rolesTaskFlowAccess.findIndex(data => {
            return res.taskFlowId == data.taskFlowId
          });

          if (taskFlowAccessLineIndex == -1) {
            this._shared.addLine('rolesTaskFlowAccess', res,false);
          } else {
            unAddedOrderLines.push(res)
          }
        });

//--------------------------------------------------------------------------------
    this.rolesTaskFlowAccessTable.refresh(this._shared.formData[this.key]);
//--------------------------------------------------------------------------------
        if (unAddedOrderLines.length) {
          this.alertUtils.showAlerts(unAddedOrderLines.length + " line(s) are not copied as they already exist.")
        }
      }
    })
  }

  mapResToRolesTaskFlowAccess(res: any): any {
    let model = new RolesTaskFlowAccess();
    model.roleTaskFlowAssignmentId = "0";
    model.roleId = this._shared.id;
    model.taskFlowId = res.taskFlowId ? res.taskFlowId : "0";
    model.taskFlowName = res.taskFlowName ? res.taskFlowName : "";
    model.description = res.description ? res.description : "";
    model.isRead = res.isRead ? res.isRead : "";
    model.isEdit = res.isEdit ? res.isEdit : "";
    model.isCreate = res.isCreate ? res.isCreate : "";
    model.isDelete = res.isDelete ? res.isDelete : "";
    model.active =res.active?res.active: "";
    return model;
  }

}
