/** @format */

import { DynamicFormJsonSchema, DynamicJsonField } from 'projects/dynamicform/src/lib/models/dynamic-form-json-schema.model';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: genera il campo GROUP di un giorno con i 7 dati (5 pasti + note + sgarro)
// Struttura reactive: { [dayId]: FormArray([FormGroup({ colazione, ... , note, sgarro })]) }
// ─────────────────────────────────────────────────────────────────────────────
function giornoJson(id: string, emoji: string, giorno: string): DynamicJsonField {
    return {
        name: id,
        type: 'GROUP',
        label: `${emoji} ${giorno}`,
        class: ['col-12'],
        children: [
            {
                title: `${emoji} ${giorno}`,
                class: ['col-12', 'nutri-day-card'],
                fields: [
                    { name: 'colazione', type: 'TEXTAREA', label: '☀️ Colazione', class: ['col-md-4'], css: { rows: 3 }, hint: 'Latte, cereali, frutta, caffè...' },
                    { name: 'spuntino_mattina', type: 'TEXTAREA', label: '🍎 Spuntino mattina', class: ['col-md-4'], css: { rows: 3 } },
                    { name: 'pranzo', type: 'TEXTAREA', label: '🌤️ Pranzo', class: ['col-md-4'], css: { rows: 3 }, hint: 'Primo, secondo, contorno, frutta' },
                    { name: 'spuntino_pomeriggio', type: 'TEXTAREA', label: '🍵 Spuntino pomeriggio', class: ['col-md-4'], css: { rows: 3 } },
                    { name: 'cena', type: 'TEXTAREA', label: '🌙 Cena', class: ['col-md-4'], css: { rows: 3 }, hint: 'Secondo, verdure, pane, frutta' },
                    { name: 'note', type: 'TEXTAREA', label: '📝 Note del giorno', class: ['col-md-7'], css: { rows: 2 } },
                    { name: 'sgarro', type: 'CHECKBOX', label: '🍕 Sgarro / Strappo', class: ['col-md-5'] },
                ],
            },
        ],
    };
}

