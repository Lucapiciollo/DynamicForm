/** @format */

import {FormArray, FormGroup} from '@angular/forms';
import {DynamicFormRuntimeConfig} from '../providers/dynamic-form.providers';
import {nestedActionsFormHelpers} from './nested-actions-form.builder';

const {groupAt, controlAt, collectFormErrors} = nestedActionsFormHelpers;

type MockOperator = {
   id: number;
   description: string;
   role: string;
   department: string;
};

const JSON_MOCK_OPERATORS: MockOperator[] = Array.from({length: 75}).map((_, index) => {
   const id = index + 1;
   const roles = ['Tecnico', 'Amministrazione', 'Responsabile', 'Operatore'];
   const departments = ['Turni', 'HR', 'Contratti', 'Assistenza'];

   return {
      id,
      description: `Operatore ${id}`,
      role: roles[index % roles.length],
      department: departments[index % departments.length],
   };
});

function queryJsonMockOperators(param: any): {items: MockOperator[]; totalCount: number} {
   const count = Number(param?.count ?? param?.size ?? 10);
   const page = Math.max(Number(param?.page ?? 1), 1);
   const search = `${param?.search ?? ''}`.trim().toLowerCase();

   const filtered = search
      ? JSON_MOCK_OPERATORS.filter(item => `${item.description} ${item.role} ${item.department}`.toLowerCase().includes(search))
      : JSON_MOCK_OPERATORS;

   const start = (page - 1) * count;

   return {
      items: filtered.slice(start, start + count),
      totalCount: filtered.length,
   };
}

function writeJsonComboResult(ctx: any, result: {items: MockOperator[]; totalCount: number}): void {
   const store = ctx?.signalStore ?? ctx?.externalStore;
   const append = ctx?.param?.append === true;
   const keyCombo = {keyId: 'id', keyDescription: ['description', 'role', 'department']};

   const currentTotal = append && typeof store?.getTotalOptions === 'function' ? store.getTotalOptions() : [];
   const nextItems = append ? [...(Array.isArray(currentTotal) ? currentTotal : []), ...result.items] : result.items;

   store?.setTotalOptions?.({items: nextItems, totalCount: result.totalCount}, keyCombo);
   store?.setFilteredOptions?.({items: result.items, totalCount: result.totalCount}, keyCombo, append);
}

export const DYNAMIC_FORM_NESTED_EVENTS: DynamicFormRuntimeConfig = {
   events: {
      logFieldChange: ctx => {
         console.log('JSON change event:', ctx.formName, ctx.formControl?.value, ctx.prevValue);
      },

      loadOperatorsRemote: ctx => {
         const result = queryJsonMockOperators(ctx?.param);
         console.log('JSON COMBOPAGINATE remoteData:', ctx?.param, result);
         writeJsonComboResult(ctx, result);
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
         registry?.patchValue({
            firstName: 'Luca',
            lastName: 'Piciollo',
            email: 'luca.json@test.it',
            phone: '3331234567',
            birthDate: new Date(1983, 4, 20),
            appointmentSlot: '2026-05-21T10:30:00',
            gender: 'M',
            customerCategory: 'PRIVATE',
            active: true,
            privacy: true,
         });
         console.log('JSON patch anagrafica eseguito');
      },

      calculateTotal: ctx => {
         const taxable = Number(controlAt(ctx.formGroup as FormGroup | FormArray, 'contract.taxable')?.value ?? 0);
         const vat = Number(controlAt(ctx.formGroup as FormGroup | FormArray, 'contract.vat')?.value ?? 0);
         controlAt(ctx.formGroup as FormGroup | FormArray, 'contract.total')?.setValue(Number((taxable + taxable * vat / 100).toFixed(2)));
         controlAt(ctx.formGroup as FormGroup | FormArray, 'contract.total')?.disable();
      },

      readWholeForm: ctx => {
         console.log('JSON formGroup:', ctx.formGroup);
         console.log('JSON value:', ctx.formGroup?.value);
         console.log('JSON raw value:', ctx.formGroup instanceof FormGroup ? ctx.formGroup.getRawValue() : ctx.formGroup?.value);
         console.log('JSON errors:', collectFormErrors(ctx.formGroup));
      },

      validateAll: ctx => {
         ctx.formGroup?.markAllAsTouched();
         console.log('JSON valid:', ctx.formGroup?.valid);
         console.log('JSON errors:', collectFormErrors(ctx.formGroup));
      },
   },
};
