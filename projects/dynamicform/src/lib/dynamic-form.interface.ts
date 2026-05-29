/** @format */

import { ComponentRef, Injector, Signal, WritableSignal } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormComponentTemplate } from './component/FormComponentTemplate';


export interface DynamicFieldConfig {
   name: string;
   type: string;

   label?: string;
   placeholder?: string;
   value?: any;

   disabled?: boolean;
   hidden?: boolean;
   readonly?: boolean;



   searchable?: boolean;
   paginated?: boolean;
   pageSize?: number;

   minSearchLength?: number;
   searchDebounceTime?: number;

   labelKey?: string;
   valueKey?: string;

   clearable?: boolean;

   props?: Record<string, any>;

   onChange?: (ctx: any) => void;
   onSearch?: (ctx: any) => void;
   onLoadMore?: (ctx: any) => void;
}


/***********************************************************************************************************************************
 * RX METHOD
 ***********************************************************************************************************************************/

export type RxMethodRef = {
   destroy: () => void;
};

export type RxMethod<Input> = ((
   input: Input | Signal<Input> | Observable<Input>,
   config?: { injector?: Injector },
) => RxMethodRef) &
   RxMethodRef;

/***********************************************************************************************************************************
 * ENUM
 ***********************************************************************************************************************************/

/**
 * Enumerazione di tutti i tipi di controllo supportati dal DynamicForm.
 *
 * Ogni valore corrisponde a uno specifico componente Angular della libreria.
 * Può essere usato sia come valore numerico che come chiave stringa nello schema JSON
 * (es. `'TEXT'`, `'COMBO'`, `'DATARANGE'`).
 */
export enum TYPE_CONTROL_FORM {
   ARRAYSTRING,
   COMBOPAGINATE,
   SEPARATOR,
   BUTTON,
   DATETIME,
   LABEL,
   ACTIONREPORT,
   LINK,
   RADIOGROUP,
   TEXT,
   TEXTAREA,
   CHECKBOX,
   FILE,
   CURRENCY,
   NUMBER,
   COMBO,
   DATA,
   DATARANGE,

   TIME,
   GROUP,
   SORTACTION,
   YEAR,
   RATING,
}

/***********************************************************************************************************************************
 * BASE TYPES
 ***********************************************************************************************************************************/

export type TypeOptionRating = {
   max?: number; // numero di stelle, default 5
};

export type TypeOptionDate = {
   max?: string;
   min?: string;
   onClose?: (value: any, formgroup: FormGroup) => void;
};

export type TypeOptionTime = {
   max?: string;
   min?: string;
};

export type TypeOptionNumber = {
   max?: number;
   min?: number;
   step?: number;
};

export type TypeInputText = {
   maxlength?: number;
   password?: boolean;
};

export type TypeCss = {
   iconCss?: string | Array<string>;
   classRadio?: Array<string>;
   class?: Array<string>;
   hide?: boolean;
   font?: {
      color?: string;
   };
   rows?: number;
   toggleIcons?: [string, string];
};

export type TypeOption = {
   date?: TypeOptionDate;
   css?: TypeCss;
   inputText?: TypeInputText;
};

export type TypeRadioOption = Array<{
   id: any;
   description: string;
   disabled?: boolean;
}>;

export type TypeComboOption = Array<{
   id: any;
   description: string;
   img?: string;
   extra?: any;
   disabled?: boolean;
   default?: boolean;
   hide?: boolean;
   selected?: boolean;
   tag?: {
      bgTag: string;
      bgText: string;
      name: string;
   };
}>;

/***********************************************************************************************************************************
 * STRUCTURE
 ***********************************************************************************************************************************/

/** Unità minima del form: contiene la configurazione di un singolo campo (`FormAction`). */
export type Form = {
   formAction: FormAction;
};

export type TypeForm = Array<Form>;

/**
 * Pulsante di azione associato a un gruppo del form.
 * Viene renderizzato come bottone nella footer del gruppo e riceve
 * l'intero stato del form al click.
 */
