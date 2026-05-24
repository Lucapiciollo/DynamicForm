/** @format */

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicFormRuntimeConfig } from 'projects/dynamicform/src/lib/providers/dynamic-form.providers';
import { TYPE_CONTROL_FORM } from 'projects/dynamicform/src/public-api';

// ---------------------------------------------------------------------------
// Factory per un gruppo-indirizzo (Group config + reactive FormGroup).
// `createRuntimeAddressGroup` e `addAddressRuntime` si referenziano a vicenda;
// le function declarations sono hoist-ate quindi l'ordine non è rilevante.
// ---------------------------------------------------------------------------

function createRuntimeAddressGroup(idx: number): { config: any; fg: FormGroup } {
   const via   = new FormControl(null, Validators.required);
   const citta = new FormControl(null, Validators.required);
   const cap   = new FormControl(null, Validators.pattern(/^[0-9]{5}$/));
   const fg = new FormGroup({ via, citta, cap });

   const config = {
      title: `Indirizzo ${idx}`,
      class: ['row'],
      formGroup: [
         { formAction: { formName: 'via',   type: TYPE_CONTROL_FORM.TEXT, title: 'Via',   formControl: via,   css: { class: ['col-12'] } } },
         { formAction: { formName: 'citta', type: TYPE_CONTROL_FORM.TEXT, title: 'Città', formControl: citta, css: { class: ['col-md-8'] } } },
         { formAction: { formName: 'cap',   type: TYPE_CONTROL_FORM.TEXT, title: 'CAP',  formControl: cap,   css: { class: ['col-md-4'] } } },
      ],
      actions: [
         {
            label: 'Aggiungi indirizzo',
            visible: true,
            action: (questions: any, idForm: string, fg: FormGroup | FormArray) =>
               addAddressRuntime(questions, idForm, fg),
         },
      ],
   };

   return { config, fg };
}

function addAddressRuntime(questions: any, _idForm: string, formGroup: FormGroup | FormArray): void {
   const configForm = questions as any[];
   if (!configForm?.length) return;

   const parentGroup = configForm[0];
   const indirizzoField = (parentGroup.formGroup as any[]).find(
      (f: any) => f.formAction?.formName === 'indirizzo',
   );
   if (!indirizzoField?.formAction?.formGroup) return;

   const idx = (indirizzoField.formAction.formGroup as any[]).length + 1;
   const { config, fg } = createRuntimeAddressGroup(idx);

   // 1. Aggiunge il gruppo config a indirizzo.formGroup (rendering visivo)
   indirizzoField.formAction.formGroup.push(config);

   // 2. Aggiunge il FormGroup al FormArray in rootFormGroup.get('indirizzo')
   if (formGroup instanceof FormGroup) {
      const indirizzoArray = formGroup.get('indirizzo') as FormArray;
      if (indirizzoArray instanceof FormArray) {
         indirizzoArray.push(fg);
      }
   }

   console.log(`[APP JSON] Aggiunto indirizzo ${idx}`);
}

// ---------------------------------------------------------------------------

export const DYNAMIC_FORM_NESTED_EVENTS: DynamicFormRuntimeConfig = {
   events: {
      logFieldChange: ctx => {
         console.log('JSON change event:', ctx.formName, ctx.formControl?.value, ctx.prevValue);
      },
   },

   actions: {
      onSave: ctx => {
         console.log('[APP JSON] Salva:', ctx.formGroup instanceof FormGroup ? ctx.formGroup.getRawValue() : ctx.formGroup?.value);
      },
      onCancel: ctx => {
         console.log('[APP JSON] Annulla');
      },
      addAddress: ctx => addAddressRuntime(ctx.questions, ctx.idForm, ctx.formGroup),
   },
};
