import { Component, OnDestroy, OnInit } from '@angular/core';

import { DateUtilities, AlertUtilities } from 'app/shared/utils';
import { LookupSharedService } from '../../_service/lookup-shared.service';
import { LookupService } from '../../_service/lookup.service';
import { Subscription } from 'rxjs';
import { ApplicationLovConfig } from '../../models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
	selector: 'lookup-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
	host: { 'class': 'general-card' }
})
export class GeneralCardComponent implements OnInit, OnDestroy {

	disabled: any = {};
	loading = true;
	today = new Date();

	private refreshSub: Subscription;
	private refreshHeaderSub: Subscription;

	applicationLov = JSON.parse(JSON.stringify(ApplicationLovConfig));



	//new options-added by shery
	accessLevelOptions = [
		{
			label: 'User',
			value: 'U'
		},
		{
			label: 'System',
			value: 'S'
		}
	];




	constructor(
		private _service: LookupService,
		public _shared: LookupSharedService,
		public dateUtils: DateUtilities,
		private alertUtils: AlertUtilities,
		private _inputService: TnzInputService
	) {
	}

	ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
			this.loadData();
		})
		this.refreshHeaderSub = this._shared.refreshHeaderData.subscribe(change => {
			this.loadData();
		})
		this.setDefaultValues();

	}

	ngOnDestroy(): void {
		if (this.refreshSub)
			this.refreshSub.unsubscribe();
		if (this.refreshHeaderSub)
			this.refreshHeaderSub.unsubscribe();

		this._service.apiSubscription?.unsubscribe();
	}

	loadData() {
		this.setLoading(true);
		this._service.fetchFormData(this._shared.lookupType).then((data: any) => {
			this._shared.setFormHeader(data);
			this.setLoading(false);
		}, err => {
			this._shared.setFormHeader({});

			this.setLoading(false);
			if (err)
				this.alertUtils.showAlerts(err, true)
		});

		//add code if no data 
	}

	setLoading(flag: boolean) {
		this.loading = flag;
		this._shared.headerLoading = flag;
		this._shared.loading = flag;
	}



	valueChangedFromUI(event) {
	//	console.log("event-",event);

		let tmp = event.value.toUpperCase();
	//	console.log("tmp-",tmp);
		//set lookuptype to header
		this._shared.formData.header.lookupType = tmp;
		
		if (tmp.length > 30) {
			this._inputService.setError(this._shared.getHeaderAttrPath('lookupType'), 'Length exceeded 30 characters!');
		}
		else {
			//check for duplicates
			this._service.duplicateLookupTypeCheck().then(data => {
				if (data) {
					this._inputService.setError(this._shared.getHeaderAttrPath('lookupType'), 'Duplicate lookup type -' + event.value + ' !');
				}
			});
		}
	}

	setPrimaryKey(key) {
		this._shared.lookupType = key;
	}

	disableInput(key) {
		this.disabled[key] = true;
	}

	enableInput(key) {
		this.disabled[key] = false;
	}

	getIfEditable(key) {
		return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.lookupType);
	}

	setDefaultValues() {
		if (this._shared.lookupType == '--') {
			let defaultValues = {
				// 'accessLevelOptions':'U',
				// 'application':'Manufacturing'
			}
			Object.keys(defaultValues).forEach(attr => {
				this._inputService.updateInput(this._shared.getHeaderAttrPath(attr), defaultValues[attr])
			});

		}
	}

	lengthCheck(event,attr){
		let val= event.value;

		let limit=240;
		if(val.length>limit){
			this._inputService.setError(this._shared.getHeaderAttrPath(attr), 'Length exceeded '+ limit+' characters!');

		}
	}

}
