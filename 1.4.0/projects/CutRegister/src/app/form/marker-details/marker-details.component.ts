import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { CutRegisterService } from '../../_service/cut-register.service';
import { AlertUtilities } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { Product } from '../../models/cut-register.model';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
	selector: 'marker-details',
	templateUrl: './marker-details.component.html'
})
export class MarkerDetailsComponent implements OnInit, OnDestroy {

	key = 'markerDetails';
	private refreshSub: Subscription;
	private refreshMarkerDetails: Subscription;

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
			this._service.loadData(this.key);
		});
		this.refreshMarkerDetails = this._shared.refreshMarkerDetails.subscribe(change => {
			this.refreshTable();
		});
	}

	ngOnDestroy(): void {
		if (this.refreshSub)
			this.refreshSub.unsubscribe();
		if (this.refreshMarkerDetails)
			this.refreshMarkerDetails.unsubscribe();
	}

	valueChanged(change, index) {
		if (this._shared.editMode) {
		}
	}

	valueChangedFromUI(change, index) {
		if (this._shared.editMode) {
			switch (change.key) {
				case 'markerRatio':
					if (change.value) {
						let totalPlyCount = this._service.calclateTotalPlyCount();
						let value = change.value
						if (typeof value != undefined && !isNaN(value)) {
							value = Number(value) * totalPlyCount;
							this.inputService.updateInput(this._shared.getMarkerDetailsPath(index, 'currcutqtysql'), value);
						}
					} else {
						this.inputService.updateInput(this._shared.getMarkerDetailsPath(index, 'currcutqtysql'), 0);						
					}
					break;
				default:
					break;
			}
		}
	}

	refreshTable() {
		this.dataTable.refresh(this._shared.formData[this.key]);
	}

	onRowSelected() {
		this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
	}

	deleteLine(index, model) {
		this._service.deleteDetailsLine(this.key, index, model)
	}
}
