/**
 * @format
 * @author luca.piciollo
 */

import {
   Component,
   ElementRef,
   Injector,
   effect,
   inject,
   signal,
   untracked,
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';

import { BaseComponent } from '../base-component.component';

export interface Fruit {
   name: string;
}

@Component({
   selector: 'app-arraystring',
   templateUrl: './arraystring.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class ArrayStringComponent extends BaseComponent {
   public getList = signal<Array<string>>([]);
   public errorsInchipValue = signal<ValidationErrors | null>(null);

   readonly addOnBlur = true;
   readonly separatorKeysCodes = [ENTER, COMMA] as const;

   readonly announcer = inject(LiveAnnouncer);

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);

      effect(() => {
         const list = this.getList();

         untracked(() => {
            const control = this.control?.formAction?.formControl as
               | FormControl
               | FormArray
               | FormGroup;

            if (!control) {
               return;
            }

            control.setValue(list, { emitEvent: true });
            control.markAsDirty();
            control.updateValueAndValidity();
         });
      });
   }

   override ngOnInit(): void {
      super.ngOnInit();

      const value = this.control?.formAction?.formControl?.value;

      this.getList.set(Array.isArray(value) ? value : []);
   }

   add(event: MatChipInputEvent): void {
      const value = (event.value || '').trim();
      const currentValue = this.getCurrentValue();

      if (value.length < 1) {
         this.errorsInchipValue.set(this.validateWithExtractedValidators(currentValue));
         return;
      }

      const nextValue = [...currentValue, value];

      this.errorsInchipValue.set(this.validateWithExtractedValidators(nextValue));

      if (Object.keys(this.errorsInchipValue() || {}).length < 1) {
         const prevValue = this.getCurrentValue();
         this.getList.set(nextValue);
         event.chipInput?.clear();

         this.control?.formAction?.action?.(
            this.control.formAction.formControl as FormControl | FormArray | FormGroup,
         );

         this.callOnChange(prevValue, nextValue);
      }
   }

   remove(value: string): void {
      const prevValue = this.getCurrentValue();
      const nextValue = prevValue.filter(item => item !== value);

      this.getList.set(nextValue);

      this.control?.formAction?.action?.(
         this.control.formAction.formControl as FormControl | FormArray | FormGroup,
      );

      this.callOnChange(prevValue, nextValue);
   }

   getCurrentValue(): string[] {
      const value = this.control?.formAction?.formControl?.value;

      return Array.isArray(value) ? value : [];
   }

   validateWithExtractedValidators(value: string[]): ValidationErrors | null {
      const control = { value } as AbstractControl;
      const validators = this.control?.formAction?.formControl?.validator
         ? [this.control.formAction.formControl.validator]
         : [];

      const errors = validators.reduce(
         (acc, validator) => ({
            ...acc,
            ...validator(control),
         }),
         null as ValidationErrors | null,
      );

      return errors;
   }
}