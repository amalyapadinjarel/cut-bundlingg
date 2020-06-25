import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { UserService } from 'app/shared/services';
import { UserSharedService } from '../_service/user-shared.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild(SmdDataTable,{static:true}) dataTable:SmdDataTable;

  public listData: any;

 
  constructor(
    private service:UserService,
    public _shared:UserSharedService,
    private router:Router) { }

  ngOnInit(): void {

    if(this._shared.listData){
      if(this._shared.columnFilterValues){
        this.dataTable.setColumnFilterInputValues(this._shared.columnFilterValues);
      }

      this.dataTable.refresh(this._shared.listData);
    }
  }

//for handling pagenation to list from where the form was opened
pageChanged(event) {
  this._shared.selectedPage = event.page;
}

  rowSelected(event){
  // this._shared.id=event.model.userId;
    if(event.selected){
      this.router.navigateByUrl("/user/"+event.model.userId);
    }
  }

  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.users) {
      this._shared.setListData(dataChange.data);
      this._shared.listConfig.offset = dataChange.offset;
      this._shared.listConfig.limit = dataChange.limit;
      this._shared.columnFilterValues = dataChange.columnFilterValues;
    }
  }
  _onPageChange(pageChangeEvent: any) {
    this._shared.selectedPage = pageChangeEvent.page;
  }

}
