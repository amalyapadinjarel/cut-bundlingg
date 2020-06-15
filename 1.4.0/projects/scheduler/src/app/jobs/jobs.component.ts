import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventService } from 'app/shared/services';
import { SmdDataTable } from 'app/shared/component';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { SchedulerUtils } from 'app/shared/scheduler-utils';
import { SchedulerService } from '../_services/scheduler.service';
import { TrendzFilePreviewComponent } from 'app/shared/component/file-preview/file-preview.component';
import { DateUtilities } from 'app/shared/utils';

@Component({
	selector: 'jobs-listing',
	templateUrl: './jobs.component.html',
	styleUrls:  ['jobs.component.scss']
})
export class JobsComponent implements OnInit, OnDestroy {

	private files: any[] = [];

	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

	onPushMessage: Subscription;

	constructor(
		public schedulerService: SchedulerService,
		public schedulerUtils: SchedulerUtils,
		private dialog: MatDialog,
		private eventService: EventService,
		public dateUtils: DateUtilities
	) {
		this.onPushMessage =
			this.eventService.schedulerJobChnaged
				.subscribe(change => {
					this.processPushMessage(change);
				});
	}

	ngOnInit() {
	}

	ngOnDestroy(): void {
		if (this.onPushMessage) {
			this.onPushMessage.unsubscribe();
		}
	}

	processPushMessage(change): any {
		if (this.dataTable) {
			if (change.action == 'refresh') {
				this.dataTable.refresh();
			}
			else if (change.action == 'update' && this.dataTable.models) {
				let row = this.dataTable.models.find(row => {
					return row.tnzJobInstncId == change.job.instanceId;
				});
				if (row) {
					row.tnzJobState = change.job.jobState;
					row.tnzJobStatus = change.job.jobStatus;
					row.endTime = change.job.endTime;
					this.dataTable._updateRows();
				}
			}
		}
	}

	rowSelected(event) {
	}


	onDataChange(dataChange: any) {
		this.files = [];
		for (let job of dataChange.data.jobs) {
			if (job.outputFileType) {
				this.files.push({
					"contentType": this.schedulerUtils.outputMimeTypes[job.outputFileType],
					"fileType": job.outputFileType.toLowerCase(),
					"key": job.tnzJobInstncId,
					"name": job.outputFileName + "." + job.outputFileType.toLowerCase()
				});
			}
		}
	}

	reloadJobs() {
		this.dataTable.refresh();
	}

	downloadOutput(jobId) {
		window.open(this.schedulerUtils.getUrl() + "/scheduler/jobs/" + jobId + "/output?token=" + this.schedulerUtils.getAuthentication());
	}

	reSchedule(job) {
		this.schedulerService.reSchedule(job);
	}

	showMoreInfo(jobData) {
		this.schedulerService.showJobDataMoreInfo(jobData, 'job');
	}

	viewLog(jobData) {
		this.schedulerService.showJobLog(jobData);
	}

	downloadLog(jobId) {
		window.open(this.schedulerUtils.getUrl() + "/scheduler/jobs/" + jobId + "/log-file?token=" + this.schedulerUtils.getAuthentication());
	}

	previewOutput(job) {
		if (job && job.outputFileType == 'PDF') {
			let file = {
				"contentType": this.schedulerUtils.outputMimeTypes[job.outputFileType],
				"fileType": job.outputFileType.toLowerCase(),
				"key": job.tnzJobInstncId,
				"name": job.outputFileName + "." + job.outputFileType.toLowerCase()
			};

			const dialogRef = this.dialog.open(TrendzFilePreviewComponent);
			dialogRef.componentInstance.fileProviderService = this.schedulerUtils;
			dialogRef.componentInstance.file = file;
			dialogRef.componentInstance.files = this.files;
		}
	}

	mailOutput(job) {
		this.schedulerService.mailOutput(job);
	}

	getDuration(start, end) {
		let temp = (new Date(end).getTime() - new Date(start).getTime()) / 1000;
		function numberEnding(number) {
			return (number > 1) ? 's' : '';
		}
		var years = Math.floor(temp / 31536000);
		if (years) {
			return years + ' yr' + numberEnding(years);
		}
		var days = Math.floor((temp %= 31536000) / 86400);
		if (days) {
			return days + ' day' + numberEnding(days);
		}
		var hours = Math.floor((temp %= 86400) / 3600);
		if (hours) {
			return hours + ' hr' + numberEnding(hours);
		}
		var minutes = Math.floor((temp %= 3600) / 60);
		if (minutes) {
			return minutes + ' min' + numberEnding(minutes);
		}
		var seconds = temp % 60;
		if (seconds) {
			return seconds + ' sec' + numberEnding(seconds);
		}
		return '--';
	}
}
