/** @format */

import {Component, EventEmitter, Input, Output, ViewContainerRef, inject} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {ConfigForm, TYPE_CONTROL_FORM} from './dynamic-form.interface';
import {StepperService} from './dynamic-form.service';
import {DynamicFormJsonSchema} from './models/dynamic-form-json-schema.model';
import {DynamicFormJsonMapperService} from './services/dynamic-form-json-mapper.service';

@Component({
   styleUrls: ['./dynamic-form.component.scss'],
   selector: 'app-dynamic-form',
   templateUrl: './dynamic-form.component.html',
   providers: [StepperService],
})
export class DynamicFormComponent {
   public _questions: ConfigForm = null;

   /**
    * Retrocompatibilità: vecchio input usato dal progetto.
    * Accetta la configurazione Angular runtime già pronta.
    */
   @Input() set questions(questions: ConfigForm) {
      this.setRuntimeConfig(questions);
   }

   /**
    * Alias più chiaro per la configurazione Angular runtime.
    * Uso: <app-dynamic-form [config]="configAngular"></app-dynamic-form>
    */
   @Input() set config(config: ConfigForm) {
      this.setRuntimeConfig(config);
   }

   /**
    * Nuova modalità JSON puro.
    * Uso: <app-dynamic-form [json]="jsonSchema"></app-dynamic-form>
    */
   @Input() set json(schema: DynamicFormJsonSchema) {
      if (!schema) return;
      this.setRuntimeConfig(this.jsonMapper.toConfig(schema));
   }

   @Output() onFormCreate: EventEmitter<FormGroup | FormArray> = new EventEmitter<FormGroup | FormArray>();
   @Output() onQuestionsCreate: EventEmitter<ConfigForm> = new EventEmitter<ConfigForm>();

   private stepperService: StepperService = inject(StepperService);
   private jsonMapper: DynamicFormJsonMapperService = inject(DynamicFormJsonMapperService);

   public TYPE_CONTROL_FORM = TYPE_CONTROL_FORM;
   public formGroup!: FormGroup | FormArray;

   constructor(private viewContainerRef: ViewContainerRef) {}

   private setRuntimeConfig(config: ConfigForm): void {
      if (!config) return;
      this._questions = config;
      this.initializeForm();
   }

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
