import { Directive, HostBinding, Input, OnChanges, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ApiServiceV4 } from '../services/api-v4.service';


@Directive({
	selector: '[pImage]',
})
export class ImageDirective implements OnChanges {

	@HostBinding('src') src;

	@Input() imageUrl: string;
	@Input() module: string;
	constructor(private sanitizer: DomSanitizer
		, private apiService: ApiServiceV4) {

	}

	@HostListener('error') onError() {
		this.src = this.sanitizer.bypassSecurityTrustUrl('assets/images/avatars/no-user.jpg');
	}

	ngOnChanges() {
		if (this.imageUrl.startsWith('/images/persons/')) {
			this.src = this.sanitizer.bypassSecurityTrustUrl('/trendz-static-assets/profile-pic/' + this.imageUrl.replace('/images/persons/', '') + '.jpg');
		}
		else {
			this.src = this.sanitizer.bypassSecurityTrustUrl('assets/images/avatars/no-user.jpg');
			this.apiService.getImage(this.imageUrl)
				.subscribe(
					data => {
						if (data.text()) {
							this.src = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + data.text());
						}

					},
					errorResponse => {
						null;
					}
				);
		}
	}

	updateImage(data) {
		this.src = data;
	}

}
