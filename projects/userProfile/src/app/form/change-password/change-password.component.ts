import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../_service/user-profile.service';
import { UserProfileSharedService } from '../../_service/user-profile-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities, ValidatorUtilities, CommonUtilities, FormUtilities } from 'app/shared/utils';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Errors } from 'app/shared/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../../authentication/src/app/_services/auth.service';
import { EventService, UserService } from 'app/shared/services';
import { Router } from '@angular/router';

@Component({
	selector: 'change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
	errors: Errors = new Errors();
	private ngUnsubscribe: Subject<any> = new Subject<any>();
	//isSubmitting: boolean = false;
	
	passwordResetForm: FormGroup;
	resetForm: boolean = false;
	blnValidPassword: boolean = false;
	newPassword: string;

	passwordVisible = false;
	confirmPasswordVisible=false;

	oldPasswordVisibility: string = 'visibility';
	newPasswordVisibility: string = 'visibility';
	confirmPasswordVisibility: string = 'visibility';

	disabled: any = {}
	constructor(
		private profileService: UserProfileService,
		public _shared: UserProfileSharedService,
		private _inputService: TnzInputService,
		private alertUtils: AlertUtilities,
		private dialogRef: MatDialogRef<ChangePasswordComponent>,
		private fb: FormBuilder,
		private eventService: EventService,
		private userService:UserService,
		private router: Router

	) { 
		this.passwordResetForm = this.fb.group({
			oldPassword: ['', Validators.required],
			newPassword: ['', Validators.required],
			confirmPassword: ['', Validators.required],
			userId: ''
		});

	}

	submitReset() {
		ValidatorUtilities.validateForm(this.passwordResetForm);
		if (this.passwordResetForm.valid) {
			this.profileService.changePassword(this.passwordResetForm.value).pipe(
				catchError((err) => {
					return err;
				}),
				takeUntil(this.ngUnsubscribe))
				.subscribe(data => {
					if (data.status === "S") {
					
						this.resetForm = false;
					
						this.dialogRef.close(true);
						this.logout();
						this.alertUtils.showAlerts("Your password has been successfully changed. Login with the new password.", true);
					}
					else {
						this.alertUtils.showAlerts(data.message, true);
					}

				
				});

		}
	}

	// oldPasswordValidation(event) {
	// 	let pass = event.value;

	// 	this._service.validateOldPassword(event.value).then(valid => {
	// 		if (!valid) {
	// 			this.alertUtils.showAlerts('Please enter the correct old password!');
	// 			this._inputService.setError(this._shared.getHeaderAttrPath('oldPassword'))
	// 		}
	// 	})

	// }

	checkConfirmPassword() {
		if (this.passwordResetForm.value.newPassword != this.passwordResetForm.value.confirmPassword) {
		  this.passwordResetForm.controls.confirmPassword.setErrors({ unique: true });
		}
	
	  }
	
	//   clear() {
	// 	this.passwordResetForm.controls.oldPassword.setValue("");
	// 	this.passwordResetForm.controls.newPassord.setValue("");
	// 	this.passwordResetForm.controls.confirmPassword.setValue("");
	//   }
	
	  ngOnInit() {
		this.passwordResetForm.controls.userId.setValue(this._shared.id);
		this.passwordResetForm.controls.newPassword.valueChanges
		  .subscribe(
		  data => {
			this.newPassword = data;
		  }
		  )
	  }
	
	  ngOnDestroy() {
		this.ngUnsubscribe.next(); this.ngUnsubscribe.complete();
	  }
	
	  
	
	  toggleVisibility(elementId: string) {
		let element = document.getElementById(elementId);
		if (elementId == "oldPassword") {
		  this.oldPasswordVisibility = this.setVisibility(element, this.oldPasswordVisibility);
		} else if (elementId == "newPassword") {
		  this.newPasswordVisibility = this.setVisibility(element, this.newPasswordVisibility);
		} else {
		  this.confirmPasswordVisibility = this.setVisibility(element, this.confirmPasswordVisibility);
		}
	  }
	
	  setVisibility(element: any, visibility: string) {
		if (visibility == "visibility") {
		  visibility = "visibility_off";
		  element.setAttribute("type", "text");
		} else {
		  visibility = "visibility";
		  element.setAttribute("type", "password");
		}
		return visibility;
	  }
	
	//   validatePassword() {
	// 	if (this.passwordResetForm.controls.newPassword.value == '')
	// 		this.passwordResetForm.controls.newPassword.setErrors({ required: true });
	// 	else {
	// 		if (!this.blnValidPassword) {
	// 			this.passwordResetForm.controls.newPassword.setErrors(null);
	// 			this.passwordResetForm.controls.newPassword.setErrors({ pattern: true });
	// 		}
	// 		else {
	// 			this.passwordResetForm.controls.newPassword.setErrors(null);
	// 		}
	// 	}
	// }

	  validatePasswordByAction(action: string) {
		if(action == "validate"){
		if (!this.blnValidPassword) {
		  this.passwordResetForm.controls.newPassword.setErrors({ pattern: true });
		}
		}else{
		  this.passwordResetForm.controls.confirmPassword.setValue("");
		}
	  }
	
	  getPasswordValidity(event) {
		this.blnValidPassword = event;
	  }
	
	  logout() {
		this.closeGadget();
		this.userService.purgeAuth();
		this.router.navigateByUrl('/login');
	  }
	
	  closeGadget() {
		this.eventService.showGadget.next(false);
	  }
	
	
}
