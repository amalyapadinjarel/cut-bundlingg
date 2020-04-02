import { Component, OnDestroy, OnInit } from '@angular/core';

import { DateUtilities, AlertUtilities } from 'app/shared/utils';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { CutRegisterService } from '../../_service/cut-register.service';
import { Subscription } from 'rxjs';
import { FacilityLovConfig, OddBundleLovConfig, AttributeSetLovConfig, CutTypeLovConfig } from '../../models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
	selector: 'cut-register-card',
	templateUrl: './card.component.html',
	host: { 'class': 'header-card' }
})
export class PdmCostingCardComponent implements OnInit, OnDestroy {

	oddBundlePerEdit: boolean = false;
	loading = true;
	approvalLoading = true;
	costApproval: any[] = [];
	today = new Date();

	private refreshSub: Subscription;
	cutFacilityLov = JSON.parse(JSON.stringify(FacilityLovConfig));
	sewingFacilityLov = JSON.parse(JSON.stringify(FacilityLovConfig));
	markerNameMethodLov = JSON.parse(JSON.stringify(FacilityLovConfig));
	oddBundleLovConfig = JSON.parse(JSON.stringify(OddBundleLovConfig));
	attributeSetLovConfig = JSON.parse(JSON.stringify(AttributeSetLovConfig));
	cutTypeLovConfig = JSON.parse(JSON.stringify(CutTypeLovConfig));
	markerNameOptions = [
		{
			label: 'Alphabet',
			value: 'A'
		},
		{
			label: 'Numeric',
			value: 'N'
		}
	];

	groupingCriteriaOptions = [
		{
			label: 'None',
			value: 'N'
		},
		{
			label: 'Multiple PO',
			value: 'Y'
		},
		{
			label: 'Multiple SO',
			value: 'S'
		}
	];

	cutTypeDefaultValue = {
		label: 'Body',
		value: 'B'
	}

	attributeSetDefaultValue = {
		label: "Size",
		value: "SIZE"
	}

	constructor(
		private _service: CutRegisterService,
		public _shared: CutRegisterSharedService,
		public dateUtils: DateUtilities,
		private alertUtils: AlertUtilities,
		private _inputService: TnzInputService
	) {
	}

	ngOnInit() {
		this.refreshSub = this._shared.refreshData.subscribe(change => {
			this.loadData();
		})
	}

	ngOnDestroy(): void {
		if (this.refreshSub)
			this.refreshSub.unsubscribe();
	}

	loadData() {
		this.setLoading(true);
		this._service.fetchFormData(this._shared.id).then((data: any) => {
			this._shared.setFormHeader(data);
			this.setLoading(false);
		}, err => {
			this.setLoading(false);
			if (err)
				this.alertUtils.showAlerts(err, true)
		});

		// this.approvalLoading = true;
		// this.costApproval = [];
		// this._service.fetchCostingApprovals().then((data: any) => {
		// 	this.costApproval = data;
		// 	this.approvalLoading = false;
		// }, err => {
		// 	this.approvalLoading = false;
		// 	if (err)
		// 		this.alertUtils.showAlerts(err, true)
		// });
	}

	setLoading(flag: boolean) {
		this.loading = flag;
		this._shared.headerLoading = flag;
		this._shared.loading = flag;
	}

	valueChanged(change, key?) {
		switch (key) {
			case 'oddBundleAcc':
				if (change.value == 'NEW_OR_LAST')
					this.oddBundlePerEdit = true;
				else{
					this.oddBundlePerEdit = false;
					this._inputService.updateInput(this._shared.getHeaderAttrPath('oddBundlePer'), '');
				}
				break;
			case 'cutFacility':
				console.log(change, 'cutFacility')
				if (change.value && typeof change.value == 'object')
					this._inputService.updateInput(this._shared.getHeaderAttrPath('sewingFacility'), change.value);
				else
					this._inputService.updateInput(this._shared.getHeaderAttrPath('sewingFacility'), '');
				break;
			default:
				break;
		}
	}

	valueChangedFromUI(event) {

	}

}
