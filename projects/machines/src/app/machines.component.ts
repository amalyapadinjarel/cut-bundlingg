import { Component } from '@angular/core';
import { MachinesSharedService } from './services/machine-shared.service';
import { MachinesService } from './services/machine.service';
import { DocumentService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';

@Component({
  selector: 'app-root',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent {
  constructor(
    public _shared: MachinesSharedService,
    public service: MachinesService,
    private docService: DocumentService,
    private alertutils: AlertUtilities,){
      this._shared.init();
      
    }
    addNewLine() {
      this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
        .then(data => {
          if (!this._shared.editMode) {
            this._shared.initLocalCache();
          }
          this._shared.editMode = true;
          this._shared.addLine('machines');
        })
        .catch(err => {
          this.alertutils.showAlerts(err)
        })
    }
    edit() {
      this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
        .then(data => {
          this._shared.editMode = true;
          this._shared.initLocalCache();
        })
        .catch(err => {
          this.alertutils.showAlerts(err)
        })
    }
    
  saveAction(exit = true) {
    this.service.save(exit)
      .then((flag) => {
        if (flag && exit) {
          this.cancelAction();
        }
      })

  }
  cancelAction() {
    this._shared.editMode = false;
    this._shared.initLocalCache();
    this._shared.resetLines();
  }
}
