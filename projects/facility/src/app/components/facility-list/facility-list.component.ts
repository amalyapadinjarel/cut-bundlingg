import { Component, OnInit ,ViewChild} from '@angular/core';
import { FacilitySharedService } from '../../services/facility-shared.service';
import { SmdDataTable } from 'app/shared/component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-facility-list',
  templateUrl: './facility-list.component.html',
  styleUrls: ['./facility-list.component.scss']
})
export class FacilityListComponent implements OnInit {
  
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

  constructor(public _shared: FacilitySharedService,private router: Router) { }

  ngOnInit(): void {
    if (this._shared.columnFilterValues) {
      this.dataTable.setColumnFilterInputValues(this._shared.columnFilterValues);
    this.dataTable.refresh([])
    setTimeout(_ => {
      this.dataTable.refresh();
    }, 0);
  }
   
  }

  rowSelected(event){
    console.log(event);
    if (event.selected) {
      this._shared.initLocalCache();
      this.router.navigateByUrl('/facility/' + event.model.facilityId);

    }
  }
  _onDataChange(dataChange: any) {

    if (dataChange.data && dataChange.data.facility){
      this._shared.setListData(dataChange.data);
      this._shared.columnFilterValues = dataChange.columnFilterValues;
      this._shared.params = this.dataTable.getParams();
    }
  }
  pageChanged(event){
    this._shared.selectedPage = event.page;
  }

}
