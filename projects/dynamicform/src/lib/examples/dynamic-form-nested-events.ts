/** @format */

import {FormArray, FormGroup} from '@angular/forms';
import {DynamicFormRuntimeConfig} from '../providers/dynamic-form.providers';
import {nestedActionsFormHelpers} from './nested-actions-form.builder';

const {groupAt, controlAt, collectFormErrors} = nestedActionsFormHelpers;

export const DYNAMIC_FORM_NESTED_EVENTS: DynamicFormRuntimeConfig = {
   events: {
      logFieldChange: ctx => {
         console.log('JSON change event:', ctx.formName, ctx.formControl?.value, ctx.prevValue);
      },
   },

   actions: {
      validateRegistry: ctx => {
         const registry = groupAt(ctx.formGroup as FormGroup | FormArray, 'registry');
         registry?.markAllAsTouched();
         console.log('JSON registry valid:', registry?.valid);
         console.log('JSON registry value:', registry?.value);
      },

      patchRegistry: ctx => {
         const registry = groupAt(ctx.formGroup as FormGroup | FormArray, 'registry');
         registry?.patchValue({firstName: 'Luca', lastName: 'Piciollo', email: 'luca.json@test.it', phone: '3331234567', gender: 'M', active: true});
         console.log('JSON patch anagrafica eseguito');
      },

      calculateTotal: ctx => {
         const amounts = groupAt(ctx.formGroup as FormGroup | FormArray, 'contract.amounts');
         const taxable = Number(amounts?.get('taxable')?.value ?? 0);
         const vat = Number(amounts?.get('vat')?.value ?? 0);
         controlAt(ctx.formGroup as FormGroup | FormArray, 'contract.amounts.total')?.setValue(Number((taxable + taxable * vat / 100).toFixed(2)));
      },

      readWholeForm: ctx => {
         console.log('JSON formGroup:', ctx.formGroup);
         console.log('JSON value:', ctx.formGroup?.value);
         console.log('JSON raw value:', ctx.formGroup instanceof FormGroup ? ctx.formGroup.getRawValue() : ctx.formGroup?.value);
         console.log('JSON errors:', collectFormErrors(ctx.formGroup));
      },
   },
};