/**
 * Pulsante di azione associato a un gruppo del form.
 * Viene renderizzato come bottone nella footer del gruppo e riceve
 * l'intero stato del form al click.
 *
 * L'action ora riceve tutti i parametri utili:
 * - questions: campi del gruppo
 * - idForm: id del gruppo (string o number)
 * - formGroup: FormGroup o FormArray del gruppo
 * - group: il Group corrente
 * - idGroup: indice del gruppo
 * - allGroup: ConfigForm completo
 * - utility: oggetto helper
 */
export type DynamicFormActionButton = {
   label?: string;
   name?: string;
   translateId?: string;
   icon?: string;

   cssClassIcon?: Array<string>;
   cssClassButton?: Array<string>;

   disabled?: boolean;
   visible?: boolean;

   action: (
      questions: Array<Form>,
      idForm: string | number,
      formGroup: FormGroup | FormArray,
      group?: Group,
      idGroup?: number,
      allGroup?: ConfigForm,
      utility?: Utility
   ) => void;
};

/**
 * Gruppo di campi del form. Ogni form può contenere uno o più gruppi.
 * Un gruppo ha un titolo opzionale, una griglia di campi (`formGroup`)
 * e un array di pulsanti di azione (`actions`).
 */
export type Group = {
   /**
    * Identificatore univoco del gruppo (assegnato dal builder o manualmente)
    */
   id?: string;
   title?: string;
   class?: Array<string>;
   formGroup?: TypeForm;
   bottomLabel?: string;
   actions?: Array<DynamicFormActionButton>;
};

/**
 * Struttura principale della configurazione del form.
 * È un array di `Group`, dove ogni gruppo rappresenta una sezione del form.
 * Viene passata al componente tramite `[config]` o `[questions]`.
 */
export type ConfigForm = Array<Group>;

/***********************************************************************************************************************************
 * UTILITY
 ***********************************************************************************************************************************/

/**
 * Oggetto di utilità iniettato in tutti gli handler di eventi.
 * Fornisce metodi helper per accedere e modificare i campi del form
 * senza dover navigare manualmente la struttura `ConfigForm`.
 */
export type Utility = {
   getFormByName?: (
      formName: string,
      parse: (response: FormAction, form?: Form) => any,
   ) => void;

   getActionByName?: (
      actionName: string,
      parse: (action: DynamicFormActionButton) => any,
   ) => void;

   setDefaultOptions?: (
      formName: string,
      parse: (
         response: any,
      ) => Partial<TypeComboOption | { items: Array<any>; totalCount: number }>,
   ) => any;

   getSelectedOptions?: (
      formName: string,
      parse: (option: Signal<TypeComboOption>) => any,
   ) => TypeComboOption;

   onSettedOptions?: (
      formName: string,
      parse: (event: Signal<TypeComboOption>) => any,
   ) => TypeComboOption;
};

/***********************************************************************************************************************************
 * EVENTS
 ***********************************************************************************************************************************/

export type DynamicFormOnChange = (
   idGroup: number,
   idForm: number,
   formControl: FormControl | FormArray | FormGroup,
   formName: string,
   formGroup: Array<Form>,
   type: TYPE_CONTROL_FORM,
   prevValue: any,
   allGroup: ConfigForm,
   utility: Utility,
) => void | Promise<void>;

export type DynamicFormOnInitialize = (
   idGroup: number,
   idForm: number,
   formControl: FormControl | FormArray | FormGroup,
   formName: string,
   formGroup: Array<Form>,
   type: TYPE_CONTROL_FORM,
   allGroup: ConfigForm,
   paging?: { count: number; page: number; totalCount?: number } | null,
   onOptionSetted?: Signal<Array<any>> | null,
   utility?: Utility,
) => void | Promise<void>;

export type DynamicFormOpenClose = (
   idGroup: number,
   idForm: number,
   formControl: FormControl | FormArray | FormGroup,
   formName: string,
   formGroup: Array<Form>,
   allGroup: ConfigForm,
   utility: Utility,
) => void | Promise<void>;

export type DynamicFormSearch = (
   idGroup: number,
   idForm: number,
   formControl: FormControl | FormArray | FormGroup,
   formName: string,
   formGroup: Array<Form>,
   search: string,
   utility: Utility,
) => void | Promise<void>;

