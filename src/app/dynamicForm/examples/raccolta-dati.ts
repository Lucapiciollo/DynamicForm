/** @format */

export type DietJsonValidator = {
   type: 'required' | 'email' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern';
   value?: any;
   message?: string;
};

export type DietJsonOption = {
   id: any;
   description: string;
   disabled?: boolean;
};

export type DietJsonEvents = {
   initialize?: string;
   change?: string;
   focus?: string;
   blur?: string;
   opened?: string;
   closed?: string;
   search?: string;
   scrollEnd?: string;
};

export type DietJsonAction = {
   label: string;
   name?: string;
   icon?: string;
   cssClassButton?: string[];
   cssClassIcon?: string[];
   visible?: boolean;
   disabled?: boolean;
   event: string;
};

export type DietJsonNode = {
   id?: string;
   title?: string;
   label?: string;
   type: string;
   formName: string;

   placeholder?: string;
   value?: any;
   disabled?: boolean;
   readonly?: boolean;
   resetButton?: boolean;
   autocomplete?: boolean;
   multiple?: boolean;

   css?: {
      class?: string[];
      classRadio?: string[];
      iconCss?: string | string[];
      rows?: number;
      hide?: boolean;
   };

   optionNumber?: {
      min?: number;
      max?: number;
      step?: number;
   };

   optionInputText?: {
      maxlength?: number;
      password?: boolean;
   };

   options?: DietJsonOption[];

   validators?: DietJsonValidator[];

   events?: DietJsonEvents;

   actions?: DietJsonAction[];

   children?: DietJsonNode[];
};

export class DietNestedFormJson {
   static build(): DietJsonNode {
      return {
         id: 'dietCollectionForm',
         title: 'Raccolta informazioni dieta settimanale',
         type: 'GROUP',
         formName: 'root',
         actions: [
            {
               label: 'Patch anagrafica demo',
               name: 'Patch anagrafica demo',
               icon: 'edit_note',
               cssClassButton: ['btn', 'btn-primary', 'mx-1'],
               visible: true,
               disabled: false,
               event: 'patchRegistryDemo',
            },
            {
               label: 'Valida anagrafica',
               name: 'Valida anagrafica',
               icon: 'check_circle',
               cssClassButton: ['btn', 'btn-success', 'mx-1'],
               visible: true,
               disabled: false,
               event: 'validateRegistry',
            },
            {
               label: 'Genera settimana demo',
               name: 'Genera settimana demo',
               icon: 'restaurant_menu',
               cssClassButton: ['btn', 'btn-warning', 'mx-1'],
               visible: true,
               disabled: false,
               event: 'patchWeekDemo',
            },
            {
               label: 'Copia lunedì su tutta la settimana',
               name: 'Copia lunedì',
               icon: 'content_copy',
               cssClassButton: ['btn', 'btn-info', 'mx-1'],
               visible: true,
               disabled: false,
               event: 'copyMondayToWholeWeek',
            },
            {
               label: 'Calcola riepilogo',
               name: 'Calcola riepilogo',
               icon: 'calculate',
               cssClassButton: ['btn', 'btn-secondary', 'mx-1'],
               visible: true,
               disabled: false,
               event: 'calculateDietSummary',
            },
            {
               label: 'Leggi form completo',
               name: 'Leggi form completo',
               icon: 'visibility',
               cssClassButton: ['btn', 'btn-secondary', 'mx-1'],
               visible: true,
               disabled: false,
               event: 'readWholeDietForm',
            },
            {
               label: 'Reset',
               name: 'Reset',
               icon: 'restart_alt',
               cssClassButton: ['btn', 'btn-danger', 'mx-1'],
               visible: true,
               disabled: false,
               event: 'resetDietForm',
            },
         ],
         children: [
            this.registryGroup(),
            this.weekGroup(),
            this.summaryGroup(),
         ],
      };
   }

   private static registryGroup(): DietJsonNode {
      return {
         id: 'registry',
         title: 'Anagrafica',
         type: 'GROUP',
         formName: 'registry',
         children: [
            this.personGroup(),
            this.bodyGroup(),
            this.preferencesGroup(),
         ],
      };
   }

