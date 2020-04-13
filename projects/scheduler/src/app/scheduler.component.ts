import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';

import { Program } from './_models';

@Component({
	selector: 'scheduler-page',
	templateUrl: './scheduler.component.html'
})
export class SchedulerComponent implements OnInit, OnDestroy {

	frequentPrograms: Program[] = [];

	selectedTab = 0;
	private tabs = ["general", "jobs", "schedules"];

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
			this.location.go("/scheduler/" + this.tabs[this.selectedTab]);
		}
	}
	
	loadProgram() {

	}
}
