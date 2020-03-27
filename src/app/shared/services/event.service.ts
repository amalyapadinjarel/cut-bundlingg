import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";



@Injectable()
export class EventService {
    
    onLogin: BehaviorSubject<any> = new BehaviorSubject([]);
    isLoadingPage: BehaviorSubject<any> = new BehaviorSubject([]);
    applicationLoaded: BehaviorSubject<any> = new BehaviorSubject([]);
    commentsCountChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    commentsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    showGadget: BehaviorSubject<any> = new BehaviorSubject([]);
    schedulerJobChnaged: BehaviorSubject<any> = new BehaviorSubject([]);
	onNewNotification: BehaviorSubject<any> = new BehaviorSubject([]);
	onPendingNotificationCountChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    
    constructor() {

    }
}