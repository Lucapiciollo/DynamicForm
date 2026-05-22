/** @format */

import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ConfigForm, Form, TYPE_CONTROL_FORM, Utility} from '../dynamic-form.interface';

export interface DynamicFieldEventContext {
   idGroup: number;
   idForm: number;
   formControl: FormControl | FormArray | FormGroup;
   formName: string;
   formGroup: Array<Form>;
   type: TYPE_CONTROL_FORM;
   prevValue?: any;
   allGroup: ConfigForm;
   paging?: {count: number; page: number; totalCount?: number};
   onOptionSetted?: any;
   utility: Utility;
   param?: any;
   externalStore?: any;
   [key: string]: any;
}

export type DynamicFieldEventHandler = (ctx: DynamicFieldEventContext) => void;
export type DynamicActionEventHandler = (ctx: {questions: Array<Form>; idForm: string; formGroup: FormGroup | FormArray}) => void;
