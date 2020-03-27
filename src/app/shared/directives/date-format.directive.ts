import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
    selector: '[trendzDateFormat]'
})



export class InputDateFilterDirective {

    error;

    constructor(private _el: ElementRef, private control: NgControl) {
    }

    get ctrl() {
        return this.control.control;
    }

    @HostListener("blur")
    onBlur() {
        if (this.control && this.ctrl && this.ctrl.value) {
            this.ctrl.setValue(this.ctrl.value);
        }
    }
    @HostListener("keyup")
    onChange() {
        if (this.control && this.ctrl) {
            if (!this.ctrl.value && this._el.nativeElement.value) {
                this.ctrl.setErrors({ invalid: true });
                if (!this.error) {
                    this.error = document.createElement('mat-error');
                    this.error.setAttribute("class", "mat-error ng-star-inserted");
                    this._el.nativeElement.parentNode.parentNode.parentNode.getElementsByClassName("mat-form-field-subscript-wrapper")[0].append(this.error);
                }
                this.error.innerText = 'Enter a valid date';
            } else {
                if (this.error) {
                    this.error.innerText = '';
                }
            }
        }
    }
}