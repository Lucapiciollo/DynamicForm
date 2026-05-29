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

// Funzione di utilità per filtrare e paginare
function filterAndPaginate(data, req) {
  let filtered = data;
  const search = (req.query.search || '').toLowerCase();
  if (search) {
    filtered = filtered.filter(opt => opt.description.toLowerCase().includes(search));
  }
  const totalCount = filtered.length; // totale dopo filtro search, ma prima della paginazione
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);
  return { items, totalCount };
}

const getLivelloAttivita = (req, res) => {
  const data = livelloAttivita();
  res.json(filterAndPaginate(data, req));
};

/**
 * GET /api/tipo-attivita-fisica
 * Restituisce le opzioni per il tipo di attività fisica.
 */
const getTipoAttivitaFisica = (req, res) => {
  const data = tipoAttivitaFisica();
  res.json(filterAndPaginate(data, req));
};

/**
 * GET /api/freq-allenamento
 * Restituisce le opzioni per la frequenza di allenamento.
 */
const getFreqAllenamento = (req, res) => {
  const data = freqAllenamento();
  res.json(filterAndPaginate(data, req));
};

module.exports = { getLivelloAttivita, getTipoAttivitaFisica, getFreqAllenamento };
