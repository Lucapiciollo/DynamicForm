/** @format */

import {FormControl, FormGroup} from '@angular/forms';

/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-17 08:56:52
 * @modify date 2022-03-17 08:56:52
 * @desc [description]
 */

const ErrorMessage = {
   required: 'Campo obbligatorio',
   email: 'E-mail non valida',
   mismatch: 'Le due password non coincidono',
   pressureError: 'Formato corretto 000/000',
   temperatureError: 'Formato corretto 00.0',
   max: 'Valore massimo: {0}',
   min: 'Valore minimo: {0}',
   conflictTask: 'Codice task già presente',
   ERROR_NO_ONLY_SPACE: 'Inserire un valore valido',
   ERROR_DECIMAL_IS_PRESENT: 'Non sono ammessi valori decimali',
};
/************************************************************************************************************************************************************* */

/**
 * @author @l.piciollo
 * @param formGroup
 * @param formName
 * @returns Array<string>
 * si occupa di controllare in un formGroup, gli errori di validazione riscontrati per un determinato controller
 */
export function GetErrorForm(formGroup: FormGroup = new FormGroup({}), formName: string): Array<string> {
   try {
      if (formName != null && !formGroup.get(formName)?.valid && (formGroup.get(formName)?.dirty || formGroup.get(formName)?.touched)) {
         return Object.keys(formGroup!.get(formName)!.errors!).map(e => {
            try {
               let msg = (ErrorMessage as any)[e];
               if (formGroup.get(formName)!.errors![e].requiredLength) msg = (ErrorMessage as any).replace('{0}', formGroup.get(formName)!.errors![e].requiredLength);
               if (formGroup.get(formName)!.errors![e].min) {
                  msg = (ErrorMessage as any).replace('{0}', formGroup.get(formName)!.errors![e].min);
               }
               if (formGroup.get(formName)!.errors![e].max) {
                  msg = (ErrorMessage as any).replace('{0}', formGroup.get(formName)!.errors![e].max);
               }
               if (formGroup.get(formName)!.errors![e].minCurrency) {
                  msg = (ErrorMessage as any).replace('{0}', formGroup.get(formName)!.errors![e].minCurrency);
               }
               return msg;
            } catch (e) {}
         });
      } else if (!formGroup.valid && formName == null && formGroup.dirty) {
         return Object.keys(formGroup!.errors!).map(e => {
            try {
               let msg = (ErrorMessage as any)[e];
               return msg;
            } catch (e) {}
         });
      } else return [];
   } catch (e) {
      return [];
   }
}
/************************************************************************************************************************************************************* */
/**
 * @author @l.piciollo
 * @param formControl
 * @returns Array<string>
 * si occupa di controllare in un formControl, gli errori di validazione riscontrati
 */
export function GetErrorFormControl(formControl: FormControl): Array<string> {
   try {
      if (formControl && !formControl.valid && (formControl?.dirty || formControl?.touched)) {
         return Object.keys(formControl.errors!)
            .filter(key => {
               return (ErrorMessage as any)[key] != null;
            })
            .map(e => {
               try {
                  let msg = (ErrorMessage as any)[e];
                  if (formControl.errors![e].requiredLength) msg = (ErrorMessage as any).replace('{0}', formControl.errors![e].requiredLength);
                  else if (formControl.errors![e].min) {
                     msg = (ErrorMessage as any).min.replace('{0}', formControl.errors![e].min);
                  } else if (formControl.errors![e].max) {
                     msg = (ErrorMessage as any).max.replace('{0}', formControl.errors![e].max);
                  } else if (formControl.errors![e].minCurrency) {
                     msg = (ErrorMessage as any).minCurrency.replace('{0}', formControl.errors![e].minCurrency);
                  }
                  return msg;
               } catch (e) {}
            });
      } else return [];
   } catch (e) {
      return [];
   }
}
/************************************************************************************************************************************************************* */
/**
 * @author @l.piciollo
 * @param formControl
 * @returns Array<string>
 * si occupa di controllare in un formControl, gli errori di validazione riscontrati
 */
export function GetErrorFormControlFromObj(objErrors: Object): Array<string> {
   try {
      return Object.keys(objErrors!).map(key => {
         try {
            let msg = (ErrorMessage as any)[key];
            return msg;
         } catch (e) {}
      });
   } catch (e) {
      return [];
   }
}
/************************************************************************************************************************************************************* */
