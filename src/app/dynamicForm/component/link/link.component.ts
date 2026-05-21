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
   selector: 'app-link',
   templateUrl: './link.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class LinkComponent extends BaseComponent {
   /************************************************************************************************************************************************************************ */

   /************************************************************************************************************************************************************************ */

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }
   /************************************************************************************************************************************************************************ */
   optionSelected(link: any) {
      this.control.formAction.formControl.setValue({
         clicked: true,
         value: link,
      });
      setTimeout(() => {
         this.control.formAction.formControl.setValue({clicked: false, value: link}, {emitEvent: false});
      }, 1);
   }
}
