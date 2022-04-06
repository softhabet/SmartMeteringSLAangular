import { FormBuilder } from '@angular/forms';

export function requiredList(fromControl) {
  return fromControl.value && fromControl.value.length ? null : {
    requiredList: {
      valid: false
    }
  };
}
