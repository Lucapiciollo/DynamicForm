/** @format */

import {signal} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfigForm, TYPE_CONTROL_FORM} from '../dynamic-form.interface';

const OPERATORS = Array.from({length: 75}).map((_, index) => ({
   id: index + 1,
   description: `Operatore ${String(index + 1).padStart(2, '0')}`,
   role: index % 3 === 0 ? 'Responsabile' : index % 3 === 1 ? 'Tecnico' : 'Amministrazione',
}));

function queryOperators(param: any) {
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

export function createAllComponentsFormBuilder(): ConfigForm {
   return [
      {
         title: 'Componenti base',
         class: ['col-12', 'p-0'],
         formGroup: [
            {
               formAction: {
                  title: 'Form playground',
                  type: TYPE_CONTROL_FORM.LABEL,
                  formName: 'infoLabel',
                  css: {class: ['col-12']},
                  value: 'Configurazione Angular runtime: FormControl, Validators, eventi e datasource mock direttamente in TypeScript.',
               } as any,
            },
            {
               formAction: {
                  title: 'Dati anagrafici',
                  type: TYPE_CONTROL_FORM.SEPARATOR,
                  formName: 'separatorBase',
                  css: {class: ['col-12']},
               } as any,
            },
            {
               formAction: {
                  title: 'Nome',
                  type: TYPE_CONTROL_FORM.TEXT,
                  formName: 'firstName',
                  placeholder: 'Inserisci il nome',
                  css: {class: ['col-12', 'col-md-6']},
                  formControl: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3)]),
                  onChange: (_idGroup: number, _idForm: number, formControl: FormControl) => console.log('Nome cambiato', formControl.value),
               } as any,
            },
            {
               formAction: {
                  title: 'Cognome',
                  type: TYPE_CONTROL_FORM.TEXT,
                  formName: 'lastName',
                  placeholder: 'Inserisci il cognome',
                  css: {class: ['col-12', 'col-md-6']},
                  formControl: new FormControl<string | null>(null, [Validators.required]),
               } as any,
            },
            {
               formAction: {
                  title: 'Email',
                  type: TYPE_CONTROL_FORM.EMAIL,
                  formName: 'email',
                  placeholder: 'nome@email.it',
                  css: {class: ['col-12', 'col-md-6']},
                  formControl: new FormControl<string | null>(null, [Validators.required, Validators.email]),
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
                  title: 'Descrizione',
                  type: TYPE_CONTROL_FORM.TEXTAREA,
                  formName: 'description',
                  placeholder: 'Descrizione lunga',
                  css: {class: ['col-12'], rows: 4},
                  formControl: new FormControl<string | null>(null, [Validators.maxLength(500)]),
               } as any,
            },
         ],
      },
      {
         title: 'Numeri, date e file',
         class: ['col-12', 'p-0'],
         formGroup: [
            {
               formAction: {
                  title: 'Età',
                  type: TYPE_CONTROL_FORM.NUMBER,
                  formName: 'age',
                  placeholder: 'Età',
                  css: {class: ['col-12', 'col-md-4']},
                  optionNumber: {min: 18, max: 99, step: 1},
                  formControl: new FormControl<number | null>(null, [Validators.required, Validators.min(18), Validators.max(99)]),
               } as any,
            },
            {
               formAction: {
                  title: 'Importo',
                  type: TYPE_CONTROL_FORM.CURRENCY,
                  formName: 'amount',
                  placeholder: 'Importo',
                  css: {class: ['col-12', 'col-md-4']},
                  formControl: new FormControl<number | null>(0, [Validators.required, Validators.min(0)]),
                  currency: 'EUR',
               } as any,
            },
            {
               formAction: {
                  title: 'Anno',
                  type: TYPE_CONTROL_FORM.YEAR,
                  formName: 'year',
                  css: {class: ['col-12', 'col-md-4']},
                  formControl: new FormControl<number | null>(new Date().getFullYear()),
               } as any,
            },
            {
               formAction: {
                  title: 'Data',
                  type: TYPE_CONTROL_FORM.DATA,
                  formName: 'date',
                  css: {class: ['col-12', 'col-md-4']},
                  formControl: new FormControl<Date | null>(null, [Validators.required]),
               } as any,
            },
            {
               formAction: {
                  title: 'Data e ora',
                  type: TYPE_CONTROL_FORM.DATETIME,
                  formName: 'dateTime',
                  css: {class: ['col-12', 'col-md-4']},
                  formControl: new FormControl<Date | null>(null),
               } as any,
            },
            {
               formAction: {
                  title: 'Ora',
                  type: TYPE_CONTROL_FORM.TIME,
                  formName: 'time',
                  css: {class: ['col-12', 'col-md-4']},
                  formControl: new FormControl<string | null>('09:00'),
               } as any,
            },
            {
               formAction: {
                  title: 'Intervallo date',
                  type: TYPE_CONTROL_FORM.DATARANGE,
                  formName: 'period',
                  css: {class: ['col-12', 'col-md-6']},
                  readonly: true,
                  formControl: new FormGroup({
                     from: new FormControl<Date | null>(null),
                     to: new FormControl<Date | null>(null),
                  }),
               } as any,
            },
            {
               formAction: {
                  title: 'Allegato',
                  type: TYPE_CONTROL_FORM.FILE,
                  formName: 'attachment',
                  css: {class: ['col-12', 'col-md-6']},
                  accept: '.pdf,.png,.jpg,.jpeg',
                  formControl: new FormControl<File | null>(null),
               } as any,
            },
         ],
      },
      {
         title: 'Combo, radio, checkbox e paginazione',
         class: ['col-12', 'p-0'],
         formGroup: [
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
                  keyCombo: {keyId: 'id', keyDescription: 'description'},
               } as any,
            },
            {
               formAction: {
                  title: 'Attivo',
                  type: TYPE_CONTROL_FORM.CHECKBOX,
                  formName: 'active',
                  css: {class: ['col-12', 'col-md-6']},
                  formControl: new FormControl<boolean>(true),
               } as any,
            },
            {
               formAction: {
                  title: 'Categoria',
                  type: TYPE_CONTROL_FORM.COMBO,
                  formName: 'category',
                  placeholder: 'Scegli categoria',
                  css: {class: ['col-12', 'col-md-6']},
                  formControl: new FormControl<string | null>(null, [Validators.required]),
                  autocomplete: true,
                  multiple: false,
                  resetButton: true,
                  options: signal([
                     {id: 'travel', description: 'Viaggi'},
                     {id: 'food', description: 'Alimentari'},
                     {id: 'medical', description: 'Medico'},
                     {id: 'sport', description: 'Sport'},
                     {id: 'home', description: 'Casa'},
                  ]),
                  keyCombo: {keyId: 'id', keyDescription: 'description'},
               } as any,
            },
            {
               formAction: {
                  title: 'Tag multipli',
                  type: TYPE_CONTROL_FORM.COMBO,
                  formName: 'tags',
                  placeholder: 'Seleziona tag',
                  css: {class: ['col-12', 'col-md-6']},
                  formControl: new FormControl<string[]>([]),
                  autocomplete: true,
                  multiple: true,
                  resetButton: true,
                  options: signal([
                     {id: 'urgent', description: 'Urgente'},
                     {id: 'refund', description: 'Da rimborsare'},
                     {id: 'private', description: 'Privato'},
                     {id: 'work', description: 'Lavoro'},
                  ]),
                  keyCombo: {keyId: 'id', keyDescription: 'description'},
               } as any,
            },
            {
               formAction: {
                  title: 'Operatore paginato',
                  type: TYPE_CONTROL_FORM.COMBOPAGINATE,
                  formName: 'operatorId',
                  placeholder: 'Cerca operatore e scorri in fondo',
                  css: {class: ['col-12']},
                  formControl: new FormControl<number | null>(null),
                  autocomplete: true,
                  multiple: false,
                  resetButton: true,
                  paging: {count: 10, page: 1, totalCount: OPERATORS.length},
                  paramsForRemoteData: signal({tenantId: 1}),
                  keyCombo: {keyId: 'id', keyDescription: ['description', 'role'], keySearch: 'search'},
                  options: signal({items: [], totalCount: OPERATORS.length} as any),
                  remoteData: ({param, externalStore}: any) => {
                     console.log('remoteData COMBOPAGINATE', param);
                     setTimeout(() => externalStore?.set?.(queryOperators(param)), 180);
                  },
               } as any,
            },
         ],
      },
      {
         title: 'Azioni, link, array e gruppo annidato',
         class: ['col-12', 'p-0'],
         formGroup: [
            {
               formAction: {
                  title: 'Link documento',
                  type: TYPE_CONTROL_FORM.LINK,
                  formName: 'documentLink',
                  css: {class: ['col-12', 'col-md-6']},
                  label: 'Apri example.com',
                  href: 'https://example.com',
                  target: '_blank',
               } as any,
            },
            {
               formAction: {
                  title: 'Direzione ordinamento',
                  type: TYPE_CONTROL_FORM.SORTACTION,
                  formName: 'sortDirection',
                  css: {class: ['col-12', 'col-md-6'], iconCss: 'sort-action-icon', toggleIcons: ['assets/icons/sort-asc.svg', 'assets/icons/sort-desc.svg']},
                  formControl: new FormControl<'ASC' | 'DESC'>('ASC'),
                  toggleAction: direction => console.log('Sort cambiato', direction),
               } as any,
            },
            {
               formAction: {
                  title: 'Lista note',
                  type: TYPE_CONTROL_FORM.ARRAYSTRING,
                  formName: 'notes',
                  css: {class: ['col-12']},
                  placeholder: 'Aggiungi nota',
                  formControl: new FormControl<string[]>(['Prima nota', 'Seconda nota']),
               } as any,
            },
            {
               formAction: {
                  title: 'Indirizzo',
                  type: TYPE_CONTROL_FORM.GROUP,
                  formName: 'address',
                  css: {class: ['col-12']},
                  formGroup: [
                     {
                        title: 'Dati indirizzo',
                        class: ['col-12', 'p-0'],
                        formGroup: [
                           {formAction: {title: 'Via', type: TYPE_CONTROL_FORM.TEXT, formName: 'street', css: {class: ['col-12', 'col-md-6']}, formControl: new FormControl<string | null>(null)} as any},
                           {formAction: {title: 'Civico', type: TYPE_CONTROL_FORM.TEXT, formName: 'streetNumber', css: {class: ['col-12', 'col-md-3']}, formControl: new FormControl<string | null>(null)} as any},
                           {formAction: {title: 'CAP', type: TYPE_CONTROL_FORM.TEXT, formName: 'zipCode', css: {class: ['col-12', 'col-md-3']}, formControl: new FormControl<string | null>(null, [Validators.pattern(/^[0-9]{5}$/)])} as any},
                        ],
                     },
                  ],
               } as any,
            },
         ],
         actions: [
            {
               label: 'Leggi valori',
               visible: true,
               cssClassButton: ['btn', 'btn-primary', 'mt-3'],
               action: (_questions, idForm, formGroup) => console.log('Azione gruppo', idForm, formGroup.value),
            },
         ],
      },
   ];
}
