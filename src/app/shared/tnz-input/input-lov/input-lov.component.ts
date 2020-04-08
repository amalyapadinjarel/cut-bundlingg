import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { AlertUtilities } from 'app/shared/utils/alert.utility';
import { SmdDataTable } from 'app/shared/component';

@Component({
	selector: 'tnz-input-lov-component',
	templateUrl: './input-lov.component.html',
	styleUrls: ['./input-lov.component.scss']
})
export class TnzInputLOVComponent implements OnInit, OnDestroy {

	lovConfig: any = {};
	returnData: any;
	preFetchPages = 1;
	primaryKey = [];

	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

	constructor(
		public dialogRef: MatDialogRef<TnzInputLOVComponent>,
		private alertUtils: AlertUtilities,
	) {
	}

	ngOnInit() {
		console.log(this.lovConfig)
		if (this.lovConfig) {
			if (this.lovConfig.preFetchPages)
				this.preFetchPages = this.lovConfig.preFetchPages;
			if (this.lovConfig.primaryKey)
				this.primaryKey = this.lovConfig.primaryKey;
		}
	}

	ngOnDestroy() {
		delete this.lovConfig;
	}

	rowSelected(event) {
		this.returnData = event.model;
		if (event.selected) {
			this.selectRecord();
		}
	}

	selectRecord() {
		let models = this.dataTable.selectedModels();
		if (this.lovConfig.allowMultiple && models.length > 0) {
			this.dialogRef.close(models);
		}
		else if (this.lovConfig.allowMultiple && this.returnData) {
			this.dialogRef.close([this.returnData]);
		}
		else if (this.returnData) {
			this.dialogRef.close(this.returnData);
		} else {
			this.alertUtils.showAlerts('Selection failed');
		}
	}
}
