import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { DateUtilities } from 'app/shared/utils';

@Component({
    selector: 'notifications-listing',
    templateUrl: './notifications-listing.component.html'
})
export class NotificationsListingComponent implements OnInit {

    @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
    
    constructor(
		public dateUtils: DateUtilities
    ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    rowSelected(event) {
    }

    reload() {
        this.dataTable.refresh();
    }

    showMoreInfo() {
    }
}
