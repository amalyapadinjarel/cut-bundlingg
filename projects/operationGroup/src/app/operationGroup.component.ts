import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OperationGroupSharedService } from './services/operationGroup-shared.service';
import { OperationGroupService } from './services/operationGroup.service';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { DocumentService } from 'app/shared/services';

@Component({
  templateUrl: './operationGroup.component.html',
  styleUrls: ['./operationGroup.component.scss']
})
export class OperationGroupComponent {
  constructor(
    private router: Router,
    public _shared: OperationGroupSharedService,
    public _service: OperationGroupService,
    private alertutils: AlertUtilities,
    private _inputService: TnzInputService,
    private docService: DocumentService
  ) {
    this._shared.init();
  }

  ngOnDestroy() {
    this._shared.clear();
  }

  ngOnInit() {

  }

  editOpGrp() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(data => {
        this._shared.editMode = true;
        this._shared.initLocalCache();
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }
  cancelAction() {
    this._shared.editMode = false;
    this._shared.initLocalCache();
    this._shared.resetLines();
  }

  saveAction(exit = true) {
    this._service.save(exit)
      .then((flag) => {
        if (flag && exit) {
          this.cancelAction();
        }
      })
      
  }

  addNewLine() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
      .then(data => {
        if (!this._shared.editMode) {
          this._shared.initLocalCache();
        }
        this._shared.editMode = true;
        this._shared.addLine('operationGroup');
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }

}
