/**
 * server.js
 * ─────────────────────────────────────────────────────────────────────────────
 * NutriCare Pro — Node.js API server
 * Espone le route REST per popolare le combo del form Angular.
 *
 * Avvio (dalla root del workspace):
 *   npm run server:start
 *
 * Avvio diretto:
 *   cd server && npm install && node server.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const express = require('express');
const cors    = require('cors');

const {
    getLivelloAttivita,
    getTipoAttivitaFisica,
    getFreqAllenamento,
} = require('./services/combo.service');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());           // abilita CORS per l'app Angular in dev
app.use(express.json());   // parsing body JSON

// ─── Routes /api/combo ───────────────────────────────────────────────────────
app.get('/api/livello-attivita',    getLivelloAttivita);
app.get('/api/tipo-attivita-fisica', getTipoAttivitaFisica);
app.get('/api/freq-allenamento',    getFreqAllenamento);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) =>
    res.json({ status: 'ok', timestamp: new Date().toISOString() }),
);

// ─── Not found ────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route non trovata' }));

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`NutriCare API server  →  http://localhost:${PORT}`);
    console.log(`  GET /api/livello-attivita`);
    console.log(`  GET /api/tipo-attivita-fisica`);
    console.log(`  GET /api/freq-allenamento`);
    console.log(`  GET /health`);
});
