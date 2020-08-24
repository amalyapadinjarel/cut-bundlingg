import { Component, OnInit, ViewChild } from '@angular/core';
import { UomSharedService } from '../../service/uom-shared.service';
import { SubSink } from 'subsink';
import { SmdDataTable } from 'app/shared/component';
import { UomService } from '../../service/uom.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'uom-conversion',
  templateUrl: './uom-conversion.component.html',
  styleUrls: ['./uom-conversion.component.scss']
})
export class UomConversionComponent implements OnInit {
  public key = "Conversiondetail";
  private subs = new SubSink();
 


  @ViewChild(SmdDataTable) dataTable: SmdDataTable;
  constructor(public _shared: UomSharedService,
    public _service: UomService,
    public _inputService: TnzInputService,) { }

  ngOnInit(): void {
    this.subs.sink = this._shared.refreshData.subscribe(change => {
      this._service.loadData(this.key);

    });
    this.subs.sink = this._shared.refreshConversiondetail.subscribe(change => {
      if (change) {
        this.refreshTable();

      }
    });
  }
  
  uomsLovconfig(index) {
  let cache = this._shared.id;
 
  
  return JSON.parse(JSON.stringify(uomsLovconfig(cache)));
}
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  refreshTable() {

    setTimeout(_ => this.dataTable.refresh(this._shared.formData[this.key]), 0)

  }
  onRowSelected() {
		this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
  }
  deleteLine(key,index) {
    this._shared.deleteLine(key, index)
  }
}
export function uomsLovconfig(categoryId) {
  let json =
      {
          title: 'Select UOM',
         url: "lovs/uoms?category="+categoryId ,
          dataHeader: 'data',
          returnKey: 'value',
          displayKey: 'shortCode',
          filterAttributes: ['shortCode'],
          displayFields: [
            {
              key: 'shortCode',
              title: 'Code'
          },
            {
              key: 'label',
              title: 'Name'
          }
          ]
      }
  return json
}
