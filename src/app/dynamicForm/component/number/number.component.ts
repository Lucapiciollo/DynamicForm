/**
 * @format
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-11-18 12:55:11
 * @modify date 2022-11-18 12:55:11
 * @desc [description]
 */

import {Component, ElementRef, Injector} from '@angular/core';
import {BaseComponent} from '../base-component.component';

@Component({
   selector: 'app-number',
   templateUrl: './number.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class NumberComponent extends BaseComponent {
   /************************************************************************************************************************************************************************ */

   /************************************************************************************************************************************************************************ */

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }
   /************************************************************************************************************************************************************************ */
}
