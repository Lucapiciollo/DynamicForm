/** @format */

import {signal} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfigForm, TYPE_CONTROL_FORM} from '../dynamic-form.interface';

function firstGroup(control: any): FormGroup | null {
   if (control instanceof FormArray) return (control.at(0) as FormGroup) || null;
   if (control instanceof FormGroup) return control;
   return null;
}

function groupAt(root: FormGroup | FormArray, path: string): FormGroup | null {
   const parts = path.split('.').filter(Boolean);
   let current: any = root;

   for (const part of parts) {
      current = firstGroup(current);
      if (!current) return null;
      current = current.get(part);
   }

   return firstGroup(current);
}

function controlAt(root: FormGroup | FormArray, path: string): any {
   const parts = path.split('.').filter(Boolean);
   const controlName = parts.pop();
   if (!controlName) return null;
   const parent = parts.length ? groupAt(root, parts.join('.')) : firstGroup(root);
   return parent?.get(controlName) ?? null;
}

function collectFormErrors(control: any, parentKey = ''): Record<string, any> {
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

export function createNestedActionsFormBuilder(): ConfigForm {
   return [
      {
         title: 'Scheda cliente completa',
         class: ['col-12', 'df-section-main'],
         formGroup: [
            {
               formAction: {
                  title: 'Dati anagrafici',
                  type: TYPE_CONTROL_FORM.GROUP,
                  formName: 'registry',
                  css: {class: ['col-12', 'df-card']},
                  formGroup: [
                     {
                        title: 'Anagrafica',
                        class: ['col-12', 'df-sub-group'],
                        formGroup: [
                           {
                              formAction: {
                                 title: 'Nome',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'firstName',
                                 placeholder: 'Inserisci nome',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<string | null>(null, {
                                    validators: [Validators.required, Validators.minLength(3)],
                                    updateOn: 'change',
                                 }),
                                 onChange: (_idGroup: any, _idForm: any, formControl: FormControl) => {
                                    console.log('Nome cambiato:', formControl.value);
                                 },
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Cognome',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'lastName',
                                 placeholder: 'Inserisci cognome',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<string | null>(null, {validators: [Validators.required]}),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Email',
                                 type: TYPE_CONTROL_FORM.EMAIL,
                                 formName: 'email',
                                 placeholder: 'nome@email.it',
                                 css: {class: ['col-12', 'col-md-6']},
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
                                 formControl: new FormControl<string | null>(null),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Sesso',
                                 type: TYPE_CONTROL_FORM.RADIOGROUP,
                                 formName: 'gender',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<string | null>('M'),
                                 options: signal([
                                    {id: 'M', description: 'Maschio'},
                                    {id: 'F', description: 'Femmina'},
                                    {id: 'N', description: 'Non specificato'},
                                 ]),
                                 keyCombo: {keyId: 'id', keyDescription: ['description']},
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Cliente attivo',
                                 type: TYPE_CONTROL_FORM.CHECKBOX,
                                 formName: 'active',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<boolean>(true),
                              } as any,
                           },
                        ],
                     },
                  ],
               } as any,
            },
            {
               formAction: {
                  title: 'Documento',
                  type: TYPE_CONTROL_FORM.GROUP,
                  formName: 'document',
                  css: {class: ['col-12', 'df-card']},
                  formGroup: [
                     {
                        title: 'Dati documento',
                        class: ['col-12', 'df-sub-group'],
                        formGroup: [
                           {
                              formAction: {
                                 title: 'Tipo documento',
                                 type: TYPE_CONTROL_FORM.COMBO,
                                 formName: 'documentType',
                                 placeholder: 'Seleziona documento',
                                 css: {class: ['col-12', 'col-md-4']},
                                 formControl: new FormControl<string | null>(null, {validators: [Validators.required]}),
                                 options: signal([
                                    {id: 'CI', description: 'Carta identità'},
                                    {id: 'PASS', description: 'Passaporto'},
                                    {id: 'PAT', description: 'Patente'},
                                 ]),
                                 keyCombo: {keyId: 'id', keyDescription: ['description']},
                                 autocomplete: false,
                                 multiple: false,
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Numero documento',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'documentNumber',
                                 placeholder: 'Numero documento',
                                 css: {class: ['col-12', 'col-md-4']},
                                 formControl: new FormControl<string | null>(null, {validators: [Validators.required]}),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Scadenza',
                                 type: TYPE_CONTROL_FORM.DATA,
                                 formName: 'documentExpireDate',
                                 placeholder: 'Data scadenza',
                                 css: {class: ['col-12', 'col-md-4']},
                                 formControl: new FormControl<Date | null>(null, {validators: [Validators.required]}),
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
               label: 'Valida anagrafica',
               visible: true,
               cssClassButton: ['btn', 'btn-primary', 'me-2', 'mb-2'],
               action: (_questions, _idForm, formGroup) => {
                  const registry = groupAt(formGroup, 'registry');
                  registry?.markAllAsTouched();
                  console.log('Registry valid:', registry?.valid);
                  console.log('Registry value:', registry?.value);
               },
            },
            {
               label: 'Patch anagrafica',
               visible: true,
               cssClassButton: ['btn', 'btn-secondary', 'me-2', 'mb-2'],
               action: (_questions, _idForm, formGroup) => {
                  const registry = groupAt(formGroup, 'registry');
                  registry?.patchValue({firstName: 'Luca', lastName: 'Piciollo', email: 'luca@test.it', phone: '3331234567', gender: 'M', active: true});
                  console.log('Patch anagrafica eseguito');
               },
            },
         ],
      },
      {
         title: 'Indirizzi e residenza',
         class: ['col-12', 'df-section-main'],
         formGroup: [
            {
               formAction: {
                  title: 'Indirizzo principale',
                  type: TYPE_CONTROL_FORM.GROUP,
                  formName: 'mainAddress',
                  css: {class: ['col-12', 'df-card']},
                  formGroup: [
                     {
                        title: 'Indirizzo',
                        class: ['col-12', 'df-sub-group'],
                        formGroup: [
                           {
                              formAction: {
                                 title: 'Via',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'street',
                                 placeholder: 'Via',
                                 css: {class: ['col-12', 'col-md-6']},
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
                                 formControl: new FormControl<string | null>(null, {validators: [Validators.pattern(/^[0-9]{5}$/)]}),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Comune e provincia',
                                 type: TYPE_CONTROL_FORM.GROUP,
                                 formName: 'cityInfo',
                                 css: {class: ['col-12', 'df-sub-card']},
                                 formGroup: [
                                    {
                                       title: 'Comune e provincia',
                                       class: ['col-12', 'df-sub-group'],
                                       formGroup: [
                                          {
                                             formAction: {
                                                title: 'Comune',
                                                type: TYPE_CONTROL_FORM.TEXT,
                                                formName: 'city',
                                                placeholder: 'Comune',
                                                css: {class: ['col-12', 'col-md-6']},
                                                formControl: new FormControl<string | null>(null),
                                             } as any,
                                          },
                                          {
                                             formAction: {
                                                title: 'Provincia',
                                                type: TYPE_CONTROL_FORM.TEXT,
                                                formName: 'province',
                                                placeholder: 'Provincia',
                                                css: {class: ['col-12', 'col-md-3']},
                                                formControl: new FormControl<string | null>(null),
                                             } as any,
                                          },
                                          {
                                             formAction: {
                                                title: 'Regione',
                                                type: TYPE_CONTROL_FORM.COMBO,
                                                formName: 'region',
                                                placeholder: 'Regione',
                                                css: {class: ['col-12', 'col-md-3']},
                                                formControl: new FormControl<string | null>(null),
                                                options: signal([
                                                   {id: 'LAZIO', description: 'Lazio'},
                                                   {id: 'UMBRIA', description: 'Umbria'},
                                                   {id: 'TOSCANA', description: 'Toscana'},
                                                ]),
                                                keyCombo: {keyId: 'id', keyDescription: ['description']},
                                                autocomplete: true,
                                                multiple: false,
                                             } as any,
                                          },
                                       ],
                                    },
                                 ],
                              } as any,
                           },
                        ],
                     },
                  ],
               } as any,
            },
            {
               formAction: {
                  title: 'Indirizzo secondario',
                  type: TYPE_CONTROL_FORM.GROUP,
                  formName: 'secondaryAddress',
                  css: {class: ['col-12', 'df-card']},
                  formGroup: [
                     {
                        title: 'Secondario',
                        class: ['col-12', 'df-sub-group'],
                        formGroup: [
                           {
                              formAction: {
                                 title: 'Usa indirizzo secondario',
                                 type: TYPE_CONTROL_FORM.CHECKBOX,
                                 formName: 'enabled',
                                 css: {class: ['col-12']},
                                 formControl: new FormControl<boolean>(false),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Via secondaria',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'street',
                                 placeholder: 'Via secondaria',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<string | null>(null),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Comune secondario',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'city',
                                 placeholder: 'Comune secondario',
                                 css: {class: ['col-12', 'col-md-6']},
                                 formControl: new FormControl<string | null>(null),
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
               label: 'Copia indirizzo principale nel secondario',
               visible: true,
               cssClassButton: ['btn', 'btn-warning', 'me-2', 'mb-2'],
               action: (_questions, _idForm, formGroup) => {
                  const mainAddress = groupAt(formGroup, 'mainAddress');
                  const cityInfo = groupAt(formGroup, 'mainAddress.cityInfo');
                  const secondaryAddress = groupAt(formGroup, 'secondaryAddress');
                  secondaryAddress?.patchValue({enabled: true, street: mainAddress?.get('street')?.value, city: cityInfo?.get('city')?.value});
                  console.log('Indirizzo copiato');
               },
            },
         ],
      },
      {
         title: 'Contratto, periodo e importi',
         class: ['col-12', 'df-section-main'],
         formGroup: [
            {
               formAction: {
                  title: 'Dati contratto',
                  type: TYPE_CONTROL_FORM.GROUP,
                  formName: 'contract',
                  css: {class: ['col-12', 'df-card']},
                  formGroup: [
                     {
                        title: 'Contratto',
                        class: ['col-12', 'df-sub-group'],
                        formGroup: [
                           {
                              formAction: {
                                 title: 'Codice contratto',
                                 type: TYPE_CONTROL_FORM.TEXT,
                                 formName: 'code',
                                 placeholder: 'Codice contratto',
                                 css: {class: ['col-12', 'col-md-4']},
                                 formControl: new FormControl<string | null>(null, {validators: [Validators.required]}),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Tipo contratto',
                                 type: TYPE_CONTROL_FORM.COMBO,
                                 formName: 'type',
                                 placeholder: 'Tipo contratto',
                                 css: {class: ['col-12', 'col-md-4']},
                                 formControl: new FormControl<string | null>(null),
                                 options: signal([
                                    {id: 'STANDARD', description: 'Standard'},
                                    {id: 'PREMIUM', description: 'Premium'},
                                    {id: 'CUSTOM', description: 'Personalizzato'},
                                 ]),
                                 keyCombo: {keyId: 'id', keyDescription: ['description']},
                                 autocomplete: false,
                                 multiple: false,
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Attivazione immediata',
                                 type: TYPE_CONTROL_FORM.CHECKBOX,
                                 formName: 'immediateActivation',
                                 css: {class: ['col-12', 'col-md-4']},
                                 formControl: new FormControl<boolean>(false),
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Periodo contratto',
                                 type: TYPE_CONTROL_FORM.GROUP,
                                 formName: 'period',
                                 css: {class: ['col-12', 'df-sub-card']},
                                 formGroup: [
                                    {
                                       title: 'Periodo',
                                       class: ['col-12', 'df-sub-group'],
                                       formGroup: [
                                          {
                                             formAction: {
                                                title: 'Dal',
                                                type: TYPE_CONTROL_FORM.DATA,
                                                formName: 'from',
                                                placeholder: 'Data inizio',
                                                css: {class: ['col-12', 'col-md-6']},
                                                formControl: new FormControl<Date | null>(null),
                                             } as any,
                                          },
                                          {
                                             formAction: {
                                                title: 'Al',
                                                type: TYPE_CONTROL_FORM.DATA,
                                                formName: 'to',
                                                placeholder: 'Data fine',
                                                css: {class: ['col-12', 'col-md-6']},
                                                formControl: new FormControl<Date | null>(null),
                                             } as any,
                                          },
                                       ],
                                    },
                                 ],
                              } as any,
                           },
                           {
                              formAction: {
                                 title: 'Importi',
                                 type: TYPE_CONTROL_FORM.GROUP,
                                 formName: 'amounts',
                                 css: {class: ['col-12', 'df-sub-card']},
                                 formGroup: [
                                    {
                                       title: 'Importi',
                                       class: ['col-12', 'df-sub-group'],
                                       formGroup: [
                                          {
                                             formAction: {
                                                title: 'Imponibile',
                                                type: TYPE_CONTROL_FORM.CURRENCY,
                                                formName: 'taxable',
                                                placeholder: 'Imponibile',
                                                css: {class: ['col-12', 'col-md-4']},
                                                formControl: new FormControl<number | null>(0, {validators: [Validators.min(0)]}),
                                                currency: 'EUR',
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
                                                type: TYPE_CONTROL_FORM.CURRENCY,
                                                formName: 'total',
                                                placeholder: 'Totale',
                                                css: {class: ['col-12', 'col-md-4']},
                                                formControl: new FormControl<number | null>({value: 0, disabled: true}),
                                                currency: 'EUR',
                                             } as any,
                                          },
                                       ],
                                    },
                                 ],
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
               label: 'Calcola totale',
               visible: true,
               cssClassButton: ['btn', 'btn-success', 'me-2', 'mb-2'],
               action: (_questions, _idForm, formGroup) => {
                  const amounts = groupAt(formGroup, 'contract.amounts');
                  const taxable = Number(amounts?.get('taxable')?.value ?? 0);
                  const vat = Number(amounts?.get('vat')?.value ?? 0);
                  amounts?.get('total')?.setValue(Number((taxable + taxable * vat / 100).toFixed(2)));
               },
            },
            {
               label: 'Disabilita contratto',
               visible: true,
               cssClassButton: ['btn', 'btn-danger', 'me-2', 'mb-2'],
               action: (_questions, _idForm, formGroup) => groupAt(formGroup, 'contract')?.disable(),
            },
            {
               label: 'Abilita contratto',
               visible: true,
               cssClassButton: ['btn', 'btn-info', 'me-2', 'mb-2'],
               action: (_questions, _idForm, formGroup) => {
                  groupAt(formGroup, 'contract')?.enable();
                  controlAt(formGroup, 'contract.amounts.total')?.disable();
               },
            },
         ],
      },
      {
         title: 'Note, allegati e operazioni finali',
         class: ['col-12', 'df-section-main'],
         formGroup: [
            {
               formAction: {
                  title: 'Note interne',
                  type: TYPE_CONTROL_FORM.TEXTAREA,
                  formName: 'internalNotes',
                  placeholder: 'Scrivi note interne',
                  css: {class: ['col-12']},
                  formControl: new FormControl<string | null>(null),
                  rows: 4,
               } as any,
            },
            {
               formAction: {
                  title: 'Tag',
                  type: TYPE_CONTROL_FORM.ARRAYSTRING,
                  formName: 'tags',
                  placeholder: 'Aggiungi tag',
                  css: {class: ['col-12']},
                  formControl: new FormControl<string[]>(['cliente', 'test', 'annidato']),
               } as any,
            },
            {
               formAction: {
                  title: 'Allegato documento',
                  type: TYPE_CONTROL_FORM.FILE,
                  formName: 'attachment',
                  css: {class: ['col-12', 'col-md-6']},
                  formControl: new FormControl<File | null>(null),
                  accept: '.pdf,.png,.jpg,.jpeg',
               } as any,
            },
            {
               formAction: {
                  title: 'Link esterno',
                  type: TYPE_CONTROL_FORM.LINK,
                  formName: 'externalLink',
                  css: {class: ['col-12', 'col-md-6']},
                  label: 'Apri documento esterno',
                  href: 'https://example.com',
                  target: '_blank',
               } as any,
            },
         ],
         actions: [
            {
               label: 'Leggi tutto il form',
               visible: true,
               cssClassButton: ['btn', 'btn-primary', 'me-2', 'mb-2'],
               action: (_questions, _idForm, formGroup) => {
                  console.log('FORM COMPLETO:', formGroup);
                  console.log('RAW VALUE:', formGroup instanceof FormGroup ? formGroup.getRawValue() : formGroup.value);
               },
            },
            {
               label: 'Valida tutto',
               visible: true,
               cssClassButton: ['btn', 'btn-success', 'me-2', 'mb-2'],
               action: (_questions, _idForm, formGroup) => {
                  formGroup.markAllAsTouched();
                  console.log('Form valido:', formGroup.valid);
                  console.log('Errori:', collectFormErrors(formGroup));
               },
            },
            {
               label: 'Reset tutto',
               visible: true,
               cssClassButton: ['btn', 'btn-secondary', 'me-2', 'mb-2'],
               action: (_questions, _idForm, formGroup) => formGroup.reset(),
            },
         ],
      },
   ];
}

export const nestedActionsFormHelpers = {
   firstGroup,
   groupAt,
   controlAt,
   collectFormErrors,
};
