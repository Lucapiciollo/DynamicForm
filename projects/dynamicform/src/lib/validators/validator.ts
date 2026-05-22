/** @format */

import { ValidatorFn, AbstractControl } from '@angular/forms';

/**
 * Validator custom che verifica che il valore selezionato in un campo combo
 * esista effettivamente nell'elenco delle opzioni disponibili.
 *
 * Utile per prevenire valori "orfani" quando le opzioni vengono aggiornate
 * dinamicamente dopo che il form è già stato compilato.
 *
 * @param formAction - L'azione del form contenente l'array `options` corrente.
 * @returns `ValidatorFn` che restituisce `{ ERROR_OPTION_NOT_VALID: { data } }` se
 *          il valore non è presente nelle opzioni, `null` altrimenti.
 */
export function isOptionValid(formAction: any): ValidatorFn {
   return (formControl: AbstractControl): any => {
      try {
         if (formControl.value != null && !(formControl.value instanceof Array)) {
            let option = formAction.options.find(f => f.id == formControl.value);
            if (option == null) {
               return { ERROR_OPTION_NOT_VALID: { data: formControl.value } };
            }
            // else {
            //   formControl.setValue(option.id, { emitEvent: false })
            // }
         }
      } catch (e) { }
   };
}
