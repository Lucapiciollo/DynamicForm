/** @format */

import {DynamicFormRuntimeConfig} from '../providers/dynamic-form.providers';

const OPERATORS = Array.from({length: 75}).map((_, index) => ({
   id: index + 1,
   description: `Operatore ${String(index + 1).padStart(2, '0')}`,
   role: index % 3 === 0 ? 'Responsabile' : index % 3 === 1 ? 'Tecnico' : 'Amministrazione',
}));

function getOperatorsPage(param: any) {
   const page = Number(param?.page ?? 1);
   const count = Number(param?.count ?? 10);
   const search = String(param?.search ?? '').toLowerCase().trim();
   const filtered = search
      ? OPERATORS.filter(op => `${op.description} ${op.role}`.toLowerCase().includes(search))
      : OPERATORS;
   const start = (page - 1) * count;
   return {
      items: filtered.slice(start, start + count),
      totalCount: filtered.length,
   };
}

export const DYNAMIC_FORM_TEST_EVENTS: DynamicFormRuntimeConfig = {
   events: {
      logFieldChange: ctx => {
         console.log('JSON change event:', ctx.formName, ctx.formControl?.value, ctx.prevValue);
      },

      initOperatorsPage: ctx => {
         ctx.onOptionSetted?.set?.(getOperatorsPage({page: 1, count: 10}));
      },

      loadOperatorsPage: ctx => {
         console.log('JSON remoteData COMBOPAGINATE:', ctx.param);
         setTimeout(() => {
            ctx.externalStore?.set?.(getOperatorsPage(ctx.param));
         }, 180);
      },
   },

   actions: {
      readGroupValues: ctx => {
         console.log('JSON action:', ctx.idForm, ctx.formGroup?.value);
      },
   },
};
