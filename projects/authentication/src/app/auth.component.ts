
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment, appVersion } from 'environments/environment';

import { UserService, EventService, NavigationService } from 'app/shared/services';
import { Errors } from 'app/shared/models';
import { AlertUtilities } from 'app/shared/utils/alert.utility';
import { ValidatorUtilities } from 'app/shared/utils/validator.utility';
import { AuthService } from './_services/auth.service';

@Component({
	selector: 'auth-page',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
	errors: Errors = new Errors();
	private ngUnsubscribe: Subject<any> = new Subject<any>();
	isSubmitting: boolean = false;
	authForm: FormGroup;
	passwordResetForm: FormGroup;
	resetForm: boolean = false;
	loginForm: boolean = true;
	loginbg: string = "url(./assets/images/backgrounds/login-bg.jpg)";
	blnValidPassword: boolean = false;
	newPassword: string;
	passwordVisible = false;
	version = appVersion;

	constructor(
		private router: Router,
		private userService: UserService,
		private fb: FormBuilder,
		private eventService: EventService,
		private navService: NavigationService,
		private alertUtils: AlertUtilities,
		private authService: AuthService
	) {
		this.authForm = this.fb.group({
			'username': ['', Validators.required],
			'password': ['', Validators.required],

		});
		this.passwordResetForm = this.fb.group({
			'username': ['', Validators.required],
			'oldPassword': '',
			'newPassword': '',
			'confirmPassword': ['', Validators.required],
			'userId': ''
		});
		this.userService.emitChange({ appName: 'Trendz E3' });
	}

	submitForm() {
		this.isSubmitting = true;
		this.errors = new Errors();
		this.userService
			.attemptAuthentication(this.authForm.value)
			.subscribe(
				data => {
					if (data['user'].resetToken) {
						this.passwordResetForm.controls.username.setValue((this.authForm.controls.username.value).toUpperCase());
						this.passwordResetForm.controls.userId.setValue(data['user'].userId);
						this.passwordResetForm.controls.newPassword.valueChanges
							.subscribe(
								data => {
									this.newPassword = data;
								}
							)
						this.resetForm = true;
						this.loginForm = false;
						this.isSubmitting = false;
					} else {
						this.eventService.isLoadingPage.next(true);
						this.eventService.onLogin.next(true);
						this.navService.fetchMenuData().then(() => {
							this.navService.fetchMenuData().then(() => {
							});
							if (this.userService.redirectUrl && this.navService.isValidUrl(this.userService.redirectUrl) && this.userService.redirectUrl !== '/login' && this.userService.redirectUrl !== '/not-found') {
								this.alertUtils.allowAlerts();
								this.router.navigateByUrl(this.userService.redirectUrl).then(() => {
									this.eventService.isLoadingPage.next(false);
								});
							} else {
								this.alertUtils.allowAlerts();
								this.router.navigateByUrl('/cut-register/list').then(() => {
									this.eventService.isLoadingPage.next(false);
								});
							}
						}, () => {
							this.alertUtils.showAlerts('Failed to fetch menu items', true)
						});
					}
				},
				errorResponse => {
					this.alertUtils.showAlerts(errorResponse.error.check ? errorResponse.error.check : "Unexpected server issues. We'll be back asap :(", true);
					this.errors = errorResponse;
					this.isSubmitting = false;
				}
			);
  }

//   submitForm(){
//     let loginData = {
//       userName: this.authForm.controls.username.value,
//       password: this.authForm.controls.password.value
//     }
//     this.userService.testLogin(loginData).subscribe(data=>{
//       if(data.status == 'S'){
//         this.router.navigateByUrl('/cut-register/list').then(() => {
//           this.eventService.isLoadingPage.next(false);
//         });
//       }

//       this.alertUtils.showAlerts(data.msg);
//     })
//   }

	submitReset() {
		ValidatorUtilities.validateForm(this.passwordResetForm);
		if (this.passwordResetForm.valid) {
			this.authService.changePassword(this.passwordResetForm.value).pipe(
				catchError((err) => {
					return err;
				}),
				takeUntil(this.ngUnsubscribe))
				.subscribe(data => {
					if (data.status === "S") {
						this.authForm.controls.username.setValue("");
						this.authForm.controls.password.setValue("");
						this.resetForm = false;
						this.loginForm = true;
						this.alertUtils.showAlerts("Your password has been successfully changed.Login with  new password ", true);
					}
					else {
						this.alertUtils.showAlerts(data.message, true);
					}
				});

		}
	}

	getRandomInt(min, max) {
		return Math.floor((Math.random() * max) + min);
	}

	validatePassword() {
		if (this.passwordResetForm.controls.newPassword.value == '')
			this.passwordResetForm.controls.newPassword.setErrors({ required: true });
		else {
			if (!this.blnValidPassword) {
				this.passwordResetForm.controls.newPassword.setErrors(null);
				this.passwordResetForm.controls.newPassword.setErrors({ pattern: true });
			}
			else {
				this.passwordResetForm.controls.newPassword.setErrors(null);
			}
		}



	}

	oldPwd() {
		if (this.passwordResetForm.controls.oldPassword.value == '')
			this.passwordResetForm.controls.oldPassword.setErrors({ required: true });
		else
			this.passwordResetForm.controls.oldPassword.setErrors(null);
	}

	checkConfirmPassword() {
		if (this.passwordResetForm.value.newPassword != this.passwordResetForm.value.confirmPassword) {
			this.passwordResetForm.controls.confirmPassword.setErrors({ unique: true });
		}

	}
	getPasswordValidity(event) {
		this.blnValidPassword = event;
	}
}
