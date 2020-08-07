import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { RolesSharedService } from '../../_service/roles-shared.service';
import { RolesService } from '../../_service/roles.service';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { LocalCacheService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import {TaskFlowComponent} from '../taskflow/taskflow.component';
@Component({
  selector: 'app-application-group',
  templateUrl: './application-group.component.html',
  styleUrls: ['./application-group.component.scss']
})
export class ApplicationGroupComponent implements OnInit {

  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

  disabled: any = {};

  private refreshSub: Subscription;
  private refreshAppAccessSub: Subscription;
  private refreshTFAccessSub:Subscription;
  
  // private tf: TaskFlowComponent  ;
//------------------------------------------------
  // =new TaskFlowComponent(RolesSharedService,
  //  RolesService,
  //   AlertUtilities,
  //  MatDialog,
  //  LocalCacheService,
  //  TnzInputService);

  public key = 'rolesAppAccess';

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
    this.refreshAppAccessSub = this._shared.refreshAppAccessData.subscribe(change => {
      this.refreshTable();
    })

    // this.refreshTFAccessSub=this._shared.refreshTaskFlowAccessData.subscribe(change=>{
    // this.tf.dataTable.refresh(this._shared.formData['rolesTaskFlowAccess']);
    //     })
  }

  ngOnDestroy(): void {
    if (this.refreshSub) this.refreshSub.unsubscribe();
    if (this.refreshAppAccessSub) this.refreshAppAccessSub.unsubscribe();
  }

 
  rowSelected(event) {
    this._shared.selectedApplicationCode=event.model.applicationShortCode;
  //  this._shared.selectedAppAccess=event.model.isAllowed;
    this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
    let selectedRow=this._shared.selectedLines[this.key];
  }

  onAllRowSelected() {
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