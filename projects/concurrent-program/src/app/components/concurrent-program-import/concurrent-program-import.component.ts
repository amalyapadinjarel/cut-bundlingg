import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConcurrentProgramSharedService } from '../../services/concurrent-program-shared.service';
import { SmdDataTable } from 'app/shared/component';

@Component({
  selector: 'app-concurrent-program-import',
  templateUrl: './concurrent-program-import.component.html',
  styleUrls: ['./concurrent-program-import.component.scss']
})
export class ConcurrentProgramImportComponent implements OnInit {

  newLines: any;
  duplicateLines: any;
  selectedPrograms: any = [];
  @ViewChild('newLines', { static: true }) newLineDataTable: SmdDataTable;
  @ViewChild('duplicates', { static: true }) duplicateLinesDataTable: SmdDataTable;
  constructor(private dialog: MatDialogRef<ConcurrentProgramImportComponent>,
    public _shared: ConcurrentProgramSharedService) { }

  ngOnInit(): void {
    if(this.newLines){
      this.newLineDataTable.refresh(this.newLines);
    }
    if(this.duplicateLines){
      this.duplicateLinesDataTable.refresh(this.duplicateLines);
    }
  }

  close(){
    this.dialog.close();
  }

  import(){
    if(this.selectedPrograms){
      let shortCodes = [];
      this.selectedPrograms.forEach(elem=>{
        if(elem && elem.shortCode){
          shortCodes.push(elem.shortCode);
        }
      });
      this.dialog.close(shortCodes);
    }
  }

  rowSelected(event){
    this.selectedPrograms = this.newLineDataTable.selectedModels();
  }

}