   private static personGroup(): DietJsonNode {
      return {
         id: 'person',
         title: 'Dati personali',
         type: 'GROUP',
         formName: 'person',
         children: [
            {
               type: 'TEXT',
               formName: 'firstName',
               title: 'Nome',
               placeholder: 'Inserisci nome',
               value: '',
               css: this.col4(),
               resetButton: true,
               validators: [
                  {
                     type: 'required',
                     message: 'Nome obbligatorio',
                  },
               ],
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'logFieldChange',
                  focus: 'logFieldChange',
                  blur: 'logFieldChange',
               },
            },
            {
               type: 'TEXT',
               formName: 'lastName',
               title: 'Cognome',
               placeholder: 'Inserisci cognome',
               value: '',
               css: this.col4(),
               resetButton: true,
               validators: [
                  {
                     type: 'required',
                     message: 'Cognome obbligatorio',
                  },
               ],
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'logFieldChange',
               },
            },
            {
               type: 'NUMBER',
               formName: 'age',
               title: 'Età',
               placeholder: 'Inserisci età',
               value: null,
               css: this.col4(),
               resetButton: true,
               optionNumber: {
                  min: 14,
                  max: 100,
                  step: 1,
               },
               validators: [
                  {
                     type: 'required',
                     message: 'Età obbligatoria',
                  },
                  {
                     type: 'min',
                     value: 14,
                     message: 'Età minima 14 anni',
                  },
               ],
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'updateSummaryOnBodyChange',
               },
            },
            {
               type: 'RADIOGROUP',
               formName: 'gender',
               title: 'Sesso',
               value: 'M',
               css: {
                  class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
                  classRadio: ['d-flex', 'gap-3', 'align-items-center'],
               },
               options: [
                  { id: 'M', description: 'Maschio' },
                  { id: 'F', description: 'Femmina' },
               ],
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'updateSummaryOnBodyChange',
               },
            },
         ],
      };
   }

   private static bodyGroup(): DietJsonNode {
      return {
         id: 'body',
         title: 'Dati corporei',
         type: 'GROUP',
         formName: 'body',
         children: [
            {
               type: 'NUMBER',
               formName: 'height',
               title: 'Altezza cm',
               placeholder: 'Esempio 178',
               value: null,
               css: this.col4(),
               resetButton: true,
               optionNumber: {
                  min: 120,
                  max: 230,
                  step: 1,
               },
               validators: [
                  {
                     type: 'required',
                     message: 'Altezza obbligatoria',
                  },
               ],
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'updateSummaryOnBodyChange',
               },
            },
            {
               type: 'NUMBER',
               formName: 'weight',
               title: 'Peso attuale kg',
               placeholder: 'Esempio 84',
               value: null,
               css: this.col4(),
               resetButton: true,
               optionNumber: {
                  min: 30,
                  max: 250,
                  step: 0.1,
               },
               validators: [
                  {
                     type: 'required',
                     message: 'Peso obbligatorio',
                  },
               ],
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'updateSummaryOnBodyChange',
               },
            },
            {
               type: 'NUMBER',
               formName: 'targetWeight',
               title: 'Peso obiettivo kg',
               placeholder: 'Esempio 78',
               value: null,
               css: this.col4(),
               resetButton: true,
               optionNumber: {
                  min: 30,
                  max: 250,
                  step: 0.1,
               },
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'logFieldChange',
               },
            },
            {
               type: 'COMBO',
               formName: 'goal',
               title: 'Obiettivo',
               placeholder: 'Seleziona obiettivo',
               value: 'lose_weight',
               css: this.col4(),
               resetButton: true,
               autocomplete: true,
               options: [
                  { id: 'lose_weight', description: 'Dimagrimento' },
                  { id: 'maintenance', description: 'Mantenimento' },
                  { id: 'gain_mass', description: 'Massa muscolare' },
               ],
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'updateSummaryOnGoalChange',
                  opened: 'logFieldInitialize',
                  closed: 'logFieldChange',
               },
            },
         ],
      };
   }

   private static preferencesGroup(): DietJsonNode {
      return {
         id: 'preferences',
         title: 'Preferenze e vincoli',
         type: 'GROUP',
         formName: 'preferences',
         children: [
            {
               type: 'COMBO',
               formName: 'activityLevel',
               title: 'Livello attività',
               placeholder: 'Seleziona livello',
               value: 'medium',
               css: this.col4(),
               resetButton: true,
               autocomplete: true,
               options: [
                  { id: 'low', description: 'Bassa' },
                  { id: 'medium', description: 'Media' },
                  { id: 'high', description: 'Alta' },
               ],
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'updateSummaryOnBodyChange',
               },
            },
            {
               type: 'ARRAYSTRING',
               formName: 'allergies',
               title: 'Allergie',
               placeholder: 'Aggiungi allergia',
               value: [],
               css: this.col4(),
               resetButton: true,
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'logArrayChange',
                  focus: 'logFieldChange',
                  blur: 'logFieldChange',
               },
            },
            {
               type: 'ARRAYSTRING',
               formName: 'dislikedFoods',
               title: 'Alimenti non graditi',
               placeholder: 'Aggiungi alimento',
               value: [],
               css: this.col4(),
               resetButton: true,
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'logArrayChange',
               },
            },
         ],
      };
   }

   private static weekGroup(): DietJsonNode {
      return {
         id: 'week',
         title: 'Piano alimentare settimanale',
         type: 'GROUP',
         formName: 'week',
         children: [
            this.dayGroup('monday', 'Lunedì'),
            this.dayGroup('tuesday', 'Martedì'),
            this.dayGroup('wednesday', 'Mercoledì'),
            this.dayGroup('thursday', 'Giovedì'),
            this.dayGroup('friday', 'Venerdì'),
            this.dayGroup('saturday', 'Sabato'),
            this.dayGroup('sunday', 'Domenica'),
         ],
      };
   }

   private static dayGroup(formName: string, title: string): DietJsonNode {
      return {
         id: formName,
         title,
         type: 'GROUP',
         formName,
         children: [
            this.mealField('breakfast', 'Colazione', `Colazione ${title}`),
            this.mealField('morningSnack', 'Spuntino mattina', `Spuntino mattina ${title}`),
            this.mealField('lunch', 'Pranzo', `Pranzo ${title}`),
            this.mealField('afternoonSnack', 'Merenda', `Merenda ${title}`),
            this.mealField('dinner', 'Cena', `Cena ${title}`),
            {
               type: 'NUMBER',
               formName: 'waterLiters',
               title: 'Acqua litri',
               placeholder: 'Litri acqua',
               value: 2,
               css: this.col4(),
               resetButton: true,
               optionNumber: {
                  min: 0,
                  max: 5,
                  step: 0.25,
               },
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'logWaterChange',
               },
            },
            {
               type: 'TEXTAREA',
               formName: 'notes',
               title: `Note ${title.toLowerCase()}`,
               placeholder: 'Note del giorno',
               value: '',
               css: {
                  class: ['col-12', 'px-1'],
                  rows: 3,
               },
               resetButton: true,
               optionInputText: {
                  maxlength: 500,
               },
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'logMealChange',
                  focus: 'logFieldChange',
                  blur: 'logFieldChange',
               },
            },
         ],
      };
   }

   private static mealField(formName: string, title: string, placeholder: string): DietJsonNode {
      return {
         type: 'TEXTAREA',
         formName,
         title,
         placeholder,
         value: '',
         css: {
            class: ['col-12', 'col-md-6', 'px-1'],
            rows: 3,
         },
         resetButton: true,
         optionInputText: {
            maxlength: 1000,
         },
         events: {
            initialize: 'logFieldInitialize',
            change: 'logMealChange',
            focus: 'logFieldChange',
            blur: 'logFieldChange',
         },
      };
   }

   private static summaryGroup(): DietJsonNode {
      return {
         id: 'summary',
         title: 'Riepilogo',
         type: 'GROUP',
         formName: 'summary',
         children: [
            {
               type: 'NUMBER',
               formName: 'bmi',
               title: 'BMI',
               placeholder: 'Calcolato automaticamente',
               value: null,
               readonly: true,
               disabled: true,
               css: this.col4(),
               optionNumber: {
                  min: 0,
                  step: 0.1,
               },
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'logFieldChange',
               },
            },
            {
               type: 'NUMBER',
               formName: 'calculatedCalories',
               title: 'Calorie giornaliere stimate',
               placeholder: 'Calcolate automaticamente',
               value: null,
               readonly: true,
               disabled: true,
               css: this.col4(),
               optionNumber: {
                  min: 0,
                  step: 1,
               },
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'logFieldChange',
               },
            },
            {
               type: 'TEXTAREA',
               formName: 'notes',
               title: 'Note generali dieta',
               placeholder: 'Scrivi note generali',
               value: '',
               css: {
                  class: ['col-12', 'px-1'],
                  rows: 4,
               },
               resetButton: true,
               optionInputText: {
                  maxlength: 1000,
               },
               events: {
                  initialize: 'logFieldInitialize',
                  change: 'logFieldChange',
               },
            },
         ],
      };
   }

   private static col4(): { class: string[] } {
      return {
         class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
      };
   }
}