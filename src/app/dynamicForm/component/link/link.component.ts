/**
 * @format
 */

import { Component, ElementRef, Injector } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '../base-component.component';

@Component({
   selector: 'app-link',
   templateUrl: './link.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class LinkComponent extends BaseComponent {
   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   onLinkClick(event: MouseEvent): void {
      const formAction = this.control?.formAction;

      if (!formAction) {
         return;
      }

      formAction.action?.(
         formAction.formControl as FormControl | FormArray | FormGroup,
      );

      /**
       * Se non hai href, evitiamo navigazioni vuote.
       * Se hai href, lasciamo il comportamento normale del link.
       */
      if (!formAction.href) {
         event.preventDefault();
         event.stopPropagation();
      }
   }

   getHref(): string | null {
      return this.control?.formAction?.href || null;
   }

   getTarget(): string {
      return this.control?.formAction?.target || '_self';
   }
}