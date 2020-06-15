import { Component, OnDestroy, OnInit } from '@angular/core';

import { DateUtilities } from 'app/shared/utils';
import { LookupSharedService } from '../../_service/lookup-shared.service';
//import { DocTypeLovconfig } from '../../models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
	selector: 'lookup-header',
	templateUrl: './header.component.html',
	host: { 'class': 'form-header' }
})
export class LookupHeaderComponent implements OnInit, OnDestroy {

	//docTypeLov = JSON.parse(JSON.stringify(DocTypeLovconfig));

	constructor(
		public dateUtils: DateUtilities,
		public _shared: LookupSharedService,
		private _inputService: TnzInputService
	) {
	}

	ngOnInit() {
	}

	ngOnDestroy(): void {
	}

	valueChanged(change) {
		
	 }

}
