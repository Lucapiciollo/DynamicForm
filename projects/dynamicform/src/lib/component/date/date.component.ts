/**
 * @format
 * @author luca.piciollo
 */

import { Component, ElementRef, Injector } from '@angular/core';
import { BaseComponent } from '../base-component.component';
import { Delay } from 'pl-decorator';
import { MatInput } from '@angular/material/input';

@Component({
   selector: 'app-date',
   templateUrl: './date.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class DateComponent extends BaseComponent {
   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   openedStream(event: unknown, datainput: MatInput): void {
      this.emitOpened();
   }

   closedStream(event: unknown): void {
      this.emitClosed();
   }

   @Delay(0)
   stopOutFocus(datainput: MatInput): void {
      datainput?.focus?.();
   }
}