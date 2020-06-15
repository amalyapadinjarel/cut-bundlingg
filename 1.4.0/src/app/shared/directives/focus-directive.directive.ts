import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[trendzAutoFocus]'
})
export class FocusDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { };

  ngAfterViewInit() {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    })
  }
}