export type DynamicFormScrollEnd = (
   idGroup: number,
   idForm: number,
   formControl: FormControl | FormArray | FormGroup,
   formName: string,
   formGroup: Array<Form>,
   paging: { count: number; page: number; totalCount?: number },
   utility: Utility,
) => void | Promise<void>;

export type DynamicFormFocusBlur = (
   idGroup: number,
   idForm: number,
   formControl: FormControl | FormArray | FormGroup,
   formName: string,
   formGroup: Array<Form>,
   allGroup: ConfigForm,
   utility: Utility,
) => void | Promise<void>;

/***********************************************************************************************************************************
 * BASE FORM ACTION
 ***********************************************************************************************************************************/

export type FormActionBase = {
   /**
    * Identificatore univoco del campo (assegnato dal builder o manualmente)
    */
   id?: string;
   formName?: string;
   disabled?: boolean;
   title?: string;
   label?: string;
   translateId?: string;

   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM;

   componentRef?: Array<ComponentRef<FormComponentTemplate>>;

   value?: any;
   placeholder?: string;

   formGroup?: ConfigForm;

   tipContent?: string;
   hint?: string;
   info?: {
      msg: string;
      color: string;
   };

   resetButton?: boolean;
   autocomplete?: boolean;
   multiple?: boolean;
   readonly?: boolean;
   hidden?: boolean;
   disableSpeech?: boolean;

   optionInputText?: TypeInputText;
   optionNumber?: TypeOptionNumber;
   optionDate?: TypeOptionDate;
   optionTime?: TypeOptionTime;
   optionsTime?: TypeOptionTime;
   optionRating?: TypeOptionRating;

   rows?: number;
   accept?: string;
   href?: string;
   target?: string;
   currency?: string;
   size?: number;
   pageSize?: number;

   options?: WritableSignal<TypeComboOption> | Signal<TypeComboOption> | TypeComboOption | any;
   optionsDisabled?: WritableSignal<TypeComboOption> | Signal<TypeComboOption> | TypeComboOption | any;
   disabledOption?: TypeComboOption;
   /**
    * Opzioni fisse mostrate in cima alla lista (es. voci predefinite con tag).
    * Vengono sempre visibili indipendentemente dalla ricerca/paginazione.
    */
   initialOptions?: TypeComboOption;

   paramsForRemoteData?: WritableSignal<{ [key: string]: any }> | Signal<{ [key: string]: any }> | any;

   remoteData?: RxMethod<{ param: any; externalStore: WritableSignal<any> }> | RxMethodRef | any;

   keyCombo?: {
      keyId: string | Array<string>;
      keyDescription: string | Array<string>;
      keySearch?: string;
   };

   paging?: {
      count: number;
      page: number;
      totalCount?: number;
   };

   props?: Record<string, any>;

   onChange?: DynamicFormOnChange;
   onInitialize?: DynamicFormOnInitialize;

   /**
    * Solo componenti apribili:
    * COMBO, COMBOPAGINATE, DATA, DATETIME, TIME, YEAR.
    */
   opened?: DynamicFormOpenClose;
   closed?: DynamicFormOpenClose;

   /**
    * Solo componenti con input/focus reale:
    * TEXT, NUMBER, CURRENCY, TEXTAREA, EMAIL, TIME, ecc.
    */
   onFocus?: DynamicFormFocusBlur;
   onBlur?: DynamicFormFocusBlur;

   /**
    * Solo combo/search/autocomplete.
    */
   onSearch?: DynamicFormSearch;

   /**
    * Solo combo paginata.
    */
   onScrollEnd?: DynamicFormScrollEnd;

   action?: (formControl: FormControl | FormArray | FormGroup) => void | Promise<void>;

   toggleAction?: (direction: 'ASC' | 'DESC' | string) => void;

   onError?: (message: string) => void;

   /**
    * Specifico DateRange storico.
    */
   onClose?: (
      value: any,
      formControl: FormGroup<{
         from: FormControl<Date | null>;
         to: FormControl<Date | null>;
      }>,
      utility: Utility,
   ) => void | Promise<void>;

   utility?: {
      getFormByName?: (formName: string, parse: (form: any) => any) => FormActionCombo;
      setDefaultOptions?: (
         option: Partial<TypeComboOption | { items: Array<any>; totalCount: number }>,
      ) => void;
   };

   [key: string]: any;
};

