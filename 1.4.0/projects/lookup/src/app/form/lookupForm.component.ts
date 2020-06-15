import { Component, OnDestroy, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ResolveEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { LookupSharedService } from '../_service/lookup-shared.service';
import { LookupService } from '../_service/lookup.service';
import { LookupType, LookupValue } from '../models/lookup.model';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { ApplicationLovConfig } from '../models/lov-config';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { HttpParams } from '@angular/common/http';
import { ConfirmPopupComponent } from 'app/shared/component';

@Component({
	selector: 'lookup-form',
	templateUrl:'./lookupForm.component.html',
	host: { 'class': 'form-view' }
})
export class LookupFormComponent {

	private routerSubs: Subscription;
	public clicked = false;

	public toggle=true;

	public accessLevelOptions = [
		{
			label: "User",
			value: "U"
		},
		{
			label: "System",
			value: "S"
		},
	]
	constructor(
		public _shared: LookupSharedService,
		private _service: LookupService,
		private _inputService: TnzInputService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private alertUtils: AlertUtilities,
		public dateUtils:DateUtilities
	) {
	}

	ngOnInit() {

		this.setLookup();
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
			if (change.url.startsWith('/lookup/list')) {
				this.unsetLookup();
			}
		}
		if (change instanceof NavigationEnd) {
			this.setLookup();
		}
	}

	unsetLookup() {
		this._shared.editMode = false;
		this._shared.lookupType = '--';
		this._shared.setFormData({});
	}

	setLookup() {
		if (this.router.url.endsWith('/create')) {
			this._shared.lookupType = '--';
			this._shared.editMode = true;
		}
		else {

			this._shared.lookupType = this.route.snapshot.params.LookupType;

			if (this.router.url.endsWith('/edit')) {
				this._shared.editMode = true;
			}
			else {
				this._shared.editMode = false;
				this._shared.refreshData.next(true);
			}
		}
		this._shared.setFormData({});
	}

	
	print() {
		console.log((this._shared.formData));
	}

	
	

	
}

