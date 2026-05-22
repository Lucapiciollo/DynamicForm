/** @format */

import { Component, ElementRef, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '../base-component.component';

@Component({
   selector: 'app-date-range',
   templateUrl: './date-range.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class DateRangeComponent extends BaseComponent implements OnInit {
   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   override ngOnInit(): void {
      super.ngOnInit();
      this.ensureDateRangeControl();
   }

   private ensureDateRangeControl(): void {
      const currentControl = this.control?.formAction?.formControl;

      if (currentControl instanceof FormGroup) {
         if (!currentControl.get('from')) {
            currentControl.addControl('from', new FormControl<Date | null>(null));
         }

         if (!currentControl.get('to')) {
            currentControl.addControl('to', new FormControl<Date | null>(null));
         }

         return;
      }

      this.control.formAction.formControl = new FormGroup({
         from: new FormControl<Date | null>(null),
         to: new FormControl<Date | null>(null),
      });
   }

   openedStream(event: unknown): void {
      this.ensureDateRangeControl();
      this.emitOpened();
   }

   closedStream(event: unknown): void {
      this.ensureDateRangeControl();

      const rangeControl = this.control.formAction.formControl as FormGroup;

      if (!rangeControl.get('to')?.value) {
         rangeControl.get('to')?.setValue(rangeControl.get('from')?.value);
      }

      this.emitClosed();
   }

   applyRange(): void {
      this.ensureDateRangeControl();

      const rangeControl = this.control.formAction.formControl as FormGroup;

      this.control.formAction?.optionDate?.onClose?.(
         rangeControl.value,
         rangeControl,
      );

      this.control.formAction?.onClose?.(
         rangeControl.value,
         rangeControl as any,
         this.utils,
      );

      rangeControl.markAsDirty();
      rangeControl.markAsTouched();
      rangeControl.updateValueAndValidity();
   }

   stopOutFocus(): void {}
}