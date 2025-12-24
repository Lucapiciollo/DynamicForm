/** @format */

import {Component, EventEmitter, Input, Output, ViewContainerRef, inject} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {ConfigForm, TYPE_CONTROL_FORM} from './dynamic-form.interface';
import {StepperService} from './dynamic-form.service';

@Component({
   styleUrls: ['./dynamic-form.component.scss'],
   selector: 'app-dynamic-form',
   templateUrl: './dynamic-form.component.html',
   providers: [StepperService],
})
export class DynamicFormComponent {
   public _questions: ConfigForm = null;

   @Input() set questions(questions: ConfigForm) {
      if (questions) {
         this._questions = questions;
         this.initializeForm();
      }
   }

   @Output() onFormCreate: EventEmitter<FormGroup | FormArray> = new EventEmitter<FormGroup | FormArray>();
   @Output() onQuestionsCreate: EventEmitter<ConfigForm> = new EventEmitter<ConfigForm>();
   private stepperService: StepperService = inject(StepperService);
   public TYPE_CONTROL_FORM = TYPE_CONTROL_FORM;
   public formGroup!: FormGroup | FormArray;

   constructor(private viewContainerRef: ViewContainerRef) {}

   compile() {
      let fg = (this.stepperService.toFormGroup(this._questions as any) as FormArray)?.controls as any;
      if (fg && fg.length == 1) {
         this.formGroup = fg[0];
      }
      if (fg && fg.length > 1) {
         this.formGroup = new FormArray([...fg]);
      }
      this.onFormCreate.emit(this.formGroup);
      this.onQuestionsCreate.emit(this._questions);
   }

   initializeForm() {
      this.compile();
   }
}
