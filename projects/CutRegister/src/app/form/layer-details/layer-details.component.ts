import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { CutRegisterService } from '../../_service/cut-register.service';
import { AlertUtilities } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { Product, LayerDetails } from '../../models/cut-register.model';
import { FabricLovConfig, StickerColorLovConfig, StyleColorLovConfig } from '../../models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
	selector: 'layer-details',
	templateUrl: './layer-details.component.html'
})
export class LayerDetailsComponent implements OnInit, OnDestroy {

	disabled: any = {};
	fabricLovConfig: any;
	styleColorLovConfig: any;
	stickerColorLovConfig = JSON.parse(JSON.stringify(StickerColorLovConfig))
	private refreshSub: Subscription;
	private refreshLayerDetails: Subscription;


	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

	constructor(
		private _service: CutRegisterService,
		public _shared: CutRegisterSharedService,
		private alertUtils: AlertUtilities,
		private inputService: TnzInputService
	) {

	}

	ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
			this._service.loadData("layerDetails");
		});
		this.refreshLayerDetails = this._shared.refreshLayerDetails.subscribe(change => {
			this.refreshTable();
		});

		this.fabricLovConfig = FabricLovConfig(this._shared.id)

		this.styleColorLovConfig = StyleColorLovConfig(this._shared.id)
	}

	ngOnDestroy(): void {
		if (this.refreshSub)
			this.refreshSub.unsubscribe();
		if (this.refreshLayerDetails)
			this.refreshLayerDetails.unsubscribe();
	}

	valueChanged(change, index) {
		// if (this._shared.editMode) {
		let lovValue = change.value;
		let changeFields = [];
		switch (change.key) {
			case 'product':
				changeFields = [
					{
						fromKey: "prdAttribute",
						toKey: "prodAttr",
					}
					, {
						fromKey: "lotNum",
						toKey: "lotNo"
					}
					, {
						fromKey: "slNum",
						toKey: "slNo"
					}
					, {
						fromKey: "grade",
						toKey: "grade"
					}
					, {
						fromKey: "shade",
						toKey: "shade"
					}
					, {
						fromKey: "rollNum",
						toKey: "rollNo"
					}
					, {
						fromKey: "shrinkage",
						toKey: "shrinkage"
					}
				]
				break;
			case 'color':
				changeFields = [
					{
						fromKey: "styleId",
						toKey: "refProdId",
					}
					, {
						fromKey: "styleName",
						toKey: "style"
					}
				]
				break;
		}

		changeFields.forEach(field => {
			if (lovValue[field.fromKey]) {
				let path = this._shared.getLayerDetailsPath(index, field.toKey);
				this.inputService.updateInput(path, lovValue[field.fromKey])
				this.disableInput(index, field.toKey);
			} else if (!this.getIfEditable(index, field.toKey)) {
				this.enableInput(index, field.toKey)
			}
		})
	}

	valueChangedFromUI(change, index) {
		if (this._shared.editMode) {
			switch (change.key) {
				case 'layerCount':
					if (change.value) {
						this._service.resetCutQty()
					}
					break;
				default:
					break;
			}
		}
	}

	refreshTable() {
		this.dataTable.refresh(this._shared.formData.layerDetails);
	}

	onRowSelected() {
		this._shared.setSelectedLines('layerDetails', this.dataTable.selectedModels())
	}

	disableInput(index, key) {
		if (!this.disabled[index])
			this.disabled[index] = [];
		let i = this.disabled[index].indexOf(key);
		if (i == -1)
			this.disabled[index].push(key);
	}

	enableInput(index, key) {
		let i = this.disabled[index].indexOf(key);
		this.disabled[index].splice(i, 1);
	}

	getIfEditable(index, key) {
		if (!this.disabled[index])
			this.disabled[index] = [];
		let i = this.disabled[index].indexOf(key);
		return i == -1 && this._shared.getLayerDetailsEditable();
	}
}
