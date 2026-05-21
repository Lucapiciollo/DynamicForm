/**
 * @format
 */

import { Component, ElementRef, Injector } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '../base-component.component';

@Component({
   selector: 'app-file',
   templateUrl: './file.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class FileComponent extends BaseComponent {
   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   getFileLabel(): string {
      const value = this.control?.formAction?.formControl?.value;

      if (!value) {
         return '';
      }

      if (Array.isArray(value)) {
         return value
            .map(file => file?.name)
            .filter(Boolean)
            .join(', ');
      }

      if (value instanceof File) {
         return value.name;
      }

      if (value?.name) {
         return value.name;
      }

      return String(value);
   }

   onFileChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      const files = Array.from(input.files || []);

      const formControl = this.control?.formAction?.formControl as
         | FormControl
         | FormArray
         | FormGroup;

      if (!formControl) {
         return;
      }

      const value = this.control?.formAction?.multiple ? files : files[0] ?? null;

      formControl.setValue(value);
      formControl.markAsDirty();
      formControl.markAsTouched();
      formControl.updateValueAndValidity();

      this.control?.formAction?.action?.(formControl);
   }

   clearFile(input: HTMLInputElement): void {
      input.value = '';

      const formControl = this.control?.formAction?.formControl as
         | FormControl
         | FormArray
         | FormGroup;

      formControl?.reset();
      formControl?.markAsDirty();
      formControl?.updateValueAndValidity();
   }
}