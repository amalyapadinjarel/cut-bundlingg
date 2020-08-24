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
  styleUrls: ['./application.component.scss']

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
    public dialog: MatDialog,
    private inputService: TnzInputService) {

  }

  ngOnInit(): void {

   // this._shared.selectedIndex=0;
    this.refreshSub = this._shared.refreshData.subscribe(change => {
      Promise.all([
        this._service.loadData('rolesAppAccess'),
        // this._service.fetchRolesAppAccess(this._shared.id),
        this._service.loadData(this.key)
      ]).then(res => {
        if (res[0] && res[1])
          this.mapMenuToApps();
      })

    })

 

    this.refreshAppAccessSub = this._shared.refreshAppAccessData.subscribe(change => {
      this.rolesAppAccessTable.refresh(this._shared.formData['rolesAppAccess']);
    })
    this.refreshTFAccessSub = this._shared.refreshTaskFlowAccessData.subscribe(change => {
      if (this._shared.formData['rolesAppAccess'] && this._shared.formData['rolesAppAccess'][this._shared.selectedIndex])
        this.rolesTaskFlowAccessTable.refresh(this._shared.formData['rolesAppAccess'][this._shared.selectedIndex].isAllowed == 'Y' ? this._shared.formData['rolesAppAccess'][this._shared.selectedIndex].rolesTaskFlowAccess : []);

        // let activeIndex = this._shared.formData.rolesAppAccess.findIndex(data => {
        //   return data.isAllowed == 'Y';
        // });
        // this.rolesTaskFlowAccessTable.refresh(activeIndex?this._shared.formData['rolesAppAccess'][activeIndex].rolesTaskFlowAccess : [])
    })
  }

  mapMenuToApps() {
    this._shared.formData['rolesAppAccess'].forEach((app, i) => {
      if (app)
        this._shared.formData['rolesAppAccess'][i].rolesTaskFlowAccess = this._shared.formData[this.key].filter(item => {
          return app.applicationShortCode == item.applicationShortCode;
        });
    });
   this._shared.setLines('rolesAppAccess', this._shared.formData['rolesAppAccess']);
  //  let activeIndex = this._shared.formData.rolesAppAccess.findIndex(data => {
  //   return data.isAllowed == 'Y';
  // })
  // console.log("activeIndex:",activeIndex)
  // this.rolesTaskFlowAccessTable.refresh(activeIndex?this._shared.formData['rolesAppAccess'][activeIndex].rolesTaskFlowAccess : [])
   
  if (this._shared.formData['rolesAppAccess'] && this._shared.formData['rolesAppAccess'][this._shared.selectedIndex])
      this.rolesTaskFlowAccessTable.refresh(this._shared.formData['rolesAppAccess'][this._shared.selectedIndex].isAllowed == 'Y' ? this._shared.formData['rolesAppAccess'][this._shared.selectedIndex].rolesTaskFlowAccess : []);
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
    this._shared.deleteLine('rolesTaskFlowAccess', index);
  }

  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);

  }

  valueChanged(index, model, event) {
    this.rolesTaskFlowAccessTable.refresh(event.value == 'Y' ? this._shared.formData['rolesAppAccess'][index].rolesTaskFlowAccess : []);
    this.inputService.updateInputCache(this._shared.getRolesAppAccessPath(index, 'applicationId'), model.applicationId, model.roleAppAssignmentId)
  }

  rowSelected(event) {
    let index = this._shared.formData.rolesAppAccess.findIndex(data => {
      return event.model.applicationShortCode == data.applicationShortCode
    })
    this._shared.selectedIndex = index;
    this.rolesTaskFlowAccessTable.refresh(this._shared.selectedAppAccess == 'Y' ? this._shared.formData['rolesAppAccess'][this._shared.selectedIndex].rolesTaskFlowAccess || [] : []);
  }

}