/***********************************************************************************************************************************
 * SPECIFIC FORM ACTIONS
 ***********************************************************************************************************************************/

export type FormActionCombo = FormActionBase & {
   type?: TYPE_CONTROL_FORM.COMBO;
   options?: WritableSignal<TypeComboOption>;
   optionsDisabled?: Signal<TypeComboOption>;
   keyCombo?: {
      keyId: string | Array<string>;
      keyDescription: string | Array<string>;
      keySearch?: string;
   };
};

export type FormActionComboPaginate = FormActionBase & {
   type: TYPE_CONTROL_FORM.COMBOPAGINATE;
   formControl: FormControl | FormArray | FormGroup;
   remoteData: RxMethod<{ param: any; externalStore: WritableSignal<any> }> | RxMethodRef | any;
   options?: Signal<TypeComboOption> | WritableSignal<TypeComboOption>;
   paramsForRemoteData?: Signal<{ [key: string]: any }> | WritableSignal<{ [key: string]: any }>;
   paging?: {
      count: number;
      page: number;
      totalCount: number;
   };
   keyCombo?: {
      keyId: string | Array<string>;
      keyDescription: string | Array<string>;
      keySearch?: string;
   };
};

export type FormActionCheckbox = FormActionBase & {
   type?: TYPE_CONTROL_FORM.CHECKBOX;
};

export type FormActionCurrency = FormActionBase & {
   type?: TYPE_CONTROL_FORM.CURRENCY;
   optionNumber?: TypeOptionNumber;
};

export type FormActionDate = FormActionBase & {
   type?: TYPE_CONTROL_FORM.DATA;
   readonly?: boolean;
   optionDate?: TypeOptionDate;
};

export type FormActionYear = FormActionBase & {
   type?: TYPE_CONTROL_FORM.YEAR;
   readonly?: boolean;
   optionDate?: TypeOptionDate;
};

export type FormActionDateRange = FormActionBase & {
   type?: TYPE_CONTROL_FORM.DATARANGE;
   readonly?: boolean;
   optionDate?: TypeOptionDate;
};

export type FormActionDateTime = FormActionBase & {
   type?: TYPE_CONTROL_FORM.DATETIME;
};

export type FormActionTime = FormActionBase & {
   type?: TYPE_CONTROL_FORM.TIME;
   optionsTime?: TypeOptionTime;
};

export type FormActionFile = FormActionBase & {
   type?: TYPE_CONTROL_FORM.FILE;
   accept?: string;
   size?: number;
};

export type FormActionText = FormActionBase & {
   type?: TYPE_CONTROL_FORM.TEXT;
   optionInputText?: TypeInputText;
};

export type FormActionNumber = FormActionBase & {
   type?: TYPE_CONTROL_FORM.NUMBER;
   optionNumber?: TypeOptionNumber;
};

export type FormActionQuestion = FormActionBase & {
   type?: TYPE_CONTROL_FORM.RADIOGROUP;
   options?: Signal<TypeComboOption>;
};

export type FormActionTextArea = FormActionBase & {
   type?: TYPE_CONTROL_FORM.TEXTAREA;
   optionInputText?: TypeInputText;
};

export type FormActionGeneric = FormActionBase;

export type FormActionRating = FormActionBase & {
   type?: TYPE_CONTROL_FORM.RATING;
   optionRating?: TypeOptionRating;
};

/**
 * Unione finale.
 *
 * Manteniamo i tipi specifici perché i componenti possono usarli,
 * ma la base è abbastanza ampia da non rompere builder e vecchi form.
 */
export type FormAction =
   | FormActionComboPaginate
   | FormActionCombo
   | FormActionGeneric
   | FormActionTextArea
   | FormActionQuestion
   | FormActionNumber
   | FormActionText
   | FormActionCurrency
   | FormActionCheckbox
   | FormActionDateRange
   | FormActionDate
   | FormActionYear
   | FormActionDateTime
   | FormActionFile
   | FormActionTime
   | FormActionRating;