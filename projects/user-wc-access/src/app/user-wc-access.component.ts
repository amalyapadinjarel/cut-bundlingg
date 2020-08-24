import { Component,OnInit } from '@angular/core';
import { UserWcAccessSharedService } from './_services/user-wc-access-shared.service';
import { DocumentService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { UserWcAccessService } from './_services/user-wc-access.service';
import { CopyFromUserComponent } from './copy-from-user/copy-from-user.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
 
  templateUrl: './user-wc-access.component.html',
  styleUrls: ['./user-wc-access.component.scss']
})
export class UserWcAccessComponent implements OnInit{
  title = 'user-wc-access';
  constructor(
    public _shared: UserWcAccessSharedService,
    private docService: DocumentService,
    private alertutils: AlertUtilities,
    public _service:UserWcAccessService,
    private dialog: MatDialog
  ){

  }
  ngOnInit(){
    this._shared.refreshData.next(true);
  }  
  newLine(){
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
      .then(data => {
        if (!this._shared.editMode) {
          this._shared.initLocalCache();
        }
        this._shared.editMode = true;
        this._shared.addLine('userWcAccess');
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }
  CopyUser(){
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
    .then(data => {

      const dialogRef = this.dialog.open(CopyFromUserComponent);
    })
    .catch(err => {
      this.alertutils.showAlerts(err)
    })
  }
  edit(){
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
    .then(data => {
      this._shared.editMode = true;
      this._shared.initLocalCache();
    })
    .catch(err => {
      this.alertutils.showAlerts(err)
    })
  }
  save(exit = true){
    this._service.save(exit)
    .then((flag) => {
      if (flag && exit) {
        this.cancelEdit();
      }
    })
  }
  cancelEdit(){
    this._shared.editMode = false;
    this._shared.initLocalCache();
    this._shared.resetLines();
  }
}
 