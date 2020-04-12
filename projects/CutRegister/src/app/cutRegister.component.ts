import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CutRegisterSharedService } from './_service/cut-register-shared.service';
import { CutRegisterService } from './_service/cut-register.service';
import { AlertUtilities } from 'app/shared/utils';
import { NavigationService, UserService, EventService, DocumentService } from 'app/shared/services';

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
    private docService: DocumentService
  ) {
    this._shared.init();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._shared.clear();
  }

  newCosting() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
      .then(() => {
        this.router.navigateByUrl('cut-register/create').then(done => {
          this._shared.editMode = true;
          this._shared.initLocalCache();
        });
      }).catch(err => {
        this.alertutils.showAlerts(err)
      })
  }

  editCosting() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(() => {
        this.docService.checkDocPermission(this._shared.getHeaderAttributeValue('docStatus'), this._shared.getHeaderAttributeValue('docType'))
          .then(data => {
            this.location.go('cut-register/' + this._shared.id + '/edit')
            this._shared.editMode = true;
            this._shared.initLocalCache();
          })
          .catch(err => {
            this.alertutils.showAlerts(err)
          })
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })

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
    this._service.generateNextCut().then((data: any) => {
      this.alertutils.showAlerts(data)
    }).catch(err => {
      this.alertutils.showAlerts(err)
    })
  }

  ifApproved() {
    return this._shared.getHeaderAttributeValue('docStatus') == 'APPROVED';
  }

  showReports() {
    this.reportData["userId"] = this.userService.getCurrentUser().userId;
    if (this._shared.id) {
      this.reportData["pCutId"] = this._shared.id;
    }
    this.navService.showApplicationReports(
      "CUTREGISTER",
      "CUT",
      this.reportData,
      this.reportsBtn
    );
  }

  approve() {
    if (this.ifApproved())
      this.alertutils.showAlerts("Cannot approve document in " + this._shared.getHeaderAttributeValue('docStatusName') + " status.")
    else {
      this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
        .then(() => {
          this.docService.checkDocPermission(this._shared.getHeaderAttributeValue('docStatus'), this._shared.getHeaderAttributeValue('docType'))
            .then(data => {
              this._service.approve().then(data => {
                this._shared.refreshData.next(true);
              })
                .catch(err => {
                  this.alertutils.showAlerts(err);
                  this._shared.refreshData.next(true);
                })
            })
            .catch(err => {
              this.alertutils.showAlerts(err)
            })
        })
        .catch(err => {
          this.alertutils.showAlerts(err)
        })

    }
  }

  revise() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(() => {
        this.docService.checkRevisionPermission(this._shared.getHeaderAttributeValue('docStatus'), this._shared.getHeaderAttributeValue('docType'))
          .then(() => {
            this._service.revise().then(data => {
              this._shared.refreshData.next(true);
            }).catch(err => {
              this.alertutils.showAlerts(err);
              this._shared.refreshData.next(true);
            })
          }).catch(err => {
            this.alertutils.showAlerts(err)
          })
      }).catch(err => {
        this.alertutils.showAlerts(err)
      })
  }
}
