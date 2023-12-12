import { Component, ElementRef, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../bsae-component.component';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['../../dynamic-form.component.css']
})
export class DateRangeComponent extends BaseComponent {

  /************************************************************************************************************************************************************************ */

 
  /************************************************************************************************************************************************************************ */
  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector,element);
 
  }
}
