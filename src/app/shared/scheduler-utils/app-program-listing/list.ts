
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
	selector: 'app-program-listing',
	templateUrl: './list.html'
})
export class ApplicationProgramListingComponent implements OnInit, OnDestroy {

	@Input() taskflowKey = "";
	@Input() module = "";
	@Input() params: any = {};

	programs = [];
	programsFiltered = [];

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
				this.filterPrograms();
			});

	}

	ngOnDestroy() {

	}

	fetchList() {
		this.loading = true;
		this.schedulerUtils.getTaskflowPrograms(this.taskflowKey, this.module).then(
			(data) => {
				this.programs = data.programs;
				this.filterPrograms();
				this.loading = false;
			},
			(reject) => {
				this.alertUtils.showAlerts("Failed to load programs");
				this.loading = false;
			});
	}

	loadProgram(report) {
		this.eventService.showGadget.next(false);
		const dialogRef = this.dialog.open(ProgramFormComponent);
		dialogRef.componentInstance.pgmId = report.pgmId;
		dialogRef.componentInstance.pgmName = report.pgmName;
		dialogRef.componentInstance.pgmDesc = report.description;
		dialogRef.componentInstance.pgmOutputFileType = report.outputFileType;
		dialogRef.componentInstance.taskflowParams = this.params;
		dialogRef.componentInstance.directSubmit = true;
		this.eventService.showGadget.next(false);
	}

	filterPrograms() {
		this.programsFiltered = CommonUtilities.filterArrayByString(this.programs, this.filterInput.value);
	}


}
