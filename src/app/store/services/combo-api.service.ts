import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface ComboOption {
    id: string;
    description: string;
}

export interface ComboApiPagedResult {
    items: ComboOption[];
    totalCount: number;
}

@Injectable({ providedIn: 'root' })
export class ComboApiService {
    private readonly baseUrl: string;

    constructor(private http: HttpClient) {
        // Usa environment.comboApiBaseUrl se definito, altrimenti fallback su localhost
        this.baseUrl = (environment as any).comboApiBaseUrl || 'http://localhost:3000';
    }

    getLivelloAttivita(params?: any): Observable<ComboApiPagedResult> {
        return this.http.get<ComboApiPagedResult>(`${this.baseUrl}/api/livello-attivita`, { params });
    }

    getTipoAttivitaFisica(params?: any): Observable<ComboApiPagedResult> {
        return this.http.get<ComboApiPagedResult>(`${this.baseUrl}/api/tipo-attivita-fisica`, { params });
    }

    getFreqAllenamento(params?: any): Observable<ComboApiPagedResult> {
        return this.http.get<ComboApiPagedResult>(`${this.baseUrl}/api/freq-allenamento`, { params });
    }
}
