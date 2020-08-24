import { Component, OnInit, ViewChild } from '@angular/core';
import { UomSharedService } from '../../service/uom-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { SubSink } from 'subsink';
import { SmdDataTable } from 'app/shared/component';
import { UomService } from '../../service/uom.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AlertUtilities } from 'app/shared/utils';

@Component({
  selector: 'uom-header',
  templateUrl: './uom-header.component.html',
  styleUrls: ['./uom-header.component.scss']
})
export class UomHeaderComponent implements OnInit {
  public key = "Uomdetail";
  private subs = new SubSink();
  private refreshvalidValue: Subscription;
  @ViewChild(SmdDataTable) dataTable: SmdDataTable;
  constructor(public _shared: UomSharedService,
    public inputService: TnzInputService,
    public alertUtils: AlertUtilities,
    public _service: UomService) { }

  ngOnInit(): void {
    this.subs.sink = this._shared.refreshData.subscribe(change => {
      this._service.loadData(this.key);

    });
    // this.subs.sink = this._shared.refreshUomdetail.subscribe(change => {
    //   if (change) {
    //     this.refreshTable();

    //   }
    // });
    this.refreshvalidValue = this._shared.refreshUomdetail.subscribe(change => {
      this.refreshTable();
    });
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
  deleteLine(key, index) {
    this._shared.deleteLine(key, index)
  }
  defaultBaseUomCheck(event, model, index) {
    if (event.value == 'Y') {
      let data = this._shared.formData['Uomdetail'];
      let key = 'Uomdetail';
      if (data && data.length) {
        data.forEach((element, idx) => {
          if (index != idx) {
            element.baseUomFlag = 'N';
            let path = this._shared.getUomdetailPath(idx, 'baseUomFlag');
            this.inputService.updateInput(path, 'N', this._shared.UomdetailPrimaryKey)
          }
        });
      }

    }
    if (event.value == 'Y') {


      let data = this._shared.formData['Uomdetail'];
      let key = 'Uomdetail';
      if (data && data.length) {
        data.forEach((element, idx) => {
          if (index == idx) {
            element.active = 'Y';
            let path = this._shared.getUomdetailPath(idx, 'active');
            this.inputService.updateInput(path, 'Y', this._shared.UomdetailPrimaryKey)
          }
        });
      }

    }
  }

  isActiveEditable(index) {
    let baseUomFlagVal = this.inputService.getInputValue(this._shared.getUomdetailPath(index, 'baseUomFlag'));
    if (baseUomFlagVal == 'Y')
      return false;
    else
      return true;
  }
  isBaseUomCheckEditable() {
    let tabdata = this.inputService.getCache(this._shared.ConversiondetailPath)
    if (tabdata && tabdata.length > 0) {
      return false;
    }
    if (this._shared.editMode && !this._shared.convlines)
      return true;
    else
      return false;

  }

}
