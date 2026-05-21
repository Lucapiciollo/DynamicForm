/**
 * @format
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-30 00:30:41
 * @modify date 2022-03-30 00:30:41
 * @desc [description]
 */

import {Component, ElementRef, Injector} from '@angular/core';
import {BaseComponent} from '../base-component.component';
import moment from 'moment';

@Component({
   selector: 'app-input-time',
   templateUrl: './input-time.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
})
export class InputTimeComponent extends BaseComponent {
   public hours = [];

   /************************************************************************************************************************************************************************ */

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   /************************************************************************************************************************************************************************ */

   ngAfterViewInit(): void {
      this.control?.formAction?.options.set(this.getTimeIntervals());
   }

   getTimeIntervals(interval = 60, format = 'HH:mm:ss') {
      let times = [];
      let start = moment().startOf('day');
      let end = moment().endOf('day');
      while (start <= end) {
         let id = start.format(format);
         let description = start.format(format);
         times.push({id, description});
         start.add(interval, 'minutes');
      }
      return times;
   }
}
