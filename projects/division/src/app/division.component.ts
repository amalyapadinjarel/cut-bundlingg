import { Component } from '@angular/core';
import { DivisionService } from './services/division.service';
import { DivisionSharedService } from './services/division-shared.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertUtilities } from 'app/shared/utils';
import { DocumentService } from 'app/shared/services';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.scss']
})
export class DivisionComponent {


 constructor( 
  private router: Router,
  private location: Location,
  public _shared: DivisionSharedService,
  public _service: DivisionService,
  private alertutils: AlertUtilities,
  public  docService: DocumentService,
  private _inputService: TnzInputService
  ){
    this._shared.init();
 }
 newDivision(){
  this._service.checkAppPermission(this._shared.taskFlowName, 'create')
  .then(() => {
    

  //   if (this.router.routerState.snapshot.url == '/division/create') {
  //     this.location.go('/division/create');
  //     this._shared.division='--';
  //     this._service.inputService.resetInputCache(this._shared.appPath);
  //     this._shared.initLocalCache();
  //     this._shared.editMode = true;
  //     this._shared.refreshData.next(true);
  //     this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
      
  //   }
  //   else {
  //     this.router.navigateByUrl('/division/create').then(done => {
  //       this._shared.editMode = true;
  //       this._shared.initLocalCache();
  //       this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');


  //     }).catch((err) => { console.log('Caught Exception on create!', err) })
  //   }
  // }).catch(err => {
  //   this.alertutils.showAlerts(err);
  
  this.router.navigateByUrl('/division/create').then(done => {
    this._shared.editMode = true;
   this._shared.initLocalCache();
   this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
  });
}).catch(err => {
  this.alertutils.showAlerts(err)
})
 
  
 }
 editDivision(){
  this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(data => {

                    this.location.go('division/' + this._shared.id + '/edit')
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
     // this._service.cancelEdit();
      this.cancelEdit();

    }
  })
}
 
 cancelEdit() {
  if (this._shared.id > 0) {
    this.location.go('/division/' + this._shared.id);
    this._shared.editMode = false;
    this._shared.reviseMode = false;
    this._shared.initLocalCache();
    this._shared.refreshData.next(true);
    //this._shared.resetLines();
} else {
    this.router.navigateByUrl('/division/list').then(done => {
        this._shared.editMode = false;
        this._shared.reviseMode = false;
        this._shared.initLocalCache();
    });
}
 }
}
