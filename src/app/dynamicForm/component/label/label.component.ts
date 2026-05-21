/**
 * @format
 */

import { Component, ElementRef, Injector } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '../base-component.component';

@Component({
   selector: 'app-label',
   templateUrl: './label.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class LabelComponent extends BaseComponent {
   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   onLabelClick(): void {
      const formAction = this.control?.formAction;

      if (!formAction?.action) {
         return;
      }

      formAction.action(
         formAction.formControl as FormControl | FormArray | FormGroup,
      );
   }

   getText(): string {
      const formAction = this.control?.formAction;

      return String(
         formAction?.title ||
            formAction?.label ||
            formAction?.formControl?.value ||
            '',
      );
   }
}