import { Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ConfigForm } from 'projects/dynamicform/src/public-api';
import { DynamicFormJsonSchema } from 'projects/dynamicform/src/lib/models/dynamic-form-json-schema.model';
import { NUTRITIONIST_JSON_SCHEMA } from './nutritionist-form.json-schema';
import { buildNutritionistForm } from './nutritionist-form.builder';

export type BmiCategory = { label: string; color: string; percent: number };

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /** Quale implementazione mostrare: JSON schema o ConfigForm builder */
  mode: 'json' | 'builder' = 'json';

  /** Form reattivo creato dalla libreria al momento del render */
  formGroup: FormGroup | FormArray | null = null;

  /** Schema JSON dichiarativo */
  nutritionistJson: DynamicFormJsonSchema = NUTRITIONIST_JSON_SCHEMA;

  /** ConfigForm runtime Angular */
  nutritionistQuestions: ConfigForm = buildNutritionistForm();

  // ─────────────────────────────────────────────────────────────────────────
  // Lifecycle del form
  // ─────────────────────────────────────────────────────────────────────────

  onFormCreate(form: FormGroup | FormArray): void {
    this.formGroup = form;
  }

  /** Accordion: click su form-title toggle la sezione o la day-card */
  onFormClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const titleEl = target.closest('.form-title') as HTMLElement | null;
    if (!titleEl) return;

    // Se il click è dentro una nutri-day-card → collassa/espandi solo quel giorno
    const dayCard = titleEl.closest('.nutri-day-card') as HTMLElement | null;
    if (dayCard) {
      dayCard.classList.toggle('collapsed');
      return;
    }

    // Altrimenti collassa/espandi la sezione principale
    const section = titleEl.closest('.nutri-section') as HTMLElement | null;
    if (!section) return;
    section.classList.toggle('collapsed');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BMI helpers (usati nel template per il pannello laterale)
  // ─────────────────────────────────────────────────────────────────────────

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

