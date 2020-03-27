import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { CutRegisterService } from '../../_service/cut-register.service';
import { AlertUtilities } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { Product, LayerDetails } from '../../models/cut-register.model';
import { FabricLovConfig } from '../../models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
	selector: 'layer-details',
	templateUrl: './layer-details.component.html'
})
export class LayerDetailsComponent implements OnInit, OnDestroy {

	fabricLovConfig: { title: string; url: string; dataHeader: string; returnKey: string; displayKey: string; filterAttributes: string[]; displayFields: { key: string; title: string; }[]; };
	private refreshSub: Subscription;
	private refreshLayerDetails: Subscription;
	
	
	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

	constructor(
		private _service: CutRegisterService,
		public _shared: CutRegisterSharedService,
		private alertUtils: AlertUtilities,
		private inputService:TnzInputService
	) {

	}

	ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
			this._service.loadData("layerDetails");
		});
		this.refreshLayerDetails = this._shared.refreshLayerDetails.subscribe(change => {
			this.refreshTable();
		});

		this.fabricLovConfig = {
			title: 'Select Fabric',
			url: '/lovs/fabric--and-attributes?cutRegisterId=' + this._shared.id,
			dataHeader: 'data',
			returnKey: 'productId',
			displayKey: 'productTitleNum',
			filterAttributes: ['productTitleNum'],
			displayFields: [
				{
					key: 'productTitleNum',
					title: 'Fabric Name'
				}
				, {
					key: 'prdAttribute',
					title: 'Attribute'
				}
				, {
					key: 'lotNum',
					title: 'Lot#',
				}
				, {
					key: 'shade',
					title: 'Shade',
				}
				, {
					key: 'slNum',
					title: 'Sl#',
				}
			]
		}
	}

	ngOnDestroy(): void {
		if (this.refreshSub)
			this.refreshSub.unsubscribe();
		if (this.refreshLayerDetails)
			this.refreshLayerDetails.unsubscribe();
	}

	valueChanged(change, index) {
		// if (this._shared.editMode) {
			console.log("Changed")
			let lovValue = change.value;
			let changeFields = [
				{
					fromKey: "prdAttribute",
					toKey: "prodAttr"
				}
				, {
					fromKey: "lotNum",
					toKey: "lotNo"
				}
			]
			changeFields.forEach(field => {
				if (lovValue[field.fromKey]) {
					let path = this._shared.getLayerDetailsPath(index, field.toKey);
					this.inputService.updateInput(path, lovValue[field.fromKey])
				}
			})
		// }
	}

	valueChangedFromUI(change, index) {
		if (this._shared.editMode) {
			
		}
	}

	deleteLine(index) {
		this._shared.formData.layerDetails.splice(index, 1);
		this._shared.refreshLayerDetails.next(true);
	}

	refreshTable() {
		this.dataTable.refresh(this._shared.formData.layerDetails);
	}

	onRowSelected(){
		this._shared.setSelectedLines('layerDetails',this.dataTable.selectedModels())
	}
}
