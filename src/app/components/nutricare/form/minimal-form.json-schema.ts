/** @format */

import { DynamicFormJsonSchema } from 'projects/dynamicform/src/lib/models/dynamic-form-json-schema.model';

export const MINIMAL_FORM_JSON_SCHEMA: DynamicFormJsonSchema = {
    groups: [
        {
            title: 'Dati anagrafici',
            class: ['row'],
            fields: [
                {
                    name: 'nome',
                    type: 'TEXT',
                    label: 'Nome',
                    class: ['col-md-6'],
                    validators: [{ type: 'required', message: 'Il nome è obbligatorio' }],
                },
                {
                    name: 'cognome',
                    type: 'TEXT',
                    label: 'Cognome',
                    class: ['col-md-6'],
                    validators: [{ type: 'required', message: 'Il cognome è obbligatorio' }],
                },
                {
                    name: 'email',
                    type: 'TEXT',
                    label: 'Email',
                    class: ['col-md-8'],
                    validators: [{ type: 'required' }, { type: 'email', message: 'Email non valida' }],
                },
                {
                    name: 'ruolo',
                    type: 'COMBO',
                    label: 'Ruolo',
                    class: ['col-md-4'],
                    options: [
                        { id: 'admin', description: 'Amministratore' },
                        { id: 'user', description: 'Utente' },
                        { id: 'guest', description: 'Ospite' },
                    ],
                },
                {
                    name: 'dataNascita',
                    type: 'DATA',
                    label: 'Data di nascita',
                    class: ['col-md-4'],
                },
                {
                    name: 'indirizzo',
                    type: 'GROUP',
                    label: 'Indirizzo',
                    class: ['col-12'],
                    children: [
                        {
                            title: 'Indirizzo',
                            class: ['row'],
                            fields: [
                                {
                                    name: 'via',
                                    type: 'TEXT',
                                    label: 'Via',
                                    class: ['col-12'],
                                    validators: [{ type: 'required', message: 'La via è obbligatoria' }],
                                },
                                {
                                    name: 'citta',
                                    type: 'TEXT',
                                    label: 'Città',
                                    class: ['col-md-8'],
                                    validators: [{ type: 'required', message: 'La città è obbligatoria' }],
                                },
                                {
                                    name: 'cap',
                                    type: 'TEXT',
                                    label: 'CAP',
                                    class: ['col-md-4'],
                                    validators: [{ type: 'pattern', value: '^[0-9]{5}$', message: 'CAP non valido' }],
                                },
                            ],
                            actions: [
                                { label: 'Aggiungi indirizzo', event: 'addAddress', visible: true },
                            ],
                        },
                    ],
                },
            ],
            actions: [
                { label: 'Salva', event: 'onSave', visible: true },
                { label: 'Annulla', event: 'onCancel', visible: true },
            ],
        },
    ],
};
