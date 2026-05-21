/**
 * @format
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */

import {Component, ElementRef, Injector, ViewChild} from '@angular/core';

import {BaseComponent} from '../base-component.component';
import {AbstractControl, FormControl, ValidationErrors} from '@angular/forms';

@Component({
   selector: 'app-file',
   templateUrl: './file.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
})
export class FileComponent extends BaseComponent {
   /************************************************************************************************************************************************************************ */
   display: FormControl = new FormControl('');
   file_store: FileList | undefined;
   file_list: Array<string> = [];
   @ViewChild('f_input') f_input: ElementRef<HTMLInputElement>;
   @ViewChild('filename') filename: ElementRef<HTMLInputElement>;
   /************************************************************************************************************************************************************************ */

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   ngAfterViewInit(): void {
      const originalReset = this.control.formAction.formControl.reset;
      this.control.formAction.formControl.reset = (...args: any[]) => {
         if (this.filename?.nativeElement) this.filename.nativeElement.value = '';
         originalReset.apply(this.control.formAction.formControl, args);
      };
   }

   /************************************************************************************************************************************************************************ */

   getRequired() {
      this.display.setValidators(this.control?.formAction?.formControl?.validator);
      this.display.updateValueAndValidity();

      if (this.display?.validator) {
         return this.display?.validator({} as AbstractControl)?.required == true;
      } else {
         this.display.setErrors(null);
         return false;
      }
   }

   /************************************************************************************************************************************************************************ */

   handleFileInputChange(l: FileList): void {
      if (l.length) {
         if (this.control?.formAction?.size && l[0].size > this.control?.formAction?.size) {
            this.control.formAction?.onError('Impossibile caricare il file: dimensione superiore al limite consentito');
            if (this.f_input?.nativeElement) this.f_input.nativeElement.value = null as any;
            this.control.reset();
         } else {
            const f = l[0];
            const count = l.length > 1 ? `(+${l.length - 1} files)` : '';
            this.control.formAction.formControl.setValue(l);
            this.display.setValue(`${f.name} ${count}`);
         }
      } else {
         this.control.formAction.formControl.setValue(null);
         this.display.setValue(null);
      }
   }

   /************************************************************************************************************************************************************************ */

   validateWithExtractedValidators(value: string[]): ValidationErrors | null {
      const control = {value} as AbstractControl;
      const validators = this.control?.formAction?.formControl.validator ? [this.control?.formAction?.formControl.validator] : [];
      return validators.reduce((errors, validator) => ({...errors, ...validator(control)}), null);
   }
}
