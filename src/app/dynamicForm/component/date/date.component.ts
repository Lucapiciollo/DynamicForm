/**
 * @format
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */

import {Component, ElementRef, Injector, ViewChild} from '@angular/core';
import {BaseComponent} from '../base-component.component';
import {MatCalendar, MatDatepicker} from '@angular/material/datepicker';
import {Subscription} from 'rxjs';
import {Delay} from 'pl-decorator';
import {MatInput} from '@angular/material/input';

declare var window: any;
@Component({
   selector: 'app-date',
   templateUrl: './date.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
})
export class DateComponent extends BaseComponent {
   /************************************************************************************************************************************************************************ */

   openedStream(eve, datainput: MatInput) {}
   /************************************************************************************************************************************************************************ */
   closedStream(eve) {}
   /************************************************************************************************************************************************************************ */

   @Delay(0)
   stopOutFocus(datainput) {}

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }
   /************************************************************************************************************************************************************************ */
}