export const NUTRITIONIST_JSON_SCHEMA: DynamicFormJsonSchema = {
    id: 'scheda-paziente',
    groups: [
        // ─────────────────────────────────────────────────────────────────────
        // GRUPPO 1 · Dati Personali
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'dati-personali',
            title: '👤 Dati Personali',
            class: ['col-12', 'nutri-section', 'mb-3'],
            fields: [
                {
                    name: 'nome',
                    type: 'TEXT',
                    label: 'Nome *',
                    class: ['col-md-6'],
                    validators: [{ type: 'required', message: 'Il nome è obbligatorio' }],
                },
                {
                    name: 'cognome',
                    type: 'TEXT',
                    label: 'Cognome *',
                    class: ['col-md-6'],
                    validators: [{ type: 'required', message: 'Il cognome è obbligatorio' }],
                },
                {
                    name: 'dataNascita',
                    type: 'DATA',
                    label: 'Data di nascita',
                    class: ['col-md-4'],
                },
                {
                    name: 'sesso',
                    type: 'RADIOGROUP',
                    label: 'Sesso',
                    class: ['col-md-4'],
                    options: [
                        { id: 'M', description: 'Maschio' },
                        { id: 'F', description: 'Femmina' },
                        { id: 'A', description: 'Altro' },
                    ],
                },
                {
                    name: 'professione',
                    type: 'TEXT',
                    label: 'Professione',
                    class: ['col-md-4'],
                },
                {
                    name: 'email',
                    type: 'TEXT',
                    label: 'Email',
                    class: ['col-md-6'],
                    validators: [{ type: 'email', message: 'Indirizzo email non valido' }],
                },
                {
                    name: 'telefono',
                    type: 'TEXT',
                    label: 'Telefono',
                    class: ['col-md-6'],
                    validators: [
                        { type: 'pattern', value: '^[+0-9\\s\\-()]{6,20}$', message: 'Formato telefono non valido' },
                    ],
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // GRUPPO 2 · Parametri Corporei
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'parametri-corporei',
            title: '📊 Parametri Corporei',
            class: ['col-12', 'nutri-section', 'mb-3'],
            fields: [
                {
                    name: 'altezza',
                    type: 'NUMBER',
                    label: 'Altezza (cm) *',
                    class: ['col-md-3'],
                    validators: [{ type: 'required', message: 'Altezza obbligatoria' }],
                    optionNumber: { min: 50, max: 250, step: 0.5 },
                    hint: 'es. 170',
                    events: { change: 'calcBMI' },
                },
                {
                    name: 'peso',
                    type: 'NUMBER',
                    label: 'Peso (kg) *',
                    class: ['col-md-3'],
                    validators: [{ type: 'required', message: 'Peso obbligatorio' }],
                    optionNumber: { min: 20, max: 300, step: 0.1 },
                    hint: 'es. 70.5',
                    events: { change: 'calcBMI' },
                },
                {
                    name: 'bmi',
                    type: 'NUMBER',
                    label: 'BMI (calcolato)',
                    class: ['col-md-3'],
                    readonly: true,
                    hint: 'Calcolato automaticamente',
                },
                {
                    name: 'pesoTarget',
                    type: 'NUMBER',
                    label: 'Peso target (kg)',
                    class: ['col-md-3'],
                    optionNumber: { min: 20, max: 300, step: 0.1 },
                },
                {
                    name: 'circonferenzaVita',
                    type: 'NUMBER',
                    label: 'Circ. vita (cm)',
                    class: ['col-md-3'],
                    optionNumber: { min: 40, max: 200, step: 0.5 },
                },
                {
                    name: 'circonferenzaFianchi',
                    type: 'NUMBER',
                    label: 'Circ. fianchi (cm)',
                    class: ['col-md-3'],
                    optionNumber: { min: 40, max: 200, step: 0.5 },
                },
                {
                    name: 'percentualeMassaGrassa',
                    type: 'NUMBER',
                    label: 'Massa grassa (%)',
                    class: ['col-md-3'],
                    optionNumber: { min: 1, max: 80, step: 0.5 },
                },
                {
                    name: 'livelloAttivita',
                    type: 'COMBO',
                    label: 'Livello attività fisica',
                    class: ['col-md-3'],
                    options: [
                        { id: 'sedentario', description: '🛋️ Sedentario (nessun esercizio)' },
                        { id: 'leggero', description: '🚶 Leggero (1-2 volte/sett)' },
                        { id: 'moderato', description: '🏃 Moderato (3-5 volte/sett)' },
                        { id: 'intenso', description: '🏋️ Intenso (6-7 volte/sett)' },
                        { id: 'molto-intenso', description: '⚡ Molto intenso (2x/giorno)' },
                    ],
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // GRUPPO 3 · Anamnesi Clinica
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'anamnesi',
            title: '🏥 Anamnesi Clinica',
            class: ['col-12', 'nutri-section', 'mb-3'],
            fields: [
                {
                    name: 'patologie',
                    type: 'ARRAYSTRING',
                    label: 'Patologie / Diagnosi',
                    class: ['col-md-6'],
                    hint: 'Aggiungi una patologia alla volta e premi Invio',
                },
                {
                    name: 'farmaci',
                    type: 'TEXTAREA',
                    label: 'Farmaci in uso',
                    class: ['col-md-6'],
                    hint: 'Indicare nome, dosaggio e frequenza',
                    css: { rows: 3 },
                },
                {
                    name: 'allergie',
                    type: 'ARRAYSTRING',
                    label: '⚠️ Allergie alimentari',
                    class: ['col-md-6'],
                    hint: 'es. arachidi, latte, glutine...',
                },
                {
                    name: 'intolleranze',
                    type: 'ARRAYSTRING',
                    label: 'Intolleranze alimentari',
                    class: ['col-md-6'],
                    hint: 'es. lattosio, fruttosio...',
                },
                {
                    name: 'chirurgie',
                    type: 'TEXTAREA',
                    label: 'Interventi chirurgici pregressi',
                    class: ['col-12'],
                    css: { rows: 2 },
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // GRUPPO 4 · Abitudini Alimentari
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'abitudini-alimentari',
            title: '🍽️ Abitudini Alimentari',
            class: ['col-12', 'nutri-section', 'mb-3'],
            fields: [
                {
                    name: 'numPasti',
                    type: 'NUMBER',
                    label: 'N° pasti al giorno',
                    class: ['col-md-3'],
                    optionNumber: { min: 1, max: 8, step: 1 },
                },
                {
                    name: 'acquaLitri',
                    type: 'NUMBER',
                    label: 'Acqua (litri/giorno)',
                    class: ['col-md-3'],
                    optionNumber: { min: 0, max: 6, step: 0.25 },
                },
                {
                    name: 'colazione',
                    type: 'TEXTAREA',
                    label: '☀️ Colazione tipica',
                    class: ['col-md-6'],
                    hint: 'Descrivi la tua colazione abituale',
                    css: { rows: 3 },
                },
                {
                    name: 'pranzo',
                    type: 'TEXTAREA',
                    label: '🌤️ Pranzo tipico',
                    class: ['col-md-6'],
                    hint: 'Descrivi il tuo pranzo abituale',
                    css: { rows: 3 },
                },
                {
                    name: 'cena',
                    type: 'TEXTAREA',
                    label: '🌙 Cena tipica',
                    class: ['col-md-6'],
                    hint: 'Descrivi la tua cena abituale',
                    css: { rows: 3 },
                },
                {
                    name: 'spuntini',
                    type: 'TEXTAREA',
                    label: '🍎 Spuntini',
                    class: ['col-md-6'],
                    hint: 'Spuntini mattina / pomeriggio',
                    css: { rows: 3 },
                },
                {
                    name: 'cibiPreferiti',
                    type: 'ARRAYSTRING',
                    label: '❤️ Cibi preferiti',
                    class: ['col-md-6'],
                },
                {
                    name: 'cibiEvitati',
                    type: 'ARRAYSTRING',
                    label: '🚫 Cibi non graditi / evitati',
                    class: ['col-md-6'],
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // GRUPPO 5 · Stile di Vita
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'stile-vita',
            title: '💪 Stile di Vita',
            class: ['col-12', 'nutri-section', 'mb-3'],
            fields: [
                {
                    name: 'tipoAttivitaFisica',
                    type: 'COMBO',
                    label: 'Tipo di attività fisica',
                    class: ['col-md-6'],
                    options: [
                        { id: 'nessuna', description: 'Nessuna' },
                        { id: 'camminata', description: '🚶 Camminata' },
                        { id: 'corsa', description: '🏃 Corsa / Running' },
                        { id: 'ciclismo', description: '🚴 Ciclismo' },
                        { id: 'nuoto', description: '🏊 Nuoto' },
                        { id: 'palestra', description: '🏋️ Palestra / Pesi' },
                        { id: 'yoga-pilates', description: '🧘 Yoga / Pilates' },
                        { id: 'sport-squadra', description: '⚽ Sport di squadra' },
                        { id: 'altro', description: 'Altro' },
                    ],
                },
                {
                    name: 'freqAllenamento',
                    type: 'COMBO',
                    label: 'Frequenza allenamento',
                    class: ['col-md-6'],
                    options: [
                        { id: '0', description: 'Mai' },
                        { id: '1', description: '1 volta a settimana' },
                        { id: '2-3', description: '2-3 volte a settimana' },
                        { id: '4-5', description: '4-5 volte a settimana' },
                        { id: '6+', description: '6+ volte a settimana' },
                    ],
                },
                {
                    name: 'oreSonno',
                    type: 'NUMBER',
                    label: 'Ore di sonno (media)',
                    class: ['col-md-3'],
                    optionNumber: { min: 2, max: 14, step: 0.5 },
                },
                {
                    name: 'livelloStress',
                    type: 'RADIOGROUP',
                    label: 'Livello di stress quotidiano',
                    class: ['col-md-9'],
                    options: [
                        { id: '1', description: '1 – Minimo' },
                        { id: '2', description: '2 – Basso' },
                        { id: '3', description: '3 – Moderato' },
                        { id: '4', description: '4 – Alto' },
                        { id: '5', description: '5 – Molto alto' },
                    ],
                },
                {
                    name: 'fumo',
                    type: 'CHECKBOX',
                    label: 'Fumatore / Fumatrice',
                    class: ['col-md-3'],
                },
                {
                    name: 'alcol',
                    type: 'CHECKBOX',
                    label: 'Consumo di alcolici',
                    class: ['col-md-3'],
                },
                {
                    name: 'integratori',
                    type: 'ARRAYSTRING',
                    label: '💊 Integratori assunti',
                    class: ['col-md-6'],
                    hint: 'es. vitamina D, omega-3...',
                },
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // GRUPPO 6 · Diario Alimentare Settimanale
        // Ogni giorno = campo GROUP → FormArray([FormGroup({ colazione, ... })])
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'diario-alimentare',
            title: '📅 Diario Alimentare Settimanale',
            class: ['col-12', 'nutri-section', 'mb-3'],
            fields: [
                giornoJson('lunedi', '🟢', 'Lunedì'),
                giornoJson('martedi', '🔵', 'Martedì'),
                giornoJson('mercoledi', '🟣', 'Mercoledì'),
                giornoJson('giovedi', '🟠', 'Giovedì'),
                giornoJson('venerdi', '🟡', 'Venerdì'),
                giornoJson('sabato', '🔴', 'Sabato'),
                giornoJson('domenica', '⚪', 'Domenica'),
            ],
        },

        // ─────────────────────────────────────────────────────────────────────
        // GRUPPO 7 · Obiettivi Terapeutici
        // ─────────────────────────────────────────────────────────────────────
        {
            id: 'obiettivi',
            title: '🎯 Obiettivi Terapeutici',
            class: ['col-12', 'nutri-section', 'mb-3'],
            fields: [
                {
                    name: 'obiettivo',
                    type: 'RADIOGROUP',
                    label: 'Obiettivo principale',
                    class: ['col-12'],
                    options: [
                        { id: 'perdita-peso', description: '⬇️ Perdita di peso' },
                        { id: 'mantenimento', description: '⚖️ Mantenimento' },
                        { id: 'aumento-massa', description: '⬆️ Aumento massa muscolare' },
                        { id: 'miglioramento-salute', description: '❤️ Miglioramento salute generale' },
                        { id: 'patologia-specifica', description: '🏥 Gestione patologia specifica' },
                        { id: 'sport-performance', description: '🏅 Performance sportiva' },
                    ],
                },
                {
                    name: 'motivazione',
                    type: 'TEXTAREA',
                    label: 'Motivazione e aspettative',
                    class: ['col-md-6'],
                    hint: 'Perché hai deciso di seguire un percorso nutrizionale?',
                    css: { rows: 4 },
                },
                {
                    name: 'noteNutrizionista',
                    type: 'TEXTAREA',
                    label: '📝 Note del nutrizionista',
                    class: ['col-md-6'],
                    hint: 'Osservazioni cliniche, indicazioni personalizzate...',
                    css: { rows: 4 },
                },
            ],
            actions: [
                {
                    label: '💾 Salva scheda',
                    event: 'onSavePatient',
                    cssClassButton: ['btn', 'btn-success', 'px-4'],
                    visible: true,
                },
                {
                    label: '🖨️ Stampa',
                    event: 'onPrintPatient',
                    cssClassButton: ['btn', 'btn-outline-secondary', 'px-3'],
                    visible: true,
                },
                {
                    label: '🔄 Azzera',
                    event: 'onResetPatient',
                    cssClassButton: ['btn', 'btn-outline-danger', 'px-3'],
                    visible: true,
                },
            ],
        },
    ],
};
