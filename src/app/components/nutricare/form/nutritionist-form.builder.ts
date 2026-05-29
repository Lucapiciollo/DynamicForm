
// import { signal, inject } from '@angular/core';
// import { FormControl, Validators } from '@angular/forms';
// import { ComboApiService, ComboOption } from '../../store/services/combo-api.service';
// import { DynamicFormBuilder } from 'projects/dynamicform/src/lib/dynamic-form.builder';
// import { TYPE_CONTROL_FORM } from 'projects/dynamicform/src/public-api';

// export function buildComboTestForm() {
//     // Signal per le opzioni locali
//     const options = signal<ComboOption[]>([
//         { id: '1', description: 'Opzione 1' },
//         { id: '2', description: 'Opzione 2' },
//         { id: '3', description: 'Opzione 3' },
//     ]);

//     // Signal per la combo paginata remota e stato paginazione
//     const remoteOptions = signal<ComboOption[]>([]);
//     let remoteTotal = 0;
//     let remotePage = 1;
//     const pageSize = 3;
//     let remoteSearch = '';

//     const comboApi = inject(ComboApiService);

//     function loadRemoteOptions({ page = 1, search = '' } = {}, tipo: 'livello' | 'tipo' = 'livello', append = false) {
//         const params: any = { page, pageSize, search };
//         const apiCall = tipo === 'livello' ? comboApi.getLivelloAttivita(params) : comboApi.getTipoAttivitaFisica(params);
//         apiCall.subscribe(result => {
//             remoteTotal = result.totalCount;
//             remotePage = page;
//             remoteSearch = search;
//             if (append) {
//                 // Evita duplicati
//                 const ids = new Set(remoteOptions().map(o => o.id));
//                 remoteOptions.set([...remoteOptions(), ...result.items.filter(o => !ids.has(o.id))]);
//             } else {
//                 remoteOptions.set(result.items);
//             }
//         });
//     }

//     return DynamicFormBuilder.create()
//         .addGroup('ComboBox Test', ['col-6 px-3'])
//         .addForm({
//             formName: 'combo_normale',
//             title: 'Combo normale',
//             type: TYPE_CONTROL_FORM.COMBO,
//             options,
//             formControl: new FormControl(null, Validators.required),
//             onInitialize: (...args) => console.log('[onInitialize] combo_normale', ...args),
//             onChange: (...args) => console.log('[onChange] combo_normale', ...args),
//         })
//         .addForm({
//             formName: 'combo_multipla',
//             title: 'Combo multipla',
//             type: TYPE_CONTROL_FORM.COMBO,
//             options,
//             formControl: new FormControl([]),
//             multiple: true,
//             onInitialize: (...args) => console.log('[onInitialize] combo_multipla', ...args),
//             onChange: (...args) => console.log('[onChange] combo_multipla', ...args),
//         })
//         .addForm({
//             formName: 'combo_paginate',
//             title: 'Combo paginata (remota)',
//             type: TYPE_CONTROL_FORM.COMBOPAGINATE,
//             options: remoteOptions,
//             formControl: new FormControl(null),
//             totalCount: () => remoteTotal,
//             onInitialize: () => {
//                 loadRemoteOptions({ page: 1 }, 'livello');
//             },
//             onChange: (...args) => console.log('[onChange] combo_paginate', ...args),
//             onSearch: (_idGroup, _idForm, _fc, _formName, _formGroup, search) => {
//                 loadRemoteOptions({ page: 1, search }, 'livello');
//             },
//             onScrollEnd: () => {
//                 if (remoteOptions().length < remoteTotal) {
//                     loadRemoteOptions({ page: remotePage + 1, search: remoteSearch }, 'livello', true);
//                 }
//             },
//         })
//         .addForm({
//             formName: 'combo_paginate_multipla',
//             title: 'Combo paginata multipla (remota)',
//             type: TYPE_CONTROL_FORM.COMBOPAGINATE,
//             options: remoteOptions,
//             formControl: new FormControl([]),
//             multiple: true,
//             totalCount: () => remoteTotal,
//             onInitialize: () => {
//                 loadRemoteOptions({ page: 1 }, 'tipo');
//             },
//             onChange: (...args) => console.log('[onChange] combo_paginate_multipla', ...args),
//             onSearch: (_idGroup, _idForm, _fc, _formName, _formGroup, search) => {
//                 loadRemoteOptions({ page: 1, search }, 'tipo');
//             },
//             onScrollEnd: () => {
//                 if (remoteOptions().length < remoteTotal) {
//                     loadRemoteOptions({ page: remotePage + 1, search: remoteSearch }, 'tipo', true);
//                 }
//             },
//         })
//         .addActions([
//             {
//                 label: 'Salva',
//                 visible: true,
//                 action: (...args) => {
//                     alert('Salva!');
//                     console.log('[Azione Salva]', ...args);
//                 },
//             },
//         ])
//         .build();
// }
// // Campo con azione custom (es. bottone)


