/** @format */

import {Injectable} from '@angular/core';
import {ValidatorFn, Validators} from '@angular/forms';
import {DynamicJsonValidator} from '../models/dynamic-form-json-schema.model';

@Injectable({providedIn: 'root'})
export class DynamicValidatorFactoryService {
   create(validators: DynamicJsonValidator[] = []): ValidatorFn[] {
      return validators.map(validator => {
         switch (validator.type) {
            case 'required':
               return Validators.required;
            case 'requiredTrue':
               return Validators.requiredTrue;
            case 'email':
               return Validators.email;
            case 'min':
               return Validators.min(validator.value);
            case 'max':
               return Validators.max(validator.value);
            case 'minLength':
               return Validators.minLength(validator.value);
            case 'maxlength':
            case 'maxLength':
               return Validators.maxLength(validator.value);
            case 'pattern':
               return Validators.pattern(validator.value);
            case 'nullValidator':
            default:
               return Validators.nullValidator;
         }
      });
   }
}
