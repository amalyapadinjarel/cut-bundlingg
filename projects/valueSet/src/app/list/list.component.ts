import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { ValueSetSharedService } from '../services/valueSet-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  private refreshSub: Subscription

  constructor(public _shared: ValueSetSharedService,
    public _inputService: TnzInputService,
    public router: Router) { }

  ngOnInit(): void {
  
  //   if (this._shared.columnFilterValues) {
  //     this.dataTable.setColumnFilterInputValues(this._shared.columnFilterValues);
  //   this.dataTable.refresh([])
  //   setTimeout(_ => {
  //     this.dataTable.refresh();
  //   }, 0);
  // }


  //////



  // if (this._shared.listData) {
  //   if (this._shared.columnFilterValues) {
  //     this.dataTable.setColumnFilterInputValues(this._shared.columnFilterValues);
  //   }
  //   this.dataTable.refresh(this._shared.listData);
  // }
  this.dataTable.refresh(this._shared.listData);
  this.refreshSub = this._shared.refreshData.subscribe(change=>{
    if(change){
      this.dataTable.refresh();
    }
  })
  }
  rowSelected(event) {

console.log('row selected------')
    
   //  if (event.selected) {
      // this._shared.id = event.model.;
    
      if (event.selected) {
        this._shared.initLocalCache();
        this._shared.editMode = false;
        this.router.navigateByUrl('/valueSet/' + event.model.setId);
      }
      this.onRowSelected();
    // }
     
   }
   
// _onDataChange(event:any){
//   if(event.data&&event.data.value){
//     this._shared.setListData(event.data);
//     this._shared.columnFilterValues = event.columnFilterValues;
//     this._shared.params = this.dataTable.getParams();
//   }
onRowSelected(){
  console.log('onRowSelected')
this._shared.setSelectedLines('list',this.dataTable.selectedModels());
let idArray = this._shared.selectedLines['list'].map(elem => elem.setId);
this._shared.selectedListLinesId = idArray;


}
  
// }
_onDataChange(dataChange: any) {

  if (dataChange.data && dataChange.data.valueSet){
    this._shared.setListData(dataChange.data);
    this._shared.columnFilterValues = dataChange.columnFilterValues;
    this._shared.params = this.dataTable.getParams();
  }
}
pageChanged(event) {
  this._shared.selectedPage = event.page;
}


}
