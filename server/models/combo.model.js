/**
 * combo.model.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Oggetti di risposta per le combo del form nutrizionista.
 * Ogni funzione restituisce un array di { id, description } pronto per la
 * serializzazione JSON. In produzione questi dati arriveranno da un DB.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Livelli di attività fisica — campo livelloAttivita
 * @returns {Array<{id: string, description: string}>}
 */
const livelloAttivita = () => [
    { id: 'sedentario',    description: 'Sedentario (nessun esercizio)' },
    { id: 'leggero',       description: 'Leggero (1-2 volte/sett)' },
    { id: 'moderato',      description: 'Moderato (3-5 volte/sett)' },
    { id: 'intenso',       description: 'Intenso (6-7 volte/sett)' },
    { id: 'molto-intenso', description: 'Molto intenso (2x/giorno)' },
];

/**
 * Tipologie di attività fisica — campo tipoAttivitaFisica
 * @returns {Array<{id: string, description: string}>}
 */
const tipoAttivitaFisica = () => [
    { id: 'nessuna',       description: 'Nessuna' },
    { id: 'camminata',     description: 'Camminata' },
    { id: 'corsa',         description: 'Corsa / Running' },
    { id: 'ciclismo',      description: 'Ciclismo' },
    { id: 'nuoto',         description: 'Nuoto' },
    { id: 'palestra',      description: 'Palestra / Pesi' },
    { id: 'yoga-pilates',  description: 'Yoga / Pilates' },
    { id: 'sport-squadra', description: 'Sport di squadra' },
    { id: 'altro',         description: 'Altro' },
];

/**
 * Frequenze di allenamento — campo freqAllenamento
 * @returns {Array<{id: string, description: string}>}
 */
const freqAllenamento = () => [
    { id: '0',   description: 'Mai' },
    { id: '1',   description: '1 volta a settimana' },
    { id: '2-3', description: '2-3 volte a settimana' },
    { id: '4-5', description: '4-5 volte a settimana' },
    { id: '6+',  description: '6+ volte a settimana' },
];

module.exports = { livelloAttivita, tipoAttivitaFisica, freqAllenamento };
