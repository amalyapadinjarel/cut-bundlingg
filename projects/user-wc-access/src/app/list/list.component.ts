import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { UserWcAccessSharedService } from '../_services/user-wc-access-shared.service';
import { Subscription } from 'rxjs';
import { UserLovConfig, facilityLovConfig, WorkcenterLovConfig } from '../Models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { UserWcAccessService } from '../_services/user-wc-access.service';
@Component({
  selector: 'user-wc-access-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit, OnDestroy {
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  private refreshSub: Subscription;
  private refreshLoadData: Subscription;
  UserLov = JSON.parse(JSON.stringify(UserLovConfig));
  
  
  constructor(public _shared: UserWcAccessSharedService,
    public _inputService: TnzInputService,
    private _service:UserWcAccessService  ) { }

  ngOnInit(): void {
   
    this.refreshLoadData = this._shared.refreshData.subscribe(change => {
      this._service.loadData();
  

    });
    this.refreshSub = this._shared.refreshUserWcAccessData.subscribe(
      change => {
        if(change) {
      
        this.refreshTable();
       
     
      }
       
      }
    );

  }
  ngOnDestroy(): void {
    this.refreshSub.unsubscribe();
    this.refreshLoadData.unsubscribe();
  }
  workCenterLov(index) {
  
    let cache = this._inputService.getInputValue(this._shared.getuserWcAccessAttrPath(index,'facility'))
    return JSON.parse(JSON.stringify(WorkcenterLovConfig(cache ? cache.value != "" ? cache.value: null: null)));
  }
  facilityLov(index) {
    let cache = this._inputService.getInputValue(this._shared.getuserWcAccessAttrPath(index,'userName'))
    return JSON.parse(JSON.stringify(facilityLovConfig(cache ? cache.userId != "" ? cache.userId: null : null)));
  }
  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.userWcAccess) {
      this._shared.setListData(dataChange.data);
    }
  }
  refreshTable(){
  this.dataTable.refresh(this._shared.formData['userWcAccess'])
}
  pageChanged(event) {
    this._shared.selectedPage = event.page;
  }
  _onPageChange(pageChangeEvent: any) {
    this._shared.selectedPage = pageChangeEvent.page;
  }
  valueChangedFromUI(index, key, primaryKeyvalue = null) {

    if (primaryKeyvalue == 0) {
      if(key==='facility'){
  
      this._inputService.updateInput(this._shared.getuserWcAccessAttrPath(index, 'workCenter'), '');
      this._shared.formData["userWcAccess"][index].workCenter = "";
    }
      if(key==='userName'){
        
      this._inputService.updateInput(this._shared.getuserWcAccessAttrPath(index, 'facility'), '');
      this._inputService.updateInput(this._shared.getuserWcAccessAttrPath(index, 'workCenter'), '');
      this._shared.formData["userWcAccess"][index].facility = "";
      this._shared.formData["userWcAccess"][index].workCenter = "";
    }
    }
    else {
      if(key==='facility'){
     
      this._shared.formData["userWcAccess"][index].workCenter = "";
    }
      if(key==='userName'){
       
      this._shared.formData["userWcAccess"][index].facility = "";
      this._shared.formData["userWcAccess"][index].workCenter = "";
    }
    }



  }

}
