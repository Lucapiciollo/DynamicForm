/**
 * @format
 */

import { DatePipe } from '@angular/common';
import { Component, ElementRef, Injector } from '@angular/core';
import { BaseComponent } from '../base-component.component';

@Component({
   selector: 'app-date-time',
   templateUrl: './date-time.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   providers: [DatePipe],
   standalone: false,
})
export class DateTimeComponent extends BaseComponent {
   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   onOpenedChange(isOpened: boolean): void {
      if (isOpened) {
         this.emitOpened();
      } else {
         this.emitClosed();
      }
   }
}