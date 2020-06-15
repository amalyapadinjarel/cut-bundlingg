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

	@ViewChild(SmdDataTable, { static: false }) dataTable: SmdDataTable;

	constructor(
		private schedulerUtils: SchedulerUtils,
		public dateUtils: DateUtilities
	) {
	}

	ngOnInit() {
		if (!this.jobData.log) {
			this.loading = true;
			this.schedulerUtils.getJobLog(this.jobData.tnzJobInstncId).then(
				(data) => {
					if (data.status == 'S') {
						this.jobData.log = data.jobLog;
						this.loading = false;
						this.dataTable.refresh(this.jobData.log);
						this.dataTable.rowCount = this.jobData.log.length;
					}
					else {
						this.loading = false;
					}
				},
				() => {
					this.loading = false;
				});
		}
	}

	ngOnDestroy() {

	}
}
