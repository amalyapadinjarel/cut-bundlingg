import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { LookupService } from '../../_service/lookup.service';
import { AlertUtilities } from 'app/shared/utils';
import { Subscription } from 'rxjs';
import { LookupSharedService } from '../../_service/lookup-shared.service';
import { LookupType, LookupValue } from '../../models/lookup.model';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
	selector: 'lookup-value',
	templateUrl: './lookupValue.component.html',
	styleUrls: ['./lookupValue.component.scss']
})
export class LookupValueComponent implements OnInit, OnDestroy {

	private refreshSub: Subscription;
	private refreshLookupValue: Subscription;
	public key = 'lookupValue';

	tempLookupCode: string;

	disabled: any = {};
	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

	constructor(
		private _service: LookupService,
		public _shared: LookupSharedService,
		private alertUtils: AlertUtilities,
		private _inputService: TnzInputService
	) {
	}

	ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
			this._service.loadData(this.key);
		});
		this.refreshLookupValue = this._shared.refreshLookupValue.subscribe(change => {
			this.refreshTable();
		});
	}

	ngOnDestroy(): void {
		if (this.refreshSub)
			this.refreshSub.unsubscribe();
		if (this.refreshLookupValue)
			this.refreshSub.unsubscribe();
	}

	// valueChanged(change, index) {
	// 	if (this._shared.editMode) {
	// 	}
	// }

	refreshTable() {
		this.dataTable.refresh(this._shared.formData[this.key])

	}

	getIfEditable(index, key) {
		if (!this.disabled[index])
			this.disabled[index] = [];
		let i = this.disabled[index].indexOf(key);
		return i == -1 && this._shared.getLookupValueEditable();
	}
	onRowSelected() {
		//	this._shared.setSelectedLines('lookupValue', this.dataTable.selectedModels())
		this._shared.setSelectedLines(this.key, this.dataTable.selectedModels())
	}
	disableInput(index, key) {
		if (!this.disabled[index])
			this.disabled[index] = [];
		let i = this.disabled[index].indexOf(key);
		if (i == -1)
			this.disabled[index].push(key);
	}
	enableInput(index, key) {
		let i = this.disabled[index].indexOf(key);
		this.disabled[index].splice(i, 1);
	}

	//Method not used
	getDate() {
		//console.log(Date.now);
		return Date.now;
	}

	//Method to check duplicate Lookupcode
	checkDuplicateLookupCode(event, index) {

		let tmp = event.value;
		if (tmp.length > 30) {
			this._inputService.setError(this._shared.getLookupValuePath(index, 'lookupCode'), 'Length exceeded 30 characters!');
		} else {
			this._inputService.resetError(this._shared.getLookupValuePath(index, 'lookupCode'));
			this._shared.formData.lookupValue.forEach((line, i) => {
				let val = this._inputService.getInputValue(this._shared.getLookupValuePath(i, 'lookupCode'));

				if (i != index) {
					if (val.toLowerCase() == tmp.toLowerCase()) {
						this._inputService.setError(this._shared.getLookupValuePath(index, 'lookupCode'), 'Duplicate lookupcode');
					}
					else {
						if (this._inputService.getStatus(this._shared.getLookupValuePath(i, 'lookupCode')) == 'error') {
							this._inputService.resetError(this._shared.getLookupValuePath(i, 'lookupCode'));

						}
					}
				}
			})
		}
	}

	lengthCheck(event,index,attr) {
		let val = event.value;
		let limit;
		switch (attr) {
			case 'lookupCode':
				limit = 30;
				break;
			case 'meaning':
				limit = 80;
				break;
			case 'header1': case 'header2': case 'header3':case 'header4':case 'header5':
				limit=60;
				break;
			case 'description':
				limit=240;
				break;
			default:
				limit=150;
					break;
		}
		if (val.length > limit) {
			this._inputService.setError(this._shared.getLookupValuePath(index,attr), 'Length exceeded ' + limit + ' characters!');
		}
	}



}
