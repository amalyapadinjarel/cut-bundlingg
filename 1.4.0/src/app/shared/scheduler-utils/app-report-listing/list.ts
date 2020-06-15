
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { SchedulerUtils } from "app/shared/scheduler-utils";
import { EventService } from "app/shared/services";
import { ProgramFormComponent } from "app/shared/scheduler-utils/program-form/form";
import { FormControl } from "@angular/forms";
import { AlertUtilities } from "app/shared/utils/alert.utility";
import { CommonUtilities } from "app/shared/utils/common.utility";


@Component({
	selector: 'app-report-listing',
	templateUrl: './list.html'
})
export class ApplicationReportListingComponent implements OnInit, OnDestroy {

	@Input() taskflowKey = "";
	@Input() module = "";
	@Input() params: any = {};

	reports = [];
	reportsFiltered = [];

	loading = true;
	filterInput: FormControl;
	
	constructor(
		private schedulerUtils: SchedulerUtils,
		private alertUtils: AlertUtilities,
		private eventService: EventService,
		private dialog: MatDialog
	) {
		this.filterInput = new FormControl('');
	}

	ngOnInit() {
		this.fetchList();

		this.filterInput.valueChanges.pipe(
			debounceTime(400),
			distinctUntilChanged())
			.subscribe(searchText => {
				this.filterReports();
			});

	}

	ngOnDestroy() {

	}

	fetchList() {
		this.loading = true;
		this.schedulerUtils.getTaskflowReports(this.taskflowKey, this.module).then(
			(data) => {
				this.reports = data.reports;
				this.filterReports();
				this.loading = false;
			},
			(reject) => {
				this.alertUtils.showAlerts("Failed to load reports");
				this.loading = false;
			});
	}

	loadProgram(report) {
		const dialogRef = this.dialog.open(ProgramFormComponent);
		dialogRef.componentInstance.pgmId = report.pgmId;
		dialogRef.componentInstance.pgmName = report.pgmName;
		dialogRef.componentInstance.pgmDesc = report.description;
		dialogRef.componentInstance.pgmOutputFileType = report.outputFileType;
		dialogRef.componentInstance.taskflowParams = this.params;
		dialogRef.componentInstance.directSubmit = true;
		this.eventService.showGadget.next(false);
	}

	filterReports() {
		this.reportsFiltered = CommonUtilities.filterArrayByString(this.reports, this.filterInput.value);
	}

}
