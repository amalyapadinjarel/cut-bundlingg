import { Component } from '@angular/core';
import { DocSequenceSharedService } from './_service/doc-sequence-shared.service';
import { DocSequenceService } from './_service/doc-sequence.service';
import { DocumentService } from 'app/shared/services';
import { Router } from '@angular/router';
import { AlertUtilities } from 'app/shared/utils';
import {Location} from '@angular/common';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
 
  templateUrl: './doc-sequence.component.html',
  styleUrls: ['./doc-sequence.component.scss']
})
export class DocSequenceComponent {
 constructor( public _shared: DocSequenceSharedService,
  public _service: DocSequenceService,
  private docService: DocumentService,
  private router: Router,
  private alertutils: AlertUtilities,
  private location: Location,
  public _inputService: TnzInputService
 )
  { }

  newDocument(){
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
    .then(data => {
      this.router.navigateByUrl('/doc-sequence/create').then(done => {
        this._shared.editMode = true;
       this._shared.initLocalCache();
      this._shared.refreshData.next(true);
      });
    }).catch(err => {
      this.alertutils.showAlerts(err)
    })
  
  
  }
  save(exit=false){

      this._service.save(exit)
  }
  editDcument(){
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
  .then(data => {
      this.location.go('doc-sequence/' + this._shared.id + '/edit')
      this._shared.editMode = true;
      this._shared.initLocalCache()

  })
  .catch(err => {

      this.alertutils.showAlerts(err)
  })
  }
  cancelEdit(){

     
  if (this._shared.id > 0) {
    this.location.go('/doc-sequence/' + this._shared.id);
    this._shared.editMode = false;
   
    this._shared.initLocalCache();
   this._shared.resetLines();
   
} else {
    this.router.navigateByUrl('/doc-sequence/list').then(done => {
        this._shared.editMode = false;
      
        this._shared.initLocalCache();
    });
}
  }


}