// // Campo con onChange
// const nome = {
//     formName: 'nome',
//     title: 'Nome',
//     type: TYPE_CONTROL_FORM.COMBO,
//     options: signal([{ id: '1', description: 'Opzione 1' }, { id: '2', description: 'Opzione 2' }]),
//     formControl: new FormControl('', Validators.required),
//     onChange: (idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility) => {
//         console.log('[onChange]', { idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility });
//     },
//     onInitialize: (idGroup, idForm, formControl, formName, formGroup, type, allGroup) => {
//         console.log('[onInitialize]', { idGroup, idForm, formControl, formName, formGroup, type, allGroup });
//     },
//     onFocus: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
//         console.log('[onFocus]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
//     },
//     onBlur: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
//         console.log('[onBlur]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
//     },
//     onSearch: (idGroup, idForm, formControl, formName, formGroup, search, utility) => {
//         console.log('[onSearch]', { idGroup, idForm, formControl, formName, formGroup, search, utility });
//     },
//     onScrollEnd: (idGroup, idForm, formControl, formName, formGroup, paging, utility) => {
//         console.log('[onScrollEnd]', { idGroup, idForm, formControl, formName, formGroup, paging, utility });
//     }
// };

// // Campo con onInitialize
// const email = {
//     formName: 'email',
//     title: 'Email',
//     type: TYPE_CONTROL_FORM.TEXT,
//     formControl: new FormControl('', Validators.email),
//     onInitialize: () => console.log('Campo email inizializzato'),
// };
// const campoConAction = {
//     formName: 'bottoneCustom',
//     type: TYPE_CONTROL_FORM.BUTTON,
//     title: 'Clicca qui',
//     action: () => alert('Hai cliccato il bottone!'),
// };

// const campoConOnChange = {
//     formName: 'nome',
//     title: 'Nome',
//     type: TYPE_CONTROL_FORM.COMBO,
//     options: signal([{ id: '1', description: 'Opzione 1' }, { id: '2', description: 'Opzione 2' }]),
//     formControl: new FormControl(''),
//     onChange: (idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility) => {
//         console.log('[onChange]', { idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility });
//     },
//     onInitialize: (idGroup, idForm, formControl, formName, formGroup, type, allGroup) => {
//         console.log('[onInitialize]', { idGroup, idForm, formControl, formName, formGroup, type, allGroup });
//     },
//     onFocus: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
//         console.log('[onFocus]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
//     },
//     onBlur: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
//         console.log('[onBlur]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
//     },
//     onSearch: (idGroup, idForm, formControl, formName, formGroup, search, utility) => {
//         console.log('[onSearch]', { idGroup, idForm, formControl, formName, formGroup, search, utility });
//     },
//     onScrollEnd: (idGroup, idForm, formControl, formName, formGroup, paging, utility) => {
//         console.log('[onScrollEnd]', { idGroup, idForm, formControl, formName, formGroup, paging, utility });
//     },
// };

// const campoConOnInitialize = {
//     formName: 'email',
//     title: 'Email',
//     type: TYPE_CONTROL_FORM.TEXT,
//     formControl: new FormControl(''),
//     onChange: (idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility) => {
//         console.log('Campo email cambiato')
//     },
//     onInitialize: (idGroup, idForm, formControl, formName, formGroup, type, allGroup) => {
//         console.log('Campo email inizializzato')
//     }
// };
// // Usa il builder guidato
// const cc = DynamicFormBuilder.create()
//     .addGroup('Dati Anagrafici', ['col-6 px-3'])
//     .addForm(nome)
//     .addForm(email)
//     .addActions([salvaAction])
//     .addGroup('Note')
//     .addForm({
//         formName: 'note',
//         title: 'Note',
//         type: TYPE_CONTROL_FORM.TEXTAREA,
//         formControl: new FormControl(''),
//         formGroup: DynamicFormBuilder.create().addGroup('Giorno 1').addForm(giornoBuilder('giorno1', '📅', 'Lunedì')).build(),
//     })
//     .addActions([salvaAction])
//     .build();



// // ---------------------------------------------------------------------------
// // Builder principale
// // ---------------------------------------------------------------------------
// export function buildNutritionistForm(): ConfigForm {
//     // Controlli reattivi per il calcolo BMI
//     const altezzaCtrl = new FormControl<number | null>(null, Validators.required);
//     const pesoCtrl = new FormControl<number | null>(null, Validators.required);
//     const bmiCtrl = new FormControl<number | null>({ value: null, disabled: true });

