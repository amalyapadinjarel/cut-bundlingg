import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { DocumentTypeService } from '../_service/document-type.service';
import { DocumentTypeSharedService } from '../_service/document-type-shared.service';
import { Router } from '@angular/router';
import { ApiService } from 'app/shared/services';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  public listData: any;

  constructor(private service: DocumentTypeService,
    public _shared: DocumentTypeSharedService,
    private router: Router) { }

  ngOnInit(): void {

      this.dataTable.refresh([])
      setTimeout(_ => {
        this.dataTable.refresh();
      }, 0);
    
    this._shared.id = 0;
  }
  rowSelected(event) {
    this._shared.id = event.model.docTypeId;
    if (event.selected) {
      this.router.navigateByUrl('/document-type/' + event.model.docTypeId);

    }
  }

  _onDataChange(dataChange: any) {

    if (dataChange.data && dataChange.data.docType) {
      this._shared.setListData(dataChange.data);
      this._shared.params = this.dataTable.getParams();
    }
  }

  pageChange(page: any) {
    this._shared.selectedPage = page.page;

  }
}





