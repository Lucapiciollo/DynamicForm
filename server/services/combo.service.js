/**
 * combo.service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Servizio Express per le combo del form nutrizionista.
 * Carica i modelli dati da combo.model.js e li espone come handler HTTP.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { livelloAttivita, tipoAttivitaFisica, freqAllenamento } = require('../models/combo.model');

/**
 * GET /api/livello-attivita
 * Restituisce le opzioni per il livello di attività fisica.
 */
const getLivelloAttivita = (req, res) => {
    res.json(livelloAttivita());
};

/**
 * GET /api/tipo-attivita-fisica
 * Restituisce le opzioni per il tipo di attività fisica.
 */
const getTipoAttivitaFisica = (req, res) => {
    res.json(tipoAttivitaFisica());
};

/**
 * GET /api/freq-allenamento
 * Restituisce le opzioni per la frequenza di allenamento.
 */
const getFreqAllenamento = (req, res) => {
    res.json(freqAllenamento());
};

module.exports = { getLivelloAttivita, getTipoAttivitaFisica, getFreqAllenamento };
