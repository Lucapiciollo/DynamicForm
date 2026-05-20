/** @format */

import {Component, ElementRef, Injector, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BaseComponent} from '../base-component.component';
declare var window: any;
@Component({
   
  standalone: false,selector: 'app-date-range',
   templateUrl: './date-range.component.html',
   styleUrls: ['../../dynamic-form.component.scss', './date-range.component.scss'],
})
export class DateRangeComponent extends BaseComponent implements OnInit {
   /************************************************************************************************************************************************************************ */

   override ngOnInit(): void {
      super.ngOnInit();
      this.ensureDateRangeControl();
   }

   private ensureDateRangeControl(): void {
      const currentControl = this.control?.formAction?.formControl;

      if (currentControl instanceof FormGroup) {
         if (!currentControl.get('from')) currentControl.addControl('from', new FormControl<Date | null>(null));
         if (!currentControl.get('to')) currentControl.addControl('to', new FormControl<Date | null>(null));
         return;
      }

      this.control.formAction.formControl = new FormGroup({
         from: new FormControl<Date | null>(null),
         to: new FormControl<Date | null>(null),
      });
   }

   openedStream(eve) {}
   /************************************************************************************************************************************************************************ */
   closedStream(eve) {
      this.ensureDateRangeControl();
      const rangeControl = this.control.formAction.formControl as FormGroup;
      if (!rangeControl.get('to')?.value) rangeControl.get('to')?.setValue(rangeControl.get('from')?.value);
   }

   stopOutFocus() {}

   /************************************************************************************************************************************************************************ */
   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }
   /************************************************************************************************************************************************************************ */
}

