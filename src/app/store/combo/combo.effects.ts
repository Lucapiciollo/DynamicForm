/** @format */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ComboApiService } from '../services/combo-api.service';
import * as ComboActions from './combo.actions';

/**
 * ComboEffects — intercetta le action di load, chiama il ComboApiService
 * e dispatcha le action di success/failure con i dati ricevuti dal BE.
 */
@Injectable()
export class ComboEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly comboApi: ComboApiService,
    ) { }

    // ─── /api/livello-attivita ────────────────────────────────────────────────

    loadLivelloAttivita$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ComboActions.loadLivelloAttivita),
            switchMap(() =>
                this.comboApi.getLivelloAttivita().pipe(
                    map((items) => ComboActions.loadLivelloAttivitaSuccess({ items })),
                    catchError((err) =>
                        of(ComboActions.loadLivelloAttivitaFailure({ error: err.message })),
                    ),
                ),
            ),
        ),
    );

    // ─── /api/tipo-attivita-fisica ────────────────────────────────────────────

    loadTipoAttivitaFisica$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ComboActions.loadTipoAttivitaFisica),
            switchMap(() =>
                this.comboApi.getTipoAttivitaFisica().pipe(
                    map((items) => ComboActions.loadTipoAttivitaFisicaSuccess({ items })),
                    catchError((err) =>
                        of(ComboActions.loadTipoAttivitaFisicaFailure({ error: err.message })),
                    ),
                ),
            ),
        ),
    );

    // ─── /api/freq-allenamento ────────────────────────────────────────────────

    loadFreqAllenamento$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ComboActions.loadFreqAllenamento),
            switchMap(() =>
                this.comboApi.getFreqAllenamento().pipe(
                    map((items) => ComboActions.loadFreqAllenamentoSuccess({ items })),
                    catchError((err) =>
                        of(ComboActions.loadFreqAllenamentoFailure({ error: err.message })),
                    ),
                ),
            ),
        ),
    );
}
