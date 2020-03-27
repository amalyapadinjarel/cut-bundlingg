import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertUtilities } from 'app/shared/utils/alert.utility';
import { ApiService } from 'app/shared/services';

@Component({
	selector: 'trendz-embedded-url',
	templateUrl: './embedded-url.component.html',
	styleUrls: ['./embedded-url.component.scss']
})
export class EmbeddedUrlComponent implements OnInit, OnDestroy {

	@Input() taskFlowId;
	@Input() location = 'LANDING';
	@Input() parameters = {};

	embeddedUrl;

	constructor(
		private apiService: ApiService,
		private alertUtils: AlertUtilities,
		private sanitizer: DomSanitizer
	) {
	}

	ngOnInit() {
		if (this.taskFlowId) {
			this.apiService.get('/tnzmain/embeddedurl?taskflow=' + this.taskFlowId + '&location=' + this.location + '&appVariables=' + JSON.stringify(this.parameters)).subscribe(res => {
				if (res.url)
					this.embeddedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
				else
					this.alertUtils.showAlerts('Could not retrieve embeded url');
			}, err => {
				this.alertUtils.showAlerts('Could not retrieve embeded url. ' + err.message);
			});
		}
	}

	ngOnDestroy() {
	}

}
