import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { RolesSharedService } from '../../_service/roles-shared.service';
import { RolesService } from '../../_service/roles.service';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'app-taskflow',
  templateUrl: './taskflow.component.html',
  styleUrls: ['./taskflow.component.scss']
})
export class TaskFlowComponent implements OnInit {

  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

  disabled: any = {};

  private refreshSub: Subscription;
  private refreshTFAccessSub: Subscription;
  private refreshAppAccessSub: Subscription;
  
  public key = 'rolesTaskFlowAccess';

  constructor(
    public _shared: RolesSharedService,
    private _service: RolesService,
    private alertUtils: AlertUtilities,
    public dialog: MatDialog,
    private cache: LocalCacheService,
    private inputService: TnzInputService

  ) { }

  ngOnInit(): void {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
      this._service.loadData(this.key);
    })
    this.refreshTFAccessSub = this._shared.refreshTaskFlowAccessData.subscribe(change => {
      this.refreshTable();
    })
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
    if (this.refreshTFAccessSub) this.refreshTFAccessSub.unsubscribe();
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
