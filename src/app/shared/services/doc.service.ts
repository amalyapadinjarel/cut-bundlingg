
import { of as observableOf, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';

@Injectable()
export class DocumentService {
    statusData;
    statusLoading = false;
    constructor(
        private apiService: ApiService
    ) { }

    checkDocSecurity(docStatus, docTypeId): Observable<number> {
        return this.apiService.get('/trendz/document-security?docStatus=' + docStatus + '&docTypeId=' + docTypeId).pipe(
            map(data => {
                if (data && data.documentSecurity) {
                    return parseInt(data.documentSecurity.documentAccessKey);
                } else {
                    return 0;
                }
            }));
    }

    checkInitiatePermission(docTypeId): Observable<number> {
        return this.apiService.get('/trendz/initiate-permission?docTypeId=' + docTypeId).pipe(
            map(data => {
                if (data && data.permission) {
                    return parseInt(data.permission);
                } else {
                    return 0;
                }
            }));
    }

    checkAssigneeChangePermission(docTypeId): Observable<number> {
        return this.apiService.get('/trendz/change-assignee-permission?docTypeId=' + docTypeId).pipe(
            map(data => {
                if (data && data.permission) {
                    return parseInt(data.permission);
                } else {
                    return 0;
                }
            }));
    }

    checkAppSecurity(uniqueId): Observable<any> {
        return this.apiService.get('/trendz/user-permission?url=' + uniqueId).pipe(
            catchError(() => {
                return observableOf(null);
            }), map(data => {
                if (data) {
                    return data.userPermissions;
                } else {
                    return 0;
                }
            }));
    }

    checkRevisionPrivilege(docStatus, docTypeId): Observable<any> {
        return this.apiService.get('/trendz/document-revision?docStatus=' + docStatus + '&docTypeId=' + docTypeId).pipe(
            map(data => {
                if (data) {
                    return data.documentRevision;
                } else {
                    return data;
                }
            }));
    }

    fetchDefaultFacility(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.get('/common/default-facility').subscribe(
                res => {
                    resolve(res);
                }, err => {
                    resolve({ defaultFacility: {} })
                });
        });
    }

    checkAppPermission(url, type) {
        return new Promise((resolve, reject) => {
            this.checkAppSecurity(url)
                .subscribe(res => {
                    if (res && res[type] == 4) {
                        resolve(true)
                    } else {
                        reject("You are not given privilege to " + type + " in this application.")
                    }
                })
        });
    }

    checkDocPermission(docStatus, docType) {
        return new Promise((resolve, reject) => {
            this.checkDocSecurity(docStatus, docType)
                .subscribe(res => {
                    if (res) {
                        resolve()
                    } else {
                        reject("The document is not editable in this status.")
                    }
                })
        });
    }

    checkRevisionPermission(docStatus, docTypeId) {
        return new Promise((resolve, reject) => {
            this.checkRevisionPrivilege(docStatus, docTypeId)
                .subscribe(data => {
                    if (data.documentRevisionKey) {
                        resolve()
                    } else {
                        reject("You are not given privilege to revise this document in this status.")
                    }
                })
        });
    }

    getAllStatusData() {
        return new Promise(async (resolve, reject) => {
            if (this.statusData) {
                resolve(this.statusData)
            } else {
                if (!this.statusLoading) {
                    this.statusLoading = true;
                    this.apiService.get('/lovs/lookup?lookupType=TRENDZ_DOC_STATUS').subscribe(
                        res => {
                            this.statusData = res.data
                                .map(line => {
                                    return {
                                        label: line.label,
                                        value: line.value,
                                        color: line.value1
                                    }
                                });
                            this.statusLoading = false;
                            resolve(this.statusData);
                        }, err => {
                            reject()
                        });
                } else {
                    while (this.statusLoading) {
                        await this.wait(500);
                    }
                    resolve(this.statusData)
                }

            }
        });
    }

    wait(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }
}
