import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmbeddedURLSharedService } from '../_service/embedded-URL-shared.service';
import { EmbeddedURLService } from '../_service/embedded-URL.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ActivatedRoute, Router, ResolveEnd, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { CopyFromUsersLovConfig } from '../models/lov-config';
import { EmbeddedURLUsers } from '../models/embedded-url-users';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	host: { 'class': 'form-view' }
})
export class FormComponent implements OnInit {

	private routerSubs: Subscription;
	constructor(
		public _shared: EmbeddedURLSharedService,
		private _service: EmbeddedURLService,
		private _inputService: TnzInputService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private alertUtils: AlertUtilities,
		public dateUtils: DateUtilities) { }

	ngOnInit(): void {
		this.setEmbeddedURL();
		this.routerSubs = this.router.events.subscribe(change => {
			this.routerChanged(change);
		})
	}
	ngOnDestroy(): void {
		if (this.routerSubs)
			this.routerSubs.unsubscribe();
			this._inputService.resetInputService(this._shared.appKey); //added on july 22

	}

	routerChanged(change) {
		if (change instanceof ResolveEnd) {
			if (change.url.startsWith('/embeddedURL/list')) {
				this.unsetEmbeddedURL();
			}
		}
		if (change instanceof NavigationEnd) {
			this.setEmbeddedURL();
		}
	}

	unsetEmbeddedURL() {
		this._shared.editMode = false;
		this._shared.id = 0;
		this._shared.setFormData({});
		this._inputService.resetInputService(this._shared.appKey); //added on july 22
	}




	setEmbeddedURL() {
		if (this.router.url.endsWith('/create')) {
			this._shared.id = 0;
			this._shared.editMode = true;
		}
		else {

			this._shared.id = this.route.snapshot.params.EmbeddedURL;
			if (this.router.url.endsWith('/edit')) {
				this._shared.editMode = true;
			}
			else {
				this._shared.editMode = false;
				this._shared.refreshData.next(true);
			}
			// this._shared.refreshData.next(true);

		}
		this._shared.setFormData({});
	}



	copyFromUsers() {
		let lovConfig: any = {};
		lovConfig = JSON.parse(JSON.stringify(CopyFromUsersLovConfig));
		const dialogRef = this.dialog.open(TnzInputLOVComponent);
		dialogRef.componentInstance.lovConfig = lovConfig;
		dialogRef.afterClosed().subscribe(resArray => {
			let unAddedOrderLines = [];
			if (resArray && resArray.length) {
				resArray.forEach(res => {
					res = this.mapResToUsers(res);
					let userLineIndex = this._shared.formData.embeddedURLUsers.findIndex(data => {
						return res.user == data.user
					})
					//if (userLineIndex == -1) {
						this._shared.addLine('embeddedURLUsers', res, false);

					// } else {
					// 	unAddedOrderLines.push(res)
					// }
				});

				this._shared.refreshLines('embeddedURLUsers');

				// if (unAddedOrderLines.length) {
				// 	this.alertUtils.showAlerts(unAddedOrderLines.length + " line(s) are not copied as they already exist.")
				// }
			}
		})
	}
	mapResToUsers(res: any): any {
		let model = new EmbeddedURLUsers();
		model.embedId = 0;
		model.urlId = this._shared.id;
		model.userId = res.userId ? res.userId : "";
		model.user = res.userName ? res.userName : "";
		model.active = 'Y';
		model.default = 'N';
		model.taskflow = '';
		model.location = '';
		return model;
	}

	deleteLine(key) {
		this._service.deleteLines(key)
	}


}
