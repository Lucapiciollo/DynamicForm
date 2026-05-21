/** @format */

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
   ConfigForm,
   FormAction,
   TYPE_CONTROL_FORM,
} from '../dynamic-form.interface';
import { signal } from '@angular/core';

function logEvent(name: string, data?: any): void {
   console.groupCollapsed(
      `%c[FORM TEST] ${name}`,
      'color:#7c5f2b;font-weight:bold',
   );
   console.log(data);
   console.groupEnd();
}

function createPagedOptions(
   prefix: string,
   page: number,
   count: number,
   search?: string | null,
): Array<any> {
   const start = (page - 1) * count;
   const cleanSearch = search?.trim();

   return Array.from({ length: count }).map((_, index) => {
      const id = start + index + 1;

      return {
         id,
         description: cleanSearch
            ? `${prefix} ${id} - ricerca: ${cleanSearch}`
            : `${prefix} ${id}`,
      };
   });
}

function createMockRemoteData(prefix: string, totalCount = 250) {
   return ({ param, externalStore }: any) => {
      const page = Number(param?.page ?? 1);
      const count = Number(param?.count ?? 25);
      const search = param?.search ?? param?.description ?? null;
      const append = param?.append === true;

      const items = createPagedOptions(prefix, page, count, search);

      console.groupCollapsed(
         `%c[REMOTE DATA] ${prefix}`,
         'color:#0284c7;font-weight:bold',
      );
      console.log('param:', param);
      console.log('page:', page);
      console.log('count:', count);
      console.log('search:', search);
      console.log('append:', append);
      console.log('items:', items);
      console.groupEnd();

      if (append) {
         const current = externalStore.getFilterOption?.() ?? [];
         const merged = [...current, ...items];

         externalStore.setFilteredOptions?.(merged, {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         });

         externalStore.setTotalOptions?.(merged, {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         });
      } else {
         externalStore.setFilteredOptions?.(items, {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         });

         externalStore.setTotalOptions?.(items, {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         });
      }

      externalStore.setIsLoading?.(false);

      return {
         items,
         totalCount,
         page,
         count,
      };
   };
}

/**
 * Helper importante:
 * Il renderer vecchio legge field.formAction.
 * La tipizzazione nuova magari non lo riconosce.
 * Quindi per il test lo forziamo con any.
 */
function field(formAction: any): any {
   return {
      formAction,
   };
}

