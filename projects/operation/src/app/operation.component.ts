import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OperationSharedService } from './_service/operation-shared.service';
import { UserService, NavigationService, DocumentService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Location } from '@angular/common';
import { OperationService } from './_service/operation.service';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationComponent {
  title = 'Operation';

  constructor(
    private router: Router,
    private location: Location,
    public _shared: OperationSharedService,
    public _service: OperationService,
    private alertutils: AlertUtilities,
    private navService: NavigationService,
    private userService: UserService,
    private dialog: MatDialog,
    private docService: DocumentService

  ) {

    this._shared.init();

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this._shared.clear();
  }

  newOperation() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
      .then(() => {
        if(!this._shared.editMode)     this._shared.initLocalCache();
        this._shared.editMode = true;
        this._shared.addLine('operations');
      }).catch(err => {
        this.alertutils.showAlerts(err);
      })
  }

  editOperation() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(data => {
        this._shared.editMode = true;
        this._shared.initLocalCache();
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }

  cancelEdit() {
    this._shared.editMode = false;
    this._shared.initLocalCache();
    this._shared.resetLines();
  }

  save(exit = true) {
    this._service.save(exit)
      .then((flag) => {
        if (flag && exit)   this.cancelEdit();
           }).catch(err => {
        this.alertutils.showAlerts(err)
      })
  }

}
