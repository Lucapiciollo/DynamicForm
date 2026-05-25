/** @format */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ComboState } from './combo.reducer';

// ─── Feature selector ─────────────────────────────────────────────────────────

const selectComboFeature = createFeatureSelector<ComboState>('combo');

// ─── Selectors (nome = get + titolo della combo) ──────────────────────────────

/** Opzioni livello attività fisica */
export const getLivelloAttivita = createSelector(
    selectComboFeature,
    (state) => state.livelloAttivita,
);

/** Opzioni tipo di attività fisica */
export const getTipoAttivitaFisica = createSelector(
    selectComboFeature,
    (state) => state.tipoAttivitaFisica,
);

/** Opzioni frequenza allenamento */
export const getFreqAllenamento = createSelector(
    selectComboFeature,
    (state) => state.freqAllenamento,
);

/** Flag di caricamento globale delle combo */
export const getComboLoading = createSelector(
    selectComboFeature,
    (state) => state.loading,
);

/** Eventuale errore durante il caricamento */
export const getComboError = createSelector(
    selectComboFeature,
    (state) => state.error,
);
