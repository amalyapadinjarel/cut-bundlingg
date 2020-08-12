import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { UserWcAccessSharedService } from '../_services/user-wc-access-shared.service';
import { Subscription } from 'rxjs';
import { UserLovConfig, facilityLovConfig, WorkcenterLovConfig } from '../Models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
@Component({
  selector: 'user-wc-access-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit, OnDestroy {
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  private refreshSub: Subscription;
  UserLov = JSON.parse(JSON.stringify(UserLovConfig));
  facilityLov = JSON.parse(JSON.stringify(facilityLovConfig));
  WorkcenterLov = JSON.parse(JSON.stringify(WorkcenterLovConfig));
  constructor(public _shared: UserWcAccessSharedService,
    public _inputService: TnzInputService) { }

  ngOnInit(): void {
    this.refreshSub = this._shared.refreshUserWcAccessData.subscribe(
      change => {


        this.dataTable.refresh(this._shared.formData['userWcAccess'])
      }
    );

  }
  ngOnDestroy(): void {
    this.refreshSub.unsubscribe();
  }
  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.userWcAccess) {
      this._shared.setListData(dataChange.data);
    }
  }
  pageChanged(event) {
    this._shared.selectedPage = event.page;
  }
  _onPageChange(pageChangeEvent: any) {
    this._shared.selectedPage = pageChangeEvent.page;
  }
  valueChangedFromFacility(index, event, primaryKeyvalue = null) {

    if (primaryKeyvalue == 0) {
      this._inputService.updateInput(this._shared.getuserWcAccessAttrPath(index, 'workCenter'), '');
    }
    else {
      this._shared.formData["userWcAccess"][index].workCenter = "";
    }

    let wcParam = `?facility=${event.value.value}`;
    let wcUrl = 'lovs/work-center';
    let newUrl = wcUrl + wcParam
    this.WorkcenterLov = { ...this.WorkcenterLov, url: newUrl };


  }

}
