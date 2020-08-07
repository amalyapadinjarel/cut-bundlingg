import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RolesSharedService } from './_service/roles-shared.service';
import { UserService, NavigationService, DocumentService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Location } from '@angular/common';
import { RolesService } from './_service/roles.service';
import { ConfirmPopupComponent } from 'app/shared/component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
  title = 'roles';

  constructor(
    private router: Router,
    private location: Location,
    public _shared: RolesSharedService,
    public _service: RolesService,
    private alertutils: AlertUtilities,
    private navService: NavigationService,
    private userService: UserService,
    private dialog: MatDialog,
    private docService: DocumentService,
    public inputservice: TnzInputService

  ) {

    this._shared.init();

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this._shared.clear();
  }

  newRoles(): Promise<boolean> {
    return new Promise(success => {
      this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
        .then(() => {
          this.router.navigateByUrl('/roles/create').then(done => {
            if (done) {
              this._shared.editMode = true;
              this._shared.initLocalCache();
              this._shared.fetchAppData.next(true);
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

  editRoles() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(data => {
        this.location.go('roles/' + this._shared.id + '/edit');
        this._shared.editMode = true;
       this._shared.initLocalCache();
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }

  cancelEdit() {
    if (this._shared.id != 0) {
      this.location.go('/roles/' + this._shared.id);
      this._shared.editMode = false;
      this._shared.initLocalCache();
      this._shared.resetLines();
    }
    else {
      this.router.navigateByUrl('/roles/list').then(done => {
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

  //method to clone
  copyRoles() {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.componentInstance.confirmText = 'CONFIRM';
    dialogRef.componentInstance.dialogTitle = 'Copy Role: <role>';
    dialogRef.componentInstance.message = 'Are you sure you want to copy the selected role ?'
    dialogRef.afterClosed().subscribe(flag => {
      if (flag) {
        this._service.copyRoles().then((data: any) => {
          if (data) {
            this.newRoles().then(success => {
              if (success) {
                let form = JSON.parse(JSON.stringify(this._shared.formData));
                console.log("form=",form);
                console.log("data=",data);
                this._shared.id = 0;
                this._shared.formData = {};
                data.role.roleId = 0;
                // data.header.roleShortCode = '';
                // data.header.roleName += '-Copy';
                Object.keys(data.role).forEach(key => {
                  this.inputservice.updateInput(this._shared.getHeaderAttrPath(key), data.role[key]);
                })
                data.roleApplicationAccess.forEach((row, idx) => {
                  Object.keys(row).forEach((key) => {
                    if (key == this._shared.primaryKey || key == this._shared.rolesAppAccessPrimaryKey)
                      this.inputservice.updateInput(this._shared.getRolesAppAccessPath(idx, key), 0);
                    else
                      this.inputservice.updateInput(this._shared.getRolesAppAccessPath(idx, key), row[key]);
                  })
                })

                data.roleUsers.forEach((row, idx) => {
                  Object.keys(row).forEach((key) => {
                    if (key == this._shared.primaryKey || key == this._shared.roleUsersPrimaryKey)
                      this.inputservice.updateInput(this._shared.getRoleUsersPath(idx, key), 0);
                    else
                      this.inputservice.updateInput(this._shared.getRoleUsersPath(idx, key), row[key]);
                  })
                })

                data.roleTaskFlowAccess.forEach((row, idx) => {
                  Object.keys(row).forEach((key) => {
                    if (key == this._shared.primaryKey || key == this._shared.rolesTaskFlowAccessPrimaryKey)
                      this.inputservice.updateInput(this._shared.getRolesTaskFlowAccessPath(idx, key), 0);
                    else
                      this.inputservice.updateInput(this._shared.getRolesTaskFlowAccessPath(idx, key), row[key]);
                  })
                })

                data.roleOrgAccess.forEach((row, idx) => {
                  Object.keys(row).forEach((key) => {
                    console.log("key=",key)
                    if (key == this._shared.primaryKey || key == this._shared.rolesOrgAccessPrimaryKey)
                      this.inputservice.updateInput(this._shared.getRolesOrgAccessPath(idx, key), 0);
                    else
                      this.inputservice.updateInput(this._shared.getRolesOrgAccessPath(idx, key), row[key]);
                  })
                })

              }else{
                console.log("fail")
              }
            });
          }
        }).catch(err => {
          this.alertutils.showAlerts(err)
        })
      }
    })

  }

}
