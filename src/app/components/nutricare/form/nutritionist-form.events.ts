/** @format */

import { FormGroup } from '@angular/forms';
import { DynamicFormRuntimeConfig } from 'projects/dynamicform/src/lib/providers/dynamic-form.providers';
import { Utility } from 'projects/dynamicform/src/public-api';

// ---------------------------------------------------------------------------
// Calcola il BMI in base ai valori correnti di altezza e peso.
// Viene chiamato sia dagli eventi JSON-schema che dal builder runtime.
// ---------------------------------------------------------------------------
export function calcBMIHelper(utility: Utility): void {
    let peso: number | null = null;
    let altezza: number | null = null;

    utility.getFormByName?.('peso', fa => { peso = fa.formControl?.value; });
    utility.getFormByName?.('altezza', fa => { altezza = fa.formControl?.value; });

    if (peso && altezza && altezza > 0) {
        const bmi = parseFloat((peso / Math.pow(altezza / 100, 2)).toFixed(1));
        utility.getFormByName?.('bmi', fa =>
            fa.formControl?.setValue(bmi, { emitEvent: false }),
        );
    }
}

// ---------------------------------------------------------------------------

export const NUTRITIONIST_EVENTS: DynamicFormRuntimeConfig = {
    events: {
        calcBMI: ctx => calcBMIHelper(ctx.utility),
    },

    actions: {
        onSavePatient: ctx => {
            const fg = ctx.formGroup;
            console.group(
                '%c[NutriCare Pro] 💾 Scheda paziente salvata',
                'color: #2e7d32; font-size: 14px; font-weight: bold; padding: 4px;',
            );
            console.log('Dati completi:', fg instanceof FormGroup ? fg.getRawValue() : fg?.value);
            console.groupEnd();
            alert('✅ Scheda paziente salvata con successo!\nControlla la console per i dettagli.');
        },

        onResetPatient: ctx => {
            if (confirm('Vuoi azzerare tutti i dati del paziente?')) {
                if (ctx.formGroup instanceof FormGroup) {
                    ctx.formGroup.reset();
                }
            }
        },

        onPrintPatient: _ctx => {
            window.print();
        },
    },
};
