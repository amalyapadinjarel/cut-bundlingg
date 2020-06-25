import { Component, ViewChild, ElementRef } from '@angular/core';
import { PackingInstructionsSharedService } from './services/packing-instructions-shared.service';
import { PackingInstructionsService } from './services/packing-instructions.service';
import { Router } from '@angular/router';
import { AlertUtilities } from 'app/shared/utils';
import { NavigationService, UserService, DocumentService } from 'app/shared/services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './packing-instructions.component.html',
  styleUrls: ['./packing-instructions.component.scss']
})
export class PackingInstructionsComponent {
  title = 'packing-instrutions';
  reportData: any = {};
  @ViewChild("reportsBtn") reportsBtn: ElementRef;
  constructor(
    private router: Router,
    public _shared: PackingInstructionsSharedService,
    public _service: PackingInstructionsService,
    private alertutils: AlertUtilities,
    private navService: NavigationService,
    private userService: UserService,
    private docService: DocumentService,
    private location: Location
  ) {
    this._shared.init();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._shared.clear();
  }

  editPackingInstructions() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(() => {
                this.location.go('packing-instructions/' + this._shared.poId + '/' + this._shared.orderId + '/' + this._shared.parentProductId + '/edit')
                this._shared.editMode = true;
                this._shared.initLocalCache()
            
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })

  }

  cancelEdit() {
    if (this._shared.poId && this._shared.orderId && this._shared.parentProductId) {
      this.location.go('/packing-instructions/' + this._shared.poId + '/' + this._shared.orderId + '/' + this._shared.parentProductId);
      this._shared.editMode = false;
      this._shared.initLocalCache();
      this._shared.resetLines();
      this._shared.refreshData.next(true);

    }
    else {
      this.router.navigateByUrl('/packing-instructions/list').then(done => {
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

  showReports() {
    this.reportData = {}
    this.reportData["userId"] = this.userService.getCurrentUser().userId;
    if (this._shared.id) {
      this.reportData["pCsId"] = this._shared.id;
      this.reportData["pSo"] = this._shared.orderId;
      this.reportData["pPo"] = this._shared.poId;
      this.reportData["pStyle"] = this._shared.parentProductId;
    }
    this.navService.showApplicationReports(
      "PACKINGINSTRUCTIONS",
      "PACK",
      this.reportData,
      this.reportsBtn
    );
  }
}

