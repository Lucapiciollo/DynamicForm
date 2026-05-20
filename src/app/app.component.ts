/** @format */

import {Component, OnDestroy} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ConfigForm} from './dynamicForm/dynamic-form.interface';
import {DynamicFormJsonSchema} from './dynamicForm/models/dynamic-form-json-schema.model';
import {
   collectFormErrors,
   createUltraSafeNestedActionsFormBuilder,
   patchUltraSafeDemo,
} from './dynamicForm/examples/ultra-safe-nested-actions.builder';
import {FULL_PLAYGROUND_JSON_SCHEMA} from './dynamicForm/examples/full-playground-json.schema';
import { createAllComponentsFormBuilder } from './dynamicForm/examples/all-components-form.builder';
import { createNestedActionsFormBuilder } from './dynamicForm/examples/nested-actions-form.builder';

export type PlaygroundMode = 'angular' | 'json';

@Component({
   
  standalone: false,selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
   mode: PlaygroundMode = 'angular';

   angularConfig: ConfigForm = createUltraSafeNestedActionsFormBuilder(); ;
   jsonSchema: DynamicFormJsonSchema = FULL_PLAYGROUND_JSON_SCHEMA;

   form: FormGroup | FormArray | null = null;
   formValue: any = null;
   rawValue: any = null;
   formErrors: Record<string, any> = {};

   private valueChangesSub?: Subscription;

   setMode(mode: PlaygroundMode): void {
      if (this.mode === mode) return;
      this.mode = mode;
      this.valueChangesSub?.unsubscribe();
      this.form = null;
      this.formValue = null;
      this.rawValue = null;
      this.formErrors = {};
   }

   onFormCreate(form: FormGroup | FormArray): void {
      this.valueChangesSub?.unsubscribe();
      this.form = form;
      this.refreshDebugValues();
      this.valueChangesSub = form.valueChanges.subscribe(() => this.refreshDebugValues());
      console.log(`FORM CREATO (${this.mode})`, form);
   }

   onQuestionsCreate(questions: ConfigForm): void {
      console.log(`CONFIG CREATA (${this.mode})`, questions);
   }

   patchDemoValue(): void {
      if (this.mode === 'angular') {
         patchUltraSafeDemo(this.form);
      } else if (this.form instanceof FormGroup) {
         (this.form as FormGroup).patchValue({
            registry: {
               firstName: 'Luca',
               lastName: 'Piciollo',
               email: 'luca.json@test.it',
               phone: '3331234567',
               birthDate: new Date(1983, 4, 20),
               appointmentSlot: '2026-05-21T10:30:00',
               gender: 'M',
               customerCategory: 'PRIVATE',
               active: true,
               privacy: true,
            },
            addresses: {
               street: 'Via Roma',
               streetNumber: '10',
               zipCode: '01100',
               city: 'Viterbo',
               province: 'VT',
               region: 'LAZIO',
               operatorId: 1,
            },
            contract: {
               code: 'JSON-001',
               taxable: 1200,
               vat: 22,
               contractPeriod: {
                  from: new Date(2026, 4, 21),
                  to: new Date(2026, 5, 21),
               },
               notes: 'Valori caricati dal playground JSON.',
               tags: ['json', 'backend', 'config'],
            },
         });
      }

      this.refreshDebugValues();
   }

   submit(): void {
      if (!this.form) return;
      this.form.markAllAsTouched();
      this.refreshDebugValues();
      console.log(this.form.valid ? `SUBMIT FORM (${this.mode})` : `FORM NON VALIDO (${this.mode})`, this.form.value, this.formErrors);
   }

   reset(): void {
      this.form?.reset();
      this.refreshDebugValues();
   }

   refreshDebugValues(): void {
      if (!this.form) return;
      this.formValue = this.form.value;
      this.rawValue = this.form instanceof FormGroup ? this.form.getRawValue() : this.form.value;
      this.formErrors = collectFormErrors(this.form);
   }

   ngOnDestroy(): void {
      this.valueChangesSub?.unsubscribe();
   }
}

