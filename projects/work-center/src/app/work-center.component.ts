import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WorkCenterSharedService } from './services/work-center-shared.service';
import { WorkCenterService } from './services/work-center.service';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { DocumentService } from 'app/shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './work-center.component.html',
  styleUrls: ['./work-center.component.scss']
})
export class WorkCenterComponent {
  title = 'work-center';

  constructor(
    private router: Router,
    public _shared: WorkCenterSharedService,
    public _service: WorkCenterService,
    private alertutils: AlertUtilities,
    private _inputService: TnzInputService,
    private docService: DocumentService
  ) { this._shared.init() }

  ngOnDestroy() {
    this._shared.clear();
  }

  ngOnInit(): void {}

  edit() {
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
        this._shared.addLine('workCenter');
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }
}
