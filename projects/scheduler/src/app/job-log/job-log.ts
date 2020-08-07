import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { SchedulerUtils } from 'app/shared/scheduler-utils';
import { SmdDataTable } from 'app/shared/component';
import { DateUtilities } from 'app/shared/utils';

@Component({
	selector: 'job-log',
	templateUrl: './job-log.html',
	styleUrls: ['./job-log.scss']
})
export class JobLogComponent implements OnInit, OnDestroy {

	loading = false;
	jobData: any;

	@ViewChild("jobLog") jobLogTable: SmdDataTable;
	@ViewChild("pgmLog") pgmLogTable: SmdDataTable;


	constructor(
		private schedulerUtils: SchedulerUtils,
		public dateUtils: DateUtilities
	) {
	}

	ngOnInit() {
		if (!this.jobData.jobLog || !this.jobData.pgmLog) {
			this.loading = true;
			this.schedulerUtils.getJobLog(this.jobData.tnzJobInstncId).then(
				(data) => {
					if (data.status == 'S') {
						this.jobData.jobLog = data.jobLog;
						this.jobData.pgmLog = this.getPgmLog(data);
						this.loading = false;
						this.jobLogTable.refresh(this.jobData.jobLog);
						this.pgmLogTable.refresh(this.jobData.pgmLog);
						this.jobLogTable.rowCount = this.jobData.jobLog.length;
						this.pgmLogTable.rowCount = this.jobData.pgmLog.length;
					}
					else {
						this.loading = false;
					}
				},
				(err) => {
					this.loading = false;
				});
		}
	}

	ngOnDestroy() {

	}

	convertFormat(date) {
		let split = date.split('.');
		return split[0];
	}

	getPgmLog(data) {
		if(data && data.pgmLog){

			data.pgmLog.forEach(model => {
				model["type"] = model.logLevel ? model.logLevel.logCode : "";
				model["time"] = this.convertFormat(model.logDate)
				model["message"] = model.logText
			})
			return data.pgmLog
		} else {
			return []
		}
	}
}

