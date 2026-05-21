/**
 * @format
 */

import {Component, ElementRef, Injector} from '@angular/core';
import {BaseComponent} from '../base-component.component';

@Component({
   selector: 'app-radiobutton',
   templateUrl: './question-radion-button.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
})
export class QuestionRadioButtonComponent extends BaseComponent {
   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   override toString(num: any): string {
      return String(num);
   }

   getOptions(): any[] {
      const options = this.control?.formAction?.options;
      const value = typeof options === 'function' ? options() : options;
      return Array.isArray(value) ? value : [];
   }
}
