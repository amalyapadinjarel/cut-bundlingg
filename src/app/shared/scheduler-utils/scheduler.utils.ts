
import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { UserService } from '../services';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class SchedulerUtils {

    private static url: string;
    private static authentication: string = "";

    outputMimeTypes = {
        'PDF': 'application/pdf',
        'XLS': 'application/vnd.ms-excel',
        'JPG': 'image/jpeg',
        'PNG': 'image/png',
        'TXT': 'text/plain',
        'HTML': 'text/html',
        'CSV': 'text/csv',
        'DOC': 'application/msword',
        'XLSX': 'application/vnd.ms-excel'
    };

    onJobScheduled: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(
        private http: HttpClient,
        private userService: UserService,
    ) {
        SchedulerUtils.url = environment.bi_url;
        SchedulerUtils.authentication = localStorage.getItem('trendzBIAuthentication')
        
    }

    private setHeaders(authentication: string): HttpHeaders {
        const headersConfig = {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
        };
        headersConfig['Authorization'] = authentication;
        return new HttpHeaders(headersConfig);
    }

    private formatErrors(error: any) {
        return observableThrowError({ status: error.status, data: error });
    }

    private get(path: string, params: HttpParams = new HttpParams(), token = Math.random()): Observable<any> {
        return this.http.get(`${SchedulerUtils.url}${path}`, { headers: this.setHeaders(SchedulerUtils.authentication), params: params }).pipe(
            catchError(this.formatErrors),
            map((res: any) => {
                console.log(res)
                res.token = token;
                return res;
            }));
    }

    private post(path: string, body: Object = {}, token = Math.random()): Observable<any> {
        return this.http.post(`${SchedulerUtils.url}${path}`, JSON.stringify(body), { headers: this.setHeaders(SchedulerUtils.authentication) }).pipe(
            catchError(this.formatErrors));
    }

    private put(path: string, body: Object = {}): Observable<any> {
        return this.http.put(`${SchedulerUtils.url}${path}`, JSON.stringify(body), { headers: this.setHeaders(SchedulerUtils.authentication) }).pipe(
            catchError(this.formatErrors));
    }

    private delete(path: string): Observable<any> {
        return this.http.delete(`${SchedulerUtils.url}${path}`, { headers: this.setHeaders(SchedulerUtils.authentication) }).pipe(
            catchError(this.formatErrors));
    }

    getUrl(): string {
        return SchedulerUtils.url;
    }

    getAuthentication(): string {
        return SchedulerUtils.authentication;
    }

    getAllPrograms(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.get('/programs')
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    getTaskflowReports(taskflowKey, module): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('Here')
            this.get('/programs/reports/' + taskflowKey + "/" + module)
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    getTaskflowPrograms(taskflowKey, module): Promise<any> {
        return new Promise((resolve, reject) => {
            this.get('/programs/' + taskflowKey + "/" + module)
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    initProgram(pgmId, inputData?): Promise<any> {
        return new Promise((resolve, reject) => {
            if (inputData) {
                this.post('/programs/' + pgmId + '/init', inputData)
                    .subscribe(response => {
                        resolve(response);
                    }, () => {
                        reject();
                    });
            }
            else {
                this.get('/programs/' + pgmId + '/init')
                    .subscribe(response => {
                        resolve(response);
                    }, () => {
                        reject();
                    });
            }
        });
    }

    submitProgram(pgmId, job): Promise<any> {
        return new Promise((resolve, reject) => {
            this.post('/programs/' + pgmId + '/submit', job)
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    getAllJobs(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.get('/scheduler/jobs')
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    getJobParams(jobId): Promise<any> {
        return new Promise((resolve, reject) => {
            this.get('/scheduler/jobs/' + jobId + '/params')
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    getAllQueue(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.get('/scheduler/queue')
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    getQueueParams(queueId): Promise<any> {
        return new Promise((resolve, reject) => {
            this.get('/scheduler/queue/' + queueId + '/params')
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    reSchedule(jobId, job) {
        return new Promise((resolve, reject) => {
            this.post('/scheduler/queue/' + jobId + '/re-schedule', job)
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    suspendSchedule(jobId) {
        return new Promise((resolve, reject) => {
            this.put('/scheduler/queue/' + jobId + '/suspend')
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    resumeSchedule(jobId) {
        return new Promise((resolve, reject) => {
            this.put('/scheduler/queue/' + jobId + '/resume')
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    deleteSchedule(jobId) {
        return new Promise((resolve, reject) => {
            this.delete('/scheduler/queue/' + jobId + '/delete')
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    getJobLog(jobId): Promise<any> {
        return new Promise((resolve, reject) => {
            this.get('/scheduler/jobs/' + jobId + '/log-data')
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }

    getPreviewContent(key): any {
        return new Promise((resolve) => {
            let content: any = {};
            content.type = 'url';
            content.data = this.getUrl() + "/scheduler/jobs/" + key + "/output-preview?token=" + this.getAuthentication();
            resolve(content);
        });
    }

    getDownloadUrl(key): string {
        return this.getUrl() + "/scheduler/jobs/" + key + "/output?token=" + this.getAuthentication();
    }

    mailOutput(tnzJobInstncId, mailData): any {
        return new Promise((resolve, reject) => {
            this.post('/scheduler/jobs/' + tnzJobInstncId + '/mail-output', mailData)
                .subscribe(response => {
                    resolve(response);
                }, () => {
                    reject();
                });
        });
    }
}
