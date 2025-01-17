import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../base-component.component';
import { MatDateRangeInput, MatDateRangePicker, MatMonthView } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { Delay } from 'pl-decorator';
declare var window: any
@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})
export class DateRangeComponent extends BaseComponent {


  /************************************************************************************************************************************************************************ */

  openedStream(eve) { }
  /************************************************************************************************************************************************************************ */
  closedStream(eve) {
    if (!this.control.formAction.formControl.get("to").value)
      this.control.formAction.formControl.get("to").setValue(this.control.formAction.formControl.get("from").value)
  }


  stopOutFocus() { }

  /************************************************************************************************************************************************************************ */
  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);

  }
  /************************************************************************************************************************************************************************ */
}
