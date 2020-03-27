import { Component, OnDestroy, OnInit } from '@angular/core';


@Component({
	selector: 'notification-form',
	templateUrl: './form.html',
	styleUrls: ['./form.scss']
})
export class NotificaionFormComponent implements OnInit, OnDestroy {

	loading = true;

	constructor() { }


	ngOnInit() {
	}

	ngOnDestroy() {

	}

	sendMessage() {
	}


}
