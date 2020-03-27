import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { ApiService } from 'app/shared/services';
import { CutRegisterSharedService } from '../_service/cut-register-shared.service';
import { Router } from '@angular/router';
import { CutRegisterService } from '../_service/cut-register.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  public listData: any;
  constructor(private service: CutRegisterService,
  public _shared: CutRegisterSharedService,
  private router: Router) { }

  ngOnInit(): void {
    // this.service.fetchListData().then(data=>{
    //   this.listData = data;
    //   this.dataTable.refresh(this.listData);
    // })
  }

  rowSelected(event) {
    this._shared.id = event.model.registerId;
    if (event.selected) {
      this.router.navigateByUrl('/cut-register/' + event.model.registerId);
    }
  }

}
