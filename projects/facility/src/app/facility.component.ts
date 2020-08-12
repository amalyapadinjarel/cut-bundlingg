import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FacilitySharedService } from './services/facility-shared.service';
import { FacilityService } from './services/facility.service';
import { AlertUtilities } from 'app/shared/utils';
import { DocumentService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.scss']
})
export class FacilityComponent {
  constructor( 
    private router: Router,
    private location: Location,
    public _shared: FacilitySharedService,
    public _service: FacilityService,
    private alertutils: AlertUtilities,
    public  docService: DocumentService,
    private _inputService: TnzInputService
    ){
      this._shared.init();
   }
  newFacility(){
    this._service.checkAppPermission(this._shared.taskFlowName, 'create')
    .then(() => {
      
  
      // if (this.router.routerState.snapshot.url == '/facility/create') {
      //   this.location.go('/facility/create');
      //   this._shared.id=0;
      //   this._service.inputService.resetInputCache(this._shared.appPath);
      //   this._shared.initLocalCache();
      //   this._shared.editMode = true;
      //   this._shared.refreshData.next(true);
      //   this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
        
      // }
      // else {
        this.router.navigateByUrl('/facility/create').then(done => {
          this._shared.editMode = true;
          this._shared.initLocalCache();
          //this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
  
        });
      //   }).catch((err) => { console.log('Caught Exception on create!', err) })
      // }
    }).catch(err => {
      this.alertutils.showAlerts(err);
    })
   }
   editFacility(){
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
        .then(data => {
  
                      this.location.go('facility/' + this._shared.id + '/edit')
                      this._shared.editMode = true;
                      this._shared.initLocalCache()
                    })
                    .catch(err => {
                      this.alertutils.showAlerts(err)
                    })
  
  
   }
   save(exit = false) {
    this._service.save().then((flag) => {
      if (flag && exit) {
        this.cancelEdit();
  
      }
    })
  }
   
   cancelEdit() {
   
    if (this._shared.id > 0) {
      this.location.go('/facility/' + this._shared.id);
      this._shared.editMode = false;
      this._shared.reviseMode = false;
      this._shared.initLocalCache();
      this._shared.refreshData.next(true);

  } else {
      this.router.navigateByUrl('/facility/list').then(done => {
          this._shared.editMode = false;
          this._shared.reviseMode = false;
          this._shared.initLocalCache();
      });
  }
   }
}
