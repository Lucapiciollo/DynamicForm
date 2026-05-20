/** @format */

import {Component, OnDestroy} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ConfigForm} from './dynamicForm/dynamic-form.interface';
import {
   collectFormErrors,
   createUltraSafeNestedActionsFormBuilder,
   patchUltraSafeDemo,
} from './dynamicForm/examples/ultra-safe-nested-actions.builder';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
   questions: ConfigForm = createUltraSafeNestedActionsFormBuilder();

   form: FormGroup | FormArray | null = null;
   formValue: any = null;
   rawValue: any = null;
   formErrors: Record<string, any> = {};

   private valueChangesSub?: Subscription;

   onFormCreate(form: FormGroup | FormArray): void {
      this.valueChangesSub?.unsubscribe();
      this.form = form;
      this.refreshDebugValues();
      this.valueChangesSub = form.valueChanges.subscribe(() => this.refreshDebugValues());
      console.log('FORM CREATO:', form);
   }

   onQuestionsCreate(questions: ConfigForm): void {
      console.log('QUESTIONS CREATE:', questions);
   }

   patchDemoValue(): void {
      patchUltraSafeDemo(this.form);
      this.refreshDebugValues();
   }

   submit(): void {                                                                                                                                                                                                                                                                             
      if (!this.form) return;
      this.form.markAllAsTouched();
      this.refreshDebugValues();
      console.log(this.form.valid ? 'SUBMIT FORM' : 'FORM NON VALIDO', this.form.value, this.formErrors);
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
