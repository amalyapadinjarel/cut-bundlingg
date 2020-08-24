import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmbeddedURLSharedService } from './_service/embedded-URL-shared.service';
import { EmbeddedURLService } from './_service/embedded-URL.service';
import { AlertUtilities } from 'app/shared/utils';
import { NavigationService, UserService, DocumentService } from 'app/shared/services';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Location } from '@angular/common';
import { ConfirmPopupComponent } from 'app/shared/component';

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
    private alertUtils: AlertUtilities,
    private dialog: MatDialog,
    private docService: DocumentService,
    public _inputService: TnzInputService

  ) {

    this._shared.init();

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this._shared.clear();
  }

  // newEmbeddedURL() {
  //   this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
  //   .then(() => {
      

  //     if (this.router.routerState.snapshot.url == '/embeddedURL/create') {
  //       this.location.go('/embeddedURL/create');
  //       this._shared.id=0;
  //       this._shared.initLocalCache();
  //       this._shared.editMode = true;
  //       this._shared.refreshData.next(true);

  //     }
  //     else {
  //       this.router.navigateByUrl('/embeddedURL/create').then(done => {
  //         this._shared.editMode = true;
  //         this._shared.initLocalCache();


  //       }).catch((err) => { console.log('Caught Exception on create!', err) })
  //     }
  //   }).catch(err => {
  //     this.alertUtils.showAlerts(err);
  //   })
  // }

  newEmbeddedURL(): Promise<boolean> {
    return new Promise(success => {
      this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
        .then(() => {
          this.router.navigateByUrl('/embeddedURL/create').then(done => {
            if (done) {
              this._shared.editMode = true;
              this._shared.id=0;
              this._shared.initLocalCache();
              success(true);
            }
            else {
              success(false);
            }
          }).catch((err) => {
            success(false);
            console.log('Caught Exception on create!', err)
          });
        }).catch(err => {
          success(false);
          this.alertUtils.showAlerts(err);
        })
    });
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
        this.alertUtils.showAlerts(err)
      })
  }

  cancelEdit() {
    if (this._shared.id != 0) {
      this.location.go('/embeddedURL/' + this._shared.id);
      this._shared.editMode = false;
      this._shared.initLocalCache();
      this._shared.resetLines();
      this._shared.refreshData.next(true);
      this._inputService.resetInputService(this._shared.appKey);//added on july 22

    }
    else {
      this.router.navigateByUrl('/embeddedURL/list').then(done => {
        this._shared.editMode = false;
        this._shared.initLocalCache();
        this._inputService.resetInputService(this._shared.appKey);//added on july 22

      });
    }


  }

  validateFormData(){

    let lastIndex=this._shared.formData.embeddedURLUsers.length;
   
    for(let i=0;i<lastIndex;i++){
      let user = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'user'));
      let taskflowId = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'taskflowId'));
      let location = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'location'));

      taskflowId=taskflowId?taskflowId:0;


      for(let j=i+1;j<lastIndex;j++){
      let user2 = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(j, 'user'));
          
          if(user==user2){
                  let taskflowId2 = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(j, 'taskflowId'));
                  let location2 = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(j, 'location'));
                  taskflowId2=taskflowId2?taskflowId2:0;
                  if(taskflowId==taskflowId2 && location==location2)  {
                          let path=this._shared.getEmbeddedURLUsersPath(j, 'location');
                          let alert='Combination of user, menu and location is not unique!';
                         this._inputService.setError(path, alert);
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
      this.alertUtils.showAlerts('Failed to save! Combination of user, menu and location is not unique!')
    }
   
  }

  //main method 
  copy() {
    if (this._shared.getHeaderData()) {
    this.copyEmbeddedURL();
  } else {
    this.copyEmbeddedURLFromListView();
  }
}

copyEmbeddedURLFromListView(){
  this._service.fetchFormData(this._shared.id).then((data: any) => {
    this._shared.setFormHeader(data);
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.componentInstance.confirmText = 'CONFIRM';
    dialogRef.componentInstance.message = 'Are you sure you want to copy the selected URL ?'
    dialogRef.componentInstance.dialogTitle = 'Copy URL -';
    dialogRef.componentInstance.value = this._shared.getHeaderAttributeValue('title');

    dialogRef.afterClosed().subscribe(flag => {
      if (flag) {
          this._service.loadData('embeddedURLUsers').then(res => {
          if (res)
           this.setNewFormData();
            });
      }
    });

  }, err => {
    if (err) {
      this.alertUtils.showAlerts(err, true);
    }
  });


}

setNewFormData(){
this.newEmbeddedURL().then(success => {

  if (success) {

    let form = JSON.parse(JSON.stringify(this._shared.formData));
    this._shared.id = 0;
    this._shared.formData = {};
    form.header.urlId = 0;

      let excludeKey = ['creationDate', 'createdBy', 'lastUpdateDate', 'lastUpdatedBy','url','title','default'];
      Object.keys(form.header).forEach((key) => {
        if (key == this._shared.primaryKey)
          this._inputService.updateInput(this._shared.getHeaderAttrPath(key), 0);
        else if(!excludeKey.includes(key)){
                  this._inputService.updateInput(this._shared.getHeaderAttrPath(key),form.header[key]);
        }
      })

    form.embeddedURLUsers.forEach((row, idx) => {
      Object.keys(row).forEach((key) => {
        if (key == this._shared.primaryKey || key == this._shared.embeddedURLUsersPrimaryKey)
          this._inputService.updateInput(this._shared.getEmbeddedURLUsersPath(idx, key), 0);
          else if (key=="default"){
            this._inputService.updateInput(this._shared.getEmbeddedURLUsersPath(idx,key),'N')
          }
        else if(!excludeKey.includes(key))
          this._inputService.updateInput(this._shared.getEmbeddedURLUsersPath(idx, key), row[key]);
      })
    })

  
  } else {
    // console.log("fail")
  }
});
}


//method to clone
copyEmbeddedURL() {
  let dialogRef = this.dialog.open(ConfirmPopupComponent);
  dialogRef.componentInstance.confirmText = 'CONFIRM';
  dialogRef.componentInstance.message = 'Are you sure you want to copy the selected URL ?'
  dialogRef.componentInstance.dialogTitle = 'Copy URL -';
  dialogRef.componentInstance.value = this._shared.getHeaderAttributeValue('title');

  dialogRef.afterClosed().subscribe(flag => {
    if (flag) {
      this.setNewFormData();
    }
  })

}

}




