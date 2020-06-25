import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UserSharedService } from '../../_service/user-shared.service';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { UserAppService } from '../../_service/user.service';
import { DateUtilities } from 'app/shared/utils';

@Component({
  selector: 'user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit, OnDestroy {

  disabled:any={};
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  private refreshSub: Subscription;
	private refreshUserRoles: Subscription;
  public key = 'userRoles';
  

  constructor(
    public _shared:UserSharedService,
    private _service:UserAppService,
    public dateUtils:DateUtilities
  ) { }

   ngOnInit(): void {
    this.refreshSub=this._shared.refreshData.subscribe(change=>{
      this._service.loadData(this.key);
    })

     this.refreshUserRoles=this._shared.refreshUserRolesData.subscribe(change=>{
      this.refreshTable();

    })
  }

  ngOnDestroy(): void {
    if(this.refreshSub)    this.refreshSub.unsubscribe();
    if(this.refreshUserRoles)   this.refreshUserRoles.unsubscribe();
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
