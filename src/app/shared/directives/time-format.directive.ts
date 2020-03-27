import { Directive, HostListener } from "@angular/core";
import { NgControl, AbstractControl } from "@angular/forms";

@Directive({
    selector: '[trendzTimeFormat]'
})

export class TimeFormatDirective {

    constructor(private control: NgControl) {
    }

    get ctrl() {
        return this.control.control;
    }

    convertToTime(fc: AbstractControl) {
        if (fc.hasError('format')) {
            let time = fc.value;
            let regex = new RegExp("^\\d*$");
            if (time && time.length <= 4 && regex.test(time)) {
                let hour, min = 0;
                if (time.length == 1)
                    hour = Number(time[0]);
                else
                    hour = Number(time[0] + time[1]);
                if (time.length == 3)
                    min = Number(time[2]);
                else if (time.length == 4)
                    min = Number(time[2] + time[3]);
                time = (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min);
                fc.setValue(time);
            }
        }
    }

    @HostListener("blur")
    onBlur() {
        if (this.control && this.ctrl && this.ctrl.value) {
            this.convertToTime(this.ctrl)
        }
    }

}