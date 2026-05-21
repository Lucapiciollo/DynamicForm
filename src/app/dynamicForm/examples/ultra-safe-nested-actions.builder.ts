/**
 * @format
 *
 * Configurazione demo completa per Dynamic Form.
 * Mantiene la struttura del file originale:
 * - field(formAction) => { formAction }
 * - createFormConfiguration() => any[]
 * - buildUltraSafeNestedActionsForm() => ConfigForm
 *
 * Cosa testa:
 * - input text
 * - number
 * - textarea
 * - checkbox
 * - radio
 * - currency
 * - date
 * - date range
 * - date time / year con fallback se l'enum cambia nome
 * - file
 * - label / link / separator
 * - array string
 * - combo normale
 * - combo con ricerca locale
 * - combo remota paginata
 * - multi combo Material standard
 * - multi combo checkbox Material
 * - multi combo checkbox remota paginata
 * - campi annidati / children
 * - indirizzi aggiungibili a runtime con pulsante +
 * - action finale che stampa il JSON in console
 */

import { signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { delay, of } from 'rxjs';
import { TYPE_CONTROL_FORM, ConfigForm, FormAction } from '../dynamic-form.interface';

 

function logEvent(name: string, data?: any): void {
   console.groupCollapsed(
      `%c[DYNAMIC FORM TEST] ${name}`,
      'color:#7c5f2b;font-weight:bold',
   );
   console.log(data);
   console.groupEnd();
}

function field(formAction: any): any {
   return {
      formAction,
   };
}

function typeControl(name: string, fallback: any = TYPE_CONTROL_FORM.TEXT): any {
   return (TYPE_CONTROL_FORM as any)[name] ?? fallback;
}

function firstType(names: string[], fallback: any = TYPE_CONTROL_FORM.TEXT): any {
   for (const name of names) {
      if ((TYPE_CONTROL_FORM as any)[name] !== undefined) {
         return (TYPE_CONTROL_FORM as any)[name];
      }
   }

   return fallback;
}

function createSimpleOptions(values: Array<[any, string]>): Array<any> {
   return values.map(([id, description]) => ({
      id,
      description,
   }));
}

function createOptions(prefix: string, total = 30): any[] {
   return Array.from({ length: total }).map((_, index) => {
      const id = index + 1;

      return {
         id,
         description: `${prefix} ${id}`,
      };
   });
}

function paginateItems<T>(items: T[], page: number, count: number): T[] {
   const start = (page - 1) * count;
   return items.slice(start, start + count);
}

function createMockRemoteData(prefix: string, totalCount = 250): any {
   const fullDataset = createOptions(prefix, totalCount);

   return ({ param }: any) => {
      const page = Number(param?.page ?? 1);
      const count = Number(param?.count ?? 10);
      const search = param?.search ?? param?.description ?? param?.q ?? '';
      const cleanSearch = String(search ?? '').trim().toLowerCase();

      const filteredDataset = cleanSearch
         ? fullDataset.filter(
              item =>
                 String(item.description).toLowerCase().includes(cleanSearch) ||
                 String(item.id).includes(cleanSearch),
           )
         : fullDataset;

      const items = paginateItems(filteredDataset, page, count);

      logEvent(`remoteData:${prefix}`, {
         param,
         page,
         count,
         search,
         filteredTotal: filteredDataset.length,
         items,
      });

      return of({
         items,
         totalCount: filteredDataset.length,
         page,
         count,
      }).pipe(delay(250));
   };
}

function getFormRawValue(formGroup: FormGroup | FormArray | any): any {
   if (formGroup?.getRawValue) {
      return formGroup.getRawValue();
   }

   return formGroup?.value ?? null;
}

function printJsonFromForm(source: FormGroup | FormArray | FormControl | any): void {
   let json: any = null;

   if (source instanceof FormGroup || source instanceof FormArray) {
      json = source.getRawValue();
   } else if (source instanceof FormControl) {
      const parent = source.parent;

      if (parent instanceof FormGroup || parent instanceof FormArray) {
         json = parent.getRawValue();
      } else {
         json = source.value;
      }
   } else if (source?.getRawValue) {
      json = source.getRawValue();
   } else if (source?.value !== undefined) {
      json = source.value;
   } else {
      json = source ?? null;
   }

   console.groupCollapsed(
      '%c[FORM TEST] JSON FINALE',
      'color:#16a34a;font-weight:bold',
   );
   console.log(json);
   console.log(JSON.stringify(json, null, 3));
   console.groupEnd();
}

function commonChangeLogger(name: string): any {
   return (
      idGroup: number,
      idForm: number,
      formControl: FormControl | FormArray | FormGroup,
      formName: string,
      formGroup: any[],
      type: TYPE_CONTROL_FORM,
      prevValue: any,
      allGroup: ConfigForm,
      utility: any,
   ) => {
      logEvent(`${name}:onChange`, {
         idGroup,
         idForm,
         formName,
         value: (formControl as any)?.value,
         prevValue,
         valid: (formControl as any)?.valid,
         errors: (formControl as any)?.errors,
         type,
         allGroup,
      });

      utility?.getActionByName?.('Reset', (action: any) => {
         action.disabled = (formControl as any)?.parent?.pristine ?? false;
      });
   };
}

function commonInitLogger(name: string): any {
   return (
      idGroup: number,
      idForm: number,
      formControl: FormControl | FormArray | FormGroup,
      formName: string,
      formGroup: any[],
      type: TYPE_CONTROL_FORM,
      allGroup: ConfigForm,
      paging?: any,
      onOptionSetted?: any,
      utility?: any,
   ) => {
      logEvent(`${name}:onInitialize`, {
         idGroup,
         idForm,
         formName,
         value: (formControl as any)?.value,
         type,
         paging,
         onOptionSetted,
         utility,
         allGroup,
      });
   };
}

function textSeparator(title: string, formName: string): any {
   return field({
      title,
      label: title,
      translateId: `section-${formName}`,

      css: {
         class: ['col-12', 'px-1', 'mt-3'],
      },

      formControl: new FormControl(
         { value: title, disabled: false },
         {
            updateOn: 'change',
            validators: [],
         },
      ),

      formName,
      type: firstType(['SEPARATOR', 'LABEL'], TYPE_CONTROL_FORM.TEXT),
      resetButton: false,
   } as FormAction);
}

function createAddressFields(index: number): any[] {
   const prefix = `addresses_${index}`;

   return [
      textSeparator(`Indirizzo ${index}`, `${prefix}_section`),

      field({
         title: `Tipo indirizzo ${index}`,
         translateId: `${prefix}-type`,
         placeholder: 'Seleziona tipo indirizzo',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-3', 'px-1'],
         },

         formControl: new FormControl(
            { value: null, disabled: false },
            {
               updateOn: 'change',
               validators: [Validators.required],
            },
         ),

         formName: `${prefix}_type`,
         type: TYPE_CONTROL_FORM.COMBO,
         resetButton: true,
         autocomplete: true,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         },

         options: signal(
            createSimpleOptions([
               ['residenza', 'Residenza'],
               ['domicilio', 'Domicilio'],
               ['lavoro', 'Lavoro'],
               ['spedizione', 'Spedizione'],
               ['fatturazione', 'Fatturazione'],
            ]),
         ),

         onInitialize: commonInitLogger(`${prefix}_type`),
         onChange: commonChangeLogger(`${prefix}_type`),
      } as FormAction),

      field({
         title: `Via ${index}`,
         translateId: `${prefix}-street`,
         placeholder: 'Via / Piazza',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-5', 'px-1'],
         },

         formControl: new FormControl(
            { value: '', disabled: false },
            {
               updateOn: 'change',
               validators: [Validators.required],
            },
         ),

         formName: `${prefix}_street`,
         type: TYPE_CONTROL_FORM.TEXT,
         resetButton: true,

         onInitialize: commonInitLogger(`${prefix}_street`),
         onChange: commonChangeLogger(`${prefix}_street`),
      } as FormAction),

      field({
         title: `Civico ${index}`,
         translateId: `${prefix}-number`,
         placeholder: 'N. civico',

         css: {
            class: ['col-12', 'col-sm-4', 'col-md-2', 'px-1'],
         },

         formControl: new FormControl(
            { value: '', disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: `${prefix}_streetNumber`,
         type: TYPE_CONTROL_FORM.TEXT,
         resetButton: true,

         onInitialize: commonInitLogger(`${prefix}_streetNumber`),
         onChange: commonChangeLogger(`${prefix}_streetNumber`),
      } as FormAction),

      field({
         title: `CAP ${index}`,
         translateId: `${prefix}-zip`,
         placeholder: 'CAP',

         css: {
            class: ['col-12', 'col-sm-4', 'col-md-2', 'px-1'],
         },

         formControl: new FormControl(
            { value: '', disabled: false },
            {
               updateOn: 'change',
               validators: [Validators.pattern(/^[0-9]{5}$/)],
            },
         ),

         formName: `${prefix}_zipCode`,
         type: TYPE_CONTROL_FORM.TEXT,
         resetButton: true,

         onInitialize: commonInitLogger(`${prefix}_zipCode`),
         onChange: commonChangeLogger(`${prefix}_zipCode`),
      } as FormAction),

      field({
         title: `Comune ${index}`,
         translateId: `${prefix}-city`,
         placeholder: 'Cerca comune',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: null, disabled: false },
            {
               updateOn: 'change',
               validators: [Validators.required],
            },
         ),

         formName: `${prefix}_cityId`,
         type: firstType(['COMBOPAGINATE', 'COMBO'], TYPE_CONTROL_FORM.COMBO),
         resetButton: true,
         autocomplete: true,
         enableInfiniteScroll: true,
         pageSize: 10,
         scrollThreshold: 80,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'search',
         },

         options: signal([]),

         paging: {
            page: 1,
            count: 10,
            totalCount: 250,
         },

         remoteData: createMockRemoteData(`Comune indirizzo ${index}`, 250),

         onInitialize: commonInitLogger(`${prefix}_cityId`),
         onChange: commonChangeLogger(`${prefix}_cityId`),

         onSearch(
            idGroup: number,
            idForm: number,
            formControl: FormControl,
            formName: string,
            formGroup: any[],
            search: string,
         ) {
            logEvent(`${prefix}_cityId:onSearch`, {
               idGroup,
               idForm,
               formName,
               search,
               value: formControl?.value,
               formGroup,
            });
         },

         onScrollEnd(
            idGroup: number,
            idForm: number,
            formControl: FormControl,
            formName: string,
            formGroup: any[],
            paging: any,
         ) {
            logEvent(`${prefix}_cityId:onScrollEnd`, {
               idGroup,
               idForm,
               formName,
               paging,
               value: formControl?.value,
               formGroup,
            });
         },
      } as FormAction),
   ];
}