function createFormConfiguration(): any[] {
   return [
      field({
         title: 'Nome',
         translateId: 'test-first-name',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: '', disabled: false },
            {
               updateOn: 'change',
               validators: [Validators.required],
            },
         ),

         formName: 'firstName',
         type: TYPE_CONTROL_FORM.TEXT,
         resetButton: true,

         onInitialize(
            idGroup: number,
            idForm: number,
            formControl: FormControl | FormArray | FormGroup,
            formName: string,
            formGroup: any[],
            type: TYPE_CONTROL_FORM,
            allGroup: ConfigForm,
            utilityOrPaging?: any,
            maybeOnOptionSetted?: any,
            maybeUtility?: any,
         ) {
            logEvent('firstName:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
               formGroup,
               allGroup,
               utilityOrPaging,
               maybeOnOptionSetted,
               maybeUtility,
            });
         },

         onChange(
            idGroup: number,
            idForm: number,
            formControl: FormControl | FormArray | FormGroup,
            formName: string,
            formGroup: any[],
            type: TYPE_CONTROL_FORM,
            prevValue: any,
            allGroup: ConfigForm,
            utility: any,
         ) {
            logEvent('firstName:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
               valid: formControl.valid,
               errors: formControl.errors,
            });

            utility?.getActionByName?.('Reset', (action: any) => {
               action.disabled = formControl.parent?.pristine ?? false;
            });
         },

         action(formControl: FormControl | FormArray | FormGroup) {
            logEvent('firstName:action', {
               value: formControl.value,
            });
         },
      }),

      field({
         title: 'Età',
         translateId: 'test-age',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: null, disabled: false },
            {
               updateOn: 'change',
               validators: [Validators.min(18)],
            },
         ),

         formName: 'age',
         type: TYPE_CONTROL_FORM.NUMBER,
         resetButton: true,

         optionNumber: {
            min: 0,
            step: 1,
         },

         onInitialize(
            idGroup: number,
            idForm: number,
            formControl: FormControl | FormArray | FormGroup,
            formName: string,
            formGroup: any[],
            type: TYPE_CONTROL_FORM,
            allGroup: ConfigForm,
            utilityOrPaging?: any,
            maybeOnOptionSetted?: any,
            maybeUtility?: any,
         ) {
            logEvent('age:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
               formGroup,
               allGroup,
               utilityOrPaging,
               maybeOnOptionSetted,
               maybeUtility,
            });
         },

         onChange(
            idGroup: number,
            idForm: number,
            formControl: FormControl | FormArray | FormGroup,
            formName: string,
            formGroup: any[],
            type: TYPE_CONTROL_FORM,
            prevValue: any,
            allGroup: ConfigForm,
            utility: any,
         ) {
            logEvent('age:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
               valid: formControl.valid,
               errors: formControl.errors,
            });

            utility?.getActionByName?.('Reset', (action: any) => {
               action.disabled = formControl.parent?.pristine ?? false;
            });
         },

         action(formControl: FormControl | FormArray | FormGroup) {
            logEvent('age:action', {
               value: formControl.value,
            });
         },
      }),
      field({
         title: 'Note',
         translateId: 'test-notes',
         placeholder: 'Scrivi una nota',

         css: {
            class: ['col-12', 'px-1'],
            rows: 4,
         },

         formControl: new FormControl(
            { value: '', disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'notes',
         type: TYPE_CONTROL_FORM.TEXTAREA,
         resetButton: true,

         optionInputText: {
            maxlength: 300,
         },

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('notes:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('notes:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('notes:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('notes:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               valid: formControl.valid,
               errors: formControl.errors,
            });

            formControl.markAsTouched();
            formControl.updateValueAndValidity();
         },
      } as FormAction),
      field({
         title: 'Data nascita',
         translateId: 'test-birth-date',
         placeholder: 'Seleziona data',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: null, disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'birthDate',
         type: TYPE_CONTROL_FORM.DATA,
         resetButton: true,

         optionDate: {
            min: '1900-01-01',
            max: '2100-12-31',
         },

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('birthDate:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('birthDate:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         opened(idGroup, idForm, formControl, formName) {
            logEvent('birthDate:opened', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         closed(idGroup, idForm, formControl, formName) {
            logEvent('birthDate:closed', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('birthDate:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('birthDate:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },
      } as FormAction),
      field({
         title: 'Fascia oraria',
         translateId: 'test-date-time',
         placeholder: 'Seleziona fascia',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: null, disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'dateTimeSlot',
         type: TYPE_CONTROL_FORM.DATETIME,
         resetButton: true,

         options: [
            { id: 'morning', description: 'Mattina' },
            { id: 'afternoon', description: 'Pomeriggio' },
            { id: 'evening', description: 'Sera' },
         ],

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('dateTimeSlot:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('dateTimeSlot:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         opened(idGroup, idForm, formControl, formName) {
            logEvent('dateTimeSlot:opened', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         closed(idGroup, idForm, formControl, formName) {
            logEvent('dateTimeSlot:closed', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('dateTimeSlot:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('dateTimeSlot:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },
      } as FormAction),
      field({
         title: 'Orario preferito',
         translateId: 'test-time',
         placeholder: 'Seleziona orario',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: null, disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'preferredTime',
         type: TYPE_CONTROL_FORM.TIME,
         resetButton: true,

         options: [
            { id: '08:00', description: '08:00' },
            { id: '09:00', description: '09:00' },
            { id: '10:00', description: '10:00' },
            { id: '11:00', description: '11:00' },
            { id: '12:00', description: '12:00' },
            { id: '15:00', description: '15:00' },
            { id: '16:00', description: '16:00' },
            { id: '17:00', description: '17:00' },
         ],

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('preferredTime:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('preferredTime:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         opened(idGroup, idForm, formControl, formName) {
            logEvent('preferredTime:opened', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         closed(idGroup, idForm, formControl, formName) {
            logEvent('preferredTime:closed', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('preferredTime:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('preferredTime:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },
      } as FormAction),
      field({
         title: 'Tipo cliente',
         translateId: 'test-customer-type',
         placeholder: 'Cerca tipo cliente',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: null, disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'customerType',
         type: TYPE_CONTROL_FORM.COMBO,
         resetButton: true,
         autocomplete: true,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         },

         options: signal([
            { id: 'private', description: 'Privato' },
            { id: 'company', description: 'Azienda' },
            { id: 'pa', description: 'Pubblica amministrazione' },
            { id: 'freelance', description: 'Professionista' },
         ]),

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('customerType:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('customerType:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         opened(idGroup, idForm, formControl, formName) {
            logEvent('customerType:opened', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         closed(idGroup, idForm, formControl, formName) {
            logEvent('customerType:closed', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onSearch(idGroup, idForm, formControl, formName, formGroup, search) {
            logEvent('customerType:onSearch', {
               idGroup,
               idForm,
               formName,
               search,
            });
         },
      } as FormAction),
      field({
         title: 'Città paginata',
         translateId: 'test-city-paginated',
         placeholder: 'Cerca città',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: null, disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'cityId',
         type: TYPE_CONTROL_FORM.COMBOPAGINATE,
         resetButton: true,
         autocomplete: true,
         enableInfiniteScroll: true,
         pageSize: 25,
         scrollThreshold: 48,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         },

         options: signal([]),

         paramsForRemoteData: signal({
            page: 1,
            count: 25,
         }),

         paging: {
            page: 1,
            count: 25,
            totalCount: 250,
         },

         remoteData: createMockRemoteData('Città', 250),

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('cityId:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
               paging,
               onOptionSetted,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('cityId:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
               valid: formControl.valid,
               errors: formControl.errors,
            });
         },

         opened(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            allGroup,
            utility,
         ) {
            logEvent('cityId:opened', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         closed(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            allGroup,
            utility,
         ) {
            logEvent('cityId:closed', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onSearch(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            search,
            utility,
         ) {
            logEvent('cityId:onSearch', {
               idGroup,
               idForm,
               formName,
               search,
               value: formControl.value,
            });
         },

         onScrollEnd(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            paging,
            utility,
         ) {
            logEvent('cityId:onScrollEnd', {
               idGroup,
               idForm,
               formName,
               paging,
               value: formControl.value,
            });
         },
      } as FormAction),
      field({
         title: 'Contratto attivo',
         translateId: 'test-active',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
            classRadio: ['d-flex', 'align-items-center'],
         },

         formControl: new FormControl(
            { value: true, disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'active',
         type: TYPE_CONTROL_FORM.CHECKBOX,
         resetButton: true,

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('active:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('active:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('active:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('active:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },
      } as FormAction),
      field({
         title: 'Sesso',
         translateId: 'test-gender',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
            classRadio: ['d-flex', 'align-items-center'],
         },

         formControl: new FormControl(
            { value: 'not_specified', disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'gender',
         type: TYPE_CONTROL_FORM.RADIOGROUP,
         resetButton: true,

         options: signal([
            { id: 'male', description: 'Maschio' },
            { id: 'female', description: 'Femmina' },
            { id: 'not_specified', description: 'Non specificato' },
         ]),

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('gender:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('gender:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('gender:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('gender:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },
      } as FormAction),
      field({
         title: 'Documento',
         translateId: 'test-document',
         placeholder: 'Carica documento',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: null, disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'documentFile',
         type: TYPE_CONTROL_FORM.FILE,
         resetButton: true,

         accept: '.pdf,.png,.jpg,.jpeg',
         multiple: false,
         size: 10,

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('documentFile:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('documentFile:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('documentFile:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('documentFile:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         action(formControl) {
            logEvent('documentFile:action', {
               value: formControl.value,
            });
         },
      } as FormAction),
      field({
         title: 'Tag',
         translateId: 'test-tags',
         placeholder: 'Aggiungi tag',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: ['demo', 'cliente'], disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'tags',
         type: TYPE_CONTROL_FORM.ARRAYSTRING,
         resetButton: true,

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('tags:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('tags:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('tags:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('tags:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         action(formControl) {
            logEvent('tags:action', {
               value: formControl.value,
            });
         },
      } as FormAction),
      field({
         title: 'Periodo contratto',
         translateId: 'test-contract-period',
         placeholder: 'Data inizio',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormGroup({
            from: new FormControl<Date | null>(null),
            to: new FormControl<Date | null>(null),
         }),

         formName: 'contractPeriod',
         type: TYPE_CONTROL_FORM.DATARANGE,
         resetButton: true,

         optionDate: {
            min: '1900-01-01',
            max: '2100-12-31',
            onClose: (value, formGroup) => {
               logEvent('contractPeriod:optionDate:onClose', {
                  value,
                  formGroupValue: formGroup.value,
               });
            },
         },

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('contractPeriod:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('contractPeriod:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         opened(idGroup, idForm, formControl, formName) {
            logEvent('contractPeriod:opened', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         closed(idGroup, idForm, formControl, formName) {
            logEvent('contractPeriod:closed', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('contractPeriod:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('contractPeriod:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onClose(value, formGroup, utility) {
            logEvent('contractPeriod:onClose', {
               value,
               formGroupValue: formGroup.value,
               utility,
            });
         },
      } as FormAction),
      field({
         title: 'Anno riferimento',
         translateId: 'test-year',
         placeholder: 'Seleziona anno',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: null, disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'referenceYear',
         type: TYPE_CONTROL_FORM.YEAR,
         resetButton: true,

         optionDate: {
            min: '1900-01-01',
            max: '2100-12-31',
         },

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('referenceYear:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('referenceYear:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         opened(idGroup, idForm, formControl, formName) {
            logEvent('referenceYear:opened', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         closed(idGroup, idForm, formControl, formName) {
            logEvent('referenceYear:closed', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('referenceYear:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('referenceYear:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },
      } as FormAction),
      field({
         title: 'Apri documento',
         label: 'Apri documento',
         translateId: 'test-link',
         placeholder: '',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
            iconCss: 'me-1',
         },

         formControl: new FormControl(
            { value: 'Documento demo', disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'documentLink',
         type: TYPE_CONTROL_FORM.LINK,

         href: 'https://www.google.com',
         target: '_blank',

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('documentLink:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('documentLink:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('documentLink:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('documentLink:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         action(formControl) {
            logEvent('documentLink:action', {
               value: formControl.value,
            });
         },
      } as FormAction),
      field({
         title: 'Etichetta informativa del form',
         label: 'Etichetta informativa del form',
         translateId: 'test-label',

         css: {
            class: ['col-12', 'px-1'],
            iconCss: 'me-1',
         },

         formControl: new FormControl(
            { value: 'Etichetta informativa del form', disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'infoLabel',
         type: TYPE_CONTROL_FORM.LABEL,

         tipContent: 'Questa è una label cliccabile di test',

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('infoLabel:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('infoLabel:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('infoLabel:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('infoLabel:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         action(formControl) {
            logEvent('infoLabel:action', {
               value: formControl.value,
            });
         },
      } as FormAction),
      field({
         title: 'Ordinamento',
         translateId: 'test-sort',
         placeholder: '',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-2', 'px-1'],
            iconCss: ['df-sort-icon'],
            toggleIcons: [
               'assets/icons/sort-asc.svg',
               'assets/icons/sort-desc.svg',
            ],
         },

         formControl: new FormControl(
            { value: 'ASC', disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'sortDirection',
         type: TYPE_CONTROL_FORM.SORTACTION,
         resetButton: false,

         onInitialize(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            allGroup,
            paging,
            onOptionSetted,
            utility,
         ) {
            logEvent('sortDirection:onInitialize', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               type,
            });
         },

         onChange(
            idGroup,
            idForm,
            formControl,
            formName,
            formGroup,
            type,
            prevValue,
            allGroup,
            utility,
         ) {
            logEvent('sortDirection:onChange', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
               prevValue,
            });
         },

         onFocus(idGroup, idForm, formControl, formName) {
            logEvent('sortDirection:onFocus', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         onBlur(idGroup, idForm, formControl, formName) {
            logEvent('sortDirection:onBlur', {
               idGroup,
               idForm,
               formName,
               value: formControl.value,
            });
         },

         toggleAction(direction) {
            logEvent('sortDirection:toggleAction', {
               direction,
            });
         },

         action(formControl) {
            logEvent('sortDirection:action', {
               value: formControl.value,
            });
         },
      } as FormAction),

   ];
}

export function buildUltraSafeNestedActionsForm(): ConfigForm {
   return [
      {
         formGroup: [...createFormConfiguration()],

         actions: [
            {
               label: 'Reset',
               cssClassButton: ['btn', 'btn-secondary', 'mx-1'],
               disabled: false,
               visible: true,

               action: (
                  questions: any[],
                  idForm: string,
                  formGroup: FormGroup | FormArray,
               ) => {
                  logEvent('ACTION:Reset', {
                     questions,
                     idForm,
                     value: formGroup.value,
                  });

                  formGroup.reset();
                  formGroup.markAsPristine();
               },
            },

            {
               label: 'Patch demo',
               cssClassButton: ['btn', 'btn-primary', 'mx-1'],
               disabled: false,
               visible: true,

               action: (
                  questions: any[],
                  idForm: string,
                  formGroup: FormGroup | FormArray,
               ) => {
                  logEvent('ACTION:Patch demo', {
                     questions,
                     idForm,
                     value: formGroup.value,
                  });

                  if (formGroup instanceof FormGroup) {
                     formGroup.patchValue({
                        firstName: 'Luca',
                        age: 40,
                     });
                  }
               },
            },
         ],
      },
   ] as any;
}