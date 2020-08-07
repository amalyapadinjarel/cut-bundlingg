import { Component, OnInit } from '@angular/core';
import { UserProfileSharedService } from '../../_service/user-profile-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { CountryCodeLOVConfig } from '../../../../../user/src/app/models/lov-config';
import { Errors } from 'app/shared/models';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorUtilities, AlertUtilities } from 'app/shared/utils';
import { catchError, takeUntil } from 'rxjs/operators';
import { UserProfileService } from '../../_service/user-profile.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
  host: { 'class': 'header-card' }
})
export class PersonalDetailsComponent implements OnInit {

  disabled: any = {};
  countryCodeLOV = JSON.parse(JSON.stringify(CountryCodeLOVConfig));

  errors: Errors = new Errors();
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  isSubmitting: boolean = false;
  authForm: FormGroup; //?
  formGroup: FormGroup;
  formData: any;

  profileEditForm: FormGroup;
  resetForm: boolean = false;
  blnValidPassword: boolean = false;
  newPassword: string;

  constructor(
    public _shared: UserProfileSharedService,
    private _inputService: TnzInputService,
    private _service: UserProfileService,
    private alertUtils: AlertUtilities,
    private dialogRef: MatDialogRef<PersonalDetailsComponent>,
    private fb: FormBuilder
    // ,
    // private userService:UserService,
    // private router: Router
  ) {

    this.profileEditForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      knownAs: ['', Validators.required],
      emailAddress: ['', Validators.required],
      countryCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      userId: ''
    });
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

  save(exit = false) {
		this._service.save(exit)
		  .then((flag) => {
			if (flag && exit) {
			  this.cancelEdit();
			}
      });
      this.dialogRef.close();
	  }
  saveProfile() {
    console.log("save")

    ValidatorUtilities.validateForm(this.profileEditForm);
    if (this.profileEditForm.valid) {
      console.log("Valid")
      this._service.saveProfile(this.profileEditForm.value).pipe(
        catchError((err) => {
          return err;
        }),
        takeUntil(this.ngUnsubscribe))
        .subscribe(data => {
          if (data.status === "S") {
            this.resetForm = false;
            this.dialogRef.close(true);
            this.alertUtils.showAlerts("Profile updated successfully.", true);
          }
          else {
            this.alertUtils.showAlerts(data.message, true);
          }

        });

    }
  }

  oldPwd() {
    if (this.profileEditForm.controls.oldPassword.value == '')
      this.profileEditForm.controls.oldPassword.setErrors({ required: true });
    else
      this.profileEditForm.controls.oldPassword.setErrors(null);
  }

  checkConfirmPassword() {
    if (this.profileEditForm.value.newPassword != this.profileEditForm.value.confirmPassword)
      this.profileEditForm.controls.confirmPassword.setErrors({ unique: true });

  }

  clear() {
    this.profileEditForm.controls.firstName.setValue("");
    this.profileEditForm.controls.middleName.setValue("");
    this.profileEditForm.controls.lastName.setValue("");
    this.profileEditForm.controls.lastName.setValue("");
    this.profileEditForm.controls.knownAs.setValue("");
    this.profileEditForm.controls.emailAddress.setValue("");
    this.profileEditForm.controls.countryCode.setValue("");
    this.profileEditForm.controls.phoneNumber.setValue("");

  }

  ngOnInit() {
    this.profileEditForm.controls.userId.setValue(this._shared.id);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  validatePasswordByAction(action: string) {
    if (action == "validate") {
      if (!this.blnValidPassword) {
        this.profileEditForm.controls.newPassword.setErrors({ pattern: true });
      }
    } else {
      this.profileEditForm.controls.confirmPassword.setValue("");
    }
  }

  cancelEdit() {
		this._shared.editMode = false;
		this._shared.initLocalCache();

	}



}
