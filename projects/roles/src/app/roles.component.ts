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
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';

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
    private alertUtils: AlertUtilities,
    private dialog: MatDialog,
    private docService: DocumentService,
    public _inputService: TnzInputService

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
            //this._shared.fetchAppData.next(true);
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
          this.alertUtils.showAlerts(err);
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
        this.alertUtils.showAlerts(err)
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
    this._shared.copy=false;
    this._service.save(exit)
      .then((flag) => {
        if (flag && exit) {
          this.cancelEdit();
        }
      })
  }

  //main method 
  copy() {
    this._shared.copy=true;
      if (this._shared.getHeaderData()) {
      this.copyRoles();
    } else {
      this.copyRolesFromListView();
    }
  }

  mapMenuToApps() {
    this._shared.formData['rolesAppAccess'].forEach((app, i) => {
      if (app)
        this._shared.formData['rolesAppAccess'][i].rolesTaskFlowAccess = this._shared.formData['rolesTaskFlowAccess'].filter(item => {
          return app.applicationShortCode == item.applicationShortCode;
        });
    });
    this._shared.setLines('rolesAppAccess', this._shared.formData['rolesAppAccess']);
    // if (this._shared.selectedIndex > -1) {
      this._shared.refreshTaskFlowAccessData.next(true);
    // }
  }

  copyRolesFromListView() {
    this._service.fetchFormData(this._shared.id).then((data: any) => {
      this._shared.setFormHeader(data);

      let dialogRef = this.dialog.open(ConfirmPopupComponent);
      dialogRef.componentInstance.confirmText = 'CONFIRM';
      dialogRef.componentInstance.message = 'Are you sure you want to copy the selected role ?'
      dialogRef.componentInstance.dialogTitle = 'Copy Role -';
      dialogRef.componentInstance.value = this._shared.getHeaderAttributeValue('roleShortCode');

      dialogRef.afterClosed().subscribe(flag => {
        if (flag) {
          Promise.all([
            this._service.loadData('roleUsers'),
            this._service.loadData('rolesOrgAccess'),
            this._service.loadData('rolesAppAccess'),
            this._service.loadData('rolesTaskFlowAccess')
          ]).then(res => {
            if (res[0] && res[1] && res[2] && res[3]) {
              if (res[2] && res[3]) {
                this.mapMenuToApps();
              }

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

setNewFormData(){
  this.newRoles().then(success => {

    if (success) {
      let form = JSON.parse(JSON.stringify(this._shared.formData));
      this._shared.id = 0;
      this._shared.formData = {};
      form.header.roleId = 0;

        form.rolesAppAccess.forEach((row, idx) => {
        Object.keys(row).forEach((key) => {
          if (key == this._shared.primaryKey || key == this._shared.rolesAppAccessPrimaryKey)
            this._inputService.updateInput(this._shared.getRolesAppAccessPath(idx, key), 0);
          else if (key == "rolesTaskFlowAccess") {  
            row[key].forEach((element, i) => {
              Object.keys(element).forEach((tkey) => {
                if (tkey == 'roleTaskFlowAssignmentId')
                  element.roleTaskFlowAssignmentId = 0;
                this._inputService.updateInput(this._shared.getFullRolesTaskFlowAccessPath(idx, i, tkey), element[tkey]);
              });
            });
          } else
            this._inputService.updateInput(this._shared.getRolesAppAccessPath(idx, key), row[key]);
        })
      })

      form.rolesTaskFlowAccess.forEach((row, idx) => {
        Object.keys(row).forEach((key) => {
          if (key == this._shared.primaryKey || key == this._shared.rolesTaskFlowAccessPrimaryKey)
            this._inputService.updateInput(this._shared.getRolesTaskFlowAccessRootPath(idx, key), 0);
          else
            this._inputService.updateInput(this._shared.getRolesTaskFlowAccessRootPath(idx, key), row[key]);
        })
      })

      form.rolesOrgAccess?.forEach((row, idx) => {
        Object.keys(row).forEach((key) => {
          if (key == this._shared.primaryKey || key == this._shared.rolesOrgAccessPrimaryKey)
            this._inputService.updateInput(this._shared.getRolesOrgAccessPath(idx, key), 0);
          else
            this._inputService.updateInput(this._shared.getRolesOrgAccessPath(idx, key), row[key]);
        })
      })

    } else {
      // console.log("fail")
    }
  });
}


  //method to clone
  copyRoles() {
    let excludeKey = ['creationDate', 'createdBy', 'lastUpdateDate', 'lastUpdatedBy'];

    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.componentInstance.confirmText = 'CONFIRM';
    dialogRef.componentInstance.message = 'Are you sure you want to copy the selected role ?'
    dialogRef.componentInstance.dialogTitle = 'Copy Role -';
    dialogRef.componentInstance.value = this._shared.getHeaderAttributeValue('roleShortCode');

    dialogRef.afterClosed().subscribe(flag => {
      if (flag) {
        this.setNewFormData();
      }
    })

  }

}
