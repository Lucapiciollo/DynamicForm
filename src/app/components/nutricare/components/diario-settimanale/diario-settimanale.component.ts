/** @format */

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// ─── Costanti ────────────────────────────────────────────────────────────────

export const SETTIMANE = [
    { id: 'settimana1', label: 'Settimana 1', icon: '📅' },
    { id: 'settimana2', label: 'Settimana 2', icon: '📅' },
];

export const GIORNI = [
    { id: 'lunedi', short: 'Lun', label: 'Lunedì', emoji: '🟢' },
    { id: 'martedi', short: 'Mar', label: 'Martedì', emoji: '🔵' },
    { id: 'mercoledi', short: 'Mer', label: 'Mercoledì', emoji: '🟣' },
    { id: 'giovedi', short: 'Gio', label: 'Giovedì', emoji: '🟠' },
    { id: 'venerdi', short: 'Ven', label: 'Venerdì', emoji: '🟡' },
    { id: 'sabato', short: 'Sab', label: 'Sabato', emoji: '🔴' },
    { id: 'domenica', short: 'Dom', label: 'Domenica', emoji: '⚪' },
];

const PASTI = [
    { id: 'colazione', label: '☀️ Colazione', rows: 3 },
    { id: 'spuntino_mattina', label: '🍎 Spuntino mattina', rows: 2 },
    { id: 'pranzo', label: '🌤️ Pranzo', rows: 3 },
    { id: 'spuntino_pomeriggio', label: '🍵 Spuntino pomeriggio', rows: 2 },
    { id: 'cena', label: '🌙 Cena', rows: 3 },
];

// ─── Helper: crea il FormGroup di un singolo giorno ──────────────────────────

function buildDayGroup(): FormGroup {
    return new FormGroup({
        colazione: new FormControl<string | null>(null),
        spuntino_mattina: new FormControl<string | null>(null),
        pranzo: new FormControl<string | null>(null),
        spuntino_pomeriggio: new FormControl<string | null>(null),
        cena: new FormControl<string | null>(null),
        note: new FormControl<string | null>(null),
        sgarro: new FormControl<boolean>(false),
    });
}

// ─── Helper: crea il FormGroup di una settimana (7 giorni) ───────────────────

function buildWeekGroup(): FormGroup {
    const controls: Record<string, FormGroup> = {};
    for (const g of GIORNI) {
        controls[g.id] = buildDayGroup();
    }
    return new FormGroup(controls);
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

@Component({
    selector: 'app-diario-settimanale',
    templateUrl: './diario-settimanale.component.html',
    styleUrls: ['./diario-settimanale.component.scss'],
    standalone: false,
})
export class DiarioSettimanaleComponent implements OnInit {

    // ── Espone le costanti al template ────────────────────────────────────
    readonly settimane = SETTIMANE;
    readonly giorni = GIORNI;
    readonly pasti = PASTI;

    // ── Form reactive ─────────────────────────────────────────────────────
    diarioForm!: FormGroup; // { settimana1: { lunedi: {...}, ... }, settimana2: { ... } }

    ngOnInit(): void {
        this.diarioForm = new FormGroup({
            settimana1: buildWeekGroup(),
            settimana2: buildWeekGroup(),
        });
    }

    // ── Accesso comodo al FormGroup di un giorno ──────────────────────────
    getDayGroup(settimanaId: string, giornoId: string): FormGroup {
        return (this.diarioForm.get(settimanaId) as FormGroup)
            .get(giornoId) as FormGroup;
    }

    getControl(settimanaId: string, giornoId: string, field: string): FormControl {
        return this.getDayGroup(settimanaId, giornoId).get(field) as FormControl;
    }
}
