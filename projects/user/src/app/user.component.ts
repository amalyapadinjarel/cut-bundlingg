import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSharedService } from './_service/user-shared.service';
import { UserService, NavigationService, DocumentService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Location } from '@angular/common';
import { UserAppService } from './_service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  title = 'user';

  constructor(
    private router: Router,
    private location: Location,
    public _shared: UserSharedService,
    public _service: UserAppService,
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

  newUser() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
      .then(() => {


        // if (this.router.routerState.snapshot.url == '/user/create') {
        //   this.location.go('/user/create');
        //   this._shared.id = 0;
        //   this._service.inputService.resetInputCache(this._shared.appPath);
        //   this._shared.initLocalCache();
        //   this._shared.editMode = true;
        //   this._shared.refreshData.next(true);

        // }
        // else {
          
            this.router.navigateByUrl('/user/create').then(done => {
            this._shared.editMode = true;
            this._shared.initLocalCache();

          }).catch((err) => { console.log('Caught Exception on create!', err) });
        //}
      }).catch(err => {
        this.alertutils.showAlerts(err);
      })
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



}
