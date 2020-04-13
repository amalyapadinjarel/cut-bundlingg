import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { EventService } from "app/shared/services";
import { Program } from "../_models";
import { SchedulerUtils } from 'app/shared/scheduler-utils';
import { ProgramFormComponent } from 'app/shared/scheduler-utils/program-form/form';
import { ProgramMoreInfoComponent } from '../program-more-info/more-info';
import { EMailOutputComponent } from '../email-output/email-output';
import { CommonUtilities } from 'app/shared/utils/common.utility';
import { AlertUtilities } from 'app/shared/utils/alert.utility';
import { JobLogComponent } from '../job-log/job-log';

@Injectable()
export class SchedulerService {

    programs: Program[] = [];
    frequentPrograms: Program[] = [];
    programsLoaded = false;

    onLogin: Subscription;

    constructor(private schedulerUtils: SchedulerUtils
        , private alertUtils: AlertUtilities
        , private eventServie: EventService,
        private dialog: MatDialog) {
        this.onLogin =
            this.eventServie.onLogin
                .subscribe(login => {
                    if (login) {
                        this.clearScheduler();
                    }
                });
    }

    fetchPrograms(force = false): Promise<any> {
        return new Promise((resolve, reject) => {
            if (force || !this.programsLoaded) {
                this.programs = [];
                this.schedulerUtils.getAllPrograms()
                    .then(data => {
                        if (data.status == 'S' && data.programs.length > 0) {
                            this.programs = data.programs.map(pgm => new Program(pgm));
                        }
                        this.setPrograms();
                        resolve();
                    }, reject);
                this.programsLoaded = true;
            }
            else {
                resolve();
            }
        });

    }

    setPrograms(): Promise<Program[]> {
        return new Promise((resolve) => {
            CommonUtilities.sortArray(this.programs, 'runCount', 'number', 'desc');
            let i = 0;
            this.frequentPrograms = [];
            for (let pgm of this.programs) {
                if (i < 10) {
                    this.frequentPrograms.push(pgm);
                    i++;
                }
                else {
                    break;
                }
            }
            CommonUtilities.sortArray(this.programs, 'pgmName');
            resolve(this.programs);
        });
    }

    clearScheduler() {
        this.programsLoaded = false;
    }

    loadProgram(pgmId) {
        if (pgmId) {
            let pgm = this.programs.find(item => {
                return item.pgmId == pgmId;
            });
            if (pgm) {
                const dialogRef = this.dialog.open(ProgramFormComponent);
                dialogRef.componentInstance.pgmId = pgm.pgmId;
                dialogRef.componentInstance.pgmName = pgm.pgmName;
                dialogRef.componentInstance.pgmDesc = pgm.description;
                dialogRef.componentInstance.pgmOutputFileType = pgm.outputFileType;
                dialogRef.afterClosed().subscribe(() => {
                }, () => {
                });
            }
        } else {
        }
    }

    reSchedule(pgm, isReSchedule = false) {
        if (pgm.exePgmId) {
            const dialogRef = this.dialog.open(ProgramFormComponent);
            dialogRef.componentInstance.pgmId = pgm.exePgmId;
            dialogRef.componentInstance.pgmName = pgm.tnzJobName;
            dialogRef.componentInstance.pgmDesc = pgm.description;
            dialogRef.componentInstance.pgmOutputFileType = pgm.outputFileType;
            dialogRef.componentInstance.cronExpression = pgm.cronExpression;
            dialogRef.componentInstance.logEnabled = pgm.logEnabled == 'Y';
            dialogRef.componentInstance.sendMail = pgm.sendMail == 'Y';
            dialogRef.componentInstance.mailToMe = pgm.mailToMe == 'Y';
            dialogRef.componentInstance.isReschedule = isReSchedule;
            dialogRef.componentInstance.isRerun = true;
            dialogRef.componentInstance.queueId = pgm.tnzJobId;
            if (pgm.parameterList) {
                dialogRef.componentInstance.postFormFields = this.getPostFormFields(pgm.parameterList);
                dialogRef.componentInstance.fetchJobForm();
            }
            else {
                dialogRef.componentInstance.loading = true;
                if (isReSchedule) {
                    this.schedulerUtils.getQueueParams(pgm.tnzJobId).then(
                        (data) => {
                            if (data.status == 'S') {
                                dialogRef.componentInstance.postFormFields = this.getPostFormFields(data.parameters);
                                dialogRef.componentInstance.loading = false;
                                dialogRef.componentInstance.fetchJobForm();
                            }
                        },
                        () => {
                            dialogRef.close();
                            this.alertUtils.showAlerts("Failed to fetch job parameters.");
                        });
                } else {
                    this.schedulerUtils.getJobParams(pgm.tnzJobInstncId).then(
                        (data) => {
                            if (data.status == 'S') {
                                dialogRef.componentInstance.postFormFields = this.getPostFormFields(data.parameters);
                                dialogRef.componentInstance.loading = false;
                                dialogRef.componentInstance.fetchJobForm();
                            }
                        },
                        () => {
                            dialogRef.close();
                            this.alertUtils.showAlerts("Failed to fetch job parameters.");
                        });
                }
            }
        }
    }

    private getPostFormFields(parameterList) {
        let postFormFields: any = {};
        for (let param of parameterList) {
            if (param.numValue) {
                postFormFields[param.parameter] = param.numValue;
            }
            else if (param.dateValue) {
                postFormFields[param.parameter] = param.dateValue;
            }
            else if (param.charValue) {
                postFormFields[param.parameter] = param.charValue;
            }
        }
        return postFormFields;
    }

    showJobDataMoreInfo(jobData, jobType) {
        const dialogRef = this.dialog.open(ProgramMoreInfoComponent);
        dialogRef.componentInstance.jobData = jobData;
        dialogRef.componentInstance.jobType = jobType;
    }

    showJobLog(jobData) {
        const dialogRef = this.dialog.open(JobLogComponent, {
            width: '80%',
        });
        dialogRef.componentInstance.jobData = jobData;
    }

    mailOutput(jobData): any {
        const dialogRef = this.dialog.open(EMailOutputComponent);
        dialogRef.componentInstance.jobData = jobData;
    }

}