function getNextAddressIndex(formGroup: any[]): number {
   const indexes = formGroup
      .map(item => item?.formAction?.formName)
      .filter((name: string) => /^addresses_\d+_section$/.test(name))
      .map((name: string) => Number(name.split('_')[1]))
      .filter((value: number) => !Number.isNaN(value));

   return indexes.length ? Math.max(...indexes) + 1 : 1;
}

function createAddAddressButton(formGroupRef: any[]): any {
   return field({
      title: '+ Aggiungi indirizzo',
      label: '+ Aggiungi indirizzo',
      translateId: 'add-address-button',

      css: {
         class: ['col-12', 'px-1', 'my-2'],
         iconCss: 'me-1',
      },

      formControl: new FormControl(
         { value: '+ Aggiungi indirizzo', disabled: false },
         {
            updateOn: 'change',
            validators: [],
         },
      ),

      formName: 'addAddressButton',
      type: firstType(['LINK', 'BUTTON'], TYPE_CONTROL_FORM.TEXT),
      resetButton: false,

      action: (
         formControl: FormControl | FormArray | FormGroup,
         idGroup?: number,
         idForm?: number,
         formName?: string,
         formGroup?: any[],
         allGroup?: ConfigForm,
         utility?: any,
      ) => {
         const nextIndex = getNextAddressIndex(formGroupRef);
         const newFields = createAddressFields(nextIndex);

         const printButtonIndex = formGroupRef.findIndex(
            item => item?.formAction?.formName === 'printJsonButton',
         );

         if (printButtonIndex >= 0) {
            formGroupRef.splice(printButtonIndex, 0, ...newFields);
         } else {
            formGroupRef.push(...newFields);
         }

         logEvent('ACTION:Add address from inline button', {
            nextIndex,
            formGroupLength: formGroupRef.length,
            formControl,
            idGroup,
            idForm,
            formName,
            formGroup,
            allGroup,
            utility,
         });
      },
   } as FormAction);
}

