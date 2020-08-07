import { Injectable } from '@angular/core';
import { Subscription } from '../../../../node_modules/rxjs';
import { MatDialog } from '@angular/material/dialog';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

import { environment } from 'environments/environment';
import { UserService, EventService, LocalConfigService } from 'app/shared/services';
import { SchedulerUtils } from 'app/shared/scheduler-utils';
import { TrendzFilePreviewComponent, } from 'app/shared/component/file-preview/file-preview.component';

@Injectable()
export class PushMessageService {

    private serverUrl = environment.ws_url;
    private stompClient;
    private privateSubs: Subscription;
    private publicSubs: Subscription;

    pushMessages: any[] = [];

    constructor(
        private userService: UserService,
        private schedulerUtils: SchedulerUtils,
        private dialog: MatDialog,
        private eventService: EventService,
        private localConfig: LocalConfigService
    ) {
    }

    get runReportsInBackground() {
        return this.localConfig.isReportsInBackground();
    }

    set runReportsInBackground(value: boolean) {
        this.localConfig.runReportsInBackground(value);
    }

    initializeWebSocketConnection() {
        this.disconnectWebSocket();
        let ws = new SockJS(this.serverUrl);
        this.stompClient = Stomp.over(ws);
        this.stompClient.debug = false;
        this.stompClient.connect({}, () => {
            this.onConnected();
        }, () => {
            setTimeout(() => {
                this.initializeWebSocketConnection();
            }, 15000);
        });
    }

    disconnectWebSocket() {
        if (this.privateSubs) {
            this.privateSubs.unsubscribe();
        }
        if (this.publicSubs) {
            this.publicSubs.unsubscribe();
        }
        if (this.stompClient) {
            this.stompClient.disconnect(() => {
            });
        }
        this.pushMessages = [];
    }

    onConnected() {
        this.privateSubs = this.stompClient.subscribe("/private/" + this.userService.getCurrentUser().userId, (message) => {
            if (message.body) {
                let msg = JSON.parse(message.body);
                if (msg.source == 'scheduler' && msg.job) {
                    this.handleSchedulerEvents(msg);
                }
                if (msg.source == 'notification') {
                    this.eventService.onNewNotification.next(1);
                }
            }
        });
        this.publicSubs = this.stompClient.subscribe("/public/", (message) => {
            if (message.body) {
                let msg = JSON.parse(message.body);
                if (msg.source == 'notification') {
                    this.eventService.onNewNotification.next(1);
                }
            }
        });
    }

    sendMessage(message) {
        this.stompClient.send("/client/send/push-message/" + this.userService.getCurrentUser().userId, {}, message);
    }

    closeUIMessage(message, remove = true) {
        if (!remove && !this.runReportsInBackground) {
            for (let i = 0; i < this.pushMessages.length; i++) {
                if (this.pushMessages[i].state == 'R')
                    this.closeUIMessage(this.pushMessages[i]);
            }
        }
        else {
            const index = this.pushMessages.findIndex(item => {
                if (item.type == 'scheduler-job' && item.instanceId == message.instanceId) {
                    return true;
                }
                return false;
            });
            if (index > -1) {
                if (remove) {
                    this.pushMessages.splice(index, 1);
                }
                else {
                    this.pushMessages[index].hidden = true;
                }
            }
        }
    }

    handleSchedulerEvents(message): any {
        if (message.type == 'job-started') {
            this.eventService.schedulerJobChnaged.next({ action: 'refresh', level: message.job.isSchedule ? 1 : 0 });
        }
        else {
            this.eventService.schedulerJobChnaged.next({ action: 'update', job: message.job });
        }
        if (!this.localConfig.isReportsInBackground()) {
            let msg: any;
            if (message.type == 'job-changed') {
                msg = this.pushMessages.find(item => {
                    return item.type == 'scheduler-job' && item.instanceId == message.job.instanceId;
                });
            }
            if (!msg) {
                msg = {};
                this.pushMessages.unshift(msg);
            }
            msg.type = 'scheduler-job';
            msg.instanceId = message.job.instanceId;
            msg.jobId = message.job.jobId;
            msg.state = message.type == 'job-started' ? 'R' : message.job.jobState;
            msg.status = message.job.jobStatus;
            msg.jobName = message.job.jobName;
            msg.fileName = message.job.fileName ? message.job.fileName : message.job.jobName;
            msg.fileType = message.job.fileType;
            msg.startTime = message.job.startTime;
            msg.endTime = message.job.endTime;
            msg.isSchedule = message.job.isSchedule;
            if (message.type == 'job-started') {
                msg.state = 'R';

                if (!this.localConfig.isReportPreviewInBackground() && msg.fileType == 'PDF' && !msg.isSchedule) {
                    msg.hidden = true;
                    this.previewOutput(msg);
                }
            }
            else {
                if (msg.endTime || msg.state == 'C' || msg.state == 'A') {
                    setTimeout(() => {
                        this.closeUIMessage(msg);
                    }, 12000);
                }
            }
        }
    }

    previewOutput(job, scheduled = true) {
        if (job) {
            let file = {
                "contentType": this.schedulerUtils.outputMimeTypes[job.fileType],
                "fileType": job.fileType.toLowerCase(),
                "key": job.instanceId,
                "name": job.fileName + "." + job.fileType.toLowerCase()
            };

            const dialogRef = this.dialog.open(TrendzFilePreviewComponent);
            dialogRef.componentInstance.fileProviderService = this.schedulerUtils;
            dialogRef.componentInstance.file = file;
            dialogRef.componentInstance.scheduler = scheduled;
        }
    }

    downloadOutput(jobId) {
        window.open(this.schedulerUtils.getUrl() + "/scheduler/jobs/" + jobId + "/output?token=" + this.schedulerUtils.getAuthentication());
    }

}