/**
 * @format
 */

import { Component, ElementRef, Injector } from '@angular/core';
import { BaseComponent } from '../base-component.component';

@Component({
   selector: 'app-radiobutton',
   templateUrl: './question-radion-button.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class QuestionRadioButtonComponent extends BaseComponent {
   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   getOptions(): Array<any> {
      const options = this.control?.formAction?.options;

      if (!options) {
         return [];
      }

      if (typeof options === 'function') {
         const value = options();

         if (Array.isArray(value)) {
            return value;
         }

         if (value?.items && Array.isArray(value.items)) {
            return value.items;
         }

         return [];
      }

      if (Array.isArray(options)) {
         return options;
      }

      if ((options as any)?.items && Array.isArray((options as any).items)) {
         return (options as any).items;
      }

      return [];
   }

   getOptionValue(option: any): any {
      const keyId = this.control?.formAction?.keyCombo?.keyId;

      if (Array.isArray(keyId)) {
         return keyId
            .map(key => option?.[key])
            .filter(value => value !== null && value !== undefined)
            .join('|');
      }

      if (typeof keyId === 'string') {
         return option?.[keyId] ?? option?.id;
      }

      return option?.id;
   }

   getOptionDescription(option: any): string {
      const keyDescription = this.control?.formAction?.keyCombo?.keyDescription;

      if (Array.isArray(keyDescription)) {
         return keyDescription
            .map(key => option?.[key])
            .filter(value => value !== null && value !== undefined && value !== '')
            .join(' - ');
      }

      if (typeof keyDescription === 'string') {
         return option?.[keyDescription] ?? option?.description ?? '';
      }

      return option?.description ?? option?.name ?? String(option?.id ?? '');
   }
}