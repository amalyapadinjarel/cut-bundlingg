import { Component, OnInit, ViewChild } from '@angular/core';
import { ValueSetSharedService } from '../../services/valueSet-shared.service';
import { SmdDataTable } from 'app/shared/component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  newLines: any;
  duplicateLines: any;
  selectedPrograms: any = [];
  @ViewChild('newLines', { static: true }) newLineDataTable: SmdDataTable;
  @ViewChild('duplicates', { static: true }) duplicateLinesDataTable: SmdDataTable;
  constructor(private dialog: MatDialogRef<ImportComponent>,
    public _shared: ValueSetSharedService) { }

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
