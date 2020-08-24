import { Component, OnDestroy, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ResolveEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CutRegisterSharedService } from '../_service/cut-register-shared.service';
import { CutRegisterService } from '../_service/cut-register.service';
import { OrderDetails, LayerDetails, MarkerDetails, CutPanelDetails } from '../models/cut-register.model';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { CopyFromSOLovConfig } from '../models/lov-config';
import { MarkerDetailsComponent } from './marker-details/marker-details.component';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { HttpParams } from '@angular/common/http';
import { ConfirmPopupComponent } from 'app/shared/component';

@Component({
	selector: 'cut-register-form',
	templateUrl: './form.component.html',
	host: { 'class': 'form-view' }
})
export class PdmCostingFormComponent {

	hasNextRecord: boolean = false;
	hasPreviousRecord: boolean = false;
	private routerSubs: Subscription;
	public clicked = false;
	

	constructor(
		public _shared: CutRegisterSharedService,
		private _service: CutRegisterService,
		private _inputService: TnzInputService,
		private route: ActivatedRoute,
		private router: Router,
		private alertUtils: AlertUtilities,
		public dateUtils: DateUtilities
	) {
	}

	ngOnInit() {
		this.setCosting();
		this.routerSubs = this.router.events.subscribe(change => {
			this.routerChanged(change);
		})
	}

	ngOnDestroy(): void {
		if (this.routerSubs)
			this.routerSubs.unsubscribe();
	}

	routerChanged(change) {
		if (change instanceof ResolveEnd) {
			if (change.url.startsWith('/cut-register/list')) {
				this.unsetCosting();
			}
		}
		if (change instanceof NavigationEnd) {
			this.setCosting();
		}
	}

	unsetCosting() {
		this._shared.editMode = false;
		this._shared.id = 0;
		this._shared.setFormData({});
		this._inputService.resetInputService(this._shared.appKey);
	}

	setCosting() {
		if (this.router.url.endsWith('/create')) {
			this._shared.id = 0;
			this._shared.editMode = true;
		}
		else {
			this._shared.id = Number(this.route.snapshot.params.costingId);
			if (this.router.url.endsWith('/edit')) {
				this._shared.editMode = true;
			}
			else {
				this._shared.editMode = false;
				this._shared.refreshData.next(true);
			}
		}
		this._shared.setFormData({});
		// this._inputService.resetInputService(this._shared.appKey);
	}


	print() {
		console.log((this._shared.formData));
	}





}

