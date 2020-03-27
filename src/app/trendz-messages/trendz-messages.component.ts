import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { FormControl } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
    selector: 'trendz-messages',
    templateUrl: './trendz-messages.component.html'
})
export class TrendzMessgesComponent implements OnInit, OnDestroy {

    selectedTab = 0;
    private tabs = ["notifications", "mail"];

    constructor(private route: ActivatedRoute,
        private location: Location) {
    }

    ngOnInit() {
        let tab = this.route.params["value"]["tab"];
        if (tab) {
            this.selectedTab = this.tabs.indexOf(tab);
        }
    }

    ngOnDestroy() {
    }

    tabChanged($event) {
        if (this.selectedTab != $event.index) {
            this.selectedTab = $event.index;
            this.location.go("/trendz-messages/" + this.tabs[this.selectedTab]);
        }
    }

    createNotification() {

    }
}
