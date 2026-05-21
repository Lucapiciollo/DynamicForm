/**
 * @format
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */

import {DatePipe} from '@angular/common';
import {Component, ElementRef, Injector} from '@angular/core';
import {BaseComponent} from '../base-component.component';

@Component({
   selector: 'app-date-time',
   templateUrl: './date-time.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   providers: [DatePipe],
   standalone: false,
})
export class DateTimeComponent extends BaseComponent {
   /************************************************************************************************************************************************************************ */

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }
   /************************************************************************************************************************************************************************ */
}
