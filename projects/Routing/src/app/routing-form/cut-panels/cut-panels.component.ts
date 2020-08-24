import { Component, OnInit, ViewChild, ContentChild, ContentChildren } from '@angular/core';
import { RoutingService } from '../../_service/routing.service';
import { RoutingSharedService } from '../../_service/routing-shared.service';
import { Subscription } from 'rxjs';
import { SmdDataTable } from 'app/shared/component';
import { AlertUtilities } from 'app/shared/utils';
import { semiProductsLovconfig } from '../../models/lov-config';
import { TnzInputComponent } from 'app/shared/tnz-input/component/tnz-input.component';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MatDialog } from '@angular/material/dialog';
import { AddNewSemiProductComponent } from '../add-new-semi-product/add-new-semi-product.component';

@Component({
  selector: 'app-cut-panels',
  templateUrl: './cut-panels.component.html'
})
export class CutPanelsComponent implements OnInit {

	key = 'cutPanelDetails'
	private refreshSub: Subscription;
	private refreshCutPanelDetails: Subscription;
	semiProducts = JSON.parse(JSON.stringify(semiProductsLovconfig));

	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
	constructor(
		private _service: RoutingService,
		public _shared: RoutingSharedService,
		private alertUtils: AlertUtilities,
		public inputService: TnzInputService,
		private dialog: MatDialog
	) {

	}

  ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
				this._service.loadData(this.key);
		});
		this.refreshCutPanelDetails = this._shared.refreshCutPanelDetails.subscribe(change => {
			if (change){}
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
	valueChangedFromUI(event) {
	if(event.displayValue == "ADD NEW"){
		const dialogRef = this.dialog.open(AddNewSemiProductComponent);
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				this.inputService.updateInput(event.path, res);
			}
			else{
				this.inputService.updateInput(event.path, "");
			}
		})
	}
	else{
		let flag = false;
		let foundOne = false;
		let path = event.path;
		let SelectedSemiProdId = event.value.semiProdId;
		let cache = this._service.getSavedCacheData();
		cache[this.key].forEach((value,index)=>{
			if(value == null){
				let dataFromForm = this._shared.formData[this.key];
				if(dataFromForm[index].semiProdId == SelectedSemiProdId){
					if(foundOne)
						flag = true;
					else	
						foundOne = true;
				}
			}
			else{
				if(value.panelName && value.panelName.semiProdId == SelectedSemiProdId)
					if(foundOne)
						flag = true;
					else	
						foundOne = true;
			}
		});
		if(flag){
			this.alertUtils.showAlerts("Selected cut panel already exist.");
			this.inputService.setError(path,"Selected cut panel already exist.")
		}

	}

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
		switch (event.key) {
			case 'delete':
				this._service.deleteLines(this.key);
				break;
			case 'add':
				this._shared.addLine(this.key);
				break;
			default:
				console.log('Unimplemented action')
				break;
		}
	}

}
