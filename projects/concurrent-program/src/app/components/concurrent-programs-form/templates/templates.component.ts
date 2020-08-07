import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SmdDataTable } from 'app/shared/component';
import { ConcurrentProgramSharedService } from '../../../services/concurrent-program-shared.service';
import { ConcurrentProgramService } from '../../../services/concurrent-program.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'concurrent-programs-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

  key = 'templatesDetails'
	private refreshSub: Subscription;
	private templatesDetails: Subscription;
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  @ViewChild('fileInput') inputEl: ElementRef;

  constructor(public _shared: ConcurrentProgramSharedService,
    public _service: ConcurrentProgramService,
    private inputService: TnzInputService) { }

    ngOnInit() {
      this.refreshSub = this._shared.refreshData.subscribe(change => {
          this._service.loadData(this.key);
      });
      this.templatesDetails = this._shared.refreshtemplatesDetails.subscribe(change => {
        if (change)
          this.refreshTable();
      });
    }
  
    ngOnDestroy(): void {
      if (this.refreshSub)
        this.refreshSub.unsubscribe();
      if (this.templatesDetails)
        this.templatesDetails.unsubscribe();
    }
  
    deleteLine(index){
      this._shared.deleteLine(this.key,index);
    }
  
    refreshTable() {
      let template = this._shared.formData[this.key].map((template,index)=>{
        template.sequence = index + 1;
        return template;
      })
      this.dataTable.refresh(template);
    }

    uploadTeplateFile(index){

    }

    fileChanged(event,index): void {
      // const inputEl: HTMLInputElement = this.inputEl.nativeElement;
      // const fileCount: number = inputEl.files.length;
      if(event.target.files.length > 0){
        this.inputService.updateInput(this._shared.getTemplatesDetailsPath(index,'fileName'),event.target.files[0].name);
        console.log(event.target.files.item(0));
        this._shared.templatesFiles.push(event.target.files.item(0));
      }
    }

    downloadFile(model){
      if(model.fileName && model.fileId)
        this._service.downloadFile(model.fileName);
    }
}
