import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { DocSequenceSharedService } from '../_service/doc-sequence-shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'doc-seq-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  constructor(public _shared: DocSequenceSharedService,
    private router: Router) { }
  ngOnInit(): void {
 
    
      this.dataTable.refresh([])
      setTimeout(_ => {
        this.dataTable.refresh();
      }, 0);
    
    this._shared.id = 0;
  }

  rowSelected(event) {
    this._shared.id = event.model.docSeqId;
    if (event.selected) {
      this.router.navigateByUrl('/doc-sequence/' + event.model.docSeqId);
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
