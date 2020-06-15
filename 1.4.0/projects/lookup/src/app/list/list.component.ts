import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { ApiService } from 'app/shared/services';
import { LookupSharedService } from '../_service/lookup-shared.service';
import { Router } from '@angular/router';
import { LookupService } from '../_service/lookup.service';
import { DateUtilities } from 'app/shared/utils';
import { SmdPaginatorComponent } from 'app/shared/component/smd/smd-paginator/paginator.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  public listData: any;
  constructor(private service: LookupService,
  public _shared: LookupSharedService,
  private router: Router) { }

 
  ngOnInit(): void {

      if (this._shared.listData) {
      if (this._shared.columnFilterValues) {
        this.dataTable.setColumnFilterInputValues(this._shared.columnFilterValues);
      }
      this.dataTable.refresh(this._shared.listData);
    }
  }

 
  //for handling pagenation to list from where the form was opened
  pageChanged(event) {
    this._shared.selectedPage = event.page;
  }

  rowSelected(event) {
   // this._shared.lookupType = event.model.lookupType;
    if (event.selected) {
      this.router.navigateByUrl('/lookup/' + event.model.lookupType);
    }
  }

_onDataChange(event:any){
  if(event.data&&event.data.lookups){
    this._shared.setListData(event.data);
    this._shared.columnFilterValues = event.columnFilterValues;
    this._shared.params = this.dataTable.getParams();
  }
}

_onPageChange(pageChangeEvent: any) {
  this._shared.selectedPage = pageChangeEvent.page;
}



}
