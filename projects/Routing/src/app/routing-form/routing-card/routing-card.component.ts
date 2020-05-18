import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../../_service/routing.service';
import { RoutingSharedService } from '../../_service/routing-shared.service';
import { DateUtilities, AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-routing-card',
  templateUrl: './routing-card.component.html',
  host: { 'class': 'header-card' }
})
export class RoutingCardComponent implements OnInit {

  	loading = true;
	disabled: any = {};
	private refreshSub: Subscription;

  

  constructor(private _service: RoutingService,
		public _shared: RoutingSharedService,
		public dateUtils: DateUtilities,
		private alertUtils: AlertUtilities,
		private _inputService: TnzInputService) { }

  ngOnInit(): void {
	this.refreshSub = this._shared.refreshData.subscribe(change => {
		this.loadData();
	})
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
	}

	setLoading(flag: boolean) {
		this.loading = flag;
		this._shared.headerLoading = flag;
		this._shared.loading = flag;
  }

	disableInput(key) {
		this.disabled[key] = true;
	}

	enableInput(key) {
		this.disabled[key] = false;
	}

	getIfEditable(key) {
		return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
  }
  
  valueChanged(change) {
	
	}
  
}
