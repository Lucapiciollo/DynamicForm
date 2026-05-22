/** @format */

import { Injectable } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { DynamicJsonValidator } from '../models/dynamic-form-json-schema.model';

/**
 * Factory per la creazione di `ValidatorFn` di Angular a partire da descrittori JSON.
 *
 * Consente di definire le validazioni direttamente nello schema JSON del form
 * senza dover scrivere codice Angular specifico.
 *
 * Tipi supportati: `required`, `requiredTrue`, `email`, `min`, `max`,
 * `minLength`, `maxLength`, `pattern`, `nullValidator`.
 */
@Injectable({ providedIn: 'root' })
export class DynamicValidatorFactoryService {
   /**
    * Converte un array di descrittori `DynamicJsonValidator` in un array di `ValidatorFn`.
    *
    * I descrittori non riconosciuti vengono mappati a `Validators.nullValidator`
    * per evitare eccezioni runtime.
    *
    * @param validators - Array di descrittori di validazione provenienti dallo schema JSON.
    * @returns Array di `ValidatorFn` pronti per essere passati a un `FormControl`.
    */
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
