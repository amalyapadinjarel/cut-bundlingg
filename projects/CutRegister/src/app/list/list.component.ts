import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { ApiService } from 'app/shared/services';
import { CutRegisterSharedService } from '../_service/cut-register-shared.service';
import { Router } from '@angular/router';
import { CutRegisterService } from '../_service/cut-register.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  public listData: any;
  constructor(private service: CutRegisterService,
    public _shared: CutRegisterSharedService,
    private router: Router) { }

  ngOnInit(): void {
    if (this._shared.listData) {
      if (this._shared.columnFilterValues) {
        this.dataTable.setColumnFilterInputValues(this._shared.columnFilterValues);
      }
      this.dataTable.refresh(this._shared.listData);
    }
  }

  rowSelected(event) {
    if(event.model){
      this._shared.reportData["pCutId"] = event.model.registerId;
      this._shared.reportData["pDocumentNum"] = event.model.documentNo;
    } else {
      this._shared.reportData = {}
    }
    if (event.selected) {
      this.router.navigateByUrl('/cut-register/' + event.model.registerId);
    }
  }

  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.registers) {
      this._shared.setListData(dataChange.data);
      this._shared.columnFilterValues = dataChange.columnFilterValues;
      this._shared.params = this.dataTable.getParams();

    }

  }

  _onPageChange(pageChangeEvent: any) {
    this._shared.selectedPage = pageChangeEvent.page;
  }

  onRowChecked(event){
    let models = this.dataTable.selectedModels()
    if(models.length && models.length == 1){
      this._shared.reportData["pCutId"] = models[0].registerId;
      this._shared.reportData["pDocumentNum"] = models[0].documentNo;
    } else {
      this._shared.reportData = {}
    }
  }
}
