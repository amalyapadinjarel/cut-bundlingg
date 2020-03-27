import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { CutRegisterService } from '../../_service/cut-register.service';
import { AlertUtilities } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { Product } from '../../models/cut-register.model';

@Component({
	selector: 'marker-details',
	templateUrl: './marker-details.component.html'
})
export class MarkerDetailsComponent implements OnInit, OnDestroy {

	private refreshSub: Subscription;
	private refreshMarkerDetails: Subscription;

	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

	constructor(
		private _service: CutRegisterService,
		public _shared: CutRegisterSharedService,
		private alertUtils: AlertUtilities
	) {
	}

	ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
			this._service.loadData("markerDetails");
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
		}
	}

	refreshTable(){
		this.dataTable.refresh( this._shared.formData.markerDetails);
	}
}
