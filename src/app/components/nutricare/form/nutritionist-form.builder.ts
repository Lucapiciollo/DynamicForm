/** @format */

import { signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigForm, DynamicFormActionButton, TYPE_CONTROL_FORM } from 'projects/dynamicform/src/public-api';
import { calcBMIHelper } from './nutritionist-form.events';
import { DynamicFormBuilder } from 'projects/dynamicform/src/lib/dynamic-form.builder';

// ---------------------------------------------------------------------------
// Helper: avvolge un oggetto FormAction nella struttura Form
// ---------------------------------------------------------------------------
function field(formAction: any): any {
    return { formAction };
}

// ---------------------------------------------------------------------------
// Opzioni condivise — signal esportati per aggiornamento da NgRx Store
// ---------------------------------------------------------------------------
export const livelloAttivitaOptions = signal([]);

export const tipoAttivitaOptions = signal([]);

export const freqAllenamentoOptions = signal([]);

const sessoOptions = signal([]);

const stressOptions = signal([]);

const obiettivoOptions = signal([]);

// ---------------------------------------------------------------------------
// onChange per BMI (firma completa di DynamicFormOnChange)
// ---------------------------------------------------------------------------
const onBMIChange = (
    _i: any, _j: any, _fc: any, _n: any, _fg: any,
    _t: any, _p: any, _ag: any, utility: any,
) => calcBMIHelper(utility);

// ---------------------------------------------------------------------------
// Helper: genera il CAMPO GROUP di un giorno (7 dati: 5 pasti + note + sgarro)
// StepperService: formName → FormArray([FormGroup({ colazione, pranzo, ... })])
// ---------------------------------------------------------------------------
function giornoBuilder(id: string, emoji: string, giorno: string): any {
    return field({
        formName: id,
        type: TYPE_CONTROL_FORM.GROUP,
        title: `${emoji} ${giorno}`,
        css: { class: ['col-12'] },
        formGroup: [
            {
                title: `${emoji} ${giorno}`,
                class: ['col-12', 'nutri-day-card'],
                formGroup: [
                    field({ formName: 'colazione', type: TYPE_CONTROL_FORM.TEXTAREA, title: '☀️ Colazione', formControl: new FormControl(null), rows: 3, css: { class: ['col-md-4'] } }),
                    field({ formName: 'spuntino_mattina', type: TYPE_CONTROL_FORM.TEXTAREA, title: '🍎 Spuntino mattina', formControl: new FormControl(null), rows: 3, css: { class: ['col-md-4'] } }),
                    field({ formName: 'pranzo', type: TYPE_CONTROL_FORM.TEXTAREA, title: '🌤️ Pranzo', formControl: new FormControl(null), rows: 3, css: { class: ['col-md-4'] } }),
                    field({ formName: 'spuntino_pomeriggio', type: TYPE_CONTROL_FORM.TEXTAREA, title: '🍵 Spuntino pomeriggio', formControl: new FormControl(null), rows: 3, css: { class: ['col-md-4'] } }),
                    field({ formName: 'cena', type: TYPE_CONTROL_FORM.TEXTAREA, title: '🌙 Cena', formControl: new FormControl(null), rows: 3, css: { class: ['col-md-4'] } }),
                    field({ formName: 'note', type: TYPE_CONTROL_FORM.TEXTAREA, title: '📝 Note del giorno', formControl: new FormControl(null), rows: 2, css: { class: ['col-md-7'] } }),
                    field({ formName: 'sgarro', type: TYPE_CONTROL_FORM.CHECKBOX, title: '🍕 Sgarro / Strappo', formControl: new FormControl(false), css: { class: ['col-md-5'] } }),
                ],
            },
        ],
    });
}


const salvaAction: DynamicFormActionButton = {
    label: 'Salva',
    visible: true,
    action: (
        formControl,
        formName,
        formGroup,
        allGroup,
        utility,
        idGroup,
        idForm
    ) => {
        alert('Hai cliccato il bottone!');
        console.log({
            formControl,
            formName,
            formGroup,
            allGroup,
            utility,
            idGroup,
            idForm,
        });
    },

};

// Campo con azione custom (es. bottone)


