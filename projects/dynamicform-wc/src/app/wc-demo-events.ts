/** @format */

import { DynamicFormRuntimeConfig } from 'projects/dynamicform/src/public-api';

const API_BASE = 'http://localhost:3000';

function buildUrl(endpoint: string, param: Record<string, any>): string {
    const url = new URL(`${API_BASE}${endpoint}`);
    if (param['page'] != null) url.searchParams.set('page', String(param['page']));
    if (param['count'] != null) url.searchParams.set('pageSize', String(param['count']));
    if (param['search']) url.searchParams.set('search', String(param['search']));
    return url.toString();
}

function makeRemoteLoader(endpoint: string) {
    return (ctx: any): Promise<{ items: any[]; totalCount: number }> =>
        fetch(buildUrl(endpoint, ctx.param ?? {}))
            .then(r => {
                if (!r.ok) throw new Error(`[WC] ${endpoint} HTTP ${r.status}`);
                return r.json();
            })
            .catch(err => {
                console.error('[WC] remoteData error:', err);
                return { items: [], totalCount: 0 };
            });
}

export const DEMO_WC_EVENTS: DynamicFormRuntimeConfig = {
    events: {
        loadLivelloAttivita: makeRemoteLoader('/api/livello-attivita'),
        loadTipoAttivitaFisica: makeRemoteLoader('/api/tipo-attivita-fisica'),
        loadFreqAllenamento: makeRemoteLoader('/api/freq-allenamento'),

        onFieldChange: (ctx) => {
            window.dispatchEvent(new CustomEvent('dfChange', {
                detail: { formName: ctx.formName, value: ctx.formControl?.value, prevValue: ctx.prevValue },
            }));
        },

        onFieldInit: (ctx) => {
            window.dispatchEvent(new CustomEvent('dfInit', {
                detail: { formName: ctx.formName, type: ctx.type },
            }));
        },
    },

    actions: {
        onSalva: (_ctx) => window.dispatchEvent(new CustomEvent('dfAction', { detail: { type: 'salva' } })),
        onReset: (_ctx) => window.dispatchEvent(new CustomEvent('dfAction', { detail: { type: 'reset' } })),
    },
};
