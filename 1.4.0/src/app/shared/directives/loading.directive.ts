import { Directive, HostBinding, Input, ElementRef, OnInit } from '@angular/core';


@Directive({
	selector: '[loadingPlaceholder]',
})
export class LoadingDirective implements OnInit {

	@Input() type = "dots";
	@Input() customClass = "";
	@Input() count;

	@HostBinding('class') class;

	constructor(private elementRef: ElementRef) {
	}

	ngOnInit() {
		if (this.type == "dots") {
			this.count = this.count ? this.count : 3;
			this.class = 'loading inline-dots ' + this.customClass;
			let html = '';
			for(let i = 0; i < this.count; i++) {
				html += '<span>.</span>';
			}
			this.elementRef.nativeElement.innerHTML = html;
		}
	}

}
