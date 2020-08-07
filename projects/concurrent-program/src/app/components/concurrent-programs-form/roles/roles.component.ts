import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SmdDataTable } from 'app/shared/component';
import { ConcurrentProgramSharedService } from '../../../services/concurrent-program-shared.service';
import { ConcurrentProgramService } from '../../../services/concurrent-program.service';
import { RolesLovConfig } from '../../../models/concurrent-programs-lov-config';

@Component({
  selector: 'concurrent-programs-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  key = 'rolesDetails'
	private refreshSub: Subscription;
	private rolesDetails: Subscription;
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  roleLov = JSON.parse(JSON.stringify(RolesLovConfig));

  constructor(public _shared: ConcurrentProgramSharedService,
    public _service: ConcurrentProgramService) { }

  ngOnInit() {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
        this._service.loadData(this.key);
    });
    this.rolesDetails = this._shared.refreshrolesDetails.subscribe(change => {
      if (change)
        this.refreshTable();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSub)
      this.refreshSub.unsubscribe();
    if (this.rolesDetails)
      this.rolesDetails.unsubscribe();
  }

  deleteLine(index){
    this._shared.deleteLine(this.key,index);
  }

  refreshTable() {
    let roles = this._shared.formData[this.key].map((role,index)=>{
      role.sequence = index + 1;
      return role;
    })
    this.dataTable.refresh(roles);
  }

}
