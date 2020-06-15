
import {takeUntil} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import { ApiServiceV4 } from 'app/shared/services';
import { SchedulerUtils } from 'app/shared/scheduler-utils';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from "rxjs";
import { AlertUtilities } from 'app/shared/utils/alert.utility';
import { AutoCompleteUtilities } from 'app/shared/utils/auto-complete.utility';
import { DateUtilities } from 'app/shared/utils';
import { LOVComponent } from 'app/shared/component/lov-component/lov-component';

@Component({
	selector: "scheduler-mail-output",
	templateUrl: "./email-output.html",
	styleUrls: ["./email-output.scss"]
})
export class EMailOutputComponent implements OnInit, OnDestroy {
	nCode: any;
	sCode: any;
	loading = false;
	jobData: any;

	template: FormControl;
	to: FormControl;
	cc: FormControl;
	bcc: FormControl;

	templateOptions: any[] = [];
	templateAutoComplete: Observable<any[]>;
	private ngUnsubscribe: Subject<any> = new Subject<any>();
	
	constructor(
		private dialogRef: MatDialogRef<EMailOutputComponent>,
		private schedulerUtils: SchedulerUtils,
		public alertUtils: AlertUtilities,
		private apiService: ApiServiceV4,
		public autoCompleteUtils: AutoCompleteUtilities,
		public dateUtils: DateUtilities,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.template = new FormControl("");
		this.to = new FormControl("", Validators.required);
		this.cc = new FormControl("");
		this.bcc = new FormControl("");
		this.templateAutoComplete = this.autoCompleteUtils.populateAutoComplete(
			this.templateOptions,
			this.template
		);
		this.setTemp();
	}
	setTemp() {
		this.apiService
			.get("/lovs/mail-templates").pipe(
			takeUntil(this.ngUnsubscribe))
			.subscribe(data => {
				if (data.templates) {
					this.templateOptions = data.templates;
					if (this.templateOptions.length > 0) {
						for (var i = 0; i < this.templateOptions.length; i++) {
							if (this.templateOptions[i].shortcode == 'TNZ_DEF_EMAIL_TEMP') {
								this.template.setValue(this.templateOptions[i]);
								this.sCode = this.templateOptions[i].shortcode;
							}
						}

					}
				}
			});
	}

	ngOnDestroy() { }

	acTemplateDisplayFn(option): string {
		return option ? option.template : "";
	}

	openTemplateLOV(e) {
		e.preventDefault();
		const dialogRef = this.dialog.open(LOVComponent);
		dialogRef.componentInstance.title = "Choose Mail Template";
		dialogRef.componentInstance.apiUrl = "/lovs/mail-templates";
		dialogRef.componentInstance.dataHeader = "templates";
		dialogRef.componentInstance.listAttrs = [
			"shortcode",
			"template",
			"to",
			"cc",
			"bcc"
		];
		dialogRef.componentInstance.listAttrTitles = [
			"Short Code",
			"Template",
			"To",
			"CC",
			"BCC"
		];
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.templateChanged(result);
			}
		});
	}

	validateTemplateLOV() {
		if (typeof this.template.value === "object") {
			this.templateChanged(this.template.value);
		} else if (this.template.value != "") {
			this.templateChanged(null);
			let params = new HttpParams();
			params.set(
				"filters",
				JSON.stringify({
					shortcode: this.template.value,
					template: this.template.value
				})
			);
			this.template.disable();
			this.apiService.get("/lovs/mail-templates", params).subscribe(
				response => {
					if (response.templates && response.templates.length == 1) {
						this.templateChanged(response.templates[0]);
					}
					this.template.enable();
				},
				err => {
					this.template.enable();
				}
			);
		}
	}

	templateChanged(template) {
		if (template) {
			this.template.setValue(template);
			this.sCode = template.shortcode;
			this.to.setValue(template.to);
			this.cc.setValue(template.cc);
			this.bcc.setValue(template.bcc);
		} else {
			this.to.setValue("");
			this.cc.setValue("");
			this.bcc.setValue("");
		}
	}

	toAddressChanged() {
		if (this.to.value) {
			if (this.template.hasError("required")) {
				this.template.setErrors({ required: false });
				this.template.markAsUntouched();
			}
		}
	}

	mailOutput(): any {
		if (this.to.validator)
			this.to.markAsTouched();
		if (this.to.valid) {
			let valid = true;
			if (this.template.value && typeof this.template.value !== "object") {
				this.template.setErrors({ invalid: true });
				this.template.markAsTouched();
				valid = false;
			}
			if (!this.template.value && !this.to.value) {
				this.template.setErrors({ required: true });
				this.template.markAsTouched();
				this.to.setErrors({ required: true });
				this.to.markAsTouched();
				valid = false;
			}
			if (valid) {
				let mailData: any = {};
				if (this.template.value) {
					mailData.template = this.template.value.shortcode;
				}
				if (this.to.value) {
					mailData.to = this.to.value;
				}
				if (this.cc.value) {
					mailData.cc = this.cc.value;
				}
				if (this.bcc.value) {
					mailData.bcc = this.bcc.value;
				}
				this.loading = true;
				this.schedulerUtils
					.mailOutput(this.jobData.tnzJobInstncId, mailData)
					.then(
						data => {
							this.loading = false;
							this.dialogRef.close();
							this.alertUtils.showAlerts("Mail has been sent");
						},
						err => {
							this.loading = false;
							this.alertUtils.showAlerts("Failed to send mail");
						}
					);
			}
		}
	}
}
