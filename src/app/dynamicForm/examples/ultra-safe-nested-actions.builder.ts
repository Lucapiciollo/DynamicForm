/** @format */

import {signal} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfigForm, TYPE_CONTROL_FORM} from '../dynamic-form.interface';

function firstGroup(control: any): FormGroup | null {
   if (control instanceof FormArray) return (control.at(0) as FormGroup) || null;
   if (control instanceof FormGroup) return control;
   return null;
}

export function groupAt(root: FormGroup | FormArray | null, path: string): FormGroup | null {
   if (!root) return null;
   const parts = path.split('.').filter(Boolean);
   let current: any = root;

   for (const part of parts) {
      current = firstGroup(current);
      if (!current) return null;
      current = current.get(part);
   }

   return firstGroup(current);
}

export function controlAt(root: FormGroup | FormArray | null, path: string): any {
   if (!root) return null;
   const parts = path.split('.').filter(Boolean);
   const controlName = parts.pop();
   if (!controlName) return null;
   const parent = parts.length ? groupAt(root, parts.join('.')) : firstGroup(root);
   return parent?.get(controlName) ?? null;
}

export function collectFormErrors(control: any, parentKey = ''): Record<string, any> {
   const errors: Record<string, any> = {};

   if (control instanceof FormArray) {
      control.controls.forEach((child, index) => {
         Object.assign(errors, collectFormErrors(child, `${parentKey}[${index}]`));
      });
      return errors;
   }

   if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
         const nextKey = parentKey ? `${parentKey}.${key}` : key;
         Object.assign(errors, collectFormErrors(control.get(key), nextKey));
      });
      return errors;
   }

   if (control?.errors) errors[parentKey] = control.errors;
   return errors;
}


type MockOperator = {
   id: number;
   description: string;
   role: string;
   department: string;
};

