/** @format */

import { Component, Input } from '@angular/core';

/** Tipo per la categorizzazione del BMI con colore e percentuale progress-bar */
export type BmiCategory = {
    label: string;
    color: string;
    percent: number;
};

@Component({
    standalone: false,
    selector: 'app-nutri-sidebar',
    templateUrl: './nutri-sidebar.component.html',
    styleUrls: ['./nutri-sidebar.component.scss'],
})
export class NutriSidebarComponent {
    @Input() bmiValue: number | null = null;
    @Input() bmiCategory: BmiCategory = { label: '—', color: '#9e9e9e', percent: 0 };
}
