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
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAX_DATE_CALENDAR, MIN_DATE_CALENDAR } from '../../dynamic-form.module';

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
   public minDate: string = inject(MIN_DATE_CALENDAR);
   public maxDate: string = inject(MAX_DATE_CALENDAR);

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   ngAfterViewInit(): void {
      if (this.control.formAction.optionDate == null) {
         this.control.formAction.optionDate = {
            min: this.minDate,
            max: this.maxDate,
         };
      }

      super.ngAfterViewInit?.();
   }

   openedStream(): void {
      this.emitOpened();
   }

   closedStream(): void {
      this.emitClosed();
   }

   /**
    * Toglie il focus dall'input per evitare riaperture indesiderate.
    */
   _takeFocusAway(datepicker: MatDatepicker<Moment>): void {
      this.closedStream();
   }

   _yearSelectedHandler(chosenDate: Moment, datepicker: MatDatepicker<Moment>): void {
      chosenDate.set({ date: 1 });

      this.control.formAction.formControl.markAsDirty();
      this.control.formAction.formControl.setValue(chosenDate);

      datepicker.close();
   }
}