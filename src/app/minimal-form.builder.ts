/** @format */

import { signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigForm, TYPE_CONTROL_FORM } from 'projects/dynamicform/src/public-api';

function field(formAction: any): any {
    return { formAction };
}

// ---------------------------------------------------------------------------
// Factory per un gruppo-indirizzo (Group config + reactive FormGroup).
// `createBuilderAddressGroup` e `addBuilderAddress` si referenziano a vicenda;
// le function declarations sono hoist-ate quindi l'ordine non è rilevante.
// ---------------------------------------------------------------------------

function createBuilderAddressGroup(idx: number): { config: any; fg: FormGroup } {
    const via   = new FormControl(null, Validators.required);
    const citta = new FormControl(null, Validators.required);
    const cap   = new FormControl(null, Validators.pattern(/^[0-9]{5}$/));
    const fg = new FormGroup({ via, citta, cap });

    const config = {
        title: `Indirizzo ${idx}`,
        class: ['row'],
        formGroup: [
            field({ formName: 'via',   type: TYPE_CONTROL_FORM.TEXT, title: 'Via',   formControl: via,   css: { class: ['col-12'] } }),
            field({ formName: 'citta', type: TYPE_CONTROL_FORM.TEXT, title: 'Città', formControl: citta, css: { class: ['col-md-8'] } }),
            field({ formName: 'cap',   type: TYPE_CONTROL_FORM.TEXT, title: 'CAP',  formControl: cap,   css: { class: ['col-md-4'] } }),
        ],
        actions: [
            {
                label: 'Aggiungi indirizzo',
                visible: true,
                action: (questions: any, idForm: string, fg: FormGroup | FormArray) =>
                    addBuilderAddress(questions, idForm, fg),
            },
        ],
    };

    return { config, fg };
}

function addBuilderAddress(questions: any, _idForm: string, formGroup: FormGroup | FormArray): void {
    const configForm = questions as any[];
    if (!configForm?.length) return;

    const parentGroup = configForm[0];
    const indirizzoField = (parentGroup.formGroup as any[]).find(
        (f: any) => f.formAction?.formName === 'indirizzo',
    );
    if (!indirizzoField?.formAction?.formGroup) return;

    const idx = (indirizzoField.formAction.formGroup as any[]).length + 1;
    const { config, fg } = createBuilderAddressGroup(idx);

    // 1. Aggiunge il gruppo config a indirizzo.formGroup (rendering visivo)
    indirizzoField.formAction.formGroup.push(config);

    // 2. Aggiunge il FormGroup al FormArray in rootFormGroup.get('indirizzo')
    if (formGroup instanceof FormGroup) {
        const indirizzoArray = formGroup.get('indirizzo') as FormArray;
        if (indirizzoArray instanceof FormArray) {
            indirizzoArray.push(fg);
        }
    }

    console.log(`[APP BUILDER] Aggiunto indirizzo ${idx}`);
}

// ---------------------------------------------------------------------------

export function buildMinimalForm(): ConfigForm {
    const { config: addr1 } = createBuilderAddressGroup(1);

    return [
        {
            title: 'Dati anagrafici',
            class: ['row'],
            formGroup: [
                field({
                    formName: 'nome',
                    type: TYPE_CONTROL_FORM.TEXT,
                    title: 'Nome',
                    formControl: new FormControl(null, Validators.required),
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'cognome',
                    type: TYPE_CONTROL_FORM.TEXT,
                    title: 'Cognome',
                    formControl: new FormControl(null, Validators.required),
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'email',
                    type: TYPE_CONTROL_FORM.TEXT,
                    title: 'Email',
                    formControl: new FormControl(null, [Validators.required, Validators.email]),
                    css: { class: ['col-md-8'] },
                }),
                field({
                    formName: 'ruolo',
                    type: TYPE_CONTROL_FORM.COMBO,
                    title: 'Ruolo',
                    formControl: new FormControl(null),
                    css: { class: ['col-md-4'] },
                    options: signal([
                        { id: 'admin', description: 'Amministratore' },
                        { id: 'user', description: 'Utente' },
                        { id: 'guest', description: 'Ospite' },
                    ]),
                }),
                field({
                    formName: 'dataNascita',
                    type: TYPE_CONTROL_FORM.DATA,
                    title: 'Data di nascita',
                    formControl: new FormControl(null),
                    css: { class: ['col-md-4'] },
                }),
                field({
                    formName: 'indirizzo',
                    type: TYPE_CONTROL_FORM.GROUP,
                    title: 'Indirizzi',
                    css: { class: ['col-12'] },
                    formGroup: [addr1],
                }),
            ],
            actions: [
                {
                    label: 'Salva',
                    visible: true,
                    action: (_questions, _id, formGroup) => {
                        console.log('[APP BUILDER] Salva:', formGroup.value);
                    },
                },
                {
                    label: 'Annulla',
                    visible: true,
                    action: () => console.log('[APP BUILDER] Annulla'),
                },
            ],
        },
    ];
}
