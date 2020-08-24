import { Component, OnInit, ViewChild } from '@angular/core';
import { PackingInstructionsService } from '../../services/packing-instructions.service';
import { PackingInstructionsSharedService } from '../../services/packing-instructions-shared.service';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SmdDataTable } from 'app/shared/component';

@Component({
  selector: 'app-cartons',
  templateUrl: './cartons.component.html',
  styleUrls: ['./cartons.component.scss']
})
export class CartonsComponent implements OnInit {
  key = 'carton'
  private refreshSub: Subscription;
	private refreshSubCartons: Subscription;
  private refreshCartonDetails: Subscription;
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  constructor(private _service: PackingInstructionsService,
		public _shared: PackingInstructionsSharedService,
		private alertUtils: AlertUtilities,
		private dialog: MatDialog) { }

  ngOnInit(): void {
    this.refreshSub = this._shared.refreshData.subscribe(change => {
      this.dataTable.refresh();
    });
  }

  refreshTable() {
		this.dataTable.refresh(this._shared.formData[this.key]);
  }
  
  ngOnDestroy(): void {
		if (this.refreshSub)
			this.refreshSub.unsubscribe();
		if (this.refreshCartonDetails)
			this.refreshCartonDetails.unsubscribe();
  }
  
  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.cartonDetails) {
      this._shared.setCartonListData(dataChange.data,this.key);
    }
  }

  onAction(event) {
    switch (event.key) {
      case 'delete':
        this._service.deleteCartonLines();
        break;
      case 'regenerate':
        this._service.generateCartonLines();
        break;
      default:
        console.log('Unimplemented action')
        break;
    }
  }

}
