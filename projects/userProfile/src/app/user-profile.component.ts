import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserProfileSharedService } from './_service/user-profile-shared.service';
import { User } from 'app/shared/models';
import { Subscription, Subject } from 'rxjs';
import { ApiService, UserService } from 'app/shared/services';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CropImageComponent, UploadFileComponent } from 'app/shared/component';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { UserProfileService } from './_service/user-profile.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { PersonnelNumLOVConfig, CountryCodeLOVConfig } from '../../../user/src/app/models/lov-config';
import { SubSink } from 'subsink';
import { endWith } from 'rxjs/operators';
import {  ImgCropperConfig, ImgCropperEvent, ImgCropperErrorEvent, LyImageCropper } from '@alyle/ui/image-cropper';
import { StyleRenderer, ThemeVariables, lyl } from '@alyle/ui';
import { ChangePasswordComponent } from './form/change-password/change-password.component';
import { CropCircleComponent } from './crop-circle-component/crop-circle-component.component';
import { PersonalDetailsComponent } from './form/personal-details/personal-details.component';

const STYLES = (theme: ThemeVariables) => ({
	$global: lyl `{
	  body {
		background-color: ${theme.background.default}
		color: ${theme.text.default}
		font-family: ${theme.typography.fontFamily}
		margin: 0
		direction: ${theme.direction}
	  }
	}`,
	root: lyl `{
	  display: block
	}`
  });

@Component({
	selector: 'user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
	host: { 'class': 'form-view' }

})


export class UserProfileComponent {
	title = 'userProfile';
	currentUser: User;
	userSubs: Subscription;
	subs = new SubSink();

	disabled: any = {};
	private matDialogRef: MatDialogRef<CropCircleComponent, any>;
	private ngUnsubscribe: Subject<any> = new Subject<any>();

	currentUserId: string;
	hasSignature: boolean;
	profilePic: any;
	signature: any;
	loading = true;
	changePwd = false;
	private refreshSub: Subscription;

	countryCodeLOV = JSON.parse(JSON.stringify(CountryCodeLOVConfig));

	
	constructor(private route: ActivatedRoute,
		private location: Location,
		public _shared: UserProfileSharedService,
		private apiService: ApiService,
		private userService: UserService,
		private router: Router,
		private dialog: MatDialog,
		private sanitizer: DomSanitizer,
		private alertUtils: AlertUtilities,
		private _service: UserProfileService,
		private _inputService: TnzInputService,
		public dateUtils: DateUtilities) {

		this._shared.init();
	}

	ngOnInit() {

		this.currentUser = this.userService.getCurrentUser();
		this._shared.id = this.currentUser.userId;
		this.refreshSub = this._shared.refreshData.subscribe(change => {
			this.loadData();
		  })
		//this.loadData();
	}

	ngOnDestroy() {

		if (this.userSubs)
			this.userSubs.unsubscribe();
		this._shared.clear();

	}

	editUserProfile() {
		//this.location.go('userProfile/' + this._shared.id + '/edit');
		this._shared.editMode = true;
		this._shared.initLocalCache();
	}

	save(exit = false) {
		this._service.save(exit)
		  .then((flag) => {
			if (flag && exit) {
			  this.cancelEdit();
			}
		  })
	  }
	

	loadData() {
		this.setLoading(true);
		this._service.fetchFormData(this._shared.id).then((data: any) => {
			this._shared.setFormHeader(data);
			this.setLoading(false);
		}, err => {
			this.setLoading(false);
			if (err) {
				this.alertUtils.showAlerts(err, true);
			}
		});
	}

	setLoading(flag) {
		this.loading = flag;
		this._shared.loading = flag;
		this._shared.headerLoading = flag;
	}

	PhoneNumberValidation(event) {
		var reg = /^\d+$/;
		if (!reg.test(event.value))
			this._inputService.setError(this._shared.getHeaderAttrPath('phoneNumber'), 'Please enter a valid phone number (Only numbers allowed)!');
	}
	emailValidation(event) {
		if (!(/^(.+)@(.+)$/.test(event.value)))
			this._inputService.setError(this._shared.getHeaderAttrPath('emailAddress'), 'Please enter a valid email address.');
	}

	openImageUploader() {
		this.matDialogRef = this.dialog.open(CropCircleComponent);
		this.matDialogRef.componentInstance.displayUrl = '/images/users'+ this._shared.id;
		this.matDialogRef.componentInstance.uploadUrl = '/userProfile/image/' + this._shared.id;
	}
	openSignatureUploader(){
		this.matDialogRef = this.dialog.open(CropCircleComponent);
		this.matDialogRef.componentInstance.displayUrl = '/images/users/signature/'+ this._shared.id;
		this.matDialogRef.componentInstance.uploadUrl = '/userProfile/signature/' + this._shared.id;
	}
	
	changePassword(){
		const dialogRef= this.dialog.open(ChangePasswordComponent);
	}

	editProfileDetails(){
		const dialogRef= this.dialog.open(PersonalDetailsComponent);

	}
	getIfEditable(key) {
		return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
	}

	cancelEdit() {
		this._shared.editMode = false;
		this._shared.initLocalCache();

	}
}