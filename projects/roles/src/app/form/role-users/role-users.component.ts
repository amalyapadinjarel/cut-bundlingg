import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RolesSharedService } from '../../_service/roles-shared.service';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { RolesService } from '../../_service/roles.service';
import { DateUtilities } from 'app/shared/utils';

@Component({
  selector: 'role-users',
  templateUrl: './role-users.component.html',
  styleUrls: ['./role-users.component.scss']
})
export class RoleUsersComponent implements OnInit, OnDestroy {

  disabled:any={};
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  private refreshSub: Subscription;
	private refreshRoleUsers: Subscription;
  public key = 'roleUsers';
  

  constructor(
    public _shared:RolesSharedService,
    private _service:RolesService,
    public dateUtils:DateUtilities
  ) { }

   ngOnInit(): void {
    this.refreshSub=this._shared.refreshData.subscribe(change=>{
      this._service.loadData(this.key);
    })

     this.refreshRoleUsers=this._shared.refreshRoleUsersData.subscribe(change=>{
      this.refreshTable();

    })
  }

  ngOnDestroy(): void {
    if(this.refreshSub)    this.refreshSub.unsubscribe();
    if(this.refreshRoleUsers)   this.refreshRoleUsers.unsubscribe();
  }

  onRowSelected(){
    this._shared.setSelectedLines(this.key,this.dataTable.selectedModels())
  }

  refreshTable(){
    this.dataTable.refresh(this._shared.formData[this.key]);
  }

  deleteLine(index,model){
    this._service.deleteDetailsLine(this.key,index,model);

  }

  getIfEditable(key){
    return !this.disabled[key]&&this._shared.getHeaderEditable(key,this._shared.id);

  }
}
