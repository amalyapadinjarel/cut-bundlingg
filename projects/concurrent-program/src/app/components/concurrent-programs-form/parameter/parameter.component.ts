import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ConcurrentProgramSharedService } from '../../../services/concurrent-program-shared.service';
import { ConcurrentProgramService } from '../../../services/concurrent-program.service';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { ValueSetLovConfig } from '../../../models/concurrent-programs-lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'concurrent-programs-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent implements OnInit, OnDestroy {

	key = 'parametersDetails'
	private refreshSub: Subscription;
	private parameterDetails: Subscription;
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  valuSetLov = JSON.parse(JSON.stringify(ValueSetLovConfig));

  constructor(public _shared: ConcurrentProgramSharedService,
    public _service: ConcurrentProgramService,
    private inputService: TnzInputService) { }

  ngOnInit() {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
        this._service.loadData(this.key);
    });
    this.parameterDetails = this._shared.refreshparametersDetails.subscribe(change => {
      if (change)
        this.refreshTable();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSub)
       this.refreshSub.unsubscribe();
    if (this.parameterDetails)
       this.parameterDetails.unsubscribe();
  }

  deleteLine(index){
    this._shared.deleteLine(this.key,index);
  }

  refreshTable() {
    let parameters = this._shared.formData[this.key].map((param,index)=>{
      param.displayOrder = (index + 1) * this._shared.parameterDetailsSeqIncBy;
      if(param.newLine){
        this.inputService.updateInput(this._shared.getParameterDetailsPath(index,'displayOrder'),param.displayOrder)
      }
      return param
    })
		this.dataTable.refresh(parameters);
  }
  
  onDataChange(dataChange:any){
    if(dataChange.rowCount){
      this._shared.parametersCount = Number(dataChange.rowCount);
    }
  }
}
