/** @format */

import { ChangeDetectorRef, Component, ElementRef, Injector } from '@angular/core';
import { BaseComponent } from '../base-component.component';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
    standalone: false,
})
export class RatingComponent extends BaseComponent {
    private _hoverValue = 0;

    constructor(
        protected override injector: Injector,
        protected override element: ElementRef,
        private cdr: ChangeDetectorRef,
    ) {
        super(injector, element);
    }

    get maxStars(): number {
        return this.control?.formAction?.optionRating?.max ?? 5;
    }

    get stars(): number[] {
        return Array.from({ length: this.maxStars }, (_, i) => i + 1);
    }

    get currentValue(): number {
        return this.control?.formAction?.formControl?.value ?? 0;
    }

    get hoverValue(): number {
        return this._hoverValue;
    }

    setHover(star: number): void {
        if (!this.control?.formAction?.formControl?.disabled) {
            this._hoverValue = star;
            this.cdr.markForCheck();
        }
    }

    clearHover(): void {
        this._hoverValue = 0;
        this.cdr.markForCheck();
    }

    selectStar(star: number): void {
        const fc = this.control?.formAction?.formControl;
        if (!fc || fc.disabled) return;

        const prevValue = fc.value;
        // click sulla stessa stella → porta a 0 (nessuna stella illuminata)
        const newValue = prevValue === star ? 0 : star;
        fc.setValue(newValue);
        fc.markAsDirty();
        fc.updateValueAndValidity();
        this.cdr.markForCheck();
        this.callOnChange(prevValue, newValue);
    }

    isActive(star: number): boolean {
        const display = this._hoverValue || this.currentValue;
        return star <= display;
    }
}
