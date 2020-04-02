import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CutRegisterSharedService } from './_service/cut-register-shared.service';
import { CutRegisterService } from './_service/cut-register.service';
import { AlertUtilities } from 'app/shared/utils';

@Component({
  selector: 'app-cutRegister',
  templateUrl: './cutRegister.component.html',
  styleUrls: ['./cutRegister.component.scss']
})
export class CutRegisterComponent {
  title = 'CutRegister';

  constructor(private router: Router,
    private location: Location,
    public _shared: CutRegisterSharedService,
    public _service: CutRegisterService,
    private alertutils: AlertUtilities) {
      this._shared.init();
  }

  ngOnDestroy(){
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
    this._service.save().then(() => {
      if (exit) {
        this.cancelEdit();
      }
    })
  }

  generateNextCut(){
    this._service.generateNextCut().then( data => {
      console.log(data);
    }).catch( err => {
      this.alertutils.showAlerts(err)
    })
  }

  ifApproved(){
    return this._shared.getHeaderAttributeValue('docStatus') == 'APPROVED';
  }
}
