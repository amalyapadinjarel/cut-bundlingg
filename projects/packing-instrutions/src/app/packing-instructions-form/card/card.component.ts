import { Component, OnInit } from '@angular/core';
import { PackingInstructionsSharedService } from '../../services/packing-instructions-shared.service';
import { Subscription } from 'rxjs';
import { RoutingService } from '../../../../../Routing/src/app/_service/routing.service';
import { DateUtilities, AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { PackingInstructionsService } from '../../services/packing-instructions.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  host: { 'class': 'header-card' }
})
export class CardComponent implements OnInit {

  loading = true;
	disabled: any = {};
	private refreshSub: Subscription;

  

  constructor(private _service: PackingInstructionsService,
		public _shared: PackingInstructionsSharedService,
		public dateUtils: DateUtilities,
		private alertUtils: AlertUtilities,
		private _inputService: TnzInputService) { }

  ngOnInit(): void {
	this.refreshSub = this._shared.refreshData.subscribe(change => {
		if(change)
			this.loadData();
	})
  }

  ngOnDestroy(){
	this.refreshSub.unsubscribe();
  }

  loadData() {
		this.setLoading(true);
		this._service.fetchFormData().then((data: any) => {
			this._shared.setFormHeader(this.setTotalQnty(data));
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
  
  setTotalQnty(data){
	this._shared.totalPacks = Number(data.totalPackSolid) + Number(data.totalPackRatio);
	return data;
  }
  
}