//     return cc;
//     // return [
//     //     // ───────────────────────────────────────────────────────────────────
//     //     // GRUPPO 1 · Dati Personali
//     //     // ───────────────────────────────────────────────────────────────────
//     //     {
//     //         title: '👤 Dati Personali',
//     //         class: ['col-6 px-3', 'nutri-section', 'mb-3'],
//     //         formGroup: [
//     //             field({
//     //                 formName: 'nome',
//     //                 type: TYPE_CONTROL_FORM.TEXT,
//     //                 title: 'Nome *',
//     //                 formControl: new FormControl(null, Validators.required),
//     //                 css: { class: ['col-md-6'] },
//     //                 onChange: (idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility) => {
//     //                     console.log('[onChange]', { idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility });
//     //                 },
//     //                 onInitialize: (idGroup, idForm, formControl, formName, formGroup, type, allGroup) => {
//     //                     console.log('[onInitialize]', { idGroup, idForm, formControl, formName, formGroup, type, allGroup });
//     //                 },
//     //                 onFocus: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
//     //                     console.log('[onFocus]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
//     //                 },
//     //                 onBlur: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
//     //                     console.log('[onBlur]', { idGroup, idForm, formControl, formName, formGroup, allGroup, utility });
//     //                 },
//     //                 onSearch: (idGroup, idForm, formControl, formName, formGroup, search, utility) => {
//     //                     console.log('[onSearch]', { idGroup, idForm, formControl, formName, formGroup, search, utility });
//     //                 },
//     //                 onScrollEnd: (idGroup, idForm, formControl, formName, formGroup, paging, utility) => {
//     //                     console.log('[onScrollEnd]', { idGroup, idForm, formControl, formName, formGroup, paging, utility });
//     //                 },
//     //             }),
//     //             field({
//     //                 formName: 'cognome',
//     //                 type: TYPE_CONTROL_FORM.TEXT,
//     //                 title: 'Cognome *',
//     //                 formControl: new FormControl(null, Validators.required),
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'dataNascita',
//     //                 type: TYPE_CONTROL_FORM.DATA,
//     //                 title: 'Data di nascita',
//     //                 formControl: new FormControl(null),
//     //                 css: { class: ['col-md-4'] },
//     //             }),
//     //             field({
//     //                 formName: 'sesso',
//     //                 type: TYPE_CONTROL_FORM.RADIOGROUP,
//     //                 title: 'Sesso',
//     //                 formControl: new FormControl('M'),
//     //                 options: sessoOptions,
//     //                 css: { class: ['col-md-4'] },
//     //             }),
//     //             field({
//     //                 formName: 'professione',
//     //                 type: TYPE_CONTROL_FORM.TEXT,
//     //                 title: 'Professione',
//     //                 formControl: new FormControl(null),
//     //                 css: { class: ['col-md-4'] },
//     //             }),
//     //             field({
//     //                 formName: 'email',
//     //                 type: TYPE_CONTROL_FORM.TEXT,
//     //                 title: 'Email',
//     //                 formControl: new FormControl(null, Validators.email),
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'telefono',
//     //                 type: TYPE_CONTROL_FORM.TEXT,
//     //                 title: 'Telefono',
//     //                 formControl: new FormControl(null),
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //         ],
//     //     },

//     //     // ───────────────────────────────────────────────────────────────────
//     //     // GRUPPO 2 · Parametri Corporei
//     //     // ───────────────────────────────────────────────────────────────────
//     //     {
//     //         title: '📊 Parametri Corporei',
//     //         class: ['col-6 px-3', 'nutri-section', 'mb-3'],
//     //         formGroup: [
//     //             field({
//     //                 formName: 'altezza',
//     //                 type: TYPE_CONTROL_FORM.NUMBER,
//     //                 title: 'Altezza (cm) *',
//     //                 formControl: altezzaCtrl,
//     //                 optionNumber: { min: 50, max: 250, step: 0.5 },
//     //                 placeholder: 'es. 170',
//     //                 css: { class: ['col-md-3'] },
//     //                 onChange: onBMIChange,
//     //             }),
//     //             field({
//     //                 formName: 'peso',
//     //                 type: TYPE_CONTROL_FORM.NUMBER,
//     //                 title: 'Peso (kg) *',
//     //                 formControl: pesoCtrl,
//     //                 optionNumber: { min: 20, max: 300, step: 0.1 },
//     //                 placeholder: 'es. 70.5',
//     //                 css: { class: ['col-md-3'] },
//     //                 onChange: onBMIChange,
//     //             }),
//     //             field({
//     //                 formName: 'bmi',
//     //                 type: TYPE_CONTROL_FORM.NUMBER,
//     //                 title: 'BMI (calcolato)',
//     //                 formControl: bmiCtrl,
//     //                 readonly: true,
//     //                 css: { class: ['col-md-3'] },
//     //             }),
//     //             field({
//     //                 formName: 'pesoTarget',
//     //                 type: TYPE_CONTROL_FORM.NUMBER,
//     //                 title: 'Peso target (kg)',
//     //                 formControl: new FormControl(null),
//     //                 optionNumber: { min: 20, max: 300, step: 0.1 },
//     //                 css: { class: ['col-md-3'] },
//     //             }),
//     //             field({
//     //                 formName: 'circonferenzaVita',
//     //                 type: TYPE_CONTROL_FORM.NUMBER,
//     //                 title: 'Circ. vita (cm)',
//     //                 formControl: new FormControl(null),
//     //                 optionNumber: { min: 40, max: 200, step: 0.5 },
//     //                 css: { class: ['col-md-3'] },
//     //             }),
//     //             field({
//     //                 formName: 'circonferenzaFianchi',
//     //                 type: TYPE_CONTROL_FORM.NUMBER,
//     //                 title: 'Circ. fianchi (cm)',
//     //                 formControl: new FormControl(null),
//     //                 optionNumber: { min: 40, max: 200, step: 0.5 },
//     //                 css: { class: ['col-md-3'] },
//     //             }),
//     //             field({
//     //                 formName: 'percentualeMassaGrassa',
//     //                 type: TYPE_CONTROL_FORM.NUMBER,
//     //                 title: 'Massa grassa (%)',
//     //                 formControl: new FormControl(null),
//     //                 optionNumber: { min: 1, max: 80, step: 0.5 },
//     //                 css: { class: ['col-md-3'] },
//     //             }),
//     //             field({
//     //                 formName: 'livelloAttivita',
//     //                 type: TYPE_CONTROL_FORM.COMBO,
//     //                 title: 'Livello attività fisica',
//     //                 formControl: new FormControl(null),
//     //                 options: livelloAttivitaOptions,
//     //                 css: { class: ['col-md-3'] },
//     //             }),
//     //         ],
//     //     },

