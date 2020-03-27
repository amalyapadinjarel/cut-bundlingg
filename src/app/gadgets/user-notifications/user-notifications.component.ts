
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { SmdDataTable } from 'app/shared/component';
import { TrendzMessageService, EventService, ApiServiceV4 } from 'app/shared/services';
import { DateUtilities } from 'app/shared/utils';

@Component({
    selector: 'user-notifications',
    templateUrl: './user-notifications.component.html',
    styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit, OnDestroy {

    @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

    constructor(
        public trendzMessageService: TrendzMessageService,
        private eventService: EventService,
        public dateUtils: DateUtilities,
        public apiServiceV4: ApiServiceV4
    ) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    reload() {
        this.dataTable.refresh();
    }

    readAllNotification() {
        this.trendzMessageService.updateReadStatus(1).then(notification => {
            if (notification) {
                this.dataTable.models.forEach(row => {
                    row.isRead = notification.isRead;
                });
                this.dataTable._updateRows();
                this.eventService.onPendingNotificationCountChanged.next('ALL');
            }
        });
    }

    readNotification(subId) {
        this.trendzMessageService.updateReadStatus(1, subId).then(notification => {
            if (notification) {
                let row = this.dataTable.models.find(row => {
                    return row.subscriptionId == notification.subscriptionId;
                });
                row.isRead = notification.isRead;
                this.dataTable._updateRows();
                this.eventService.onPendingNotificationCountChanged.next(-1);
            }
        });
    }

    unreadNotification(subId) {
        this.trendzMessageService.updateReadStatus(0, subId).then(notification => {
            if (notification) {
                let row = this.dataTable.models.find(row => {
                    return row.subscriptionId == notification.subscriptionId;
                });
                row.isRead = notification.isRead;
                this.dataTable._updateRows();
                this.eventService.onPendingNotificationCountChanged.next(1);
            }
        });
    }

    showMoreInfo() {
    }
}