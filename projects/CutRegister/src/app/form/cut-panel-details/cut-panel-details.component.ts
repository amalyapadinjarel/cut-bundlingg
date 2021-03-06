import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { CutRegisterService } from '../../_service/cut-register.service';
import { AlertUtilities } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { Product } from '../../models/cut-register.model';

@Component({
	selector: 'cut-register-products',
	templateUrl: './cut-panel-details.component.html'
})
export class CutPanelDetailsComponent implements OnInit, OnDestroy {

	key = 'cutPanelDetails'
	private refreshSub: Subscription;
	private refreshCutPanelDetails: Subscription;

	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

	constructor(
		private _service: CutRegisterService,
		public _shared: CutRegisterSharedService,
		private alertUtils: AlertUtilities
	) {
	}

	ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
				this._service.loadData(this.key);
		});
		this.refreshCutPanelDetails = this._shared.refreshCutPanelDetails.subscribe(change => {
			if (change)
				this.refreshTable();
		});
	}

	ngOnDestroy(): void {
		if (this.refreshSub)
			this.refreshSub.unsubscribe();
		if (this.refreshCutPanelDetails)
			this.refreshCutPanelDetails.unsubscribe();
	}

	valueChanged(change, index) {
		
	}

	valueChangedFromUI(change, index) {
		
	}

	deleteLine(index){
		this._shared.deleteLine(this.key, index)
	}

	refreshTable() {
		this.dataTable.refresh(this._shared.formData[this.key]);
	}

	onRowSelected() {
		this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
	}

	onAction(event) {
		console.log(event)
		switch (event.key) {
			case 'delete':
				this._service.deleteLines(this.key);
				break;
			case 'regenerate':
				this._service.regenerateCutPanels();
				break;
			default:
				console.log('Unimplemented action')
				break;
		}
	}
}
