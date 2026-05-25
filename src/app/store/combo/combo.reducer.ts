/** @format */

import { createReducer, on } from '@ngrx/store';
import { ComboItem } from '../services/combo-api.service';
import * as ComboActions from './combo.actions';

// ─── State ────────────────────────────────────────────────────────────────────

export interface ComboState {
    livelloAttivita: ComboItem[];
    tipoAttivitaFisica: ComboItem[];
    freqAllenamento: ComboItem[];
    loading: boolean;
    error: string | null;
}

export const initialComboState: ComboState = {
    livelloAttivita: [],
    tipoAttivitaFisica: [],
    freqAllenamento: [],
    loading: false,
    error: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

export const comboReducer = createReducer(
    initialComboState,

    // Qualsiasi load → loading = true
    on(
        ComboActions.loadLivelloAttivita,
        ComboActions.loadTipoAttivitaFisica,
        ComboActions.loadFreqAllenamento,
        (state) => ({ ...state, loading: true, error: null }),
    ),

    // Success per singola combo
    on(ComboActions.loadLivelloAttivitaSuccess, (state, { items }) => ({
        ...state,
        livelloAttivita: items,
        loading: false,
    })),
    on(ComboActions.loadTipoAttivitaFisicaSuccess, (state, { items }) => ({
        ...state,
        tipoAttivitaFisica: items,
        loading: false,
    })),
    on(ComboActions.loadFreqAllenamentoSuccess, (state, { items }) => ({
        ...state,
        freqAllenamento: items,
        loading: false,
    })),

    // Failure generica
    on(
        ComboActions.loadLivelloAttivitaFailure,
        ComboActions.loadTipoAttivitaFisicaFailure,
        ComboActions.loadFreqAllenamentoFailure,
        (state, { error }) => ({ ...state, error, loading: false }),
    ),
);
