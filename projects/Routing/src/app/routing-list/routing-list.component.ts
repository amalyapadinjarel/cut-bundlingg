import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { RoutingService } from '../_service/routing.service';
import { RoutingSharedService } from '../_service/routing-shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-routing-list',
  templateUrl: './routing-list.component.html'
})
export class RoutingListComponent implements OnInit {
  
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

  constructor(private service: RoutingService,
    public _shared: RoutingSharedService,
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
    this._shared.id = event.model.routingId;
    if (event.selected) {
      this.router.navigateByUrl('/routing-cut-panels/' + this._shared.id);
    }
  }

  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.routing){
      this._shared.setListData(dataChange.data);
      this._shared.columnFilterValues = dataChange.columnFilterValues;
      this._shared.params = this.dataTable.getParams();
    }  
  }

  _onPageChange(pageChangeEvent: any) {
    // this._shared.selectedPage = pageChangeEvent.page;
  }
}
