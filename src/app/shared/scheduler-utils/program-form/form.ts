
import {map, distinctUntilChanged, debounceTime, startWith} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DatePipe } from "@angular/common";

import { SchedulerUtils } from '../scheduler.utils';
import { CronOptions } from "app/shared/component/cron-generator/CronOptions";
import cronstrue from 'cronstrue';
import { AlertUtilities } from 'app/shared/utils/alert.utility';
import { DateUtilities } from 'app/shared/utils/date.utility';
import { AutoCompleteUtilities } from 'app/shared/utils/auto-complete.utility';
import { UserService } from 'app/shared/services';
import { CommonUtilities } from 'app/shared/utils/common.utility';
import { LOVComponent } from 'app/shared/component/lov-component/lov-component';

@Component({
	selector: 'program-form',
	templateUrl: './form.html',
	styleUrls: ['./form.scss']
})
export class ProgramFormComponent implements OnInit, OnDestroy {
	
	lovUnsubscribe: any = {};
	pgmId: number;
	pgmName = "Submit Program";
	pgmDesc = "";
	pgmOutputFileType = "code";
	directSubmit = false;
	formAction = "Run";
	postFormFields;
	taskflowParams;
	isReschedule = false;
	isRerun = false;
	queueId: number;

	formGroup: FormGroup;
	formFields = [];
	defValChildDependancy: any = {};
	defValParentDependancy: any = {};
	lovChildDependancy: any = {};
	lovParentDependancy: any = {};
	formControls: any = {};
	autoCompletes: any = {};
	autoCompleteOptions: any = {};

	cronExpression;
	runImmediate = true;
	logEnabled = false;
	sendMail = false;
	mailToMe = false;
	runAnother = false;
	preserveValues = false;
	isPrivileged = false;

	cronExpression1 = "0 0 10 1 1 ? *";
	cronDescription = "";
	public cronOptions: CronOptions = {
		formInputClass: 'form-control cron-editor-input',
		formSelectClass: 'form-control cron-editor-select',
		formRadioClass: 'cron-editor-radio',
		formCheckboxClass: 'cron-editor-checkbox',
		defaultTime: "10:00:00",
		hideMinutesTab: true,
		hideHourlyTab: true,
		hideDailyTab: false,
		hideWeeklyTab: false,
		hideMonthlyTab: false,
		hideYearlyTab: false,
		hideAdvancedTab: true,
		use24HourTime: true,
		hideSeconds: true
	};

	loading = true;
	constructor(
		private schedulerUtils: SchedulerUtils,
		private dialogRef: MatDialogRef<ProgramFormComponent>,
		private dialog: MatDialog,
		public alertUtils: AlertUtilities,
		private autoCompleteUtils: AutoCompleteUtilities,
		private userService: UserService
	) {
	}

	ngOnInit() {
		if (!this.isRerun)
			this.fetchJobForm();
		if (this.pgmOutputFileType)
			this.pgmOutputFileType = this.pgmOutputFileType.toLowerCase();
		else
			this.pgmOutputFileType = 'code';
		if (this.isReschedule)
			this.formAction = "Re-Schedule";
		if (this.cronExpression) {
			this.cronExpression1 = this.cronExpression;
			this.runImmediate = false;
		}
	}

	ngOnDestroy() {
		this.formFields.forEach(field => {
			if (this.lovUnsubscribe[field.fieldID]) {
				this.lovUnsubscribe[field.fieldID].next();
				this.lovUnsubscribe[field.fieldID].complete();
			}
		});
	}

