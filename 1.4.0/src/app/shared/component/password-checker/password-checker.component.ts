import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-password-checker',
	templateUrl: './password-checker.component.html',
	styleUrls: ['./password-checker.component.scss']
})
export class PasswordCheckerComponent implements OnInit {

	@Input() password: string;
	@Output() validity = new EventEmitter();

	private goodRegexCaps = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
	private goodRegexSpecial = new RegExp("^(?=.*[a-z])(?=.*[!@#\$%\^&\*])(?=.*[0-9])(?=.{8,})");
	private strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
	private color: string = "white";
	private width: string = "0px";
	private transition: string = "width 1s";
	private strength: number = 0;
	private blnValidPassword: boolean = false;


	constructor() {
	}

	ngOnInit() {
	}

	ngOnChanges() {
		this.checkPassword()
		this.validity.emit(this.blnValidPassword);
	}

	checkPassword() {
		let blnGood = false;
		let blnStrong = false;

		if (!this.password || this.password.length < 6) {
			this.strength = 0;
			this.blnValidPassword = false;
		} else {
			this.strength = 1;
			this.blnValidPassword = true;
			blnGood = this.goodRegexCaps.test(this.password) || this.goodRegexSpecial.test(this.password);
			if (blnGood) {
				this.strength = 2;
				blnStrong = this.strongRegex.test(this.password);
				if (blnStrong) {
					this.strength = 3;
				} else if (this.strength == 3) {
					this.strength = 2;
				}
			} else if (this.strength == 2) {
				this.strength = 1;
			}
		}
		this.setStrengthMeter();

	}

	setStrengthMeter() {
		if (this.strength == 0) {
			this.color = "#f44336";
			this.width = "0%";
		}
		else if (this.strength == 1) {
			this.color = "#f44336";
			this.width = "33.33%";
		} else if (this.strength == 2) {
			this.color = "#FF9800";
			this.width = "66.66%";
		} else if (this.strength == 3) {
			this.color = "#4CAF50";
			this.width = "100%";
		}
	}

	getColor() {
		return this.color;
	}

	getWidth() {
		return this.width;
	}

	getTransition() {
		return this.transition;
	}


}
