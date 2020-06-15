import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { CutRegisterService } from '../../_service/cut-register.service';
import { AlertUtilities } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { Product, OrderDetails } from '../../models/cut-register.model';

@Component({
	selector: 'cut-bundle',
	templateUrl: './cut-bundle.component.html'
})
export class CutBundleComponent implements OnInit, OnDestroy {

	private refreshSub: Subscription;
	private refreshCutBundle: Subscription;

	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

	constructor(
		private _service: CutRegisterService,
		public _shared: CutRegisterSharedService,
		private alertUtils: AlertUtilities
	) {
	}

	ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
			this._service.loadData("cutBundle");
		});
		this.refreshCutBundle = this._shared.refreshCutBundle.subscribe(change => {
				this.refreshTable();
		});
	}

	ngOnDestroy(): void {
		if (this.refreshSub)
			this.refreshSub.unsubscribe();
		if (this.refreshCutBundle)
			this.refreshSub.unsubscribe();
	}

	refreshTable(){
		this.dataTable.refresh(this._shared.formData.cutBundle);
	}
}