	fetchJobForm() {
		this.loading = true;
		if (!this.preserveValues) {
			this.formFields = [];
			this.formControls = {};
			this.autoCompletes = {};
			this.autoCompleteOptions = {};
		}
		if (this.pgmId) {
			this.schedulerUtils.initProgram(this.pgmId, this.taskflowParams).then(
				(data) => {
					if (data.status == "S") {
						this.isPrivileged = true;
						if (!this.isReschedule && !this.preserveValues) {
							this.formFields = data.form.formFields;
							if (!this.directSubmit || data.form.prompt) {
								this.defValChildDependancy = data.form.defValChildDependancy;
								this.defValParentDependancy = data.form.defValParentDependancy;
								this.lovChildDependancy = data.form.lovChildDependancy;
								this.lovParentDependancy = data.form.lovParentDependancy;
								for (const field of this.formFields) {
									const fc = new FormControl();
									if (this.postFormFields && this.postFormFields[field.parameter]) {
										field.fieldValue = this.postFormFields[field.parameter];
									}
									else if (this.taskflowParams && this.taskflowParams[field.taskflowParameter]) {
										field.fieldValue = this.taskflowParams[field.taskflowParameter];
									}
									if (field.fieldValue) {
										if (field.fieldType == 'Date') {
											fc.setValue(DateUtilities.formatToCalDate(new Date(field.fieldValue)));
										}
										else if (field.fieldType == 'Lov') {
											fc.setValue(JSON.parse(field.fieldValue));
										}
										else {
											fc.setValue(field.fieldValue);
										}
									}
									else fc.setValue("")
									if (field.fieldType == 'Lov') {
										fc.setValidators(this.autoCompleteUtils.autoCompleteValidator);
										this.autoCompletes[field.fieldID] = null;
										this.autoCompleteOptions[field.fieldID] = [];
									}
									if (field.fieldRequired) {
										if (field.fieldType == 'Lov') fc.setValidators(this.autoCompleteUtils.autoCompleteRequiredValidator);
										else fc.setValidators(Validators.required);
									}
									this.formControls[field.fieldID] = fc;
									if (field.fieldType == 'Lov')
										this.lovUnsubscribe[field.fieldID] = this.populateAutoCompleteFromDB(this.formControls[field.fieldID], field)
											.subscribe(data => {
												this.autoCompletes[field.fieldID] = data;
											});
								}
							}
							else {
								this.submitForm();
							}
						}
					}
					else if (data.status == "U") {
						this.alertUtils.showAlerts("You do not have privilege to run this program");
						this.dialogRef.close();
					}
					else {
						this.alertUtils.showAlerts("Failed to load program");
						this.dialogRef.close();
					}
					this.loading = false;
				},
				() => {
					this.alertUtils.showAlerts("Failed to load program");
					this.dialogRef.close();
				});
		}
		else {
			this.loading = false;
		}
	}

	openLOV(field, event = null) {
		if (event)
			event.stopPropagation();
		let postBody: any = {};
		postBody.formFields = this.getProgramInputs();
		const dialogRef = this.dialog.open(LOVComponent);
		dialogRef.componentInstance.title = 'Choose ' + field.fieldTitle;
		dialogRef.componentInstance.apiClass = this.schedulerUtils;
		dialogRef.componentInstance.apiMethod = 'POST';
		dialogRef.componentInstance.postBody = postBody;
		dialogRef.componentInstance.apiUrl = '/programs/' + this.pgmId + '/params/' + field.fieldID + '/lov';
		dialogRef.componentInstance.dataHeader = 'rows';
		dialogRef.componentInstance.listAttrs = this.getListAttr(field.selectFieldName);
		dialogRef.componentInstance.listAttrTitles = this.getListAttrNames(dialogRef.componentInstance.listAttrs);
		dialogRef.componentInstance.showColumnFilter = false;
		dialogRef.afterClosed()
			.subscribe(result => {
				if (result) {
					let val: any = {};
					val.label = result.DISPLAY_FIELD;
					val.value = result.RETURN_FIELD;
					this.formControls[field.fieldID].setValue(val);
					this.processValueChange(field.fieldID);
				}
			});
	}

	validateLOV(fieldID) {
		if (typeof this.formControls[fieldID].value !== 'object') {
			this.autoCompleteUtils.checkAutoCompleteSelected(this.autoCompleteOptions[fieldID], this.formControls[fieldID]);
		}
	}

	onBlurLOV(fieldID) {
		if (this.formControls[fieldID].value && typeof this.formControls[fieldID].value !== 'object') {
			this.autoCompleteUtils.checkAutoCompleteSelected(this.autoCompleteOptions[fieldID], this.formControls[fieldID]);
		}
		this.processValueChange(fieldID)
	}

