/** @format */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * ComboItem — shape dell'oggetto restituito da ogni route combo del BE.
 * Deve corrispondere esattamente a { id, description } definito in combo.model.js.
 */
export interface ComboItem {
    id: string;
    description: string;
}

/**
 * ComboApiService — servizio globale per le chiamate HTTP alle combo del BE.
 * Viene iniettato negli NgRx Effects; non va usato direttamente nei componenti.
 *
 * Base URL: environment.baseUrlRemoteApi  (es. http://localhost:3000)
 * Routes:   environment.http.api.combo.*
 */
@Injectable({ providedIn: 'root' })
export class ComboApiService {
    private readonly base = environment.baseUrlRemoteApi;

    constructor(private http: HttpClient) { }

    /** GET /api/livello-attivita */
    getLivelloAttivita(): Observable<ComboItem[]> {
        return this.http.get<ComboItem[]>(
            `${this.base}/${environment.http.api.combo.livelloAttivita}`,
        );
    }

    /** GET /api/tipo-attivita-fisica */
    getTipoAttivitaFisica(): Observable<ComboItem[]> {
        return this.http.get<ComboItem[]>(
            `${this.base}/${environment.http.api.combo.tipoAttivitaFisica}`,
        );
    }

    /** GET /api/freq-allenamento */
    getFreqAllenamento(): Observable<ComboItem[]> {
        return this.http.get<ComboItem[]>(
            `${this.base}/${environment.http.api.combo.freqAllenamento}`,
        );
    }
}
