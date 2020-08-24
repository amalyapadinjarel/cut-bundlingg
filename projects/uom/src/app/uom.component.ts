import { Component, ViewChild } from '@angular/core';
import { UomSharedService } from './service/uom-shared.service';
import { Router } from '@angular/router';
import { AlertUtilities } from 'app/shared/utils';
import { DocumentService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Location } from '@angular/common';
import { UomService } from './service/uom.service';
import { SmdDataTable } from 'app/shared/component';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss']
})
export class UomComponent {

  refreshData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor( 
    private router: Router,
    private location: Location,
    public _shared: UomSharedService,
    private alertutils: AlertUtilities,
    public  docService: DocumentService,
    private _inputService: TnzInputService,
    public _service: UomService,
   
    ){
      this._shared.init();
   }
   newUom(){
    this._service.checkAppPermission(this._shared.taskFlowName, 'create')
    .then(() => {
      

    this.router.navigateByUrl('/uom/create').then(done => {
      this._shared.editMode = true;
     this._shared.initLocalCache();
     this._shared.filterUomLines=[];
    //  this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
     this._shared.refreshData.next(true);
    });
  }).catch(err => {
    this.alertutils.showAlerts(err)
  })
  
    
   }
   editUom(){
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
        .then(data => {
  
                      this.location.go('uom/' + this._shared.id + '/edit')
                      this._shared.editMode = true;
                      this._shared.initLocalCache();
                      //this._shared.refreshData.next(true);
                      
                    })
                    .catch(err => {
                      this.alertutils.showAlerts(err)
                    })
  
  
   }
   save(exit = false) {
    this._service.save().then((flag) => {
      if (flag && exit) {
       // this._service.cancelEdit();
        this.cancelEdit();
  
      }
    })
  }
   
   cancelEdit() {
    if (this._shared.id > 0) {
      this.location.go('/uom/' + this._shared.id);
      this._shared.editMode = false;
      this._shared.reviseMode = false;
      this._shared.initLocalCache();
      //this._shared.refreshData.next(true);
      this._shared.resetLines();
  } else {
      this.router.navigateByUrl('/uom/list').then(done => {
          this._shared.editMode = false;
          this._shared.reviseMode = false;
          this._shared.initLocalCache();
      });
  }
   }
  
}
