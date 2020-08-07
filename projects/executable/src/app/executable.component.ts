import { Component } from '@angular/core';
import { ExecutableModule } from './executable.module';
import { ExecutableRoutingModule } from './executable-routing.module';
import { Router } from '@angular/router';
import { ExecutableSharedService } from './services/executable-shared.service';
import { ExecutableService } from './services/executable.service';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { DocumentService } from 'app/shared/services';



@Component({
  templateUrl: './executable.component.html',
  styleUrls: ['./executable.component.scss']
})


export class ExecutableComponent {
  title = 'executable';
  constructor(
    private router: Router,
    public _shared: ExecutableSharedService,
    public _service: ExecutableService,
    private alertutils: AlertUtilities,
    private _inputService: TnzInputService,
    private docService: DocumentService
  ) { this._shared.init() }

  ngOnDestroy() {
    this._shared.clear();
  }

  ngOnInit() {

  }

  editOpGrp() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(data => {
        this._shared.editMode = true;
        this._shared.initLocalCache();
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }
  cancelAction() {
    this._shared.editMode = false;
    this._shared.initLocalCache();
    this._shared.resetLines();
  }

  saveAction(exit = true) {
    this._service.save(exit)
      .then((flag) => {
        if (flag && exit) {
          this.cancelAction();
        }
      })

  }

  addNewLine() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
      .then(data => {
        if (!this._shared.editMode) {
          this._shared.initLocalCache();
        }
        this._shared.editMode = true;
        this._shared.addLine('executable');
      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }

  exportData(flag) {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'view')
      .then(data => {
        this._shared.selectDataforPrint = [];
        if (flag) {
          this._service.setExportData();
          const dataToBePrint = this._shared.selectDataforPrint;
          if (dataToBePrint.length == 0) {
            this.alertutils.showAlerts('No lines selected!.');
          }
          else {
            this._service.writeExeData(dataToBePrint, 'true');
          }
        }
        else { this._service.setExportFormData(); }
      })
      .catch(err => {
        this.alertutils.showAlerts(err);
      })
  }

  import(event: any) {
    event.preventDefault();
    const element: HTMLElement = document.getElementById('import') as HTMLElement;
    element.click();
  }

  fileChanged(event): void {
     if (event.target.files.length > 0) {
      const fileName = event.target.files[0].name;
      const extension = fileName.substr(fileName.lastIndexOf('.') + 1);
      if (extension == 'tnzdat') {
        const selectedFile = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(selectedFile, 'UTF-8');
        fileReader.onload = () => {
          const dataOnLoad = JSON.parse(fileReader.result.toString());
          this._service.readExeData(dataOnLoad);
          event.target.value = '';
        }
        fileReader.onerror = (error) => {
          this.alertutils.showAlerts(error.toString());
        }
      }
      else {
        this.alertutils.showAlerts('Please upload a tnzdat file!');
        // this.cancelAction();
      }
    }
  }
}
