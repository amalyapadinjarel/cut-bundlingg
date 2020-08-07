import { Component, OnInit, ViewChild } from '@angular/core';
import { ValueSetSharedService } from '../../services/valueSet-shared.service';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { ValueSetService } from '../../services/valueSet.service';

@Component({
  selector: 'app-validation-static',
  templateUrl: './validation-static.component.html',
  styleUrls: ['./validation-static.component.scss']
})
export class ValidationStaticComponent implements OnInit {
  private refreshSub: Subscription;
  @ViewChild(SmdDataTable) dataTable: SmdDataTable;
  private refreshvalidValue: Subscription;
  public key ="validDetails";
  constructor(public _shared: ValueSetSharedService,
    private _service:ValueSetService) { }

  ngOnInit(): void {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
      this._service.loadData(this.key);
      console.log("PrimaryKey", this._shared.validDetailsPrimaryKey)
		});
		this.refreshvalidValue = this._shared.refreshOpertionTable.subscribe(change => {
			this.refreshTable();
		});
  }
  onRowSelected() {
		this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
  }
  refreshTable() {
    setTimeout(_ => this.dataTable.refresh(this._shared.formData[this.key]), 0)

  }
  deleteLine(index,model){
    this._service.deleteDetailsLine(this.key,index,model);

  }
}
