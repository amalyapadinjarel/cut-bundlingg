import { Component, OnDestroy, OnInit } from '@angular/core';

import { SchedulerUtils } from 'app/shared/scheduler-utils';
import { AlertUtilities } from 'app/shared/utils/alert.utility';
import { DateUtilities } from 'app/shared/utils';

@Component({
	selector: 'program-more-info',
	templateUrl: './more-info.html',
	styleUrls: ['./more-info.scss']
})
export class ProgramMoreInfoComponent implements OnInit, OnDestroy {

	loading = false;
	jobData: any;
	jobType: string;
	
	constructor(
		private schedulerUtils: SchedulerUtils,
		public alertUtils: AlertUtilities,
		public dateUtils: DateUtilities
	) {
	}

	ngOnInit() {
		if (!this.jobData.parameterList) {
			this.loading = true;
			if (this.jobType == 'job') {
				this.schedulerUtils.getJobParams(this.jobData.tnzJobInstncId).then(
					(data) => {
						if (data.status == 'S') {
							this.jobData.parameterList = data.parameters;
							this.loading = false;
						}
					},
					() => {
						this.loading = false;
						this.alertUtils.showAlerts("Failed to fetch job parameters.");
					});
			}
			else if (this.jobType == 'queue') {
				this.schedulerUtils.getQueueParams(this.jobData.tnzJobId).then(
					(data) => {
						if (data.status == 'S') {
							this.jobData.parameterList = data.parameters;
							this.loading = false;
						}
					},
					() => {
						this.loading = false;
						this.alertUtils.showAlerts("Failed to fetch job parameters.");
					});
			}
		}
	}

	ngOnDestroy() {

	}
}
