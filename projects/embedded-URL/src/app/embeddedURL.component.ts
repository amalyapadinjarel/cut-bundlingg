import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmbeddedURLSharedService } from './_service/embedded-URL-shared.service';
import { EmbeddedURLService } from './_service/embedded-URL.service';
import { AlertUtilities } from 'app/shared/utils';
import { NavigationService, UserService, DocumentService } from 'app/shared/services';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-embeddedURL',
  templateUrl: './embeddedURL.component.html',
  styleUrls: ['./embeddedURL.component.scss']
})
export class EmbeddedURLComponent {
  title = 'EmbeddedURL';

  constructor(
    private router: Router,
    private location:Location,
    public _shared: EmbeddedURLSharedService,
    public _service: EmbeddedURLService,
    private alertutils: AlertUtilities,
    private navService: NavigationService,
    private userService: UserService,
    private dialog: MatDialog,
    private docService: DocumentService,
    public inputservice: TnzInputService

  ) {

    this._shared.init();

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this._shared.clear();
  }

  newEmbeddedURL() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
    .then(() => {
      

      if (this.router.routerState.snapshot.url == '/embeddedURL/create') {
        this.location.go('/embeddedURL/create');
        this._shared.id=0;
        this._shared.initLocalCache();
        this._shared.editMode = true;
        this._shared.refreshData.next(true);

      }
      else {
        this.router.navigateByUrl('/embeddedURL/create').then(done => {
          this._shared.editMode = true;
          this._shared.initLocalCache();


        }).catch((err) => { console.log('Caught Exception on create!', err) })
      }
    }).catch(err => {
      this.alertutils.showAlerts(err);
    })
  }

  editEmbeddedURL() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(data => {
        this.location.go('embeddedURL/' + this._shared.id + '/edit');
        this._shared.editMode = true;
       this._shared.initLocalCache();
       this._shared.refreshData.next(true);//added on july 22

      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }

  cancelEdit() {
    if (this._shared.id != 0) {
      this.location.go('/embeddedURL/' + this._shared.id);
      this._shared.editMode = false;
      this._shared.initLocalCache();
      this._shared.resetLines();
      this._shared.refreshData.next(true);
      this.inputservice.resetInputService(this._shared.appKey);//added on july 22

    }
    else {
      this.router.navigateByUrl('/embeddedURL/list').then(done => {
        this._shared.editMode = false;
        this._shared.initLocalCache();
        this.inputservice.resetInputService(this._shared.appKey);//added on july 22

      });
    }


  }

  validateFormData(){

    let lastIndex=this._shared.formData.embeddedURLUsers.length;
   
    for(let i=0;i<lastIndex;i++){
      let user = this.inputservice.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'user'));
      let taskflowId = this.inputservice.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'taskflowId'));
      let location = this.inputservice.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'location'));

      taskflowId=taskflowId?taskflowId:0;


      for(let j=i+1;j<lastIndex;j++){
      let user2 = this.inputservice.getInputValue(this._shared.getEmbeddedURLUsersPath(j, 'user'));
          
          if(user==user2){
                  let taskflowId2 = this.inputservice.getInputValue(this._shared.getEmbeddedURLUsersPath(j, 'taskflowId'));
                  let location2 = this.inputservice.getInputValue(this._shared.getEmbeddedURLUsersPath(j, 'location'));
                  taskflowId2=taskflowId2?taskflowId2:0;

                  // console.log("taskflowId2:",taskflowId2);
                  // console.log("taskflowId:",taskflowId);

                  // console.log("location:",location);
                  // console.log("location2:",location2);

                  if(taskflowId==taskflowId2 && location==location2)  {
                          let path=this._shared.getEmbeddedURLUsersPath(j, 'location');
                          let alert='Combination of user, menu and location is not unique!';
                         this.inputservice.setError(path, alert);
                        return false;
                       } 
                 }
        } 
    
      }
      return true;
   }

  save(exit = false) {
    let unique=this.validateFormData();
    
    if(unique){
      this._service.save(exit)
      .then((flag) => {
        if (flag && exit) {
          this.cancelEdit();
        }
      })
    }else{
      this.alertutils.showAlerts('Failed to save! Combination of user, menu and location is not unique!')
    }
   
  }

}
