/** @format */

import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ConfigForm, Form, TYPE_CONTROL_FORM, Utility } from '../dynamic-form.interface';

/**
 * Contesto passato a tutti gli handler di eventi dei campi del DynamicForm.
 *
 * Ogni campo può registrare handler per `onChange`, `onInitialize`, `opened`,
 * `closed`, `action` e `remoteData`. Tutti ricevono questo contesto che fornisce
 * accesso completo al form corrente e all'intera struttura dei gruppi.
 */
export interface DynamicFieldEventContext {
   idGroup: number;
   idForm: number;
   formControl: FormControl | FormArray | FormGroup;
   formName: string;
   formGroup: Array<Form>;
   type: TYPE_CONTROL_FORM;
   prevValue?: any;
   allGroup: ConfigForm;
   paging?: { count: number; page: number; totalCount?: number };
   onOptionSetted?: any;
   utility: Utility;
   param?: any;
   externalStore?: any;
   [key: string]: any;
}

/** Firma di un handler per eventi di campo (onChange, onInitialize, remoteData, ecc.). */
export type DynamicFieldEventHandler = (ctx: DynamicFieldEventContext) => void;
/** Firma di un handler per i pulsanti di azione di un gruppo. */
export type DynamicActionEventHandler = (ctx: { questions: Array<Form>; idForm: string; formGroup: FormGroup | FormArray }) => void;