	processValueChange(fieldID) {
		if (this.lovChildDependancy[fieldID] && this.lovChildDependancy[fieldID].length > 0) {
			for (let id of this.lovChildDependancy[fieldID]) {
				let index = this.formFields.findIndex(form => {
					return form.fieldID == id ? true : false;
				});
				let formField = this.formFields[index];
				if (formField.fieldType == 'Lov') {
					this.formControls[id].reset('');
					this.lovUnsubscribe[id].next();
					this.lovUnsubscribe[id] = this.populateAutoCompleteFromDB(this.formControls[id], formField)
						.subscribe(data => {
							this.autoCompletes[id] = data;
						});
				}
				else if (formField.fieldType == 'ChoiceList') {
					this.formControls[id].reset();
					this.getChoiceListData(id)
						.then(data => {
							this.formFields[index].fieldOptions = data;
						})
						.catch(() => {

						});
				}
				else
					this.formControls[id].reset();
			}
		}
		//TODO resolve depend choice list
	}

	cronExpressionChanged() {
		if (this.cronExpression != "") {
			this.cronDescription = cronstrue.toString(this.cronExpression);
			if (this.isReschedule)
				this.formAction = "Re-Schedule";
			else
				this.formAction = "Schedule";
		}
		else {
			this.cronDescription = "";
			if (this.postFormFields)
				this.formAction = "Re-Run";
			else
				this.formAction = "Run";
		}
	}

	getProgramInputs() {
		let pgmInputs = [];
		for (let field of this.formFields) {
			let param: any = {};
			let fc = this.formControls[field.fieldID];
			let value = '';
			if (fc && fc.value) {
				if (field.fieldType == 'Lov') {
					value = '' + (typeof fc.value == 'object' ? fc.value.value : fc.value);
				}
				else if (field.fieldType == 'Date') {
					let datePipe = new DatePipe("en-US");
					value = datePipe.transform(fc.value, 'dd/MM/yyyy');
				}
				else {
					value = '' + fc.value
				}
			}
			else if (field.fieldValue) {
				if (field.fieldType == 'Date') {
					let datePipe = new DatePipe("en-US");
					value = datePipe.transform(new Date(field.fieldValue), 'dd/MM/yyyy');
				}
				else {
					value = field.fieldValue;
				}
			}
			param.parameter = field.parameter;
			param.dataType = field.dataType;
			param.exclude = field.exclude;
			param.visible = field.fieldVisible;
			param.defaultValue = field.defaultValue;
			param.value = value;
			param.fieldID = field.fieldID;
			pgmInputs.push(param);
		}
		return pgmInputs;
	}

	submitForm() {
		let valid = true;
		this.loading = true;
		for (let field of this.formFields) {
			let fc = this.formControls[field.fieldID];
			if (fc) {
				if (fc.validator)
					fc.markAsTouched();
				if (!fc.valid) {
					valid = false;
				}
			}
		}
		if (valid) {
			let form: any = {};
			form.taskId = this.pgmId
			form.division = this.userService.getCurrentUser().division;
			form.cronExpression = this.cronExpression;
			form.logEnabled = this.logEnabled ? 'Y' : 'N';
			form.sendMail = this.sendMail ? 'Y' : 'N';
			form.mailToMe = this.mailToMe ? 'Y' : 'N';
			form.isReschedule = this.isReschedule ? 'Y' : 'N';
			if (!this.isReschedule) {
				form.formFields = this.getProgramInputs();
				this.schedulerUtils.submitProgram(this.pgmId, form).then((data) => {
					if (data.status == 'S') {
						if (!this.preserveValues) {
							this.formFields = [];
							this.formControls = {};
						}
						if (this.runImmediate) {
							this.alertUtils.showAlerts("Job Submitted");
						}
						else {
							this.schedulerUtils.onJobScheduled.next(1);
							this.alertUtils.showAlerts("Job Scheduled");
						}
						this.runAnother ? this.fetchJobForm() : this.dialogRef.close(true);
					}
					else {
						this.alertUtils.showAlerts("Failed to submit program.");
					}
					this.loading = false;
				}, () => {
					this.alertUtils.showAlerts("Failed to submit program.");
					this.loading = false;
				});
			}
			else {
				this.schedulerUtils.reSchedule(this.queueId, form).then(
					(data: any) => {
						if (data.status == 'S') {
							if (!this.preserveValues) {
								this.formFields = [];
								this.formControls = {};
							}
							this.schedulerUtils.onJobScheduled.next(1);
							this.alertUtils.showAlerts("Job re-scheduled");
							this.runAnother ? this.fetchJobForm() : this.dialogRef.close(true);
						}
						else {
							this.alertUtils.showAlerts("Failed to re-schedule job");
						}
					},
					() => {
						this.alertUtils.showAlerts("Failed to re-schedule job");
					});
			}
		}
		else {
			this.loading = false;
			this.alertUtils.showAlerts("Enter valid data");
		}
	}

