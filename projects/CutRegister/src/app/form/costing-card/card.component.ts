import { Component, OnDestroy, OnInit } from '@angular/core';

import { DateUtilities, AlertUtilities } from 'app/shared/utils';
import { CutRegisterSharedService } from '../../_service/cut-register-shared.service';
import { CutRegisterService } from '../../_service/cut-register.service';
import { Subscription } from 'rxjs';
import { FacilityLovConfig, OddBundleLovConfig, AttributeSetLovConfig, CutTypeLovConfig } from '../../models/lov-config';

@Component({
	selector: 'cut-register-card',
	templateUrl: './card.component.html',
	host: { 'class': 'header-card' }
})
export class PdmCostingCardComponent implements OnInit, OnDestroy {

	loading = true;
	approvalLoading = true;
	costApproval: any[] = [];

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
			label: 'Multiple PO',
			value: 'Y'
		},
		{
			label: 'None',
			value: 'N'
		},
		{
			label: 'Multiple SO',
			value: 'S'
		}
	];

	constructor(
		private _service: CutRegisterService,
		public _shared: CutRegisterSharedService,
		public dateUtils: DateUtilities,
		private alertUtils: AlertUtilities
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

	setLoading(flag:boolean){
		this.loading = flag;
		this._shared.headerLoading = flag;
		this._shared.loading = flag;
	}

	valueChanged(change) {
		// if (this._shared.editMode) {
		// 	if (change.key == 'ProductId' || change.key == 'Season') {
		// 		this.setCostingProduct(change.key == 'ProductId' ? change.value : null);
		// 	} else if (change.key == 'ExchangeRateType' || change.key == 'ConversionDate' || change.key == 'CurrencyId') {
		// 		this.updateExchangeRate(change.key);
		// 	}
		// }
	}

	valueChangedFromUI(event){

	}

}