const MOCK_OPERATORS: MockOperator[] = Array.from({length: 75}).map((_, index) => {
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

function queryMockOperators(param: any): {items: MockOperator[]; totalCount: number} {
   const count = Number(param?.count ?? param?.size ?? 10);
   const page = Math.max(Number(param?.page ?? 1), 1);
   const search = `${param?.search ?? ''}`.trim().toLowerCase();

   const filtered = search
      ? MOCK_OPERATORS.filter(item => `${item.description} ${item.role} ${item.department}`.toLowerCase().includes(search))
      : MOCK_OPERATORS;

   const start = (page - 1) * count;
   const items = filtered.slice(start, start + count);

   return {
      items,
      totalCount: filtered.length,
   };
}

function writeComboPaginateResult(ctx: any, result: {items: MockOperator[]; totalCount: number}): void {
   const store = ctx?.signalStore ?? ctx?.externalStore;
   const formAction = ctx?.formAction;
   const keyCombo = formAction?.keyCombo ?? {keyId: 'id', keyDescription: ['description', 'role']};
   const append = ctx?.param?.append === true;

   if (formAction) {
      formAction.paging = {
         ...(formAction.paging ?? {}),
         totalCount: result.totalCount,
      };
   }

   // Con scroll infinito:
   // - nuova ricerca/apertura: append=false => sostituisce i risultati
   // - fondo scroll: append=true => aggiunge la pagina successiva mantenendo la stessa search
   const currentTotal = append && typeof store?.getTotalOptions === 'function' ? store.getTotalOptions() : [];
   const nextItems = append ? [...(Array.isArray(currentTotal) ? currentTotal : []), ...result.items] : result.items;

   store?.setTotalOptions?.({items: nextItems, totalCount: result.totalCount}, keyCombo);
   store?.setFilteredOptions?.({items: result.items, totalCount: result.totalCount}, keyCombo, append);
}


function findFormActionByName(config: any, formName: string): any | null {
   if (!Array.isArray(config)) return null;

   for (const group of config) {
      const found = findFormActionInGroup(group?.formGroup, formName);
      if (found) return found;
   }

   return null;
}

function findFormActionInGroup(formGroup: any[] | undefined, formName: string): any | null {
   if (!Array.isArray(formGroup)) return null;

   for (const item of formGroup) {
      if (item?.formAction?.formName === formName) {
         return item.formAction;
      }

      const childFromAction = findFormActionInGroup(item?.formAction?.formGroup, formName);
      if (childFromAction) return childFromAction;

      const childFromGroup = findFormActionInGroup(item?.formGroup, formName);
      if (childFromGroup) return childFromGroup;
   }

   return null;
}

function loadOperatorPageFromAction(questions: any, formGroup: any, page: number, search: string | null = null): void {
   const action = findFormActionByName(questions, 'operatorId');

   if (!action) {
      console.warn('Campo operatorId non trovato nella configurazione');
      return;
   }

   const count = Number(action?.paging?.count ?? 10);
   const param = {
      ...(typeof action.paramsForRemoteData === 'function' ? action.paramsForRemoteData() : action.paramsForRemoteData ?? {}),
      page,
      count,
      search,
      append: false,
   };

   action.paging = {
      ...(action.paging ?? {}),
      page,
      count,
   };

   action.paramsForRemoteData?.set?.(param);

   action.remoteData?.({
      param,
      externalStore: action.instance?.signalStore,
      signalStore: action.instance?.signalStore,
      setInitialOption: action.instance?.setInitialOption,
      formAction: action,
      formGroup,
      instance: action.instance,
   });

   console.log(`Pagina operatori caricata manualmente: ${page}`, param);
}

export function createUltraSafeNestedActionsFormBuilder(): ConfigForm {
   return [
      {
         title: 'Playground sicuro - gruppi annidati e actions',
         class: ['col-12', 'df-section-main'],
         formGroup: [
            {
               formAction: {
                  title: 'Anagrafica',
                  type: TYPE_CONTROL_FORM.GROUP,
                  formName: 'registry',
                  css: {class: ['col-12', 'df-card']},
                  formGroup: [
                     {
                        title: 'Dati principali',
                        class: ['col-12', 'df-sub-group'],
                        formGroup: [
                           {
                              formAction: {
                                 title: 'Nome',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'firstName',
                                 placeholder: 'Inserisci nome',
                                 css: {class: ['col-12', 'col-md-6']},
                                 disableSpeech: true,
                                 formControl: new FormControl<string | null>(null, {
                                    validators: [Validators.required, Validators.minLength(3)],
                                    updateOn: 'change',
                                 }),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Cognome',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'lastName',
                                 placeholder: 'Inserisci cognome',
                                 css: {class: ['col-12', 'col-md-6']},
                                 disableSpeech: true,
                                 formControl: new FormControl<string | null>(null, {validators: [Validators.required]}),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Email',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'email',
                                 placeholder: 'nome@email.it',
                                 css: {class: ['col-12', 'col-md-6']},
                                 disableSpeech: true,
                                 formControl: new FormControl<string | null>(null, {
                                    validators: [Validators.required, Validators.email],
                                    updateOn: 'blur',
                                 }),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Telefono',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'phone',
                                 placeholder: 'Telefono',
                                 css: {class: ['col-12', 'col-md-6']},
                                 disableSpeech: true,
                                 formControl: new FormControl<string | null>(null),
                              } as any,
                           },

                           {
                              formAction: {
                                 title: 'Sesso',
                                 type: TYPE_CONTROL_FORM.RADIOGROUP,
                                 formName: 'gender',
                                 css: {class: ['col-12', 'col-md-6'], classRadio: ['me-3']},
                                 formControl: new FormControl<string | null>('M'),
                                 options: signal([
                                    {id: 'M', description: 'Maschio'},
                                    {id: 'F', description: 'Femmina'},
                                    {id: 'N', description: 'Non specificato'},
                                 ]),
                                 resetButton: true,
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Categoria cliente',
                                 type: TYPE_CONTROL_FORM.COMBO,
                                 formName: 'customerCategory',
                                 placeholder: 'Seleziona categoria',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<string | null>(null, {validators: [Validators.required]}),
                                 options: signal([
                                    {id: 'PRIVATE', description: 'Privato'},
                                    {id: 'COMPANY', description: 'Azienda'},
                                    {id: 'PUBLIC', description: 'Ente pubblico'},
                                    {id: 'OTHER', description: 'Altro'},
                                 ]),
                                 keyCombo: {
                                    keyId: 'id',
                                    keyDescription: ['description'],
                                 },
                                 autocomplete: false,
                                 multiple: false,
                                 resetButton: true,
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Data nascita',
                                 type: TYPE_CONTROL_FORM.DATA,
                                 formName: 'birthDate',
                                 placeholder: 'Seleziona data nascita',
                                 css: {class: ['col-12', 'col-md-6']},
                                 resetButton: true,
                                 formControl: new FormControl<Date | null>(null),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Fascia appuntamento',
                                 type: TYPE_CONTROL_FORM.DATETIME,
                                 formName: 'appointmentSlot',
                                 placeholder: 'Seleziona fascia',
                                 css: {class: ['col-12', 'col-md-6']},
                                 resetButton: true,
                                 formControl: new FormControl<string | null>(null),
                                 options: [
                                    {id: '2026-05-21T09:00:00', description: '21/05/2026 09:00'},
                                    {id: '2026-05-21T10:30:00', description: '21/05/2026 10:30'},
                                    {id: '2026-05-21T15:00:00', description: '21/05/2026 15:00'},
                                 ],
                              } as any,
                           },
                        ],
                     },
                     {
                        title: 'Consensi',
                        class: ['col-12', 'df-sub-group'],
                        formGroup: [
                           {
                              formAction: {
                                 title: 'Cliente attivo',
                                 type: TYPE_CONTROL_FORM.CHECKBOX,
                                 formName: 'active',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<boolean>(true),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Consenso privacy',
                                 type: TYPE_CONTROL_FORM.CHECKBOX,
                                 formName: 'privacy',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<boolean>(false, {validators: [Validators.requiredTrue]}),
                              } as any,
                           },
                        ],
                     },
                  ],
               } as any,
            },
            {
               formAction: {
                  title: 'Indirizzi',
                  type: TYPE_CONTROL_FORM.GROUP,
                  formName: 'addresses',
                  css: {class: ['col-12', 'df-card']},
                  formGroup: [
                     {
                        title: 'Indirizzo principale',
                        class: ['col-12', 'df-sub-group'],
                        formGroup: [
                           {
                              formAction: {
                                 title: 'Via',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'street',
                                 placeholder: 'Via',
                                 css: {class: ['col-12', 'col-md-6']},
                                 disableSpeech: true,
                                 formControl: new FormControl<string | null>(null),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Civico',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'streetNumber',
                                 placeholder: 'Civico',
                                 css: {class: ['col-12', 'col-md-2']},
                                 disableSpeech: true,
                                 formControl: new FormControl<string | null>(null),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'CAP',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'zipCode',
                                 placeholder: 'CAP',
                                 css: {class: ['col-12', 'col-md-4']},
                                 disableSpeech: true,
                                 formControl: new FormControl<string | null>(null, {validators: [Validators.pattern(/^[0-9]{5}$/)]}),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Comune',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'city',
                                 placeholder: 'Comune',
                                 css: {class: ['col-12', 'col-md-6']},
                                 disableSpeech: true,
                                 formControl: new FormControl<string | null>(null),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Provincia',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'province',
                                 placeholder: 'Provincia',
                                 css: {class: ['col-12', 'col-md-6']},
                                 disableSpeech: true,
                                 formControl: new FormControl<string | null>(null),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Regione',
                                 type: TYPE_CONTROL_FORM.COMBO,
                                 formName: 'region',
                                 placeholder: 'Seleziona regione',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<string | null>(null),
                                 options: signal([
                                    {id: 'LAZIO', description: 'Lazio'},
                                    {id: 'UMBRIA', description: 'Umbria'},
                                    {id: 'TOSCANA', description: 'Toscana'},
                                    {id: 'CAMPANIA', description: 'Campania'},
                                 ]),
                                 keyCombo: {keyId: 'id', keyDescription: 'description'},
                                 autocomplete: true,
                                 multiple: false,
                                 resetButton: true,
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Operatore paginato - step 06 con scroll e ricerca',
                                 type: TYPE_CONTROL_FORM.COMBOPAGINATE,
                                 formName: 'operatorId',
                                 placeholder: 'Cerca operatore remoto',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<number | null>(null),
                                 autocomplete: true,
                                 multiple: false,
                                 resetButton: true,
                                 enableInfiniteScroll: true,
                                 paging: {count: 10, page: 1, totalCount: MOCK_OPERATORS.length},
                                 paramsForRemoteData: signal({tenantId: 1}),
                                 options: signal({items: [], totalCount: MOCK_OPERATORS.length} as any),
                                 keyCombo: {
                                    keyId: 'id',
                                    keyDescription: ['description', 'role', 'department'],
                                    keySearch: 'search',
                                 },
                                 opened: () => console.log('Combo paginata aperta - caricamento pagina iniziale'),
                                 remoteData: (ctx: any) => {
                                    const result = queryMockOperators(ctx?.param);
                                    console.log('COMBOPAGINATE step 05 remoteData:', ctx?.param, result);
                                    writeComboPaginateResult(ctx, result);
                                 },
                              } as any,
                           },
                        ],
                     },
                  ],
               } as any,
            },
            {
               formAction: {
                  title: 'Contratto',
                  type: TYPE_CONTROL_FORM.GROUP,
                  formName: 'contract',
                  css: {class: ['col-12', 'df-card']},
                  formGroup: [
                     {
                        title: 'Dati contratto',
                        class: ['col-12', 'df-sub-group'],
                        formGroup: [
                           {
                              formAction: {
                                 title: 'Codice contratto',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'code',
                                 placeholder: 'Codice contratto',
                                 css: {class: ['col-12', 'col-md-4']},
                                 disableSpeech: true,
                                 formControl: new FormControl<string | null>(null, {validators: [Validators.required]}),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Importo imponibile',
                                 type: TYPE_CONTROL_FORM.NUMBER,
                                 formName: 'taxable',
                                 placeholder: 'Imponibile',
                                 css: {class: ['col-12', 'col-md-4']},
                                 formControl: new FormControl<number | null>(0, {validators: [Validators.min(0)]}),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'IVA %',
                                 type: TYPE_CONTROL_FORM.NUMBER,
                                 formName: 'vat',
                                 placeholder: 'IVA',
                                 css: {class: ['col-12', 'col-md-4']},
                                 formControl: new FormControl<number | null>(22, {validators: [Validators.min(0), Validators.max(100)]}),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Totale',
                                 type: TYPE_CONTROL_FORM.NUMBER,
                                 formName: 'total',
                                 placeholder: 'Totale',
                                 css: {class: ['col-12', 'col-md-4']},
                                 formControl: new FormControl<number | null>({value: 0, disabled: true}),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Periodo contratto',
                                 type: TYPE_CONTROL_FORM.DATARANGE,
                                 formName: 'contractPeriod',
                                 placeholder: 'Seleziona periodo',
                                 css: {class: ['col-12', 'col-md-8']},
                                 resetButton: true,
                                 optionDate: {
                                    onClose: (value: any) => console.log('Periodo contratto chiuso:', value),
                                 },
                                 formControl: new FormGroup({
                                    from: new FormControl<Date | null>(null),
                                    to: new FormControl<Date | null>(null),
                                 }),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Note contratto',
                                 type: TYPE_CONTROL_FORM.TEXTAREA,
                                 formName: 'notes',
                                 placeholder: 'Note',
                                 css: {class: ['col-12'], rows: 4},
                                 disableSpeech: true,
                                 formControl: new FormControl<string | null>(null),
                              } as any,
                           },

                           {
                              formAction: {
                                 title: 'Tag cliente',
                                 type: TYPE_CONTROL_FORM.ARRAYSTRING,
                                 formName: 'tags',
                                 placeholder: 'Aggiungi tag e premi invio',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<string[]>(['demo', 'cliente'], {
                                    validators: [Validators.maxLength(10)],
                                 }),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Allegato documento',
                                 type: TYPE_CONTROL_FORM.FILE,
                                 formName: 'attachment',
                                 placeholder: 'Seleziona file',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<FileList | null>(null),
                                 accept: '.pdf,.png,.jpg,.jpeg',
                                 size: 5 * 1024 * 1024,
                                 onError: (message: string) => console.warn(message),
                              } as any,
                           },
                        ],
                     },
                  ],
               } as any,
            },
         ],
         actions: [
            {
               label: 'Patch demo',
               visible: true,
               cssClassButton: ['df-action-btn', 'df-action-primary'],
               action: (_questions, _idForm, formGroup) => patchUltraSafeDemo(formGroup),
            },
            {
               label: 'Calcola totale',
               visible: true,
               cssClassButton: ['df-action-btn', 'df-action-success'],
               action: (_questions, _idForm, formGroup) => calculateUltraSafeTotal(formGroup),
            },
            {
               label: 'Operatori pagina 1',
               visible: true,
               cssClassButton: ['df-action-btn', 'df-action-info'],
               action: (questions, _idForm, formGroup) => loadOperatorPageFromAction(questions, formGroup, 1),
            },
            {
               label: 'Operatori pagina 2',
               visible: true,
               cssClassButton: ['df-action-btn', 'df-action-info'],
               action: (questions, _idForm, formGroup) => loadOperatorPageFromAction(questions, formGroup, 2),
            },
            {
               label: 'Operatori pagina 3',
               visible: true,
               cssClassButton: ['df-action-btn', 'df-action-info'],
               action: (questions, _idForm, formGroup) => loadOperatorPageFromAction(questions, formGroup, 3),
            },
            {
               label: 'Cerca operatori Tecnico',
               visible: true,
               cssClassButton: ['df-action-btn', 'df-action-warning'],
               action: (questions, _idForm, formGroup) => loadOperatorPageFromAction(questions, formGroup, 1, 'Tecnico'),
            },
            {
               label: 'Valida tutto',
               visible: true,
               cssClassButton: ['df-action-btn', 'df-action-warning'],
               action: (_questions, _idForm, formGroup) => {
                  formGroup.markAllAsTouched();
                  console.log('VALIDO:', formGroup.valid);
                  console.log('ERRORI:', collectFormErrors(formGroup));
               },
            },
         ],
      },
   ];
}

export function patchUltraSafeDemo(form: FormGroup | FormArray | null): void {
   groupAt(form, 'registry')?.patchValue({
      firstName: 'Luca',
      lastName: 'Piciollo',
      email: 'luca@test.it',
      phone: '3331234567',
      birthDate: new Date(1983, 4, 20),
      appointmentSlot: '2026-05-21T10:30:00',
      gender: 'M',
      customerCategory: 'PRIVATE',
      active: true,
      privacy: true,
   });

   groupAt(form, 'addresses')?.patchValue({
      street: 'Via Roma',
      streetNumber: '10',
      zipCode: '01100',
      city: 'Viterbo',
      province: 'VT',
      region: 'LAZIO',
      operatorId: 1,
   });

   groupAt(form, 'contract')?.patchValue({
      code: 'CTR-001',
      taxable: 1000,
      vat: 22,
      contractPeriod: {
         from: new Date(2026, 4, 21),
         to: new Date(2026, 5, 21),
      },
      notes: 'Contratto demo con sottogruppi e azioni.',
      tags: ['demo', 'contratto', 'file'],
   });

   calculateUltraSafeTotal(form);
}

export function calculateUltraSafeTotal(form: FormGroup | FormArray | null): void {
   const taxable = Number(controlAt(form, 'contract.taxable')?.value ?? 0);
   const vat = Number(controlAt(form, 'contract.vat')?.value ?? 0);
   const total = taxable + taxable * vat / 100;
   controlAt(form, 'contract.total')?.setValue(Number(total.toFixed(2)));
   controlAt(form, 'contract.total')?.disable();
}
