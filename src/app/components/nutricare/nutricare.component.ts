/** @format */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { ConfigForm } from 'projects/dynamicform/src/public-api';
import { buildNutritionistForm } from './form/nutritionist-form.builder';
import {
    livelloAttivitaOptions,
    tipoAttivitaOptions,
    freqAllenamentoOptions,
} from './form/nutritionist-form.builder';
import {
    loadLivelloAttivita,
    loadTipoAttivitaFisica,
    loadFreqAllenamento,
} from '../../store/combo/combo.actions';
import {
    getLivelloAttivita,
    getTipoAttivitaFisica,
    getFreqAllenamento,
} from '../../store/combo/combo.selectors';
import { BmiCategory } from './components/nutri-sidebar/nutri-sidebar.component';

/**
 * NutriCareComponent — pagina principale della scheda paziente.
 *
 * Al bootstrap:
 *  1. Dispatcha le action di load per ogni combo (livelloAttivita, tipoAttivitaFisica, freqAllenamento).
 *  2. Gli NgRx Effects eseguono la chiamata HTTP al server Node.js e salvano
 *     il risultato nello store con le action *Success.
 *  3. I selettori emettono i nuovi valori; il componente aggiorna i signal del
 *     form builder, che si propagano reattivamente nelle combo del form.
 */
@Component({
    standalone: false,
    selector: 'app-nutricare',
    templateUrl: './nutricare.component.html',
    styleUrls: ['./nutricare.component.scss'],
})
export class NutriCareComponent implements OnInit, OnDestroy {
    /** Form reattivo creato dalla libreria alla prima renderizzazione */
    formGroup: FormGroup | FormArray | null = null;

    /** Configurazione form in modalità ConfigForm (Angular builder) */
    nutritionistQuestions: ConfigForm = buildNutritionistForm();

    private subs = new Subscription();

    constructor(private readonly store: Store) { }

    // ─── Lifecycle ────────────────────────────────────────────────────────────

    ngOnInit(): void {
        // 1. Dispatcha le action — gli Effects chiamano il BE Node.js
        this.store.dispatch(loadLivelloAttivita());
        this.store.dispatch(loadTipoAttivitaFisica());
        this.store.dispatch(loadFreqAllenamento());

        // 2. Quando lo store riceve i dati dal BE, aggiorna i signal del builder.
        //    I signal si propagano reattivamente nelle combo del form già renderizzato.
        this.subs.add(
            this.store
                .select(getLivelloAttivita)
                .pipe(filter((d) => d.length > 0))
                .subscribe((d) => livelloAttivitaOptions.set(d)),
        );
        this.subs.add(
            this.store
                .select(getTipoAttivitaFisica)
                .pipe(filter((d) => d.length > 0))
                .subscribe((d) => tipoAttivitaOptions.set(d)),
        );
        this.subs.add(
            this.store
                .select(getFreqAllenamento)
                .pipe(filter((d) => d.length > 0))
                .subscribe((d) => freqAllenamentoOptions.set(d)),
        );
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    // ─── Form lifecycle ───────────────────────────────────────────────────────

    onFormCreate(form: FormGroup | FormArray): void {
        this.formGroup = form;
    }

    /**
     * Accordion handler — click su qualsiasi .form-title toglie/aggiunge
     * la classe 'collapsed' alla sezione o day-card più vicina.
     */
    onFormClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const titleEl = target.closest('.form-title') as HTMLElement | null;
        if (!titleEl) return;

        const dayCard = titleEl.closest('.nutri-day-card') as HTMLElement | null;
        if (dayCard) {
            dayCard.classList.toggle('collapsed');
            return;
        }

        const section = titleEl.closest('.nutri-section') as HTMLElement | null;
        if (!section) return;
        section.classList.toggle('collapsed');
    }

    // ─── BMI helpers ─────────────────────────────────────────────────────────

    get bmiValue(): number | null {
        const fg = this.formGroup as FormGroup | null;
        return fg?.get('bmi')?.value ?? null;
    }

    get bmiCategory(): BmiCategory {
        const bmi = this.bmiValue;
        if (!bmi || bmi <= 0) return { label: '—', color: '#9e9e9e', percent: 0 };
        if (bmi < 18.5) return { label: 'Sottopeso', color: '#2196f3', percent: this._bmiPercent(bmi) };
        if (bmi < 25) return { label: 'Normopeso ✓', color: '#4caf50', percent: this._bmiPercent(bmi) };
        if (bmi < 30) return { label: 'Sovrappeso', color: '#ff9800', percent: this._bmiPercent(bmi) };
        if (bmi < 35) return { label: 'Obesità I', color: '#f44336', percent: this._bmiPercent(bmi) };
        return { label: 'Obesità grave', color: '#b71c1c', percent: 100 };
    }

    private _bmiPercent(bmi: number): number {
        return Math.min(Math.round((bmi / 40) * 100), 100);
    }
}

