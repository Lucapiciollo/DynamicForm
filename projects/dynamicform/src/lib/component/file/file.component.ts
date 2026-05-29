/**
 * @format
 */

import { AfterViewInit, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '../base-component.component';

@Component({
   selector: 'app-file',
   templateUrl: './file.component.html',
   styleUrls: ['../../dynamic-form.component.scss'],
   standalone: false,
})
export class FileComponent extends BaseComponent implements AfterViewInit {
   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }

   ngAfterViewInit(): void {
      const fc = this.control?.formAction?.formControl;
      if (!fc) return;

      // Quando il FormControl viene resettato (valore null/undefined/empty)
      // ripulisce anche il DOM dell'input nativo, altrimenti il browser ignora
      // la selezione dello stesso file e non triggera il change event.
      fc.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
         if (!value && this.fileInput?.nativeElement) {
            this.fileInput.nativeElement.value = '';
         }
      });
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

      // Resetta il valore nativo dell'input dopo la selezione: il browser non
      // triggera "change" se si sceglie lo stesso file due volte di fila a meno
      // che l'input non venga prima ripulito.
      input.value = '';

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