/** @format */

import {ValidatorFn, AbstractControl} from '@angular/forms';

export function isOptionValid(formAction: any): ValidatorFn {
   return (formControl: AbstractControl): any => {
      try {
         if (formControl.value != null && !(formControl.value instanceof Array)) {
            let option = formAction.options.find(f => f.id == formControl.value);
            if (option == null) {
               return {ERROR_OPTION_NOT_VALID: {data: formControl.value}};
            }
            // else {
            //   formControl.setValue(option.id, { emitEvent: false })
            // }
         }
      } catch (e) {}
   };
}
