import { FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';

export function requiredList(fromControl) {
  return fromControl.value && fromControl.value.length ? null : {
    requiredList: {
      valid: false
    }
  };
}

export function timeRequired(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) {
      return  { required: true };
    }
    return null;
  };
}
