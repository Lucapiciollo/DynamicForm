/** @format */

import {DynamicFormJsonSchema} from '../models/dynamic-form-json-schema.model';

export const NESTED_ACTIONS_JSON_SCHEMA: DynamicFormJsonSchema = {
   id: 'nested-actions-json-playground',
   groups: [
      {
         title: 'JSON - Scheda cliente completa',
         class: ['col-12', 'df-section-main'],
         fields: [
            {
               name: 'registry',
               type: 'GROUP',
               label: 'Dati anagrafici',
               class: ['col-12', 'df-card'],
               children: [
                  {
                     title: 'Anagrafica',
                     class: ['col-12', 'df-sub-group'],
                     fields: [
                        {name: 'firstName', type: 'TEXT', label: 'Nome', class: ['col-12', 'col-md-6'], validators: [{type: 'required'}, {type: 'minLength', value: 3}], events: {change: 'logFieldChange'}},
                        {name: 'lastName', type: 'TEXT', label: 'Cognome', class: ['col-12', 'col-md-6'], validators: [{type: 'required'}]},
                        {name: 'email', type: 'EMAIL', label: 'Email', class: ['col-12', 'col-md-6'], validators: [{type: 'required'}, {type: 'email'}]},
                        {name: 'phone', type: 'TEXT', label: 'Telefono', class: ['col-12', 'col-md-6']},
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
                        {name: 'active', type: 'CHECKBOX', label: 'Cliente attivo', value: true, class: ['col-12', 'col-md-6']},
                     ],
                  },
               ],
            },
            {
               name: 'document',
               type: 'GROUP',
               label: 'Documento',
               class: ['col-12', 'df-card'],
               children: [
                  {
                     title: 'Dati documento',
                     class: ['col-12', 'df-sub-group'],
                     fields: [
                        {
                           name: 'documentType',
                           type: 'COMBO',
                           label: 'Tipo documento',
                           class: ['col-12', 'col-md-4'],
                           validators: [{type: 'required'}],
                           options: [
                              {id: 'CI', description: 'Carta identità'},
                              {id: 'PASS', description: 'Passaporto'},
                              {id: 'PAT', description: 'Patente'},
                           ],
                           keyCombo: {keyId: 'id', keyDescription: ['description']},
                        },
                        {name: 'documentNumber', type: 'TEXT', label: 'Numero documento', class: ['col-12', 'col-md-4'], validators: [{type: 'required'}]},
                        {name: 'documentExpireDate', type: 'DATA', label: 'Scadenza', class: ['col-12', 'col-md-4'], validators: [{type: 'required'}]},
                     ],
                  },
               ],
            },
         ],
         actions: [
            {label: 'JSON valida anagrafica', event: 'validateRegistry', visible: true, cssClassButton: ['btn', 'btn-primary', 'me-2', 'mb-2']},
            {label: 'JSON patch anagrafica', event: 'patchRegistry', visible: true, cssClassButton: ['btn', 'btn-secondary', 'me-2', 'mb-2']},
         ],
      },
      {
         title: 'JSON - Contratto e importi',
         class: ['col-12', 'df-section-main'],
         fields: [
            {
               name: 'contract',
               type: 'GROUP',
               label: 'Dati contratto',
               class: ['col-12', 'df-card'],
               children: [
                  {
                     title: 'Contratto',
                     class: ['col-12', 'df-sub-group'],
                     fields: [
                        {name: 'code', type: 'TEXT', label: 'Codice contratto', class: ['col-12', 'col-md-4'], validators: [{type: 'required'}]},
                        {
                           name: 'type',
                           type: 'COMBO',
                           label: 'Tipo contratto',
                           class: ['col-12', 'col-md-4'],
                           options: [
                              {id: 'STANDARD', description: 'Standard'},
                              {id: 'PREMIUM', description: 'Premium'},
                              {id: 'CUSTOM', description: 'Personalizzato'},
                           ],
                           keyCombo: {keyId: 'id', keyDescription: ['description']},
                        },
                        {name: 'immediateActivation', type: 'CHECKBOX', label: 'Attivazione immediata', value: false, class: ['col-12', 'col-md-4']},
                        {
                           name: 'period',
                           type: 'GROUP',
                           label: 'Periodo contratto',
                           class: ['col-12', 'df-sub-card'],
                           children: [
                              {
                                 title: 'Periodo',
                                 class: ['col-12', 'df-sub-group'],
                                 fields: [
                                    {name: 'from', type: 'DATA', label: 'Dal', class: ['col-12', 'col-md-6']},
                                    {name: 'to', type: 'DATA', label: 'Al', class: ['col-12', 'col-md-6']},
                                 ],
                              },
                           ],
                        },
                        {
                           name: 'amounts',
                           type: 'GROUP',
                           label: 'Importi',
                           class: ['col-12', 'df-sub-card'],
                           children: [
                              {
                                 title: 'Importi',
                                 class: ['col-12', 'df-sub-group'],
                                 fields: [
                                    {name: 'taxable', type: 'CURRENCY', label: 'Imponibile', value: 0, class: ['col-12', 'col-md-4'], validators: [{type: 'min', value: 0}]},
                                    {name: 'vat', type: 'NUMBER', label: 'IVA %', value: 22, class: ['col-12', 'col-md-4'], validators: [{type: 'min', value: 0}, {type: 'max', value: 100}]},
                                    {name: 'total', type: 'CURRENCY', label: 'Totale', value: 0, disabled: true, class: ['col-12', 'col-md-4']},
                                 ],
                              },
                           ],
                        },
                     ],
                  },
               ],
            },
         ],
         actions: [
            {label: 'JSON calcola totale', event: 'calculateTotal', visible: true, cssClassButton: ['btn', 'btn-success', 'me-2', 'mb-2']},
            {label: 'JSON leggi form', event: 'readWholeForm', visible: true, cssClassButton: ['btn', 'btn-primary', 'me-2', 'mb-2']},
         ],
      },
   ],
};
