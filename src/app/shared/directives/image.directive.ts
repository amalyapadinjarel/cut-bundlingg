import { Directive, HostBinding, Input, OnChanges, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../services/api.service';



@Directive({
	selector: '[pImage]',
})
export class ImageDirective implements OnChanges {

	@HostBinding('src') src;

	@Input() imageUrl: string;
	@Input() module: string;
	@Input() default: string = 'avatars/no-user.jpg';
	constructor(private sanitizer: DomSanitizer
		, private apiService: ApiService) {

	}

	@HostListener('error') onError() {
		this.src = this.sanitizer.bypassSecurityTrustUrl('assets/images/' + this.default);
	}

	ngOnChanges() {
		if (this.imageUrl.startsWith('/images/persons/')) {
			this.src = this.sanitizer.bypassSecurityTrustUrl('/trendz-static-assets/profile-pic/' + this.imageUrl.replace('/images/persons/', '') + '.jpg');
		}
		else {
			this.src = this.sanitizer.bypassSecurityTrustUrl('assets/images/' + this.default);
			this.apiService.get(this.imageUrl)
				.subscribe(
					data => {
						if (data && data.image) {
							this.src = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + data.image);
						}

					},
					errorResponse => {
						console.log(errorResponse);
					}
				);
		}
	}

	updateImage(data) {
		this.src = data;
	}

}
