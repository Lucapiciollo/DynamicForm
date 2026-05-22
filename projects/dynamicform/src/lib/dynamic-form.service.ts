/** @format */

import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { ConfigForm, TYPE_CONTROL_FORM } from './dynamic-form.interface';

/**
 * Servizio che converte una `ConfigForm` in una struttura `FormArray` di Angular Reactive Forms.
 *
 * Istanziato come provider locale del `DynamicFormComponent` (non singleton),
 * così ogni istanza del form ha il proprio stato di validazione isolato.
 */
@Injectable()
export class StepperService {
   /**
    * Trasforma ricorsivamente la `ConfigForm` in un `FormArray`.
    *
    * Per ogni `Group` crea un `FormGroup` figlio; per ogni `Form` al suo interno
    * aggiunge il `FormControl` (o `FormArray` per i campi di tipo GROUP/nested)
    * come controllo nominato.
    *
    * @param questions - Array di gruppi che descrivono la struttura del form.
    * @param formArray - `FormArray` accumulatore; viene restituito al termine.
    * @returns Il `FormArray` popolato con tutti i controlli.
    */
   toFormGroup(questions: ConfigForm, formArray: FormArray<any> = new FormArray<any>([])): FormArray {
      questions?.forEach(question => {
         let uuid = uuidv4();
         if (question.formGroup) {
            formArray.push(new FormGroup({}));
            (question as any)['id'] = uuid;
            question.formGroup?.forEach(fg => {
               const action = fg.formAction;
               if (action.formGroup) {
                  action.type = TYPE_CONTROL_FORM.GROUP;
                  (formArray.controls[formArray.controls.length - 1] as FormGroup).addControl(action.formName as string, new FormArray<any>([]));
                  this.toFormGroup(action.formGroup, (formArray.controls[formArray.controls.length - 1] as FormGroup).get(action.formName as string) as FormArray);
               } else {
                  if (!action.formName) {
                     action.formName = uuidv4();
                  }
                  if (!action.formControl) {
                     action.formControl = new FormControl({ value: null, disabled: action.disabled ?? false });
                  }
                  (formArray.controls[formArray.controls.length - 1] as FormGroup).addControl(action.formName as string, action.formControl);
               }
            });
         }
      });
      return formArray;
   }
}
