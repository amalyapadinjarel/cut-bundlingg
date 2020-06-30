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
    if (this._shared.listData) {
      if (this._shared.columnFilterValues) {
        this.dataTable.setColumnFilterInputValues(
          this._shared.columnFilterValues
        );
      }
      this.dataTable.refresh(this._shared.listData);
    }
  }

  ngOnDestroy() {
    
  }

  rowSelected(event) {
    this._shared.poId = event.model.po;
    this._shared.orderId = event.model.orderId;
    this._shared.parentProductId = event.model.parentProduct;
    if (event.selected) {
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
      this._shared.columnFilterValues = dataChange.columnFilterValues;
      this._shared.params = this.dataTable.getParams();
    }
  }

  _onPageChange(pageChangeEvent: any) {
    // this._shared.selectedPage = pageChangeEvent.page;
  }

}
