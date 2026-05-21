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

@Component({
   selector: 'app-label',
   templateUrl: './label.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class LabelComponent extends BaseComponent {
   /************************************************************************************************************************************************************************ */

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }
   /************************************************************************************************************************************************************************ */
}
