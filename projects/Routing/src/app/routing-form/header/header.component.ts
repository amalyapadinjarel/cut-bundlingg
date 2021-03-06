import { Component, OnInit } from '@angular/core';
import { RoutingSharedService } from '../../_service/routing-shared.service';
import { DateUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { DocTypeLovconfig } from '../../models/lov-config';

@Component({
  selector: 'app-routing-header',
  templateUrl: './header.component.html',
  host: { 'class': 'form-header' }
})
export class HeaderComponent implements OnInit {

	docTypeLov = JSON.parse(JSON.stringify(DocTypeLovconfig));

	constructor(
		public dateUtils: DateUtilities,
		public _shared: RoutingSharedService,
		private _inputService: TnzInputService
	) {
	}

	ngOnInit() {
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
