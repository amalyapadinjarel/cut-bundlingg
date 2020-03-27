import { Component, OnDestroy, OnInit } from '@angular/core';

import { DateUtilities } from 'app/shared/utils';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { DocTypeLovconfig } from '../../models/lov-config';

@Component({
	selector: 'cut-register-header',
	templateUrl: './header.component.html',
	host: { 'class': 'form-header' }
})
export class PdmCostingHeaderComponent implements OnInit, OnDestroy {

	docTypeLov = JSON.parse(JSON.stringify(DocTypeLovconfig));

	constructor(
		public dateUtils: DateUtilities,
		public _shared: CutRegisterSharedService
	) {
	}

	ngOnInit() {
	}

	ngOnDestroy(): void {
	}

	valueChanged(change) { }

}
