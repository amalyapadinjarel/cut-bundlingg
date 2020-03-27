import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable()
export class ValidatorUtilities {
    constructor() {
    }
    
    public static validateForm(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(key => {
            const fc = formGroup.get(key);
            if (fc.validator) {
                fc.markAsTouched();
            }
        });
    }

    public static shorCodeValidator(fc: FormControl) {
        let regex = new RegExp(/^[a-zA-Z0-9_]*$/);
        return fc.value && !regex.test(fc.value) ? { shortcode: true } : null;
    }

    public static emailValidator(fc: FormControl) {
        return fc.value ? Validators.email(fc) : null;
    }

    public static integerValidator(fc: FormControl) {
        let regex = new RegExp("^-?\\d*$");
        return fc.value && !regex.test(fc.value) ? { integer: true } : null;
    }

    public static positiveNumberValidator(fc: FormControl) {
        let regex = new RegExp(/^(?![0.]+$)\d+(\.\d{1,2})?$/);
        // ^\d + $
        return fc.value && !regex.test(fc.value) ? { pnum: true } : null;
    }

    public static numberValidator(fc: FormControl) {
        let regex = new RegExp("^-?\\d*\.?\\d*$");
        return fc.value && !regex.test(fc.value) ? { number: true } : null;
    }

    public static urlValidator(fc: FormControl) {
        let regex = new RegExp("/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi");
        return fc.value && !regex.test(fc.value) ? { url: true } : null;
    }

    public static yearValidator(fc: FormControl) {
        let regex = new RegExp("^\\d*$");
        return fc.value && (fc.value.toString().length != 4 || !regex.test(fc.value)) ? { year: true } : null;
    }
    
    public static timeValidator(fc: FormControl) {
        let time = fc.value;
        if (time) {
            let regex = new RegExp("[0-9][0-9]:[0-9][0-9]");
            let arr = time.split(':');
            if (regex.test(time) && time.length == 5) {
                let hour = Number(arr[0]);
                let min = Number(arr[1]);
                if (hour >= 24)
                    return { hour: true }
                else if (min >= 60)
                    return { min: true }
                else
                    return null;
            }
            return { format: true };
        }
    }

}