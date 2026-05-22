/** @format */

import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { DynamicJsonCondition } from '../models/dynamic-form-json-schema.model';

/**
 * Servizio per la valutazione di condizioni dichiarative JSON sul form.
 *
 * Usato per implementare `visibleWhen` e `disabledWhen` nei campi dello schema JSON:
 * ogni condizione specifica un campo da osservare, un operatore e un valore di confronto.
 * Tutte le condizioni devono essere soddisfatte (AND logico).
 *
 * Operatori supportati: `eq`, `neq`, `in`, `notIn`, `truthy`, `falsy`,
 * `gt`, `gte`, `lt`, `lte`.
 */
@Injectable({ providedIn: 'root' })
export class DynamicConditionEvaluatorService {
   /**
    * Valuta un array di condizioni rispetto al form corrente.
    *
    * @param conditions - Array di condizioni da valutare. Array vuoto = sempre `true`.
    * @param form - Il `FormGroup` o `FormArray` di Angular da cui leggere i valori dei campi.
    * @returns `true` se tutte le condizioni sono soddisfatte, `false` altrimenti.
    */
   evaluate(conditions: DynamicJsonCondition[] = [], form: FormGroup | FormArray): boolean {
      if (!conditions.length) return true;

      return conditions.every(condition => {
         const value = form.get(condition.field)?.value;

         switch (condition.operator) {
            case 'eq':
               return value === condition.value;
            case 'neq':
               return value !== condition.value;
            case 'in':
               return Array.isArray(condition.value) && condition.value.includes(value);
            case 'notIn':
               return Array.isArray(condition.value) && !condition.value.includes(value);
            case 'truthy':
               return !!value;
            case 'falsy':
               return !value;
            case 'gt':
               return value > condition.value;
            case 'gte':
               return value >= condition.value;
            case 'lt':
               return value < condition.value;
            case 'lte':
               return value <= condition.value;
            default:
               return true;
         }
      });
   }
}
