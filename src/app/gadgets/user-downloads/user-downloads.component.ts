
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { EventService, UserService } from 'app/shared/services';
import { SchedulerUtils } from 'app/shared/scheduler-utils';
import { TrendzFilePreviewComponent } from 'app/shared/component/file-preview/file-preview.component';
import { DateUtilities } from 'app/shared/utils';
import { SmdDataTable } from 'app/shared/component/smd/smd-datatable/datatable.component';
import { ProgramMoreInfoComponent } from '../../../../projects/scheduler/src/app/program-more-info/more-info';
import { EMailOutputComponent } from '../../../../projects/scheduler/src/app/email-output/email-output';

@Component({
    selector: 'user-downloads',
    templateUrl: './user-downloads.component.html',
    styleUrls: ['./user-downloads.component.scss']
})
export class UserDownloadsComponent implements OnInit, OnDestroy {

    preFilters: any = {};
    files: any[] = [];
    onPushMessage: Subscription;

    @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

    constructor(
        public userService: UserService,
        public schedulerUtils: SchedulerUtils,
        private dialog: MatDialog,
        private eventService: EventService,
        public dateUtils: DateUtilities
    ) {
        this.preFilters.createdBy = this.userService.getCurrentUser().userId;

        this.onPushMessage =
            this.eventService.schedulerJobChnaged
                .subscribe(change => {
                    this.processPushMessage(change);
                });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
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

    reload() {
        this.dataTable.refresh();
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

    downloadOutput(job) {
        if (job.tnzJobStatus == 'S' && job.tnzJobState == 'C' && job.outputFileType) {
            window.open(this.schedulerUtils.getUrl() + "/scheduler/jobs/" + job.tnzJobInstncId + "/output?token=" + this.schedulerUtils.getAuthentication());
        }
    }

    showMoreInfo(jobData) {
        const dialogRef = this.dialog.open(ProgramMoreInfoComponent);
        dialogRef.componentInstance.jobData = jobData;
        dialogRef.componentInstance.jobType = 'job';
    }

    previewOutput(job) {
        if (job) {
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

    mailOutput(jobData): any {
        const dialogRef = this.dialog.open(EMailOutputComponent);
        dialogRef.componentInstance.jobData = jobData;
    }
}