//     //     // ───────────────────────────────────────────────────────────────────
//     //     // GRUPPO 3 · Anamnesi Clinica
//     //     // ───────────────────────────────────────────────────────────────────
//     //     {
//     //         title: '🏥 Anamnesi Clinica',
//     //         class: ['col-6 px-3', 'nutri-section', 'mb-3'],
//     //         formGroup: [
//     //             field({
//     //                 formName: 'patologie',
//     //                 type: TYPE_CONTROL_FORM.ARRAYSTRING,
//     //                 title: 'Patologie / Diagnosi',
//     //                 formControl: new FormControl([]),
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'farmaci',
//     //                 type: TYPE_CONTROL_FORM.TEXTAREA,
//     //                 title: 'Farmaci in uso',
//     //                 formControl: new FormControl(null),
//     //                 rows: 3,
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'allergie',
//     //                 type: TYPE_CONTROL_FORM.ARRAYSTRING,
//     //                 title: '⚠️ Allergie alimentari',
//     //                 formControl: new FormControl([]),
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'intolleranze',
//     //                 type: TYPE_CONTROL_FORM.ARRAYSTRING,
//     //                 title: 'Intolleranze alimentari',
//     //                 formControl: new FormControl([]),
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'chirurgie',
//     //                 type: TYPE_CONTROL_FORM.TEXTAREA,
//     //                 title: 'Interventi chirurgici pregressi',
//     //                 formControl: new FormControl(null),
//     //                 rows: 2,
//     //                 css: { class: ['col-6 px-3'] },
//     //             }),
//     //         ],
//     //     },

//     //     // ───────────────────────────────────────────────────────────────────
//     //     // GRUPPO 4 · Abitudini Alimentari
//     //     // ───────────────────────────────────────────────────────────────────
//     //     {
//     //         title: '🍽️ Abitudini Alimentari',
//     //         class: ['col-6 px-3', 'nutri-section', 'mb-3'],
//     //         formGroup: [
//     //             field({
//     //                 formName: 'numPasti',
//     //                 type: TYPE_CONTROL_FORM.NUMBER,
//     //                 title: 'N° pasti al giorno',
//     //                 formControl: new FormControl(null),
//     //                 optionNumber: { min: 1, max: 8, step: 1 },
//     //                 css: { class: ['col-md-3'] },
//     //             }),
//     //             field({
//     //                 formName: 'acquaLitri',
//     //                 type: TYPE_CONTROL_FORM.NUMBER,
//     //                 title: 'Acqua (litri/giorno)',
//     //                 formControl: new FormControl(null),
//     //                 optionNumber: { min: 0, max: 6, step: 0.25 },
//     //                 css: { class: ['col-md-3'] },
//     //             }),
//     //             field({
//     //                 formName: 'colazione',
//     //                 type: TYPE_CONTROL_FORM.TEXTAREA,
//     //                 title: '☀️ Colazione tipica',
//     //                 formControl: new FormControl(null),
//     //                 rows: 3,
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'pranzo',
//     //                 type: TYPE_CONTROL_FORM.TEXTAREA,
//     //                 title: '🌤️ Pranzo tipico',
//     //                 formControl: new FormControl(null),
//     //                 rows: 3,
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'cena',
//     //                 type: TYPE_CONTROL_FORM.TEXTAREA,
//     //                 title: '🌙 Cena tipica',
//     //                 formControl: new FormControl(null),
//     //                 rows: 3,
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'spuntini',
//     //                 type: TYPE_CONTROL_FORM.TEXTAREA,
//     //                 title: '🍎 Spuntini',
//     //                 formControl: new FormControl(null),
//     //                 rows: 3,
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'cibiPreferiti',
//     //                 type: TYPE_CONTROL_FORM.ARRAYSTRING,
//     //                 title: '❤️ Cibi preferiti',
//     //                 formControl: new FormControl([]),
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'cibiEvitati',
//     //                 type: TYPE_CONTROL_FORM.ARRAYSTRING,
//     //                 title: '🚫 Cibi non graditi / evitati',
//     //                 formControl: new FormControl([]),
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //         ],
//     //     },

