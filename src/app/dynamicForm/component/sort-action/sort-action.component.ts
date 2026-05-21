/** @format */

import {Component, ElementRef, Injector} from '@angular/core';
import {BaseComponent} from '../base-component.component';

type SortDirection = 'ASC' | 'DESC';

@Component({
   selector: 'app-sort-action',
   templateUrl: './sort-action.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class SortActionComponent extends BaseComponent {
   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   getSortValue(): SortDirection {
      const value = this.control?.formAction?.formControl?.value;
      return value === 'DESC' ? 'DESC' : 'ASC';
   }

   getToggleIcon(): string | null {
      const icons = this.control?.formAction?.css?.toggleIcons;
      if (!Array.isArray(icons) || icons.length < 2) return null;
      return this.getSortValue() === 'ASC' ? icons[0] : icons[1];
   }

   toggleSort(): void {
      const nextValue: SortDirection = this.getSortValue() === 'ASC' ? 'DESC' : 'ASC';
      this.control?.formAction?.formControl?.setValue(nextValue);
      this.control?.formAction?.toggleAction?.(nextValue);
   }
}
