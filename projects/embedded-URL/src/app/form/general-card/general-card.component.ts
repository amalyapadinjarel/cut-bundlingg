import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmbeddedURLService } from '../../_service/embedded-URL.service';
import { EmbeddedURLSharedService } from '../../_service/embedded-URL-shared.service';
import { DateUtilities, AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { BIVendorLOVConfig, LocationLOVConfig, TaskFlowLOVConfig } from '../../models/lov-config';

@Component({
	selector: 'embeddedURL-general-card',
	templateUrl: './general-card.component.html',
	//styleUrls: ['./general-card.component.scss'],
	host: { 'class': 'general-card' }
})
export class GeneralCardComponent implements OnInit {

	disabled: any = {};
	loading = true;
	private refreshSub: Subscription;
	private refreshHeaderSub: Subscription;

	BIVendorLov=JSON.parse(JSON.stringify(BIVendorLOVConfig));
	locationLov=JSON.parse(JSON.stringify(LocationLOVConfig));
	taskflowLov=JSON.parse(JSON.stringify(TaskFlowLOVConfig));

	constructor(
		private _service: EmbeddedURLService,
		public _shared: EmbeddedURLSharedService,
		public dateUtils: DateUtilities,
		private alertUtils: AlertUtilities,
		private _inputService: TnzInputService
	) {
	}

	ngOnInit(): void {
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
		this._service.fetchFormData(this._shared.id).then((data: any) => {
			this._shared.setFormHeader(data);
			this.setLoading(false);
		}, err => {
			this._shared.setFormHeader({});

			this.setLoading(false);
			if (err)
				this.alertUtils.showAlerts(err, true)
		});

	}

	setLoading(flag: boolean) {
		this.loading = flag;
		this._shared.headerLoading = flag;
		this._shared.loading = flag;
	}

	getIfEditable(key) {
		return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
	}

	setDefaultValues() {
		if (this._shared.id == 0) {
			let defaultValues = {
				// 'startDate': DateUtilities.formatDate(new Date()),
				'isDefault': 'N',
				'active':'Y'

			}
			Object.keys(defaultValues).forEach(attr => {
				this._inputService.updateInput(this._shared.getHeaderAttrPath(attr), defaultValues[attr])
			});

		}
	}



}