//     //     // ───────────────────────────────────────────────────────────────────
//     //     // GRUPPO 5 · Stile di Vita
//     //     // ───────────────────────────────────────────────────────────────────
//     //     {
//     //         title: '💪 Stile di Vita',
//     //         class: ['col-6 px-3', 'nutri-section', 'mb-3'],
//     //         formGroup: [
//     //             field({
//     //                 formName: 'tipoAttivitaFisica',
//     //                 type: TYPE_CONTROL_FORM.COMBO,
//     //                 title: 'Tipo di attività fisica',
//     //                 formControl: new FormControl(null),
//     //                 options: tipoAttivitaOptions,
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'freqAllenamento',
//     //                 type: TYPE_CONTROL_FORM.COMBO,
//     //                 title: 'Frequenza allenamento',
//     //                 formControl: new FormControl(null),
//     //                 options: freqAllenamentoOptions,
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'oreSonno',
//     //                 type: TYPE_CONTROL_FORM.NUMBER,
//     //                 title: 'Ore di sonno (media)',
//     //                 formControl: new FormControl(null),
//     //                 optionNumber: { min: 2, max: 14, step: 0.5 },
//     //                 css: { class: ['col-md-3'] },
//     //             }),
//     //             field({
//     //                 formName: 'livelloStress',
//     //                 type: TYPE_CONTROL_FORM.RADIOGROUP,
//     //                 title: 'Livello di stress quotidiano',
//     //                 formControl: new FormControl(null),
//     //                 options: stressOptions,
//     //                 css: { class: ['col-md-9'] },
//     //             }),
//     //             field({
//     //                 formName: 'fumo',
//     //                 type: TYPE_CONTROL_FORM.CHECKBOX,
//     //                 title: 'Fumatore / Fumatrice',
//     //                 formControl: new FormControl(false),
//     //                 css: { class: ['col-md-3'] },
//     //             }),
//     //             field({
//     //                 formName: 'alcol',
//     //                 type: TYPE_CONTROL_FORM.CHECKBOX,
//     //                 title: 'Consumo di alcolici',
//     //                 formControl: new FormControl(false),
//     //                 css: { class: ['col-md-3'] },
//     //             }),
//     //             field({
//     //                 formName: 'integratori',
//     //                 type: TYPE_CONTROL_FORM.ARRAYSTRING,
//     //                 title: '💊 Integratori assunti',
//     //                 formControl: new FormControl([]),
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //         ],
//     //     },

//     //     // ───────────────────────────────────────────────────────────────────
//     //     // GRUPPO 6 · Diario Alimentare — gestito dal DiarioSettimanaleComponent
//     //     // (rimosso dalla ConfigForm: il componente dedicato con tab settimane
//     //     //  viene incluso direttamente nel template di NutriCareComponent)
//     //     // ───────────────────────────────────────────────────────────────────

//     //     // ───────────────────────────────────────────────────────────────────
//     //     // GRUPPO 6 · Obiettivi Terapeutici
//     //     // ───────────────────────────────────────────────────────────────────
//     //     {
//     //         title: '🎯 Obiettivi Terapeutici',
//     //         class: ['col-6 px-3', 'nutri-section', 'mb-3'],
//     //         formGroup: [
//     //             field({
//     //                 formName: 'obiettivo',
//     //                 type: TYPE_CONTROL_FORM.RADIOGROUP,
//     //                 title: 'Obiettivo principale',
//     //                 formControl: new FormControl(null),
//     //                 options: obiettivoOptions,
//     //                 css: { class: ['col-6 px-3'] },
//     //             }),
//     //             field({
//     //                 formName: 'motivazione',
//     //                 type: TYPE_CONTROL_FORM.TEXTAREA,
//     //                 title: 'Motivazione e aspettative',
//     //                 formControl: new FormControl(null),
//     //                 rows: 4,
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //             field({
//     //                 formName: 'noteNutrizionista',
//     //                 type: TYPE_CONTROL_FORM.TEXTAREA,
//     //                 title: '📝 Note del nutrizionista',
//     //                 formControl: new FormControl(null),
//     //                 rows: 4,
//     //                 css: { class: ['col-md-6'] },
//     //             }),
//     //         ],
//     //         actions: [
//     //             {
//     //                 label: '💾 Salva scheda',
//     //                 visible: true,
//     //                 cssClassButton: ['btn', 'btn-success', 'px-4'],
//     //                 action: (questions: any, idForm: string, formGroup: FormGroup | FormArray) => {
//     //                     const fg = formGroup;
//     //                     console.group(
//     //                         '%c[NutriCare Pro] 💾 Scheda paziente (Builder)',
//     //                         'color: #1565c0; font-size: 14px; font-weight: bold',
//     //                     );
//     //                     console.log('Dati:', fg instanceof FormGroup ? fg.getRawValue() : fg?.value);
//     //                     console.groupEnd();
//     //                     alert('✅ Scheda paziente salvata!\nControlla la console per i dettagli.');
//     //                 },
//     //             },
//     //             {
//     //                 label: '🖨️ Stampa',
//     //                 visible: true,
//     //                 cssClassButton: ['btn', 'btn-outline-secondary', 'px-3'],
//     //                 action: () => window.print(),
//     //             },
//     //             {
//     //                 label: '🔄 Azzera',
//     //                 visible: true,
//     //                 cssClassButton: ['btn', 'btn-outline-danger', 'px-3'],
//     //                 action: (_q: any, _id: any, formGroup: FormGroup | FormArray) => {
//     //                     if (confirm('Vuoi azzerare tutti i dati del paziente?')) {
//     //                         if (formGroup instanceof FormGroup) formGroup.reset();
//     //                     }
//     //                 },
//     //             },
//     //         ],
//     //     },
//     // ];
// }

