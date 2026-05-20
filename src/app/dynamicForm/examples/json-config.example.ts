/** @format */

import {DynamicFormJsonSchema} from '../models/dynamic-form-json-schema.model';

export const dynamicFormJsonExample: DynamicFormJsonSchema = {
   id: 'demo-json-form',
   groups: [
      {
         id: 'registry',
         title: 'Anagrafica da JSON',
         class: ['row'],
         fields: [
            {
               name: 'firstName',
               type: 'TEXT',
               label: 'Nome',
               class: ['col-6'],
               validators: [{type: 'required', message: 'Il nome è obbligatorio'}],
               events: {
                  change: 'firstNameChanged',
               },
            },
            {
               name: 'age',
               type: 'NUMBER',
               label: 'Età',
               class: ['col-6'],
               validators: [
                  {type: 'required', message: 'Età obbligatoria'},
                  {type: 'min', value: 18, message: 'Devi essere maggiorenne'},
               ],
               optionNumber: {min: 18, max: 99, step: 1},
            },
            {
               name: 'gender',
               type: 'COMBO',
               label: 'Sesso',
               class: ['col-6'],
               autocomplete: true,
               keyCombo: {keyId: 'id', keyDescription: 'description'},
               options: [
                  {id: 'M', description: 'Maschio'},
                  {id: 'F', description: 'Femmina'},
               ],
            },
         ],
      },
   ],
};
