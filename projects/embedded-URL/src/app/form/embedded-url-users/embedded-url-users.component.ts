import { Component, OnInit, ViewChild } from '@angular/core';
import { EmbeddedURLService } from '../../_service/embedded-URL.service';
import { EmbeddedURLSharedService } from '../../_service/embedded-URL-shared.service';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { LocationLOVConfig, TaskFlowLOVConfig } from '../../models/lov-config';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'app-embedded-url-users',
  templateUrl: './embedded-url-users.component.html',
  styleUrls: ['./embedded-url-users.component.scss']
})
export class EmbeddedURLUsersComponent implements OnInit {
  disabled: any = {};
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  private refreshSub: Subscription;
  private refreshEmbeddedURLUsers: Subscription;
  public key = 'embeddedURLUsers';
  taskflowLov = JSON.parse(JSON.stringify(TaskFlowLOVConfig));
  locationLov = JSON.parse(JSON.stringify(LocationLOVConfig));

  constructor(
    public _shared: EmbeddedURLSharedService,
    private _service: EmbeddedURLService,
    private _alertUtils: AlertUtilities,
    private _inputService: TnzInputService
  ) { }

  ngOnInit(): void {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
      this._service.loadData(this.key);
    })
    this.refreshEmbeddedURLUsers = this._shared.refreshEmbeddedURLUsersData.subscribe(change => {
      this.dataTable.refresh(this._shared.formData['embeddedURLUsers']);

    })
  }

  ngOnDestroy() {
    this.refreshSub.unsubscribe();
    this.refreshEmbeddedURLUsers.unsubscribe();
  }
  onRowSelected() {
    this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
  }

  deleteLine(index, model) {
    //this._shared.deleteLine(this.key, index); // for deleting from cache
    this._service.deleteSingleLine(this.key, index);

  }

  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
  }

  checkDefaultURL(event, model, index) {

    let tasflowId = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(index, 'taskflowId'));
    let location = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(index, 'location'));
   
      if (event.value == 'Y') {
      this._service.getAlreadyDefaultedURLtitle(model.userId, tasflowId, location).then(title => {
        if (title && title != "") {
          this._alertUtils.showAlerts('Default URL-' + title + ' already set for this user will be removed!');
        }
      })
    }
   

  }

  // //added on July 21---validation for LOV
  // checkUnique(event, model, index) {
  //   let cache = this._inputService.getCache(this._shared.embeddedURLUsersPath);
  //   // let errorPath;

  //   let changedKey = event.key;
  //   let uniqueURL = true;
  //   let location = '';
  //   let taskflowId = 0;
  //   let taskflowName = '';

  //   if (changedKey == "location") {
  //     location = event.value;
  //     if (cache[index].taskflow) {
  //       taskflowId = cache[index].taskflow.taskFlowId;
  //       taskflowName = cache[index].taskflow.taskFlowName;
  //     } else {
  //       taskflowName = model.taskflow;
  //       taskflowId = model.taskflowId;
  //     }
  //   }
  //   else if (changedKey == "taskflow") {
  //     taskflowId = event.value.taskFlowId;
  //     taskflowName = event.value.taskFlowName;
  //     if (cache[index].location) location = cache[index].location;
  //     else location = model.location;
  //   }
  //   this._shared.formData.embeddedURLUsers.forEach((line, i) => {

  //     // if (i != index) {
  //     let user = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'user'));
  //     if (model.user == user) {

  //       let taskflowInInput = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'taskflow'));
  //       let locationInInput = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'location'));
  //       let taskFlowNameInInput = '';

  //       if (typeof (taskflowInInput) == 'string')
  //         taskFlowNameInInput = taskflowInInput
  //       else taskFlowNameInInput = taskflowInInput.taskFlowName;


  //       if (location == locationInInput && taskflowName == taskFlowNameInInput && i != index) {
  //         uniqueURL = false;
  //         console.log("uniqueURL:", uniqueURL)
  //         console.log(event.path)
  //         let alert = 'Combination of user, taskflow and location is not unique!'
  //         this._inputService.setError(event.path, alert);
  //         this._alertUtils.showAlerts('Combination of user, taskflow and location is not unique!');
  //       }
  //       else if (i != index && location != locationInInput && taskflowName != taskFlowNameInInput) {
  //         this._inputService.resetError(this._shared.getEmbeddedURLUsersPath(index, 'taskflow'));
  //         this._inputService.resetError(this._shared.getEmbeddedURLUsersPath(index, 'location'));
  //       }
  //     }


  //   }
  //   );

  //   let defaultVal = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(index, 'default'));

  //   if (uniqueURL) {
  //     if (defaultVal == 'Y') {
  //       this._service.getAlreadyDefaultedURLtitle(model.userId, taskflowId, location).then(title => {
  //         if (title && title != "") {
  //           this._inputService.setError(event.path, 'Default URL-' + title + ' already set for this user!');
  //           this._alertUtils.showAlerts('Default URL-' + title + ' already set for this user!');
  //         }
  //       })
  //     }
  //   }


  // }

  //added on July 22--used for select
  checkDuplicate(event, model, index) {
    let cache = this._inputService.getCache(this._shared.embeddedURLUsersPath);
    let changedKey = event.key;
    let uniqueURL = true;
    let location = '';
    let taskflowId = 0;

    if (changedKey == "taskflowId") {
      taskflowId = event.value;
      if (cache[index].location) location = cache[index].location;
      else location = model.location;

    } else if (changedKey == "location") {

      location = event.value;
      if (cache[index].taskflowId)    taskflowId = cache[index].taskflowId;
      else     taskflowId = model.taskflowId;
      
    }

    this._shared.formData.embeddedURLUsers.forEach((line, i) => {

      let user = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'user'));
      if (model.user == user) {

        let taskflowIdInInput = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'taskflowId'));
        let locationInInput = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(i, 'location'));

        taskflowId=taskflowId?taskflowId:0;
      
        if (i != index) {
   
          // console.log("taskflowId:",taskflowId);
          // console.log("taskflowIdInInput:",taskflowIdInInput);

          // console.log("location:",location);
          // console.log("locationInInput:",locationInInput);

            if( taskflowId == taskflowIdInInput && location == locationInInput){
              uniqueURL = false;
              let alert = 'Combination of user, menu and location is not unique!'
              this._inputService.setError(event.path, alert);
              this._alertUtils.showAlerts('Combination of user, menu and location is not unique!');
            }else{
              this._inputService.resetError(this._shared.getEmbeddedURLUsersPath(index, 'taskflowId'));
              this._inputService.resetError(this._shared.getEmbeddedURLUsersPath(index, 'location'))
            }
        }
       
      }
    });

    let defaultVal = this._inputService.getInputValue(this._shared.getEmbeddedURLUsersPath(index, 'default'));

    if (uniqueURL) {

      if (defaultVal == 'Y'&& (location!=model.location || taskflowId!=model.taskflowId)) {
        this._service.getAlreadyDefaultedURLtitle(model.userId, taskflowId, location).then(title => {
          if (title && title != "") {
            // this._inputService.setError(event.path, 'Default URL-' + title + ' already set for this user!');
            this._alertUtils.showAlerts('Default URL-' + title + ' already set for this user will be removed!');
          }
        })
      }
    }
  }

}
