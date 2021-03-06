import { creditCard } from './validator';
import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';


const CREDIT_CARD_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => CreditCardValidator),
  multi: true
};

@Directive({
  selector: '[creditCard][formControlName],[creditCard][formControl],[creditCard][ngModel]',
  providers: [CREDIT_CARD_VALIDATOR]
})
export class CreditCardValidator implements Validator {
  validate(c: AbstractControl): {[key: string]: any} {
    return creditCard(c);
  }
}
