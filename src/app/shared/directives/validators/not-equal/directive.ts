import { Directive, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

import { notEqual  } from './validator';

const NOT_EQUAL_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NotEqualValidator),
  multi: true
};

@Directive({
  selector: '[notEqual][formControlName],[notEqual][formControl],[notEqual][ngModel]',
  providers: [NOT_EQUAL_VALIDATOR]
})
export class NotEqualValidator implements Validator, OnInit, OnChanges {
  @Input() notEqual: any;

  private validator: ValidatorFn;
  private onChange: () => void;

  ngOnInit() {
    this.validator = notEqual(this.notEqual);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let key in changes) {
      if (key === 'notEqual') {
        this.validator = notEqual(changes[key].currentValue);
        if (this.onChange) this.onChange();
      }
    }
  }

  validate(c: AbstractControl): {[key: string]: any} {
    return this.validator(c);
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
