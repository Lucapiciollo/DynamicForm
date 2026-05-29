/** @format */

import { Component, EventEmitter, Input, Output, ViewContainerRef, inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ConfigForm, TYPE_CONTROL_FORM } from './dynamic-form.interface';
import { StepperService } from './dynamic-form.service';
import { DynamicFormJsonSchema } from './models/dynamic-form-json-schema.model';
import { DynamicFormJsonMapperService } from './services/dynamic-form-json-mapper.service';

/**
 * Componente principale della libreria DynamicForm.
 *
 * Accetta la configurazione del form in tre modalità:
 * - `[config]` / `[questions]` — oggetto `ConfigForm` già costruito runtime (API Angular)
 * - `[json]` — schema JSON puro (`DynamicFormJsonSchema`) tradotto automaticamente dal mapper
 *
 * Emette due eventi al completamento dell'inizializzazione:
 * - `(onFormCreate)` — fornisce il `FormGroup` / `FormArray` generato
 * - `(onQuestionsCreate)` — fornisce la `ConfigForm` risolta
 *
 * @example
 * ```html
 * <!-- Con JSON schema -->
 * <app-dynamic-form [json]="mySchema" (onFormCreate)="onForm($event)"></app-dynamic-form>
 *
 * <!-- Con ConfigForm runtime -->
 * <app-dynamic-form [config]="myConfig" (onFormCreate)="onForm($event)"></app-dynamic-form>
 * ```
 */
@Component({
   styleUrls: ['./dynamic-form.component.scss'],
   selector: 'app-dynamic-form',
   templateUrl: './dynamic-form.component.html',
   providers: [StepperService],
   standalone: false,
})
export class DynamicFormComponent {
   /** Configurazione interna del form, costruita da `setRuntimeConfig`. */
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

   constructor(private viewContainerRef: ViewContainerRef) { }

   /**
    * Normalizza e memorizza la configurazione runtime, poi avvia l'inizializzazione.
    * Scartato se `config` è null/undefined (guard per evitare re-render inutili).
    */
   private setRuntimeConfig(config: ConfigForm): void {
      if (!config) return;
      this._questions = config;
      this.initializeForm();
   }

   /**
    * Trasforma la `ConfigForm` in un `FormGroup` o `FormArray` tramite `StepperService`.
    * - Se il form ha un solo gruppo produce un `FormGroup` piatto.
    * - Se ha più gruppi produce un `FormArray`.
    * Al termine emette `onFormCreate` e `onQuestionsCreate`.
    */
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

   /**
    * Punto di ingresso dell'inizializzazione: delega a `compile()`.
    * Separato per consentire override nelle sottoclassi o hook aggiuntivi in futuro.
    */
   initializeForm() {
      this.compile();
   }

   /**
    * Restituisce il `FormGroup` reattivo del gruppo all'indice dato.
    * Se il form ha un solo gruppo `formGroup` è già il `FormGroup` diretto;
    * se ha più gruppi `formGroup` è un `FormArray` e si accede all'elemento per indice.
    */
   getGroupForm(index: number): FormGroup | FormArray {
      return this.formGroup instanceof FormArray
         ? (this.formGroup.at(index) as FormGroup)
         : this.formGroup;
   }
}
