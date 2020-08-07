import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { EmbeddedURLService } from '../_service/embedded-URL.service';
import { EmbeddedURLSharedService } from '../_service/embedded-URL-shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  public listData: any;
  constructor(private service: EmbeddedURLService,
  public _shared: EmbeddedURLSharedService,
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
  this._shared.id = event.model.urlId;
    if (event.selected) {
      this.router.navigateByUrl('/embeddedURL/' + event.model.urlId);
    }
  }

_onDataChange(event:any){
  if(event.data&&event.data.embeddedURL){
    this._shared.setListData(event.data);
    this._shared.columnFilterValues = event.columnFilterValues;
    this._shared.params = this.dataTable.getParams();
  }
}

_onPageChange(pageChangeEvent: any) {
  this._shared.selectedPage = pageChangeEvent.page;
}


}
