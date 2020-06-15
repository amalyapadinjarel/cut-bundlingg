import {Component, OnInit, ViewChild} from '@angular/core';
import {MfgRoutingSharedService} from '../../services/mfg-routing-shared.service';
import {Router} from '@angular/router';
import {SmdDataTable} from '../../../../../../src/app/shared/component/smd/smd-datatable';

@Component({
  selector: 'app-mfg-routing-list',
  templateUrl: './mfg-routing-list.component.html',
  styleUrls: ['./mfg-routing-list.component.scss']
})
export class MfgRoutingListComponent implements OnInit {

  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

  constructor(public _shared: MfgRoutingSharedService,
              public router: Router) { }

  ngOnInit(): void {

    if (this._shared.columnFilterValues) {
        this.dataTable.setColumnFilterInputValues(this._shared.columnFilterValues);
      this.dataTable.refresh([])
      setTimeout(_ => {
        this.dataTable.refresh();
      }, 0);
    }
  }

  rowSelected(event) {
    this._shared.id = event.model.registerId;
    if (event.selected) {
      this.router.navigateByUrl('/routing/' + event.model.routingId);
    }

  }

  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.routing){
      this._shared.setListData(dataChange.data);
      this._shared.columnFilterValues = dataChange.columnFilterValues;
      this._shared.params = this.dataTable.getParams();
    }
  }

    pageChange(page: any) {
    this._shared.selectedPage = page.page;

    }
}
