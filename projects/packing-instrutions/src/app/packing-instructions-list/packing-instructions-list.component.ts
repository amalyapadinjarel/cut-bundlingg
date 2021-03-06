import { Component, OnInit, ViewChild } from "@angular/core";
import { SmdDataTable } from "app/shared/component";
import { PackingInstructionsService } from "../services/packing-instructions.service";
import { PackingInstructionsSharedService } from "../services/packing-instructions-shared.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-packing-instructions-list",
  templateUrl: "./packing-instructions-list.component.html",
  styleUrls: ["./packing-instructions-list.component.scss"],
})
export class PackingInstructionsListComponent implements OnInit {
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

  constructor(
    private service: PackingInstructionsService,
    public _shared: PackingInstructionsSharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this._shared.listData && !this._shared.refreshList) {
      if (this._shared.columnFilterValues) {
        this.dataTable.setColumnFilterInputValues(
          this._shared.columnFilterValues
        );
      }
      this.dataTable.refresh(this._shared.listData);
    }
    else{
      if (this._shared.columnFilterValues && Object.keys(this._shared.columnFilterValues).length != 0) {
        this.dataTable.setColumnFilterInputValues(this._shared.columnFilterValues);
        this._shared.refreshList = false;
        setTimeout(_ => {
          this.dataTable.refresh();
        }, 0);
      }
      else{
        this.dataTable.refresh();
      }
    }
  }

  ngOnDestroy() {
    
  }

  rowSelected(event) {
    if (event.model) {
      this._shared.reportData["pCsId"] = event.model['csId'];
      this._shared.reportData["pSo"] = event.model.orderId;
      this._shared.reportData["pPo"] = event.model.po;
      this._shared.reportData["pStyle"] = event.model.parentProduct;
    } else {
      this._shared.reportData = {}
    }
    if (event.selected) {
      this._shared.poId = event.model.po;
      this._shared.orderId = event.model.orderId;
      this._shared.parentProductId = event.model.parentProduct;
      this.router.navigateByUrl(
        "/packing-instructions/" +
          this._shared.poId +
          "/" +
          this._shared.orderId +
          "/" +
          this._shared.parentProductId
      );
    }
  }

  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.packingInstructions) {
      this._shared.setListData(dataChange.data);
      this._shared.columnFilterValues = dataChange.columnFilterValues ? dataChange.columnFilterValues : undefined;
      this._shared.params = this.dataTable.getParams();
    }
  }

  _onPageChange(pageChangeEvent: any) {
    // this._shared.selectedPage = pageChangeEvent.page;
  }

  onRowChecked(event) {
    let models = this.dataTable.selectedModels()
    if (models.length && models.length == 1) {
      this._shared.reportData["pCsId"] = models[0]['csId'];
      this._shared.reportData["pSo"] = models[0].orderId;
      this._shared.reportData["pPo"] = models[0].po;
      this._shared.reportData["pStyle"] = models[0].parentProduct;
    } else {
      this._shared.reportData = {}
    }
  }

}
