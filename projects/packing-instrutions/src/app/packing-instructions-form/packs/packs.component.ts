import { Component, OnInit, ViewChild } from '@angular/core';
import { PackingInstructionsService } from '../../services/packing-instructions.service';
import { PackingInstructionsSharedService } from '../../services/packing-instructions-shared.service';
import { Subscription } from 'rxjs';
import { semiProductsLovconfig } from '../../../../../Routing/src/app/models/lov-config';
import { SmdDataTable } from 'app/shared/component';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MatDialog } from '@angular/material/dialog';
import { AddNewSemiProductComponent } from '../../../../../Routing/src/app/routing-form/add-new-semi-product/add-new-semi-product.component';

@Component({
  selector: 'app-packs',
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.scss']
})
export class PacksComponent implements OnInit {

  	key = 'packsDetails'
	private refreshSub: Subscription;
	private refreshPackDetails: Subscription;

	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
	constructor(
		private _service: PackingInstructionsService,
		public _shared: PackingInstructionsSharedService,
		private alertUtils: AlertUtilities,
		public inputService: TnzInputService,
		private dialog: MatDialog
	) {

	}

  ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
				this._service.loadData(this.key);
				this._service.loadStyleVarientData();
		});
		this.refreshPackDetails = this._shared.refreshpacksDetails.subscribe(change => {
			if (change){}
				this.refreshTable();
		});
	}

	ngOnDestroy(): void {
		if (this.refreshSub)
			this.refreshSub.unsubscribe();
		if (this.refreshPackDetails)
			this.refreshPackDetails.unsubscribe();
	}

	valueChanged(change, index) {
		
	}
	valueChangedFromUI(event) {
	
	}

	deleteLine(index){
		this._shared.deleteLine(this.key, index)
	}

	refreshTable() {
		// this.dataTable.refresh(this._shared.formData[this.key]);
	}

	onRowSelected() {
		this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
	}

}