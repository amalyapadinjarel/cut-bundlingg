import { map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Injectable, ElementRef, OnDestroy } from '@angular/core';
import { EventService } from './event.service';
import { ApiService } from './api.service';

@Injectable()
export class NavigationService implements OnDestroy {

    appMenus;
    bookmarks;
    // allowedUrls = ['/login', '/embed', '/mailbox', '/scheduler', '/not-found', '/wip', '/loading', '/trendz-drive', '/pdm-costing'];
     allowedUrls = ['/login', '/embed', '/mailbox', '/scheduler', '/not-found', '/wip', '/loading', '/trendz-drive', '/pdm-costing','/P-profile'];

    bookmarkedTaskFlows: number[] = [];
    showQuickMenu = false;

    private ngUnsubscribe: Subject<any> = new Subject<any>();
    constructor(private apiService: ApiService
        , private eventService: EventService) {
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public fetchMenuData(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.appMenus) {
                this.fetchMenuDataFromDB()
                    .then(res => {
                        this.appMenus = JSON.parse(JSON.stringify(res));
                        resolve(this.appMenus);
                    }, () => {
                        reject();
                    });
            } else {
                resolve(this.appMenus);
            }
        });
    }

    public fetchBookmarks(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.bookmarks) {
                this.fetchBookmarksFromDB()
                    .then(res => {
                        this.bookmarks = JSON.parse(JSON.stringify(res));
                        resolve(this.bookmarks);
                    }, () => {
                        reject();
                    });
            } else {
                resolve(this.bookmarks);
            }
        });
    }

    public saveBookMark(bookmark): Observable<any> {
        return this.apiService.post('/administration/bookmarks', { bookmark: bookmark }).pipe(
            map(data => { return data }));
    }

    public deleteBookmark(bookmarkId): Observable<any> {
        if (bookmarkId) {
            return this.apiService.delete('/administration/bookmarks/' + bookmarkId).pipe(
                map(data => data))
        }
    }

    public getAppName(shortCode, applicationCode) {
        if (shortCode && applicationCode)
            return this.apiService.get('/common/taskflow/' + shortCode + '/' + applicationCode).pipe(
                map(data => data));
    }

    public showApplicationReports(taskflowKey, module, params?, origin?: ElementRef, align = 'left') {
        const event = { key: 'application-reports', position: { origin: origin, align: align }, data: { taskflowKey: taskflowKey, module: module, params: params } };
        this.eventService.showGadget.next(event);
    }

    public showApplicationPrograms(taskflowKey, module, params?, origin?: ElementRef, align = 'left') {
        const event = { key: 'application-programs', position: { origin: origin, align: align }, data: { taskflowKey: taskflowKey, module: module, params: params } };
        this.eventService.showGadget.next(event);
    }

    public isValidUrl(url): boolean {
        const allowed = this.allowedUrls.find(item => {
            return url.startsWith(item);
        });
        if (allowed) {
            return true;
        }
        else {
            const menu = this.appMenus;
            if (menu && menu.length > 0) {
                let keepGoing = true;
                menu.forEach(app => {
                    if (keepGoing && this.leafNodes(app, url)) {
                        keepGoing = false;
                    }
                });
                return (!keepGoing);
            } else {
                return (false);
            }
        }
    }


    private fetchMenuDataFromDB(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.get('/administration/menu')
                .subscribe(res => {
                    if (res && res.tnzMenu) {
                        resolve(res.tnzMenu);
                    } else {
                        reject();
                    }
                }, () => {
                    reject();
                });
        });
    }

    private fetchBookmarksFromDB(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.get('/administration/bookmarks')
                .subscribe(res => {
                    if (res && res.bookmarks) {
                        resolve(res.bookmarks);
                    } else {
                        reject();
                    }
                }, () => {
                    reject();
                });
        });
    }

    private leafNodes(menu, url): boolean {
        if (menu.childList.length > 0) {
            let keepGoing = true;
            menu.childList.forEach(element => {
                if (keepGoing && this.leafNodes(element, url)) {
                    keepGoing = false;
                }
            });
            return (!keepGoing);
        } else if (url.indexOf(menu.url) == 0) {
            return true;
        } else {
            return false;
        }
    }

}