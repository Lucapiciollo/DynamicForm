/** @format */

import {Injectable} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {DynamicJsonCondition} from '../models/dynamic-form-json-schema.model';

@Injectable({providedIn: 'root'})
export class DynamicConditionEvaluatorService {
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
