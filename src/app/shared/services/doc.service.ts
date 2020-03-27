
import { of as observableOf, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ApiServiceV4 } from './api-v4.service';

@Injectable()
export class DocumentService {

    constructor(
        private apiService: ApiServiceV4
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

    checkRevisionPermission(docStatus, docTypeId): Observable<any> {
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
}