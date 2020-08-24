import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventService } from 'app/shared/services';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ConfirmPopupComponent, SmdDataTable } from 'app/shared/component';
import { SchedulerUtils } from 'app/shared/scheduler-utils';
import { SchedulerService } from '../_services/scheduler.service';
import { DateUtilities, AlertUtilities } from 'app/shared/utils';

@Component({
	selector: 'queue-listing',
	templateUrl: './queue.component.html'
})
export class QueueComponent implements OnInit, OnDestroy {

	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

	onJobScheduled: Subscription;
	onPushMessage: Subscription;
	onRefresh: Subscription;

	constructor(
		public schedulerService: SchedulerService,
		public schedulerUtils: SchedulerUtils,
		private alertUtils: AlertUtilities,
		public dateUtils: DateUtilities,
		private confirmDialog: MatDialog,
		private eventService: EventService
	) {
		this.onJobScheduled =
			this.schedulerUtils.onJobScheduled
				.subscribe(data => {
					if (data == 1 && this.dataTable) {
						this.dataTable.refresh();
					}
				});
		this.onPushMessage =
			this.eventService.schedulerJobChnaged
				.subscribe(change => {
					this.processPushMessage(change);
				});
		this.onRefresh = this.schedulerService.onRefresh.subscribe(change => {
			this.dataTable.refresh();
		})
	}

	ngOnInit() {
	}

	ngOnDestroy(): void {
		if (this.onJobScheduled) {
			this.onJobScheduled.unsubscribe();
		}
		if (this.onPushMessage) {
			this.onPushMessage.unsubscribe();
		}
		if (this.onRefresh) {
			this.onRefresh.unsubscribe();
		}
	}

	processPushMessage(change): any {
		if (this.dataTable) {
			if (change.type == 'refresh') {
				if (change.level > 0)
					this.dataTable.refresh();
			}
			else if (change.type == 'update' && this.dataTable.models) {
				let row = this.dataTable.models.find(row => {
					return row.tnzJobId == change.job.jobId;
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

	reSchedule(job) {
		this.schedulerService.reSchedule(job, true);
	}

	suspendSchedule(jobId) {
		this.schedulerUtils.suspendSchedule(jobId).then(
			(data: any) => {
				if (data.status == 'S') {
					let row = this.dataTable.models.find(row => {
						return row.tnzJobId == jobId;
					});
					row.tnzJobState = 'S';
					row.tnzJobStatus = '';
					row.nextRun = '';
					this.dataTable._updateRows();
				}
				else {
					this.alertUtils.showAlerts("Failed to suspend job");
				}
			},
			err => {
				this.alertUtils.showAlerts("Failed to suspend job");
			})
	}

	resumeSchedule(job) {
		if (job.secured == 'Y') {
				this.schedulerUtils.resumeSchedule(job.tnzJobId).then(
				(data: any) => {
					if (data.status == 'S') {
						let row = this.dataTable.models.find(row => {
							return row.tnzJobId == job.tnzJobId;
						});
						row.tnzJobState = 'P';
						row.tnzJobStatus = '';
						row.nextRun = data.nextRun;
						this.dataTable._updateRows();
					}
					else {
						this.alertUtils.showAlerts("Failed to resume job");
					}
				},
				err => {
					this.alertUtils.showAlerts("Failed to resume job");
				});
		}
		else {
			this.alertUtils.showAlerts('Insufficient privilege to run program')
		}
	}

	deleteSchedule(job) {
		let dialogRef = this.confirmDialog.open(ConfirmPopupComponent);
		dialogRef.componentInstance.dialogTitle = 'Delete Schedule ?'
		dialogRef.componentInstance.message = job.tnzJobName + ' will be removed from schedule permanently!';
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.schedulerUtils.deleteSchedule(job.tnzJobId).then(
					(data: any) => {
						if (data.status == 'S') {
							let row = this.dataTable.models.find(row => {
								return row.tnzJobId == job.tnzJobId;
							});
							this.dataTable.rowCount--;
							this.dataTable.models.splice(this.dataTable.models.indexOf(row), 1);
							this.dataTable._updateRows();
						}
						else {
							this.alertUtils.showAlerts("Failed to delete job");
						}
					},
					err => {
						this.alertUtils.showAlerts("Failed to delete job");
					});
			}
		});
	}

	showMoreInfo(jobData) {
		this.schedulerService.showJobDataMoreInfo(jobData, 'queue');
	}

}
