import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CutRegisterSharedService } from './_service/cut-register-shared.service';
import { CutRegisterService } from './_service/cut-register.service';
import { AlertUtilities } from 'app/shared/utils';
import { NavigationService, UserService, EventService } from 'app/shared/services';

@Component({
  selector: 'app-cutRegister',
  templateUrl: './cutRegister.component.html',
  styleUrls: ['./cutRegister.component.scss']
})
export class CutRegisterComponent {
  title = 'CutRegister';
  reportData: any = {};

  @ViewChild("reportsBtn") reportsBtn: ElementRef;

  constructor(
    private router: Router,
    private location: Location,
    public _shared: CutRegisterSharedService,
    public _service: CutRegisterService,
    private alertutils: AlertUtilities,
    private navService: NavigationService,
    private userService: UserService,
    private eventService: EventService
  ) {
    this._shared.init();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._shared.clear();
  }

  newCosting() {
    this.router.navigateByUrl('cut-register/create').then(done => {
      this._shared.editMode = true;
      this._shared.initLocalCache();
    });
  }

  editCosting() {
    if (this._shared.id > 0) {
      this.location.go('cut-register/' + this._shared.id + '/edit')
      this._shared.editMode = true;
      this._shared.initLocalCache();
    }
  }

  cancelEdit() {
    if (this._shared.id > 0) {
      this.location.go('cut-register/' + this._shared.id);
      this._shared.editMode = false;
      this._shared.initLocalCache();
      this._shared.resetLines();
    }
    else {
      this.router.navigateByUrl('cut-register/list').then(done => {
        this._shared.editMode = false;
        this._shared.initLocalCache();
      });
    }
  }

  save(exit = false) {
    this._service.save().then((flag) => {
      if (flag && exit) {
        this.cancelEdit();
      }
    })
  }

  generateNextCut() {
    this._service.generateNextCut().then(data => {
      console.log(data);
    }).catch(err => {
      this.alertutils.showAlerts(err)
    })
  }

  ifApproved() {
    return this._shared.getHeaderAttributeValue('docStatus') == 'APPROVED';
  }

  showReports() {
    this.reportData["userId"] = this.userService.getCurrentUser().userId;
    this.navService.showApplicationReports(
      "CUTREGISTER",
      "CUT",
      this.reportData,
      this.reportsBtn
    );
  }

  approve() {
    this._service.approve().then(data => {
      this._shared.refreshData.next(true);
    }).catch(err => {
      this.alertutils.showAlerts(err);
      this._shared.refreshData.next(true);           
    })
  }
}
