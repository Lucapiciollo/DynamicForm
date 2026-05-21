/**
 * @format
 */

import { Component, ElementRef, Injector, signal } from '@angular/core';
import { BaseComponent } from '../base-component.component';
import moment from 'moment';

@Component({
   selector: 'app-input-time',
   templateUrl: './input-time.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class InputTimeComponent extends BaseComponent {
   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   override ngAfterViewInit(): void {
      super.ngAfterViewInit?.();

      const currentOptions = this.getOptions();

      if (currentOptions.length < 1) {
         this.setOptions(this.getTimeIntervals());
      }
   }

   onOpenedChange(opened: boolean): void {
      if (opened) {
         this.emitOpened();
      } else {
         this.emitClosed();
      }
   }

   getOptions(): Array<{ id: string; description: string }> {
      const options = this.control?.formAction?.options;

      if (!options) {
         return [];
      }

      if (typeof options === 'function') {
         const value = options();

         if (Array.isArray(value)) {
            return value;
         }

         if (value?.items && Array.isArray(value.items)) {
            return value.items;
         }

         return [];
      }

      if (Array.isArray(options)) {
         return options;
      }

      if ((options as any)?.items && Array.isArray((options as any).items)) {
         return (options as any).items;
      }

      return [];
   }

   private setOptions(options: Array<{ id: string; description: string }>): void {
      const currentOptions = this.control?.formAction?.options as any;

      if (currentOptions && typeof currentOptions.set === 'function') {
         currentOptions.set(options);
         return;
      }

      this.control.formAction.options = signal(options);
   }

   getTimeIntervals(interval = 60, format = 'HH:mm:ss'): Array<{ id: string; description: string }> {
      const times: Array<{ id: string; description: string }> = [];

      const start = moment().startOf('day');
      const end = moment().endOf('day');

      while (start <= end) {
         const id = start.format(format);

         times.push({
            id,
            description: id,
         });

         start.add(interval, 'minutes');
      }

      return times;
   }

   isHourVisible(hour: { id: string; description: string }): boolean {
      const min = this.control?.formAction?.optionsTime?.min;
      const max = this.control?.formAction?.optionsTime?.max;

      const hourNumber = this.timeToNumber(hour?.id);
      const minNumber = min ? this.timeToNumber(min) : null;
      const maxNumber = max ? this.timeToNumber(max) : null;

      if (minNumber != null && hourNumber < minNumber) {
         return false;
      }

      if (maxNumber != null && hourNumber > maxNumber) {
         return false;
      }

      return true;
   }

   private timeToNumber(value: string): number {
      if (!value) {
         return 0;
      }

      const parts = value.split(':').map(Number);

      const hours = parts[0] || 0;
      const minutes = parts[1] || 0;
      const seconds = parts[2] || 0;

      return hours * 3600 + minutes * 60 + seconds;
   }
}