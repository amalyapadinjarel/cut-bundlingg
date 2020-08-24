import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { UserService } from 'app/shared/services';
import { RolesSharedService } from '../_service/roles-shared.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RolesService } from '../_service/roles.service';

@Component({
  selector: 'roles-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild(SmdDataTable,{static:true}) dataTable:SmdDataTable;

  public listData: any;

 
  constructor(
    private service:RolesService,
    public _shared:RolesSharedService,
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
  this._shared.id=event.model.roleId;
    if(event.selected){
      this.router.navigateByUrl("/roles/"+event.model.roleId);
    }
  }

  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.roles) {
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