// Campo con onChange
const nome = {
    formName: 'nome',
    title: 'Nome',
    type: TYPE_CONTROL_FORM.COMBO,
    options: signal([{ id: '1', description: 'Opzione 1' }, { id: '2', description: 'Opzione 2' }]),
    formControl: new FormControl('', Validators.required),
    onChange: (idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility) => {
        console.log('[onChange]', { idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility });
    },
    onInitialize: (idGroup, idForm, formControl, formName, formGroup, type, allGroup) => {
        console.log('[onInitialize]', { idGroup, idForm, formControl, formName, formGroup, type, allGroup });
    },
    onFocus: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
        console.log('[onFocus]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
    },
    onBlur: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
        console.log('[onBlur]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
    },
    onSearch: (idGroup, idForm, formControl, formName, formGroup, search, utility) => {
        console.log('[onSearch]', { idGroup, idForm, formControl, formName, formGroup, search, utility });
    },
    onScrollEnd: (idGroup, idForm, formControl, formName, formGroup, paging, utility) => {
        console.log('[onScrollEnd]', { idGroup, idForm, formControl, formName, formGroup, paging, utility });
    }
};

// Campo con onInitialize
const email = {
    formName: 'email',
    title: 'Email',
    type: TYPE_CONTROL_FORM.TEXT,
    formControl: new FormControl('', Validators.email),
    onInitialize: () => console.log('Campo email inizializzato'),
};
const campoConAction = {
    formName: 'bottoneCustom',
    type: TYPE_CONTROL_FORM.BUTTON,
    title: 'Clicca qui',
    action: () => alert('Hai cliccato il bottone!'),
};

const campoConOnChange = {
    formName: 'nome',
    title: 'Nome',
    type: TYPE_CONTROL_FORM.COMBO,
    options: signal([{ id: '1', description: 'Opzione 1' }, { id: '2', description: 'Opzione 2' }]),
    formControl: new FormControl(''),
    onChange: (idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility) => {
        console.log('[onChange]', { idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility });
    },
    onInitialize: (idGroup, idForm, formControl, formName, formGroup, type, allGroup) => {
        console.log('[onInitialize]', { idGroup, idForm, formControl, formName, formGroup, type, allGroup });
    },
    onFocus: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
        console.log('[onFocus]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
    },
    onBlur: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
        console.log('[onBlur]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
    },
    onSearch: (idGroup, idForm, formControl, formName, formGroup, search, utility) => {
        console.log('[onSearch]', { idGroup, idForm, formControl, formName, formGroup, search, utility });
    },
    onScrollEnd: (idGroup, idForm, formControl, formName, formGroup, paging, utility) => {
        console.log('[onScrollEnd]', { idGroup, idForm, formControl, formName, formGroup, paging, utility });
    },
};

const campoConOnInitialize = {
    formName: 'email',
    title: 'Email',
    type: TYPE_CONTROL_FORM.TEXT,
    formControl: new FormControl(''),
    onChange: (idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility) => {
        console.log('Campo email cambiato')
    },
    onInitialize: (idGroup, idForm, formControl, formName, formGroup, type, allGroup) => {
        console.log('Campo email inizializzato')
    }
};
// Usa il builder guidato
const cc = DynamicFormBuilder.create()
    .addGroup('Dati Anagrafici', ['col-12'])
    .addForm(nome)
    .addForm(email)
    .addActions([salvaAction])
    .addGroup('Note')
    .addForm({
        formName: 'note',
        title: 'Note',
        type: TYPE_CONTROL_FORM.TEXTAREA,
        formControl: new FormControl(''),
        formGroup: DynamicFormBuilder.create().addGroup('Giorno 1').addForm(giornoBuilder('giorno1', '📅', 'Lunedì')).build(),
    })
    .addActions([salvaAction])
    .build();



