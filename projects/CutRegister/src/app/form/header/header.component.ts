import { Component, OnDestroy, OnInit } from '@angular/core';

import { DateUtilities } from 'app/shared/utils';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { DocTypeLovconfig } from '../../models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
	selector: 'cut-register-header',
	templateUrl: './header.component.html',
	host: { 'class': 'form-header' }
})
export class PdmCostingHeaderComponent implements OnInit, OnDestroy {

	docTypeLov = JSON.parse(JSON.stringify(DocTypeLovconfig));

	constructor(
		public dateUtils: DateUtilities,
		public _shared: CutRegisterSharedService,
		private _inputService: TnzInputService
	) {
	}

	ngOnInit() {
		console.log(this._shared.formData)
	}

	ngOnDestroy(): void {
	}

	valueChanged(change) {
		switch(change.key){
			case 'docType':
				this._inputService.updateInput(this._shared.getHeaderAttrPath('docStatus'),'DRAFT')
				break;
			default:
				break;
		}
	 }

}