function createFormConfiguration(): any[] {
   const formGroup: any[] = [];

   formGroup.push(
      textSeparator('Raccolta anagrafica', 'section_registry'),

      field({
         title: 'Nome',
         translateId: 'test-first-name',
         placeholder: 'Inserisci nome',

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

         onInitialize: commonInitLogger('firstName'),
         onChange: commonChangeLogger('firstName'),
      } as FormAction),

      field({
         title: 'Cognome',
         translateId: 'test-last-name',
         placeholder: 'Inserisci cognome',

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

         formName: 'lastName',
         type: TYPE_CONTROL_FORM.TEXT,
         resetButton: true,

         onInitialize: commonInitLogger('lastName'),
         onChange: commonChangeLogger('lastName'),
      } as FormAction),

      field({
         title: 'Età',
         translateId: 'test-age',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-2', 'px-1'],
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

         onInitialize: commonInitLogger('age'),
         onChange: commonChangeLogger('age'),
      } as FormAction),

      field({
         title: 'Codice fiscale',
         translateId: 'test-tax-code',
         placeholder: 'Codice fiscale',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: '', disabled: false },
            {
               updateOn: 'change',
               validators: [Validators.minLength(16), Validators.maxLength(16)],
            },
         ),

         formName: 'taxCode',
         type: TYPE_CONTROL_FORM.TEXT,
         resetButton: true,

         onInitialize: commonInitLogger('taxCode'),
         onChange: commonChangeLogger('taxCode'),
      } as FormAction),

      field({
         title: 'Email',
         translateId: 'test-email',
         placeholder: 'nome@email.it',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: '', disabled: false },
            {
               updateOn: 'change',
               validators: [Validators.email],
            },
         ),

         formName: 'email',
         type: TYPE_CONTROL_FORM.TEXT,
         resetButton: true,

         onInitialize: commonInitLogger('email'),
         onChange: commonChangeLogger('email'),
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

         onInitialize: commonInitLogger('active'),
         onChange: commonChangeLogger('active'),
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
         type: firstType(['RADIOGROUP', 'RADIO_BUTTON'], TYPE_CONTROL_FORM.COMBO),
         resetButton: true,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         },

         options: signal(
            createSimpleOptions([
               ['male', 'Maschio'],
               ['female', 'Femmina'],
               ['not_specified', 'Non specificato'],
            ]),
         ),

         onInitialize: commonInitLogger('gender'),
         onChange: commonChangeLogger('gender'),
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
         type: firstType(['DATA', 'DATE'], TYPE_CONTROL_FORM.TEXT),
         resetButton: true,

         optionDate: {
            min: '1900-01-01',
            max: '2100-12-31',
         },

         onInitialize: commonInitLogger('birthDate'),
         onChange: commonChangeLogger('birthDate'),
      } as FormAction),

      field({
         title: 'Periodo validità',
         translateId: 'test-validity-period',
         placeholder: 'Periodo',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormGroup({
            from: new FormControl<Date | null>(null),
            to: new FormControl<Date | null>(null),
         }),

         formName: 'validityPeriod',
         type: firstType(['DATARANGE', 'DATE_RANGE'], TYPE_CONTROL_FORM.TEXT),
         resetButton: true,

         optionDate: {
            min: '1900-01-01',
            max: '2100-12-31',
         },

         onInitialize: commonInitLogger('validityPeriod'),
         onChange: commonChangeLogger('validityPeriod'),
      } as FormAction),

      field({
         title: 'Data e ora appuntamento',
         translateId: 'test-date-time',
         placeholder: 'Seleziona data e ora',

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

         formName: 'appointmentDateTime',
         type: firstType(['DATETIME', 'DATE_TIME'], TYPE_CONTROL_FORM.TEXT),
         resetButton: true,

         onInitialize: commonInitLogger('appointmentDateTime'),
         onChange: commonChangeLogger('appointmentDateTime'),
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
         type: firstType(['YEAR', 'DATE_YEAR'], TYPE_CONTROL_FORM.TEXT),
         resetButton: true,

         optionDate: {
            min: '1900-01-01',
            max: '2100-12-31',
         },

         onInitialize: commonInitLogger('referenceYear'),
         onChange: commonChangeLogger('referenceYear'),
      } as FormAction),

      field({
         title: 'Note',
         translateId: 'test-notes',
         placeholder: 'Scrivi note anagrafiche',

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

         onInitialize: commonInitLogger('notes'),
         onChange: commonChangeLogger('notes'),
      } as FormAction),

      textSeparator('Combo e selezioni', 'section_combo'),

      field({
         title: 'Tipo cliente - combo normale',
         translateId: 'test-customer-type',
         placeholder: 'Seleziona tipo cliente',

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
         autocomplete: false,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         },

         options: signal(
            createSimpleOptions([
               ['private', 'Privato'],
               ['company', 'Azienda'],
               ['pa', 'Pubblica amministrazione'],
               ['freelance', 'Professionista'],
            ]),
         ),

         onInitialize: commonInitLogger('customerType'),
         onChange: commonChangeLogger('customerType'),
      } as FormAction),

      field({
         title: 'Professione - combo con ricerca locale',
         translateId: 'test-profession',
         placeholder: 'Cerca professione',

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

         formName: 'profession',
         type: TYPE_CONTROL_FORM.COMBO,
         resetButton: true,
         autocomplete: true,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         },

         options: signal(
            createSimpleOptions([
               ['developer', 'Sviluppatore'],
               ['designer', 'Designer'],
               ['doctor', 'Medico'],
               ['teacher', 'Insegnante'],
               ['worker', 'Operaio'],
               ['employee', 'Impiegato'],
               ['student', 'Studente'],
               ['retired', 'Pensionato'],
            ]),
         ),

         onInitialize: commonInitLogger('profession'),
         onChange: commonChangeLogger('profession'),
      } as FormAction),

      field({
         title: 'Comune - combo remota paginata',
         translateId: 'test-city-paginated',
         placeholder: 'Cerca comune',

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
         type: firstType(['COMBOPAGINATE', 'COMBO'], TYPE_CONTROL_FORM.COMBO),
         resetButton: true,
         autocomplete: true,
         enableInfiniteScroll: true,
         pageSize: 10,
         scrollThreshold: 80,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'search',
         },

         options: signal([]),

         paging: {
            page: 1,
            count: 10,
            totalCount: 250,
         },

         remoteData: createMockRemoteData('Comune', 250),

         onInitialize: commonInitLogger('cityId'),
         onChange: commonChangeLogger('cityId'),

         onSearch(
            idGroup: number,
            idForm: number,
            formControl: FormControl,
            formName: string,
            formGroup: any[],
            search: string,
         ) {
            logEvent('cityId:onSearch', {
               idGroup,
               idForm,
               formName,
               search,
               value: formControl?.value,
               formGroup,
            });
         },

         onScrollEnd(
            idGroup: number,
            idForm: number,
            formControl: FormControl,
            formName: string,
            formGroup: any[],
            paging: any,
         ) {
            logEvent('cityId:onScrollEnd', {
               idGroup,
               idForm,
               formName,
               paging,
               value: formControl?.value,
               formGroup,
            });
         },
      } as FormAction),

      field({
         title: 'Lingue - multi select Material standard',
         translateId: 'test-languages',
         placeholder: 'Seleziona lingue',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: [], disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'languages',
         type: TYPE_CONTROL_FORM.COMBO,
         resetButton: true,
         autocomplete: true,
         multiple: true,
         checkboxSelect: false,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         },

         options: signal(
            createSimpleOptions([
               ['it', 'Italiano'],
               ['en', 'Inglese'],
               ['fr', 'Francese'],
               ['es', 'Spagnolo'],
               ['de', 'Tedesco'],
            ]),
         ),

         onInitialize: commonInitLogger('languages'),
         onChange: commonChangeLogger('languages'),
      } as FormAction),

      field({
         title: 'Intolleranze - multi checkbox Material',
         translateId: 'test-intolerances',
         placeholder: 'Seleziona intolleranze',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: [], disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'intolerances',
         type: TYPE_CONTROL_FORM.COMBO,
         resetButton: true,
         autocomplete: true,
         multiple: true,
         checkboxSelect: true,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         },

         combotext: {
            maxElementShow: 3,
         },

         options: signal(
            createSimpleOptions([
               ['glutine', 'Glutine'],
               ['lattosio', 'Lattosio'],
               ['uova', 'Uova'],
               ['frutta_secca', 'Frutta secca'],
               ['pesce', 'Pesce'],
               ['arachidi', 'Arachidi'],
            ]),
         ),

         onInitialize: commonInitLogger('intolerances'),
         onChange: commonChangeLogger('intolerances'),
      } as FormAction),

      field({
         title: 'Patologie - multi checkbox remota paginata',
         translateId: 'test-pathologies',
         placeholder: 'Cerca patologie',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: [], disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'pathologies',
         type: firstType(['COMBOPAGINATE', 'COMBO'], TYPE_CONTROL_FORM.COMBO),
         resetButton: true,
         autocomplete: true,
         multiple: true,
         checkboxSelect: true,
         enableInfiniteScroll: true,
         pageSize: 10,
         scrollThreshold: 80,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'search',
         },

         options: signal([]),

         paging: {
            page: 1,
            count: 10,
            totalCount: 200,
         },

         remoteData: createMockRemoteData('Patologia', 200),

         onInitialize: commonInitLogger('pathologies'),
         onChange: commonChangeLogger('pathologies'),

         onSearch(
            idGroup: number,
            idForm: number,
            formControl: FormControl,
            formName: string,
            formGroup: any[],
            search: string,
         ) {
            logEvent('pathologies:onSearch', {
               idGroup,
               idForm,
               formName,
               search,
               value: formControl?.value,
               formGroup,
            });
         },

         onScrollEnd(
            idGroup: number,
            idForm: number,
            formControl: FormControl,
            formName: string,
            formGroup: any[],
            paging: any,
         ) {
            logEvent('pathologies:onScrollEnd', {
               idGroup,
               idForm,
               formName,
               paging,
               value: formControl?.value,
               formGroup,
            });
         },
      } as FormAction),

      textSeparator('Dati dieta annidati / simulati', 'section_diet'),

      field({
         title: 'Obiettivo dieta',
         translateId: 'test-diet-goal',
         placeholder: 'Seleziona obiettivo',

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

         formName: 'diet_goal',
         type: TYPE_CONTROL_FORM.COMBO,
         resetButton: true,
         autocomplete: true,

         keyCombo: {
            keyId: 'id',
            keyDescription: 'description',
            keySearch: 'description',
         },

         options: signal(
            createSimpleOptions([
               ['dimagrimento', 'Dimagrimento'],
               ['massa', 'Massa muscolare'],
               ['mantenimento', 'Mantenimento'],
               ['salute', 'Salute generale'],
            ]),
         ),

         onInitialize: commonInitLogger('diet_goal'),
         onChange: commonChangeLogger('diet_goal'),
      } as FormAction),

      field({
         title: 'Lunedì - Colazione',
         translateId: 'test-monday-breakfast',
         placeholder: 'Alimenti colazione',

         css: {
            class: ['col-12', 'col-md-6', 'px-1'],
            rows: 3,
         },

         formControl: new FormControl(
            { value: '', disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'diet_monday_breakfast',
         type: TYPE_CONTROL_FORM.TEXTAREA,
         resetButton: true,

         onInitialize: commonInitLogger('diet_monday_breakfast'),
         onChange: commonChangeLogger('diet_monday_breakfast'),
      } as FormAction),

      field({
         title: 'Lunedì - Pranzo',
         translateId: 'test-monday-lunch',
         placeholder: 'Alimenti pranzo',

         css: {
            class: ['col-12', 'col-md-6', 'px-1'],
            rows: 3,
         },

         formControl: new FormControl(
            { value: '', disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'diet_monday_lunch',
         type: TYPE_CONTROL_FORM.TEXTAREA,
         resetButton: true,

         onInitialize: commonInitLogger('diet_monday_lunch'),
         onChange: commonChangeLogger('diet_monday_lunch'),
      } as FormAction),

      field({
         title: 'Martedì - Colazione',
         translateId: 'test-tuesday-breakfast',
         placeholder: 'Alimenti colazione',

         css: {
            class: ['col-12', 'col-md-6', 'px-1'],
            rows: 3,
         },

         formControl: new FormControl(
            { value: '', disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'diet_tuesday_breakfast',
         type: TYPE_CONTROL_FORM.TEXTAREA,
         resetButton: true,

         onInitialize: commonInitLogger('diet_tuesday_breakfast'),
         onChange: commonChangeLogger('diet_tuesday_breakfast'),
      } as FormAction),

      field({
         title: 'Martedì - Pranzo',
         translateId: 'test-tuesday-lunch',
         placeholder: 'Alimenti pranzo',

         css: {
            class: ['col-12', 'col-md-6', 'px-1'],
            rows: 3,
         },

         formControl: new FormControl(
            { value: '', disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'diet_tuesday_lunch',
         type: TYPE_CONTROL_FORM.TEXTAREA,
         resetButton: true,

         onInitialize: commonInitLogger('diet_tuesday_lunch'),
         onChange: commonChangeLogger('diet_tuesday_lunch'),
      } as FormAction),

      field({
         title: 'Tag dieta',
         translateId: 'test-diet-tags',
         placeholder: 'Aggiungi tag',

         css: {
            class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
         },

         formControl: new FormControl(
            { value: ['demo', 'dieta'], disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'diet_tags',
         type: firstType(['ARRAYSTRING'], TYPE_CONTROL_FORM.TEXT),
         resetButton: true,

         onInitialize: commonInitLogger('diet_tags'),
         onChange: commonChangeLogger('diet_tags'),
      } as FormAction),

      textSeparator('Documento e link', 'section_document'),

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
         type: firstType(['FILE'], TYPE_CONTROL_FORM.TEXT),
         resetButton: true,

         accept: '.pdf,.png,.jpg,.jpeg',
         multiple: false,
         size: 10,

         onInitialize: commonInitLogger('documentFile'),
         onChange: commonChangeLogger('documentFile'),
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
         type: firstType(['LINK'], TYPE_CONTROL_FORM.TEXT),

         href: 'https://www.google.com',
         target: '_blank',

         onInitialize: commonInitLogger('documentLink'),
         onChange: commonChangeLogger('documentLink'),
      } as FormAction),

      textSeparator('Componenti annidati', 'section_nested'),

      field({
         title: 'Gruppo annidato dati fisici',
         formName: 'nestedPhysicalData',
         type: firstType(['GROUP'], TYPE_CONTROL_FORM.TEXT),
         css: { class: ['col-12', 'px-1', 'mt-2'] },
         formControl: new FormGroup({}),
         children: [
            field({
               title: 'Altezza cm',
               formName: 'nested_heightCm',
               type: TYPE_CONTROL_FORM.NUMBER,
               css: { class: ['col-12', 'col-md-6', 'px-1'] },
               formControl: new FormControl(null, [
                  Validators.min(50),
                  Validators.max(250),
               ]),
            } as FormAction),
            field({
               title: 'Peso kg',
               formName: 'nested_weightKg',
               type: TYPE_CONTROL_FORM.NUMBER,
               css: { class: ['col-12', 'col-md-6', 'px-1'] },
               formControl: new FormControl(null, [
                  Validators.min(10),
                  Validators.max(300),
               ]),
            } as FormAction),
            field({
               title: 'Note fisiche',
               formName: 'nested_physicalNotes',
               type: TYPE_CONTROL_FORM.TEXTAREA,
               css: { class: ['col-12', 'px-1'], rows: 3 },
               formControl: new FormControl(''),
            } as FormAction),
         ],
      } as FormAction),

      textSeparator('Indirizzi', 'section_addresses'),
   );

   formGroup.push(createAddAddressButton(formGroup));
   formGroup.push(...createAddressFields(1));

   formGroup.push(
      field({
         title: 'Stampa JSON',
         label: 'Stampa JSON',
         translateId: 'print-json-button',

         css: {
            class: ['col-12', 'px-1', 'mt-3'],
            iconCss: 'me-1',
         },

         formControl: new FormControl(
            { value: 'Stampa JSON', disabled: false },
            {
               updateOn: 'change',
               validators: [],
            },
         ),

         formName: 'printJsonButton',
         type: firstType(['LINK', 'BUTTON'], TYPE_CONTROL_FORM.TEXT),
         resetButton: false,

      action: (
         formControl: FormControl | FormArray | FormGroup,
         idGroup?: number,
         idForm?: number,
         formName?: string,
         currentFormGroup?: FormGroup | FormArray,
      ) => {
         printJsonFromForm(currentFormGroup ?? formControl);
      },
      } as FormAction),
   );

   return formGroup;
}

export function buildUltraSafeNestedActionsForm(): ConfigForm {
   const formGroup = createFormConfiguration();

   return [
      {
         formGroup,

         actions: [
            {
               label: 'Reset',
               cssClassButton: ['btn', 'btn-secondary', 'mx-1'],
               disabled: false,
               visible: true,

               action: (
                  questions: any[],
                  idForm: string,
                  formGroupRef: FormGroup | FormArray,
               ) => {
                  logEvent('ACTION:Reset', {
                     questions,
                     idForm,
                     value: getFormRawValue(formGroupRef),
                  });

                  formGroupRef.reset();
                  formGroupRef.markAsPristine();
               },
            },

            {
               label: '+ Aggiungi indirizzo',
               cssClassButton: ['btn', 'btn-outline-primary', 'mx-1'],
               disabled: false,
               visible: true,

               action: (
                  questions: any[],
                  idForm: string,
                  formGroupRef: FormGroup | FormArray,
               ) => {
                  const nextIndex = getNextAddressIndex(formGroup);
                  const newFields = createAddressFields(nextIndex);

                  const printButtonIndex = formGroup.findIndex(
                     item => item?.formAction?.formName === 'printJsonButton',
                  );

                  if (printButtonIndex >= 0) {
                     formGroup.splice(printButtonIndex, 0, ...newFields);
                  } else {
                     formGroup.push(...newFields);
                  }

                  logEvent('ACTION:Add address from footer action', {
                     questions,
                     idForm,
                     nextIndex,
                     value: getFormRawValue(formGroupRef),
                  });
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
                  formGroupRef: FormGroup | FormArray,
               ) => {
                  logEvent('ACTION:Patch demo', {
                     questions,
                     idForm,
                     value: getFormRawValue(formGroupRef),
                  });

                  if (formGroupRef instanceof FormGroup) {
                     formGroupRef.patchValue({
                        firstName: 'Luca',
                        lastName: 'Piciollo',
                        age: 40,
                        customerType: 'private',
                        active: true,
                        gender: 'male',
                        intolerances: ['glutine', 'lattosio'],
                        languages: ['it', 'en'],
                        diet_goal: 'dimagrimento',
                        addresses_1_type: 'residenza',
                        addresses_1_street: 'Via Roma',
                        addresses_1_streetNumber: '10',
                        addresses_1_zipCode: '01100',
                     });
                  }
               },
            },

            {
               label: 'Stampa JSON',
               cssClassButton: ['btn', 'btn-success', 'mx-1'],
               disabled: false,
               visible: true,

               action: (
                  questions: any[],
                  idForm: string,
                  formGroupRef: FormGroup | FormArray,
               ) => {
                  logEvent('ACTION:Stampa JSON', {
                     questions,
                     idForm,
                     value: getFormRawValue(formGroupRef),
                  });

                  printJsonFromForm(formGroupRef);
               },
            },
         ],
      },
   ] as any;
}

export const ULTRA_SAFE_NESTED_ACTIONS_FORM = buildUltraSafeNestedActionsForm();
