import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';

@Component({
  selector: 'config-ref',
  templateUrl: './config-ref.component.html',
  styleUrls: ['./config-ref.component.scss']
})
export class ConfigRefComponent implements OnInit {
  @ViewChild(SmdDataTable) dataTable: SmdDataTable;
  tableData = []

  constructor() { }

  ngOnInit(

  ): void {
    this.setTable()
  }
  setTable() {

    let patternArr = ["${DIVISION}", "${FACILITY}", "${YY}", "${YYYY}", "${MM}", "${MMM}", "${DD}"]
    let resolArr = ["Division short code", "Facility short code", "Last 2 digits of year", "Year", "Months in digits", "Months in character e.g., JAN", "Date in digits"]
    patternArr.forEach((patternValue, index) => {
      let indexnum = index
      resolArr.forEach((resolValue, index) => {
        if (indexnum == index) {
          let arrValue = { "pattern": patternValue, "resolution": resolValue }
          this.tableData.push(arrValue)
        }
      });

    });

  }
}