// ---------------------------------------------------------------------------
// Builder principale
// ---------------------------------------------------------------------------
export function buildNutritionistForm(): ConfigForm {
    // Controlli reattivi per il calcolo BMI
    const altezzaCtrl = new FormControl<number | null>(null, Validators.required);
    const pesoCtrl = new FormControl<number | null>(null, Validators.required);
    const bmiCtrl = new FormControl<number | null>({ value: null, disabled: true });

    return cc;
    return [
        // ───────────────────────────────────────────────────────────────────
        // GRUPPO 1 · Dati Personali
        // ───────────────────────────────────────────────────────────────────
        {
            title: '👤 Dati Personali',
            class: ['col-12', 'nutri-section', 'mb-3'],
            formGroup: [
                field({
                    formName: 'nome',
                    type: TYPE_CONTROL_FORM.TEXT,
                    title: 'Nome *',
                    formControl: new FormControl(null, Validators.required),
                    css: { class: ['col-md-6'] },
                    onChange: (idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility) => {
                        console.log('[onChange]', { idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility });
                    },
                    onInitialize: (idGroup, idForm, formControl, formName, formGroup, type, allGroup) => {
                        console.log('[onInitialize]', { idGroup, idForm, formControl, formName, formGroup, type, allGroup });
                    },
                    onFocus: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
                        console.log('[onFocus]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
                    },
                    onBlur: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
                        console.log('[onBlur]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
                    },
                    onSearch: (idGroup, idForm, formControl, formName, formGroup, search, utility) => {
                        console.log('[onSearch]', { idGroup, idForm, formControl, formName, formGroup, search, utility });
                    },
                    onScrollEnd: (idGroup, idForm, formControl, formName, formGroup, paging, utility) => {
                        console.log('[onScrollEnd]', { idGroup, idForm, formControl, formName, formGroup, paging, utility });
                    },
                }),
                field({
                    formName: 'cognome',
                    type: TYPE_CONTROL_FORM.TEXT,
                    title: 'Cognome *',
                    formControl: new FormControl(null, Validators.required),
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'dataNascita',
                    type: TYPE_CONTROL_FORM.DATA,
                    title: 'Data di nascita',
                    formControl: new FormControl(null),
                    css: { class: ['col-md-4'] },
                }),
                field({
                    formName: 'sesso',
                    type: TYPE_CONTROL_FORM.RADIOGROUP,
                    title: 'Sesso',
                    formControl: new FormControl('M'),
                    options: sessoOptions,
                    css: { class: ['col-md-4'] },
                }),
                field({
                    formName: 'professione',
                    type: TYPE_CONTROL_FORM.TEXT,
                    title: 'Professione',
                    formControl: new FormControl(null),
                    css: { class: ['col-md-4'] },
                }),
                field({
                    formName: 'email',
                    type: TYPE_CONTROL_FORM.TEXT,
                    title: 'Email',
                    formControl: new FormControl(null, Validators.email),
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'telefono',
                    type: TYPE_CONTROL_FORM.TEXT,
                    title: 'Telefono',
                    formControl: new FormControl(null),
                    css: { class: ['col-md-6'] },
                }),
            ],
        },

        // ───────────────────────────────────────────────────────────────────
        // GRUPPO 2 · Parametri Corporei
        // ───────────────────────────────────────────────────────────────────
        {
            title: '📊 Parametri Corporei',
            class: ['col-12', 'nutri-section', 'mb-3'],
            formGroup: [
                field({
                    formName: 'altezza',
                    type: TYPE_CONTROL_FORM.NUMBER,
                    title: 'Altezza (cm) *',
                    formControl: altezzaCtrl,
                    optionNumber: { min: 50, max: 250, step: 0.5 },
                    placeholder: 'es. 170',
                    css: { class: ['col-md-3'] },
                    onChange: onBMIChange,
                }),
                field({
                    formName: 'peso',
                    type: TYPE_CONTROL_FORM.NUMBER,
                    title: 'Peso (kg) *',
                    formControl: pesoCtrl,
                    optionNumber: { min: 20, max: 300, step: 0.1 },
                    placeholder: 'es. 70.5',
                    css: { class: ['col-md-3'] },
                    onChange: onBMIChange,
                }),
                field({
                    formName: 'bmi',
                    type: TYPE_CONTROL_FORM.NUMBER,
                    title: 'BMI (calcolato)',
                    formControl: bmiCtrl,
                    readonly: true,
                    css: { class: ['col-md-3'] },
                }),
                field({
                    formName: 'pesoTarget',
                    type: TYPE_CONTROL_FORM.NUMBER,
                    title: 'Peso target (kg)',
                    formControl: new FormControl(null),
                    optionNumber: { min: 20, max: 300, step: 0.1 },
                    css: { class: ['col-md-3'] },
                }),
                field({
                    formName: 'circonferenzaVita',
                    type: TYPE_CONTROL_FORM.NUMBER,
                    title: 'Circ. vita (cm)',
                    formControl: new FormControl(null),
                    optionNumber: { min: 40, max: 200, step: 0.5 },
                    css: { class: ['col-md-3'] },
                }),
                field({
                    formName: 'circonferenzaFianchi',
                    type: TYPE_CONTROL_FORM.NUMBER,
                    title: 'Circ. fianchi (cm)',
                    formControl: new FormControl(null),
                    optionNumber: { min: 40, max: 200, step: 0.5 },
                    css: { class: ['col-md-3'] },
                }),
                field({
                    formName: 'percentualeMassaGrassa',
                    type: TYPE_CONTROL_FORM.NUMBER,
                    title: 'Massa grassa (%)',
                    formControl: new FormControl(null),
                    optionNumber: { min: 1, max: 80, step: 0.5 },
                    css: { class: ['col-md-3'] },
                }),
                field({
                    formName: 'livelloAttivita',
                    type: TYPE_CONTROL_FORM.COMBO,
                    title: 'Livello attività fisica',
                    formControl: new FormControl(null),
                    options: livelloAttivitaOptions,
                    css: { class: ['col-md-3'] },
                }),
            ],
        },

        // ───────────────────────────────────────────────────────────────────
        // GRUPPO 3 · Anamnesi Clinica
        // ───────────────────────────────────────────────────────────────────
        {
            title: '🏥 Anamnesi Clinica',
            class: ['col-12', 'nutri-section', 'mb-3'],
            formGroup: [
                field({
                    formName: 'patologie',
                    type: TYPE_CONTROL_FORM.ARRAYSTRING,
                    title: 'Patologie / Diagnosi',
                    formControl: new FormControl([]),
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'farmaci',
                    type: TYPE_CONTROL_FORM.TEXTAREA,
                    title: 'Farmaci in uso',
                    formControl: new FormControl(null),
                    rows: 3,
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'allergie',
                    type: TYPE_CONTROL_FORM.ARRAYSTRING,
                    title: '⚠️ Allergie alimentari',
                    formControl: new FormControl([]),
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'intolleranze',
                    type: TYPE_CONTROL_FORM.ARRAYSTRING,
                    title: 'Intolleranze alimentari',
                    formControl: new FormControl([]),
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'chirurgie',
                    type: TYPE_CONTROL_FORM.TEXTAREA,
                    title: 'Interventi chirurgici pregressi',
                    formControl: new FormControl(null),
                    rows: 2,
                    css: { class: ['col-12'] },
                }),
            ],
        },

        // ───────────────────────────────────────────────────────────────────
        // GRUPPO 4 · Abitudini Alimentari
        // ───────────────────────────────────────────────────────────────────
        {
            title: '🍽️ Abitudini Alimentari',
            class: ['col-12', 'nutri-section', 'mb-3'],
            formGroup: [
                field({
                    formName: 'numPasti',
                    type: TYPE_CONTROL_FORM.NUMBER,
                    title: 'N° pasti al giorno',
                    formControl: new FormControl(null),
                    optionNumber: { min: 1, max: 8, step: 1 },
                    css: { class: ['col-md-3'] },
                }),
                field({
                    formName: 'acquaLitri',
                    type: TYPE_CONTROL_FORM.NUMBER,
                    title: 'Acqua (litri/giorno)',
                    formControl: new FormControl(null),
                    optionNumber: { min: 0, max: 6, step: 0.25 },
                    css: { class: ['col-md-3'] },
                }),
                field({
                    formName: 'colazione',
                    type: TYPE_CONTROL_FORM.TEXTAREA,
                    title: '☀️ Colazione tipica',
                    formControl: new FormControl(null),
                    rows: 3,
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'pranzo',
                    type: TYPE_CONTROL_FORM.TEXTAREA,
                    title: '🌤️ Pranzo tipico',
                    formControl: new FormControl(null),
                    rows: 3,
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'cena',
                    type: TYPE_CONTROL_FORM.TEXTAREA,
                    title: '🌙 Cena tipica',
                    formControl: new FormControl(null),
                    rows: 3,
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'spuntini',
                    type: TYPE_CONTROL_FORM.TEXTAREA,
                    title: '🍎 Spuntini',
                    formControl: new FormControl(null),
                    rows: 3,
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'cibiPreferiti',
                    type: TYPE_CONTROL_FORM.ARRAYSTRING,
                    title: '❤️ Cibi preferiti',
                    formControl: new FormControl([]),
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'cibiEvitati',
                    type: TYPE_CONTROL_FORM.ARRAYSTRING,
                    title: '🚫 Cibi non graditi / evitati',
                    formControl: new FormControl([]),
                    css: { class: ['col-md-6'] },
                }),
            ],
        },

        // ───────────────────────────────────────────────────────────────────
        // GRUPPO 5 · Stile di Vita
        // ───────────────────────────────────────────────────────────────────
        {
            title: '💪 Stile di Vita',
            class: ['col-12', 'nutri-section', 'mb-3'],
            formGroup: [
                field({
                    formName: 'tipoAttivitaFisica',
                    type: TYPE_CONTROL_FORM.COMBO,
                    title: 'Tipo di attività fisica',
                    formControl: new FormControl(null),
                    options: tipoAttivitaOptions,
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'freqAllenamento',
                    type: TYPE_CONTROL_FORM.COMBO,
                    title: 'Frequenza allenamento',
                    formControl: new FormControl(null),
                    options: freqAllenamentoOptions,
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'oreSonno',
                    type: TYPE_CONTROL_FORM.NUMBER,
                    title: 'Ore di sonno (media)',
                    formControl: new FormControl(null),
                    optionNumber: { min: 2, max: 14, step: 0.5 },
                    css: { class: ['col-md-3'] },
                }),
                field({
                    formName: 'livelloStress',
                    type: TYPE_CONTROL_FORM.RADIOGROUP,
                    title: 'Livello di stress quotidiano',
                    formControl: new FormControl(null),
                    options: stressOptions,
                    css: { class: ['col-md-9'] },
                }),
                field({
                    formName: 'fumo',
                    type: TYPE_CONTROL_FORM.CHECKBOX,
                    title: 'Fumatore / Fumatrice',
                    formControl: new FormControl(false),
                    css: { class: ['col-md-3'] },
                }),
                field({
                    formName: 'alcol',
                    type: TYPE_CONTROL_FORM.CHECKBOX,
                    title: 'Consumo di alcolici',
                    formControl: new FormControl(false),
                    css: { class: ['col-md-3'] },
                }),
                field({
                    formName: 'integratori',
                    type: TYPE_CONTROL_FORM.ARRAYSTRING,
                    title: '💊 Integratori assunti',
                    formControl: new FormControl([]),
                    css: { class: ['col-md-6'] },
                }),
            ],
        },

        // ───────────────────────────────────────────────────────────────────
        // GRUPPO 6 · Diario Alimentare — gestito dal DiarioSettimanaleComponent
        // (rimosso dalla ConfigForm: il componente dedicato con tab settimane
        //  viene incluso direttamente nel template di NutriCareComponent)
        // ───────────────────────────────────────────────────────────────────

        // ───────────────────────────────────────────────────────────────────
        // GRUPPO 6 · Obiettivi Terapeutici
        // ───────────────────────────────────────────────────────────────────
        {
            title: '🎯 Obiettivi Terapeutici',
            class: ['col-12', 'nutri-section', 'mb-3'],
            formGroup: [
                field({
                    formName: 'obiettivo',
                    type: TYPE_CONTROL_FORM.RADIOGROUP,
                    title: 'Obiettivo principale',
                    formControl: new FormControl(null),
                    options: obiettivoOptions,
                    css: { class: ['col-12'] },
                }),
                field({
                    formName: 'motivazione',
                    type: TYPE_CONTROL_FORM.TEXTAREA,
                    title: 'Motivazione e aspettative',
                    formControl: new FormControl(null),
                    rows: 4,
                    css: { class: ['col-md-6'] },
                }),
                field({
                    formName: 'noteNutrizionista',
                    type: TYPE_CONTROL_FORM.TEXTAREA,
                    title: '📝 Note del nutrizionista',
                    formControl: new FormControl(null),
                    rows: 4,
                    css: { class: ['col-md-6'] },
                }),
            ],
            actions: [
                {
                    label: '💾 Salva scheda',
                    visible: true,
                    cssClassButton: ['btn', 'btn-success', 'px-4'],
                    action: (questions: any, idForm: string, formGroup: FormGroup | FormArray) => {
                        const fg = formGroup;
                        console.group(
                            '%c[NutriCare Pro] 💾 Scheda paziente (Builder)',
                            'color: #1565c0; font-size: 14px; font-weight: bold',
                        );
                        console.log('Dati:', fg instanceof FormGroup ? fg.getRawValue() : fg?.value);
                        console.groupEnd();
                        alert('✅ Scheda paziente salvata!\nControlla la console per i dettagli.');
                    },
                },
                {
                    label: '🖨️ Stampa',
                    visible: true,
                    cssClassButton: ['btn', 'btn-outline-secondary', 'px-3'],
                    action: () => window.print(),
                },
                {
                    label: '🔄 Azzera',
                    visible: true,
                    cssClassButton: ['btn', 'btn-outline-danger', 'px-3'],
                    action: (_q: any, _id: any, formGroup: FormGroup | FormArray) => {
                        if (confirm('Vuoi azzerare tutti i dati del paziente?')) {
                            if (formGroup instanceof FormGroup) formGroup.reset();
                        }
                    },
                },
            ],
        },
    ];
}
