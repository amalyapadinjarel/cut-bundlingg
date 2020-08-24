import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DefectGroupSharedService } from './services/defect-group-shared.service';
import { DefectGroupService } from './services/defect-group.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { DocumentService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'app/shared/component';

@Component({
  templateUrl: './defect-group.component.html',
  styleUrls: ['./defect-group.component.scss']
})
export class DefectGroupComponent {
  title = 'defect-group';

  constructor(
    private router: Router,
    public _shared: DefectGroupSharedService,
    public _service: DefectGroupService,
    private _inputService: TnzInputService,
    private location: Location,
    private dialog: MatDialog,
    public docService: DocumentService,
    private alertutils: AlertUtilities,
  ) {  }

  ngOnDestroy() {
    this._shared.clear();
  }

  ngOnInit() {

  }
  cancelEdit() {
    if (this._shared.id > 0) {
      this.location.go('/defect-group/' + this._shared.id);
      this._shared.editMode = false;
      this._shared.initLocalCache();
      this._shared.resetLines();
      this._shared.refreshdefectGroupHeaderData.next(true);
    } else {
      this.router.navigateByUrl('/defect-group/list').then(done => {
        this._shared.editMode = false;
        this._shared.initLocalCache();
      });
    }
  }

  save(exit = false) {
    this._service.save(exit).then((flag) => {
      if (flag && exit) {
        this.cancelEdit();
      }
    })
  }

  create() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
      .then(() => {
        if (this._shared.id != 0) {
          this.location.go('/defect-group/create');
          this._shared.id = 0;
          this._service.inputService.resetInputCache(this._shared.appPath);
          this._shared.resetLines()
          this._shared.editMode = true;
          this._shared.initLocalCache();
          this._shared.refreshdefectGroupHeaderData.next(true);
          this._inputService.updateInput(this._shared.getdefectGroupHeaderAttrPath('active'), 'Y');
        }
        else {
          this.router.navigateByUrl('/defect-group/create').then(done => {
            this._shared.editMode = true;
            this._shared.initLocalCache();
            if (this._shared.id == 0) {
              this._inputService.updateInput(this._shared.getdefectGroupHeaderAttrPath('active'), 'Y');
            }
          }).catch(reason => console.log(reason))
        }
       
      }).catch(err => {
        this.alertutils.showAlerts(err)
      })
   
  }


  edit() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(() => {

        this.location.go('defect-group/' + this._shared.id + '/edit')
        this._shared.editMode = true;
        this._shared.initLocalCache();

      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }
}