	getListAttr(data) {
		let selectString = data.replace(/ *\([^)]*\) */g, "").replace(/"/g, '');
		let list = [];
		if (selectString) {
			list = selectString.split(',');
		}
		for (let i = 0; i < list.length; i++) {
			let t = list[i].trim().toUpperCase();
			list[i] = t.substr(t.indexOf(" ") + 1);
		}
		return list;
	}

	getListAttrNames(listAttrs) {
		let list = [];
		for (let i = 0; i < listAttrs.length; i++) {
			list[i] = CommonUtilities.toTitleCase(listAttrs[i].replace(/_/g, ' '));
		}
		return list;
	}

	cronChange() {
		this.cronExpression = this.cronExpression1
		this.cronExpressionChanged();
	}

	runImmediateChange() {
		this.cronExpression = '';
	}

	populateAutoCompleteFromDB(
		fc: AbstractControl, field: any) {
		let service: any = this.schedulerUtils;
		let postBody: any = {};
		let filterAttributes = [];
		if (field.selectFieldName)
			filterAttributes = this.getListAttr(field.selectFieldName);
		return fc.valueChanges.pipe(
			startWith(null),
			debounceTime(400),
			distinctUntilChanged(),
			map(data => data && typeof data === 'object' ? data.label : data),
			map(data => {
				let filter, filters;
				if (data && data.startsWith('+')) {
					data = data.replace('+', '');
				}
				if (data) {
					let filter = {
						"type": "group",
						"con": "and",
						"items": [],
					};
					filterAttributes.forEach(field => {
						filter.items.push({
							"type": "item",
							"con": "or",
							"attr": field,
							"operator": "startsWith",
							"value": data
						});
					});
					filters = {};
					filterAttributes.forEach(field => {
						filters[field] = data;
					});
				}
				postBody.formFields = this.getProgramInputs();
				postBody['limit'] = '30';
				postBody['offset'] = '1';
				postBody['filter'] = filter;
				postBody['filters'] = filters;
				return service.post(('/programs/' + this.pgmId + '/params/' + field.fieldID + '/lov'), postBody)
					.map(res => res['data']).map(data => {
						if (data) data = data.rows;
						if (data && data.length > 0) {
							data.forEach(row => {
								row.label = row.DISPLAY_FIELD;
								row.value = row.RETURN_FIELD;
							});
							this.autoCompleteOptions[field.fieldID] = data;
						}
						return data;
					});
			}));
	}

	runAnotherChange(event) {
		if (event == true) {
			this.preserveValues = true;
		}
	}

	preserveValueChange(event) {
		if (event == true) {
			this.runAnother = true;
		}
	}

	getChoiceListData(fieldID): Promise<any> {
		let service: any = this.schedulerUtils;
		let postBody: any = {};
		postBody.formFields = this.getProgramInputs();
		return new Promise((resolve, reject) => {
			service.post(('/programs/' + this.pgmId + '/params/' + fieldID + '/lov'), postBody)
				.map(res => res['data'])
				.catch(err => reject(err))
				.subscribe(data => {
					if (data && data.rows) {
						let rows = data.rows;
						rows.forEach(row => {
							if (row) {
								row.value = row.RETURN_FIELD;
								row.label = row.DISPLAY_FIELD;
							}
						})
						resolve(rows);
					}
					else
						resolve([]);
				})
		})

	}

}
