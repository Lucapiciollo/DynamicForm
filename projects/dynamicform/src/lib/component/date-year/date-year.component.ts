/**
 * @format
 * @author luca.piciollo
 */

import { Component, ElementRef, forwardRef, inject, Injector } from '@angular/core';
import { BaseComponent } from '../base-component.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';
import moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAX_DATE_CALENDAR, MIN_DATE_CALENDAR } from '../../tokens/dynamic-form-injection-tokens';

export const YEAR_MODE_FORMATS = {
   parse: {
      dateInput: 'YYYY',
   },
   display: {
      dateInput: 'YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
   },
};

@Component({
   selector: 'app-year',
   templateUrl: './date-year.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
   providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'it' },
      {
         provide: DateAdapter,
         useClass: MomentDateAdapter,
         deps: [MAT_DATE_LOCALE],
      },
      { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS },
      {
         provide: NG_VALUE_ACCESSOR,
         useExisting: forwardRef(() => DateYearComponent),
         multi: true,
      },
   ],
})
export class DateYearComponent extends BaseComponent {
   private _minDateToken: string = inject(MIN_DATE_CALENDAR);
   private _maxDateToken: string = inject(MAX_DATE_CALENDAR);

   get minDate(): Moment | null {
      const min = this.control?.formAction?.optionDate?.min;
      return min ? moment(min, 'YYYY').startOf('year') : null;
   }

   get maxDate(): Moment | null {
      const max = this.control?.formAction?.optionDate?.max;
      return max ? moment(max, 'YYYY').endOf('year') : null;
   }

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   override ngAfterViewInit(): void {
      // Non imporre min/max automatici per l'anno: l'utente deve settare optionDate esplicitamente.
      // I token di default del modulo sono troppo restrittivi per un picker annuale.
      super.ngAfterViewInit?.();
   }

   get currentYear(): number {
      const v = this.control?.formAction?.formControl?.value;
      if (v && moment.isMoment(v)) return (v as Moment).year();
      if (v instanceof Date) return v.getFullYear();
      return moment().year();
   }

   get minYear(): number {
      const min = this.control?.formAction?.optionDate?.min;
      return min ? moment(min, 'YYYY').year() : 1900;
   }

   get maxYear(): number {
      const max = this.control?.formAction?.optionDate?.max;
      return max ? moment(max, 'YYYY').year() : 2100;
   }

   prevYear(): void {
      const current = this.currentYear;
      if (current > this.maxYear) {
         // valore fuori range superiore → salta al massimo consentito
         this._setYear(this.maxYear);
      } else {
         const y = current - 1;
         if (y >= this.minYear) this._setYear(y);
      }
   }

   nextYear(): void {
      const current = this.currentYear;
      if (current < this.minYear) {
         // valore fuori range inferiore → salta al minimo consentito
         this._setYear(this.minYear);
      } else {
         const y = current + 1;
         if (y <= this.maxYear) this._setYear(y);
      }
   }

   private _setYear(year: number): void {
      const date = moment().year(year).startOf('year');
      this.control.formAction.formControl.setValue(date);
      this.control.formAction.formControl.markAsDirty();
      this.control.formAction.formControl.updateValueAndValidity();
   }

   openedStream(): void {
      this.emitOpened();
   }

   closedStream(): void {
      this.emitClosed();
   }

   _yearSelectedHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>): void {
      this._setYear(chosenDate.year());
      datepicker.close();
   }
}
