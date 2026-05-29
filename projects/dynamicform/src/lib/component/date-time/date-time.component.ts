/**
 * @format
 */

import { DatePipe } from '@angular/common';
import { Component, ElementRef, Injector, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseComponent } from '../base-component.component';
import moment from 'moment';

@Component({
   selector: 'app-date-time',
   templateUrl: './date-time.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   providers: [DatePipe],
   standalone: false,
})
export class DateTimeComponent extends BaseComponent implements OnInit {
   readonly dateCtrl = new FormControl<Date | null>(null);
   readonly timeOptions = signal<Array<{ id: string; description: string }>>([]);
   selectedTime: string | null = null;

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   override ngOnInit(): void {
      super.ngOnInit();

      this.timeOptions.set(this.buildTimeIntervals(30, 'HH:mm'));

      const value = this.control?.formAction?.formControl?.value;
      if (value?.date) this.dateCtrl.setValue(value.date);
      if (value?.time) this.selectedTime = value.time;
   }

   onDateChange(): void {
      this.updateExternalControl();
   }

   onTimeChange(time: string): void {
      this.selectedTime = time;
      this.updateExternalControl();
   }

   private updateExternalControl(): void {
      const date = this.dateCtrl.value;
      const time = this.selectedTime;
      const newValue = (date || time) ? { date, time } : null;
      const fc = this.control?.formAction?.formControl;
      if (fc) {
         fc.setValue(newValue);
         fc.markAsDirty();
         fc.updateValueAndValidity();
      }
   }

   onOpenedChange(isOpened: boolean): void {
      if (isOpened) {
         this.emitOpened();
      } else {
         this.emitClosed();
      }
   }

   private buildTimeIntervals(intervalMinutes = 30, format = 'HH:mm'): Array<{ id: string; description: string }> {
      const times: Array<{ id: string; description: string }> = [];
      const start = moment().startOf('day');
      const end = moment().endOf('day');

      while (start <= end) {
         const id = start.format(format);
         times.push({ id, description: id });
         start.add(intervalMinutes, 'minutes');
      }

      return times;
   }
}
