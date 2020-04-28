import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { CutRegisterService } from '../../_service/cut-register.service';
import { AlertUtilities } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { Product, OrderDetails } from '../../models/cut-register.model';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
	selector: 'order-details',
	templateUrl: './order-details.component.html'
})
export class OrderDetailsComponent implements OnInit, OnDestroy {

	private refreshSub: Subscription;
	private refreshOrderDetails: Subscription;
	public key = 'orderDetails';

	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

	constructor(
		private _service: CutRegisterService,
		public _shared: CutRegisterSharedService,
		private alertUtils: AlertUtilities,
		private _inputService: TnzInputService
	) {
	}

	ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
			this._service.loadData(this.key);
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

	valueChangedFromUI(change, index) {
		if (this._shared.editMode) {
			let value, totalOrderQty, orderQty, otherValue
			value = change.value;
			totalOrderQty = ''
			if (typeof value != 'undefined' && value !== '') {
				switch (change.key) {
					case 'cutAllowancePercent':
						orderQty = this._shared.formData.orderDetails[index]['lineQty'];
						totalOrderQty = this._service.calculateAllowedQty(orderQty, value)
						otherValue = this._inputService.getInputValue(this._shared.getOrderDetailsPath(index, 'cutAllowanceQty'))
						if (otherValue) {
							this._inputService.updateInput(this._shared.getOrderDetailsPath(index, 'cutAllowanceQty'), '')
							this.alertUtils.showAlerts("Setting Cut Allowance Qty as blank since Cut Allowance Percent has changed")
						}
						break;
					case 'cutAllowanceQty':
						orderQty = this._shared.formData.orderDetails[index]['lineQty'];
						totalOrderQty = Number(orderQty) + Number(value);
						otherValue = this._inputService.getInputValue(this._shared.getOrderDetailsPath(index, 'cutAllowanceQty'))
						if (otherValue) {
							this._inputService.updateInput(this._shared.getOrderDetailsPath(index, 'cutAllowancePercent'), '')
							this.alertUtils.showAlerts("Setting Cut Allowance Percent as blank since Cut Allowance Qty has changed")
						}
						break;
					default:
						break;
				}
			}
			this._inputService.updateInput(this._shared.getOrderDetailsPath(index, 'totalOrderQty'), totalOrderQty)
		}
	}

	valueChanged(change, index) {
		if (this._shared.editMode) {
		}
	}

	refreshTable() {
		console.log(this._shared.formData[this.key])
		this.dataTable.refresh(this._shared.formData[this.key]);
	}

	onRowSelected() {
		this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
	}

	deleteLine(index, model) {
		this._service.deleteDetailsLine(this.key, index, model);
	}
}
