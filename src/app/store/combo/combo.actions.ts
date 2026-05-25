/** @format */

import { createAction, props } from '@ngrx/store';
import { ComboItem } from '../services/combo-api.service';

// ─── /api/livello-attivita ────────────────────────────────────────────────────

export const loadLivelloAttivita = createAction(
    '[/api/livello-attivita] Load',
);
export const loadLivelloAttivitaSuccess = createAction(
    '[/api/livello-attivita] Load Success',
    props<{ items: ComboItem[] }>(),
);
export const loadLivelloAttivitaFailure = createAction(
    '[/api/livello-attivita] Load Failure',
    props<{ error: string }>(),
);

// ─── /api/tipo-attivita-fisica ────────────────────────────────────────────────

export const loadTipoAttivitaFisica = createAction(
    '[/api/tipo-attivita-fisica] Load',
);
export const loadTipoAttivitaFisicaSuccess = createAction(
    '[/api/tipo-attivita-fisica] Load Success',
    props<{ items: ComboItem[] }>(),
);
export const loadTipoAttivitaFisicaFailure = createAction(
    '[/api/tipo-attivita-fisica] Load Failure',
    props<{ error: string }>(),
);

// ─── /api/freq-allenamento ────────────────────────────────────────────────────

export const loadFreqAllenamento = createAction(
    '[/api/freq-allenamento] Load',
);
export const loadFreqAllenamentoSuccess = createAction(
    '[/api/freq-allenamento] Load Success',
    props<{ items: ComboItem[] }>(),
);
export const loadFreqAllenamentoFailure = createAction(
    '[/api/freq-allenamento] Load Failure',
    props<{ error: string }>(),
);
