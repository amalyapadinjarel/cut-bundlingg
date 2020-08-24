import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSharedService } from './_service/user-shared.service';
import { UserService, NavigationService, DocumentService } from 'app/shared/services';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Location } from '@angular/common';
import { UserAppService } from './_service/user.service';
import { Subscription } from 'rxjs';
import { ConfirmPopupComponent } from 'app/shared/component';

@Component({
  selector: 'app-root',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  title = 'user';

  private refreshSub: Subscription;

  constructor(
    private router: Router,
    private location: Location,
    public _shared: UserSharedService,
    public _service: UserAppService,
    private alertutils: AlertUtilities,
    private navService: NavigationService,
    private userService: UserService,
    private dialog: MatDialog,
    private docService: DocumentService,
    public _inputService: TnzInputService,
    public alertUtils: AlertUtilities

  ) {

    this._shared.init();

  }

  ngOnInit() {

    // this.refreshSub=this._shared.refreshData.subscribe(change=>{

    //  })
  }

  ngOnDestroy() {
    this._shared.clear();
  }

  // newUser() {
  //   this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
  //     .then(() => {
  //       this.router.navigateByUrl('/user/create').then(done => {
  //         this._shared.editMode = true;
  //         this._shared.initLocalCache();

  //       }).catch((err) => { console.log('Caught Exception on create!', err) });
  //       //}
  //     }).catch(err => {
  //       this.alertutils.showAlerts(err);
  //     })
  // }



  newUser(): Promise<boolean> {
    return new Promise(success => {
      this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
        .then(() => {
          this.router.navigateByUrl('/user/create').then(done => {
            if (done) {
              this._shared.editMode = true;
              this._shared.id=0; //??
              this._shared.initLocalCache();
              success(true);
            }
            else {
              success(false);
            }
          }).catch((err) => {
            success(false);
            console.log('Caught Exception on create!', err)
          });
        }).catch(err => {
          success(false);
          this.alertutils.showAlerts(err);
        })
    });
  }


  editUser() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(data => {
        this.location.go('user/' + this._shared.id + '/edit');
        this._shared.editMode = true;
        this._shared.initLocalCache();
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }

  cancelEdit() {
    if (this._shared.id != 0) {
      this.location.go('/user/' + this._shared.id);
      this._shared.editMode = false;
      this._shared.initLocalCache();
      this._shared.resetLines();
    }
    else {
      this.router.navigateByUrl('/user/list').then(done => {
        this._shared.editMode = false;
        this._shared.initLocalCache();
      });
    }
  }

  save(exit = false) {
    this._service.save(exit)
      .then((flag) => {
        if (flag && exit) {
          this.cancelEdit();
        }
      })
  }

  unlock() {
    this._service.unlock().then(data => {
      this.alertUtils.showAlerts("User account has been unlocked successfully.")

    }).catch(err => {
      console.log("Error", err)
    });
  }

  copyUser() {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.componentInstance.confirmText = 'CONFIRM';
    dialogRef.componentInstance.dialogTitle = 'Copy User -';
    dialogRef.componentInstance.value = this._shared.getHeaderAttributeValue('userName');

    dialogRef.componentInstance.message = 'Are you sure you want to copy the selected user ?'
    dialogRef.afterClosed().subscribe(flag => {
      if (flag) {
        this.setNewFormData();
      }
    })

  }

  //main method 
  copy() {
    if (this._shared.getHeaderData()) {
      this.copyUser();
    } else {
      this.copyUserFromListView();
    }
  }

  copyUserFromListView() {
    this._service.fetchFormData(this._shared.id).then((data: any) => {
      this._shared.setFormHeader(data);
      let dialogRef = this.dialog.open(ConfirmPopupComponent);
      dialogRef.componentInstance.confirmText = 'CONFIRM';
      dialogRef.componentInstance.message = 'Are you sure you want to copy the selected user ?'
      dialogRef.componentInstance.dialogTitle = 'Copy User -';
      dialogRef.componentInstance.value = this._shared.getHeaderAttributeValue('userName');

      dialogRef.afterClosed().subscribe(flag => {
        if (flag) {
          Promise.all([
            this._service.loadData('userRoles'),
            this._service.loadData('userOrgAccess')

          ]).then(res => {
            if (res) {
              this.setNewFormData();
            }
          });

        }
      });
    }, err => {
      if (err) {
        this.alertUtils.showAlerts(err, true);
      }
    });
  }



  setNewFormData() {
    let excludeKey = ['creationDate', 'createdBy', 'lastUpdateDate', 'lastUpdatedBy', 'roleStartDate', 'roleEndDate'];
    this.newUser().then(success => {
      if (success) {
        let form = JSON.parse(JSON.stringify(this._shared.formData));
        this._shared.id = 0;
        this._shared.formData = {};
        form.header.userId = 0;

        form.userRoles.forEach((row, idx) => {
          Object.keys(row).forEach((key) => {
          //  if(key=="roleUserAssignmentId")
          //    console.log("key",key)
            if (key == this._shared.primaryKey || key == this._shared.userRolesPrimaryKey)
              this._inputService.updateInput(this._shared.getUserRolesPath(idx, key), 0);
            else if (key == 'roleStartDate') {
              this._inputService.updateInput(this._shared.getUserRolesPath(idx, key), DateUtilities.formatDate(new Date()))
            }
            else if (key == 'active') {
              this._inputService.updateInput(this._shared.getUserRolesPath(idx, key), 'Y')
            }
            else if (excludeKey.indexOf(key) == -1)
              this._inputService.updateInput(this._shared.getUserRolesPath(idx, key), row[key] || null);
          })
        })

        form.userOrgAccess.forEach((row, idx) => {
          Object.keys(row).forEach((key) => {
            if (key == this._shared.primaryKey || key == this._shared.userOrgAccessPrimaryKey)
              this._inputService.updateInput(this._shared.getUserOrgAccessPath(idx, key), 0);
            else if (excludeKey.indexOf(key) == -1)
              this._inputService.updateInput(this._shared.getUserOrgAccessPath(idx, key), row[key]);
          })
        })

      } else {
        console.log("fail")
      }
    });
  }

}
