import { Component, OnInit, ViewChild } from '@angular/core';
import { DivisionSharedService } from '../services/division-shared.service';
import { SmdPaginatorComponent } from 'app/shared/component/smd/smd-paginator/paginator.component';
import { SmdDataTable } from 'app/shared/component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

  constructor(public _shared: DivisionSharedService,private router: Router) { }

  ngOnInit(): void {

    this.dataTable.refresh([])
    setTimeout(_ => {
      this.dataTable.refresh();
    }, 0);
  
   
  }
  rowSelected(event) {
    // this._shared.lookupType = event.model.lookupType;

    
     if (event.selected) {
       this._shared.initLocalCache();
       this.router.navigateByUrl('/division/' + event.model.divisionId);

     }
   }
   
// _onDataChange(event:any){
//   if(event.data&&event.data.division){
//     this._shared.setListData(event.data);
//     this._shared.columnFilterValues = event.columnFilterValues;
//     this._shared.params = this.dataTable.getParams();
//   }
 
  
//}
_onDataChange(dataChange: any) {

  if (dataChange.data && dataChange.data.divisions){
    this._shared.setListData(dataChange.data);
    this._shared.columnFilterValues = dataChange.columnFilterValues;
    this._shared.params = this.dataTable.getParams();
  }
}
pageChanged(event) {
  this._shared.selectedPage = event.page;
}

}
