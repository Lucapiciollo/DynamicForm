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
const livelloAttivita = () =>
  Array.from({ length: 100 }, (_, i) => ({
    id: `livello${i + 1}`,
    description: `Livello attività fisica ${i + 1}`,
  }));

/**
 * Tipologie di attività fisica — campo tipoAttivitaFisica
 * @returns {Array<{id: string, description: string}>}
 */
const tipoAttivitaFisica = () =>
  Array.from({ length: 100 }, (_, i) => ({
    id: `tipo${i + 1}`,
    description: `Tipo attività fisica ${i + 1}`,
  }));

/**
 * Frequenze di allenamento — campo freqAllenamento
 * @returns {Array<{id: string, description: string}>}
 */
const freqAllenamento = () => [
  { id: '0', description: 'Mai' },
  { id: '1', description: '1 volta a settimana' },
  { id: '2-3', description: '2-3 volte a settimana' },
  { id: '4-5', description: '4-5 volte a settimana' },
  { id: '6+', description: '6+ volte a settimana' },
];

module.exports = { livelloAttivita, tipoAttivitaFisica, freqAllenamento };
