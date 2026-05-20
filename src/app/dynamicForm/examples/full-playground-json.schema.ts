/** @format */

import {DynamicFormJsonSchema} from '../models/dynamic-form-json-schema.model';

export const FULL_PLAYGROUND_JSON_SCHEMA: DynamicFormJsonSchema = {
   id: 'full-playground-json-schema',
   groups: [
      {
         title: 'JSON playground - tutti i componenti principali',
         class: ['col-12', 'df-section-main'],
         fields: [
            {
               name: 'registry',
               type: 'GROUP',
               label: 'Anagrafica',
               class: ['col-12', 'df-card'],
               children: [
                  {
                     title: 'Dati principali JSON',
                     class: ['col-12', 'df-sub-group'],
                     fields: [
                        {name: 'firstName', type: 'TEXT', label: 'Nome', class: ['col-12', 'col-md-6'], props: {placeholder: 'Inserisci nome', disableSpeech: true}, validators: [{type: 'required'}, {type: 'minLength', value: 3}], events: {change: 'logFieldChange'}},
                        {name: 'lastName', type: 'TEXT', label: 'Cognome', class: ['col-12', 'col-md-6'], props: {placeholder: 'Inserisci cognome', disableSpeech: true}, validators: [{type: 'required'}]},
                        {name: 'email', type: 'EMAIL', label: 'Email', class: ['col-12', 'col-md-6'], props: {placeholder: 'nome@email.it', disableSpeech: true}, validators: [{type: 'required'}, {type: 'email'}]},
                        {name: 'phone', type: 'TEXT', label: 'Telefono', class: ['col-12', 'col-md-6'], props: {placeholder: 'Telefono', disableSpeech: true}},
                        {name: 'birthDate', type: 'DATA', label: 'Data nascita', class: ['col-12', 'col-md-6'], props: {placeholder: 'Seleziona data', resetButton: true}},
                        {
                           name: 'appointmentSlot',
                           type: 'DATETIME',
                           label: 'Fascia appuntamento',
                           class: ['col-12', 'col-md-6'],
                           value: '2026-05-21T09:00:00',
                           options: [
                              {id: '2026-05-21T09:00:00', description: '21/05/2026 09:00'},
                              {id: '2026-05-21T10:30:00', description: '21/05/2026 10:30'},
                              {id: '2026-05-21T15:00:00', description: '21/05/2026 15:00'},
                           ],
                           keyCombo: {keyId: 'id', keyDescription: ['description']},
                           props: {placeholder: 'Seleziona fascia'},
                        },
                        {
                           name: 'gender',
                           type: 'RADIOGROUP',
                           label: 'Sesso',
                           value: 'M',
                           class: ['col-12', 'col-md-6'],
                           options: [
                              {id: 'M', description: 'Maschio'},
                              {id: 'F', description: 'Femmina'},
                              {id: 'N', description: 'Non specificato'},
                           ],
                           keyCombo: {keyId: 'id', keyDescription: ['description']},
                        },
                        {name: 'active', type: 'CHECKBOX', label: 'Cliente attivo', value: true, class: ['col-12', 'col-md-3']},
                        {name: 'privacy', type: 'CHECKBOX', label: 'Privacy accettata', value: false, class: ['col-12', 'col-md-3'], validators: [{type: 'requiredTrue'}]},
                        {
                           name: 'customerCategory',
                           type: 'COMBO',
                           label: 'Categoria cliente',
                           class: ['col-12', 'col-md-6'],
                           value: 'PRIVATE',
                           options: [
                              {id: 'PRIVATE', description: 'Privato'},
                              {id: 'COMPANY', description: 'Azienda'},
                              {id: 'PUBLIC', description: 'Pubblica amministrazione'},
                           ],
                           keyCombo: {keyId: 'id', keyDescription: ['description']},
                           autocomplete: true,
                           multiple: false,
                           props: {placeholder: 'Seleziona categoria', resetButton: true},
                        },
                     ],
                  },
               ],
            },
            {
               name: 'addresses',
               type: 'GROUP',
               label: 'Indirizzo e operatore',
               class: ['col-12', 'df-card'],
               children: [
                  {
                     title: 'Indirizzo JSON',
                     class: ['col-12', 'df-sub-group'],
                     fields: [
                        {name: 'street', type: 'TEXT', label: 'Via', class: ['col-12', 'col-md-6'], props: {placeholder: 'Via', disableSpeech: true}},
                        {name: 'streetNumber', type: 'TEXT', label: 'Civico', class: ['col-12', 'col-md-2'], props: {placeholder: 'Civico', disableSpeech: true}},
                        {name: 'zipCode', type: 'TEXT', label: 'CAP', class: ['col-12', 'col-md-4'], props: {placeholder: 'CAP', disableSpeech: true}, validators: [{type: 'pattern', value: '^[0-9]{5}$'}]},
                        {name: 'city', type: 'TEXT', label: 'Comune', class: ['col-12', 'col-md-6'], props: {placeholder: 'Comune', disableSpeech: true}},
                        {name: 'province', type: 'TEXT', label: 'Provincia', class: ['col-12', 'col-md-6'], props: {placeholder: 'Provincia', disableSpeech: true}},
                        {
                           name: 'region',
                           type: 'COMBO',
                           label: 'Regione',
                           class: ['col-12', 'col-md-6'],
                           options: [
                              {id: 'LAZIO', description: 'Lazio'},
                              {id: 'UMBRIA', description: 'Umbria'},
                              {id: 'TOSCANA', description: 'Toscana'},
                              {id: 'CAMPANIA', description: 'Campania'},
                           ],
                           keyCombo: {keyId: 'id', keyDescription: ['description']},
                           autocomplete: true,
                           multiple: false,
                           props: {placeholder: 'Seleziona regione', resetButton: true},
                        },
                        {
                           name: 'operatorId',
                           type: 'COMBOPAGINATE',
                           label: 'Operatore paginato JSON',
                           class: ['col-12', 'col-md-6'],
                           remoteData: 'loadOperatorsRemote',
                           paging: {count: 10, page: 1, totalCount: 75},
                           paramsForRemoteData: {tenantId: 1},
                           keyCombo: {keyId: 'id', keyDescription: ['description', 'role', 'department'], keySearch: 'search'},
                           autocomplete: true,
                           multiple: false,
                           props: {placeholder: 'Cerca operatore remoto', resetButton: true, enableInfiniteScroll: true},
                        },
                     ],
                  },
               ],
            },
            {
               name: 'contract',
               type: 'GROUP',
               label: 'Contratto',
               class: ['col-12', 'df-card'],
               children: [
                  {
                     title: 'Contratto JSON',
                     class: ['col-12', 'df-sub-group'],
                     fields: [
                        {name: 'code', type: 'TEXT', label: 'Codice contratto', class: ['col-12', 'col-md-4'], props: {placeholder: 'Codice contratto', disableSpeech: true}, validators: [{type: 'required'}]},
                        {name: 'taxable', type: 'NUMBER', label: 'Importo imponibile', value: 0, class: ['col-12', 'col-md-4'], props: {placeholder: 'Imponibile'}, validators: [{type: 'min', value: 0}]},
                        {name: 'vat', type: 'NUMBER', label: 'IVA %', value: 22, class: ['col-12', 'col-md-4'], props: {placeholder: 'IVA'}, validators: [{type: 'min', value: 0}, {type: 'max', value: 100}]},
                        {name: 'total', type: 'NUMBER', label: 'Totale', value: 0, disabled: true, class: ['col-12', 'col-md-4'], props: {placeholder: 'Totale'}},
                        {name: 'contractPeriod', type: 'DATARANGE', label: 'Periodo contratto', class: ['col-12', 'col-md-8'], props: {placeholder: 'Seleziona periodo', resetButton: true}},
                        {name: 'notes', type: 'TEXTAREA', label: 'Note contratto', class: ['col-12'], css: {class: ['col-12'], rows: 4}, props: {placeholder: 'Note', disableSpeech: true}},
                        {name: 'tags', type: 'ARRAYSTRING', label: 'Tag cliente', value: ['json', 'cliente'], class: ['col-12', 'col-md-6'], props: {placeholder: 'Aggiungi tag e premi invio'}},
                        {name: 'attachment', type: 'FILE', label: 'Allegato documento', class: ['col-12', 'col-md-6'], props: {placeholder: 'Seleziona file', accept: '.pdf,.png,.jpg,.jpeg', size: 5242880}},
                     ],
                  },
               ],
            },
         ],
         actions: [
            {label: 'JSON patch anagrafica', event: 'patchRegistry', visible: true, cssClassButton: ['df-action-btn', 'df-action-primary']},
            {label: 'JSON calcola totale', event: 'calculateTotal', visible: true, cssClassButton: ['df-action-btn', 'df-action-success']},
            {label: 'JSON leggi form', event: 'readWholeForm', visible: true, cssClassButton: ['df-action-btn', 'df-action-info']},
            {label: 'JSON valida tutto', event: 'validateAll', visible: true, cssClassButton: ['df-action-btn', 'df-action-warning']},
         ],
      },
   ],
};
