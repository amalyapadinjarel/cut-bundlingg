import { Component, OnInit, ViewChild } from '@angular/core';
import { ConcurrentProgramSharedService } from '../../services/concurrent-program-shared.service';
import { ConcurrentProgramService } from '../../services/concurrent-program.service';
import { Router, ResolveEnd } from '@angular/router';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-concurrent-programs-list',
  templateUrl: './concurrent-programs-list.component.html',
  styleUrls: ['./concurrent-programs-list.component.scss']
})
export class ConcurrentProgramsListComponent implements OnInit {
  
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  private routerSubs: Subscription;

  constructor(public _shared: ConcurrentProgramSharedService,
    private router: Router,
    public service: ConcurrentProgramService) { }

    private refreshSub: Subscription;
  ngOnInit(): void {
    if (this._shared.listData) {
      if (this._shared.columnFilterValues) {
        this.dataTable.setColumnFilterInputValues(this._shared.columnFilterValues);
      }
      this.dataTable.refresh(this._shared.listData);
    }
    this.refreshSub = this._shared.refreshData.subscribe(change=>{
      if(change){
        this.dataTable.refresh();
      }
    })
  }

  rowSelected(event) {
    if (event.selected) {
      this._shared.id = event.model.pgmId;
      this.router.navigateByUrl('/concurrent-programs/' + this._shared.id);
    }
    this.onRowSelected();
  }

  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.concurrentPrograms){
      this._shared.setListData(dataChange.data);
      this._shared.columnFilterValues = dataChange.columnFilterValues;
      this._shared.params = this.dataTable.getParams();
    }  
  }

  onRowSelected(){
    this._shared.setSelectedLines('list',this.dataTable.selectedModels());
    let idArray = this._shared.selectedLines['list'].map(elem => elem.pgmId);
    this._shared.selectedListLinesId = idArray;
  }
}
