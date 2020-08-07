import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { SmdDataTable } from 'app/shared/component';
import { ConcurrentProgramSharedService } from '../../../services/concurrent-program-shared.service';
import { ConcurrentProgramService } from '../../../services/concurrent-program.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';

@Component({
  selector: 'concurrent-programs-style-sheet',
  templateUrl: './style-sheet.component.html',
  styleUrls: ['./style-sheet.component.scss']
})
export class StyleSheetComponent implements OnInit {

  key = 'styleSheetDetails'
	private refreshSub: Subscription;
	private styleSheetDetails: Subscription;
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  @ViewChild('fileInput') inputEl: ElementRef;

  constructor(public _shared: ConcurrentProgramSharedService,
    public _service: ConcurrentProgramService,
    private inputService: TnzInputService,
    private alterUtility: AlertUtilities) { }

  ngOnInit() {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
        this._service.loadData(this.key);
    });
    this.styleSheetDetails = this._shared.refreshstyleSheetDetails.subscribe(change => {
      if (change)
        this.refreshTable();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSub)
      this.refreshSub.unsubscribe();
    if (this.styleSheetDetails)
      this.styleSheetDetails.unsubscribe();
  }

  deleteLine(index){
    this._shared.deleteLine(this.key,index);
  }

  refreshTable() {
    let styles = this._shared.formData[this.key].map((style,index)=>{
      style.sequence = index + 1;
      return style;
    })
    this.dataTable.refresh(styles);
  }

  fileChanged(event,index): void {
    if(event.target.files.length > 0){
      this.inputService.updateInput(this._shared.getStyleSheetDetailsPath(index,'fileName'),event.target.files[0].name);
      console.log(event.target.files.item(0));
      this._shared.styleSheetFiles.push(event.target.files.item(0));
    }
  }
  
  downloadFile(fileName: String){
    this._service.downloadFile(fileName);
  }

  onDataChange(data){
    if(data && data.rowCount != null){
      this._shared.eventEmitter.emit({'styleSheetCount': Number(data.rowCount)});
    }
  }

  fileUpload(index){
    let active = this.inputService.getInputValue(this._shared.getStyleSheetDetailsPath(index,'active'));
    if(active == 'Y'){
      this.alterUtility.showAlerts("Cannot update style sheet since it is in active state")
    }
    else{
      this.inputEl.nativeElement.click();
    }
  }

}
