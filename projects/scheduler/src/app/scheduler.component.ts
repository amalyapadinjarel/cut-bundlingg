import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';

import { Program } from './_models';
import { SchedulerService } from './_services';

@Component({
	selector: 'scheduler-page',
	templateUrl: './scheduler.component.html'
})
export class SchedulerComponent implements OnInit, OnDestroy {

	frequentPrograms: Program[] = [];

	selectedTab = 'general';
	private tabs = ["general", "jobs", "schedules"];

	constructor(private service: SchedulerService,
		private location: Location) {
		this.location.onUrlChange(x => this.onUrlChange(x))
			
	}

	ngOnInit() {
		this.onUrlChange(this.location.path())
		// this.router.events.subscribe( route => {
		// 	console.log('Router',route)
		// })
		// this.router.events.subscribe(route => {
		// 	console.log('ActivatedRoute',route)
		// })
		// let tab = this.router.params["value"]["tab"];
		// if (tab) {
		// 	this.selectedTab = this.tabs.indexOf(tab);
		// }
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

	onUrlChange(url){
		this.selectedTab = url.split('/').pop();
	}

	refresh(){
		console.log(this.selectedTab)
		this.service.onRefresh.next(true);
	}
}