// --- FORM BUILDER DI TEST PER TUTTE LE COMBO PRINCIPALI ---
import { inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DynamicFormBuilder } from 'projects/dynamicform/src/lib/dynamic-form.builder';
import { ConfigForm, TYPE_CONTROL_FORM } from 'projects/dynamicform/src/public-api';
import { ComboApiService } from 'src/app/store/services/combo-api.service';

export function buildComboTestForm(): ConfigForm {
    // Signal per le opzioni locali
    const options = signal([
        { id: '1', description: 'Opzione 1' },
        { id: '2', description: 'Opzione 2' },
        { id: '3', description: 'Opzione 3' },
    ]);

    // Signal e stato per combo paginata (livello)
    const remoteOptionsLivello = signal([]);
    let totalLivello = 0;
    let pageLivello = 1;
    let searchLivello = '';
    let pageSize = 10; // default, può essere aumentato dinamicamente

    // Signal e stato per combo paginata multipla (tipo)
    const remoteOptionsTipo = signal([]);
    let totalTipo = 0;
    let pageTipo = 1;
    let searchTipo = '';

    const comboApi = inject(ComboApiService);

    function loadRemoteOptions({ page = 1, search = '', pageSize: ps = pageSize } = {}, tipo = 'livello', append = false) {
        const params: any = { page, pageSize: ps, search };
        const apiCall = tipo === 'livello' ? comboApi.getLivelloAttivita(params) : comboApi.getTipoAttivitaFisica(params);
        apiCall.subscribe((result: any) => {
            if (tipo === 'livello') {
                totalLivello = result.totalCount;
                pageLivello = page;
                searchLivello = search;
                if (page > 1) {
                    const ids = new Set(remoteOptionsLivello().map((o: any) => o.id));
                    remoteOptionsLivello.set([...remoteOptionsLivello(), ...result.items.filter((o: any) => !ids.has(o.id))]);
                } else {
                    remoteOptionsLivello.set(result.items);
                }
            } else {
                totalTipo = result.totalCount;
                pageTipo = page;
                searchTipo = search;
                if (page > 1) {
                    const ids = new Set(remoteOptionsTipo().map((o: any) => o.id));
                    remoteOptionsTipo.set([...remoteOptionsTipo(), ...result.items.filter((o: any) => !ids.has(o.id))]);
                } else {
                    remoteOptionsTipo.set(result.items);
                }
            }
        });
    }

    return DynamicFormBuilder.create()
        .addGroup('ComboBox Test', ['col-6 px-3'])
        .addForm({
            formName: 'combo_normale',
            title: 'Combo normale',
            type: TYPE_CONTROL_FORM.COMBO,
            options,
            formControl: new FormControl(null, Validators.required),
            onInitialize: (...args) => console.log('[onInitialize] combo_normale', ...args),
            onChange: (...args) => console.log('[onChange] combo_normale', ...args),
        })
        .addForm({
            formName: 'combo_multipla',
            title: 'Combo multipla',
            type: TYPE_CONTROL_FORM.COMBO,
            options,
            formControl: new FormControl([]),
            multiple: true,
            onInitialize: (...args) => console.log('[onInitialize] combo_multipla', ...args),
            onChange: (...args) => console.log('[onChange] combo_multipla', ...args),
        })
        .addForm({
            formName: 'combo_paginate',
            title: 'Combo paginata (remota)',
            type: TYPE_CONTROL_FORM.COMBOPAGINATE,
            options: remoteOptionsLivello,
            formControl: new FormControl(null),
            totalCount: () => totalLivello,
            enableInfiniteScroll: true,
            keyCombo: { keySearch: 'search', keyId: 'id', keyDescription: 'description' },
            pageSize: 10,
            paging: { page: 1, count: 10, totalCount: 0 },
            remoteData: ({ param, append }) => {
                // param.page, param.count, param.search
                return new Promise((resolve, reject) => {
                    loadRemoteOptions({ page: param.page, search: param.search, pageSize: param.count }, 'livello', append);
                    // Simula async: risolvi dopo che le options sono state aggiornate
                    setTimeout(() => {
                        console.log('[DEBUG remoteData] remoteOptionsLivello:', remoteOptionsLivello().map(o => o.id));
                        resolve({ items: remoteOptionsLivello(), totalCount: totalLivello });
                    }, 100);
                });
            },
            onInitialize: () => {
                pageSize = 10;
                loadRemoteOptions({ page: 1, pageSize }, 'livello');
            },
            onChange: (...args) => console.log('[onChange] combo_paginate', ...args),
            onSearch: (_idGroup, _idForm, _fc, _formName, _formGroup, search) => {
                pageSize = 10;
                loadRemoteOptions({ page: 1, search, pageSize }, 'livello');
            },
            onScrollEnd: () => {
                if (remoteOptionsLivello().length < totalLivello) {
                    loadRemoteOptions({ page: pageLivello + 1, search: searchLivello, pageSize }, 'livello', true);
                }
            },
        })
        .addForm({
            formName: 'combo_paginate_multipla',
            title: 'Combo paginata multipla (remota)',
            type: TYPE_CONTROL_FORM.COMBOPAGINATE,
            options: remoteOptionsTipo,
            formControl: new FormControl([]),
            multiple: true,
            autocomplete: true,
            // totalCount: () => totalTipo,
            enableInfiniteScroll: true,
            keyCombo: { keySearch: 'search', keyId: 'id', keyDescription: 'description' },
            pageSize: 10,
            paging: { page: 1, count: 10, totalCount: 0 },
            remoteData: ({ param, append }) => {
                return new Promise((resolve, reject) => {
                    loadRemoteOptions({ page: param.page, search: param.search, pageSize: param.count }, 'tipo', append);
                    setTimeout(() => {
                        resolve({ items: remoteOptionsTipo(), totalCount: totalTipo });
                    }, 100);
                });
            },
            onInitialize: () => {
                pageSize = 10;
                loadRemoteOptions({ page: 1, pageSize }, 'tipo');
            },
            onChange: (...args) => console.log('[onChange] combo_paginate_multipla', ...args),
            onSearch: (_idGroup, _idForm, _fc, _formName, _formGroup, search) => {
                pageSize = 10;
                loadRemoteOptions({ page: 1, search, pageSize }, 'tipo');
            },
            onScrollEnd: () => {
                if (remoteOptionsTipo().length < totalTipo) {
                    loadRemoteOptions({ page: pageTipo + 1, search: searchTipo, pageSize }, 'tipo', true);
                }
            },
        })
        // --- GRUPPO: Testo e numeri ---
        .addGroup('Testo e Numeri', ['col-6 px-3'])
        .addForm({
            formName: 'campo_text',
            title: 'Input Text',
            type: TYPE_CONTROL_FORM.TEXT,
            formControl: new FormControl(''),
            onInitialize: (...args) => console.log('[onInitialize] campo_text', ...args),
            onChange: (...args) => console.log('[onChange] campo_text', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_text', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_text', ...args),
        })
        .addForm({
            formName: 'campo_textarea',
            title: 'Textarea',
            type: TYPE_CONTROL_FORM.TEXTAREA,
            formControl: new FormControl(''),
            rows: 3,
            onInitialize: (...args) => console.log('[onInitialize] campo_textarea', ...args),
            onChange: (...args) => console.log('[onChange] campo_textarea', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_textarea', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_textarea', ...args),
        })
        .addForm({
            formName: 'campo_number',
            title: 'Number',
            type: TYPE_CONTROL_FORM.NUMBER,
            formControl: new FormControl(null),
            optionNumber: { min: 0, max: 100, step: 1 },
            onInitialize: (...args) => console.log('[onInitialize] campo_number', ...args),
            onChange: (...args) => console.log('[onChange] campo_number', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_number', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_number', ...args),
        })
        .addForm({
            formName: 'campo_currency',
            title: 'Currency (€)',
            type: TYPE_CONTROL_FORM.CURRENCY,
            formControl: new FormControl(null),
            onInitialize: (...args) => console.log('[onInitialize] campo_currency', ...args),
            onChange: (...args) => console.log('[onChange] campo_currency', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_currency', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_currency', ...args),
        })

        // --- GRUPPO: Date e Tempo ---
        .addGroup('Date e Tempo', ['col-6 px-3'])
        .addForm({
            formName: 'campo_data',
            title: 'Data',
            type: TYPE_CONTROL_FORM.DATA,
            formControl: new FormControl(null),
            onInitialize: (...args) => console.log('[onInitialize] campo_data', ...args),
            onChange: (...args) => console.log('[onChange] campo_data', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_data', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_data', ...args),
        })
        .addForm({
            formName: 'campo_datarange',
            title: 'Date Range',
            type: TYPE_CONTROL_FORM.DATARANGE,
            formControl: new FormControl(null),
            onInitialize: (...args) => console.log('[onInitialize] campo_datarange', ...args),
            onChange: (...args) => console.log('[onChange] campo_datarange', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_datarange', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_datarange', ...args),
        })
        .addForm({
            formName: 'campo_datetime',
            title: 'DateTime',
            type: TYPE_CONTROL_FORM.DATETIME,
            formControl: new FormControl(null),
            onInitialize: (...args) => console.log('[onInitialize] campo_datetime', ...args),
            onChange: (...args) => console.log('[onChange] campo_datetime', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_datetime', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_datetime', ...args),
        })
        .addForm({
            formName: 'campo_time',
            title: 'Time',
            type: TYPE_CONTROL_FORM.TIME,
            formControl: new FormControl(null),
            onInitialize: (...args) => console.log('[onInitialize] campo_time', ...args),
            onChange: (...args) => console.log('[onChange] campo_time', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_time', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_time', ...args),
        })
        .addForm({
            formName: 'campo_year',
            optionDate: { min: "2000", max: "2002" },
            title: 'Year',
            type: TYPE_CONTROL_FORM.YEAR,
            formControl: new FormControl(null),
            onInitialize: (...args) => console.log('[onInitialize] campo_year', ...args),
            onChange: (...args) => console.log('[onChange] campo_year', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_year', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_year', ...args),
        })

        // --- GRUPPO: Selezione e Toggle ---
        .addGroup('Selezione e Toggle', ['col-6 px-3'])
        .addForm({
            formName: 'campo_checkbox',
            title: 'Checkbox',
            type: TYPE_CONTROL_FORM.CHECKBOX,
            formControl: new FormControl(false),
            onInitialize: (...args) => console.log('[onInitialize] campo_checkbox', ...args),
            onChange: (...args) => console.log('[onChange] campo_checkbox', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_checkbox', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_checkbox', ...args),
        })
        .addForm({
            formName: 'campo_radiogroup',
            title: 'Radio Group',
            type: TYPE_CONTROL_FORM.RADIOGROUP,
            formControl: new FormControl(null),
            options: signal([
                { id: 'a', description: 'Opzione A' },
                { id: 'b', description: 'Opzione B' },
                { id: 'c', description: 'Opzione C' },
            ]),
            onInitialize: (...args) => console.log('[onInitialize] campo_radiogroup', ...args),
            onChange: (...args) => console.log('[onChange] campo_radiogroup', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_radiogroup', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_radiogroup', ...args),
        })
        .addForm({
            formName: 'campo_arraystring',
            title: 'Array String (tag)',
            type: TYPE_CONTROL_FORM.ARRAYSTRING,
            formControl: new FormControl([]),
            onInitialize: (...args) => console.log('[onInitialize] campo_arraystring', ...args),
            onChange: (...args) => console.log('[onChange] campo_arraystring', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_arraystring', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_arraystring', ...args),
        })

        // --- GRUPPO: File e Display ---
        .addGroup('File e Display', ['col-6 px-3'])
        .addForm({
            formName: 'campo_file',
            title: 'File Upload',
            type: TYPE_CONTROL_FORM.FILE,
            formControl: new FormControl(null),
            onInitialize: (...args) => console.log('[onInitialize] campo_file', ...args),
            onChange: (...args) => console.log('[onChange] campo_file', ...args),
            onFocus: (...args) => console.log('[onFocus] campo_file', ...args),
            onBlur: (...args) => console.log('[onBlur] campo_file', ...args),
        })
        .addForm({
            formName: 'campo_label',
            title: 'Label',
            type: TYPE_CONTROL_FORM.LABEL,
            formControl: new FormControl('Questo è un campo label di sola lettura'),
            onInitialize: (...args) => console.log('[onInitialize] campo_label', ...args),
        })
        .addForm({
            formName: 'campo_link',
            title: 'Link',
            type: TYPE_CONTROL_FORM.LINK,
            formControl: new FormControl('https://example.com'),
            onInitialize: (...args) => console.log('[onInitialize] campo_link', ...args),
        })
        .addForm({
            formName: 'campo_separator',
            title: 'Separatore',
            type: TYPE_CONTROL_FORM.SEPARATOR,
            formControl: new FormControl(null),
        })

        .addActions([
            {
                label: 'Salva',
                visible: true,
                action: (...args) => {
                    alert('Salva!');
                    console.log('[Azione Salva]', ...args);
                },
            },
            {
                label: 'Reset',
                visible: true,
                action: (_q: any, _id: any, formGroup: any) => {
                    if (formGroup?.reset) formGroup.reset();
                },
            },
        ])
        .build();
}
