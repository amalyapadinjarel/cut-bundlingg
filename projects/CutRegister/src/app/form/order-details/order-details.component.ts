import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { CutRegisterService } from '../../_service/cut-register.service';
import { AlertUtilities } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { Product, OrderDetails } from '../../models/cut-register.model';

@Component({
	selector: 'order-details',
	templateUrl: './order-details.component.html'
})
export class OrderDetailsComponent implements OnInit, OnDestroy {

	private refreshSub: Subscription;
	private refreshOrderDetails: Subscription;

	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

	constructor(
		private _service: CutRegisterService,
		public _shared: CutRegisterSharedService,
		private alertUtils: AlertUtilities
	) {
	}

	ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
			this._service.loadData("orderDetails");
		});
		this.refreshOrderDetails = this._shared.refreshOrderDetails.subscribe(change => {
				this.refreshTable();
		});
	}

	ngOnDestroy(): void {
		if (this.refreshSub)
			this.refreshSub.unsubscribe();
		if (this.refreshOrderDetails)
			this.refreshSub.unsubscribe();
	}

	valueChanged(change, index) {
		if (this._shared.editMode) {
			if (change.key == 'LineAmount')
				this.calculateProfit(index);
		}
	}

	valueChangedFromUI(change, index) {
		if (this._shared.editMode) {
			if (change.key == 'SellingPrice')
				this.calculateProfit(index);
		}
	}

	calculateProfit(index) {
		let fob = this._shared.getProdAttributeValue(index, 'SellingPrice');
		let profit = Math.round(((fob - this._shared.getProdAttributeValue(index, 'LineAmount')) + Number.EPSILON) * 10 ** 12) / 10 ** 12;
		this._service.inputService.updateInput(this._shared.getProductAttrPath(index, 'ProfitAmount'), profit);
		this._service.inputService.updateInput(this._shared.getProductAttrPath(index, 'ProfitPercent'), Math.round(((profit * 100 / fob) + Number.EPSILON) * 100) / 100);
	}


	private getCombinationKey(combo, color) {
		if (combo && color) {
			return 'cmbclr:' + combo + ':' + color;
		}
		else if (combo) {
			return 'cmb:' + combo;
		}
		else if (color) {
			return 'clr:' + color;
		}
		else {
			return 'general';
		}
	}

	refreshTable(){
		this.dataTable.refresh(this._shared.formData.orderDetails);
	}
}
