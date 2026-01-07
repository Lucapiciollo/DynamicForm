/** @format */

import { ComponentRef, Injector, Signal, WritableSignal } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormComponentTemplate } from './component/FormComponentTemplate';
import { Observable } from 'rxjs';

/*********************************************************************************************************************************** */

export type RxMethodRef = {destroy: () => void};
export type RxMethod<Input> = ((input: Input | Signal<Input> | Observable<Input>, config?: {injector?: Injector}) => RxMethodRef) & RxMethodRef;

/*********************************************************************************************************************************** */

export type Utility = {
   getFormByName?: (formName: string, parse: (response: any,form:any) => any) => void;
   getActionByName?: (actionName: string, parse: (form: FormAction) => any) => void;
   setDefaultOptions?: (formName: string, parse: (response: any) => Partial<TypeComboOption | {items: Array<any>; totalCount: number}>) => any;
   getSelectedOptions?: (formName: string, parse: (option: Signal<TypeComboOption>) => any) => TypeComboOption;
   onSettedOptions?: (formName: string, parse: (event: Signal<TypeComboOption>) => any) => TypeComboOption;
};

export type TypeOptionDate = {
   max?: string;
   min?: string;
   onClose?: (value: any, formgroup: FormGroup) => void;
};
export type TypeOptionTime = {max?: string; min?: string};
export type TypeOptionNumber = {max?: number; min?: number; step?: number};
export type TypeCss = {
   iconCss?: string;
   classRadio?: Array<string>;
   class?: Array<string>;
   hide?: boolean;
   font?: {color?: string};
   rows?: number;
   toggleIcons?: [string, string];
};
export type TypeInputText = {maxlength?: number; password?: boolean};
export type TypeOption = {
   date?: TypeOptionDate;
   css?: TypeCss;
   inputText?: TypeInputText;
};

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
   EMAIL,
   TIME,
   GROUP,
   SORTACTION,
   YEAR,
}

export type Form = {
   formAction: FormAction;
};

export type TypeForm = Array<Form>;

export type Group = {
   title?: string;
   class?: Array<string>;
   formGroup?: TypeForm;
   bottomLabel?: string;
   actions?: Array<{
      label?: string;
      action: (questions: Array<Form>, idForm: string, formGroup: FormGroup | FormArray) => void;
      cssClassIcon?: Array<string>;
      cssClassButton?: Array<string>;
      disabled?: boolean;
      visible?: boolean;
   }>;
};

export type ConfigForm = Array<Group>;

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
   tag?: {bgTag: string; bgText: string; name: string};
}>;

export declare type FormAction = FormActionComboPaginate | FormActionGeneric | FormActionTextArea | FormActionQuestion | FormActionNumber | FormActionText | FormActionCombo | FormActionCurrency | FormActionCheckbox | FormActionDateRange | FormActionDate | FormActionYear | FormActionDateRange | FormActionDateTime | FormActionFile | FormActionTime;
export declare type FormActionCombo = {
   autocomplete?: boolean;
   disabled?: boolean;
   multiple?: boolean;
   formName?: string;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.COMBO;
   hint?: string;
   tipContent?: string;
   formGroup?: ConfigForm;
   info?: {msg: string; color: string};
   disabledOption?: TypeComboOption;
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   opened?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, allGroup: ConfigForm, utility: Utility) => void;
   closed?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, paging: {count: number; page: number}, onOptionSetted: Signal<Array<any>>, utility: Utility) => void;
   keyCombo?: {
      keyId: string | Array<string>;
      keyDescription: string | Array<string>;
      keySearch?: string;
   };
   options?: WritableSignal<TypeComboOption>;
   optionsDisabled?: Signal<TypeComboOption>;
};

export declare type FormActionComboPaginate = {
   autocomplete?: boolean;
   disabled?: boolean;
   multiple?: boolean;
   formName?: string;
   title?: string;
   formControl: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type: TYPE_CONTROL_FORM.COMBOPAGINATE;
   tipContent?: string;
   formGroup?: ConfigForm;
   info?: {msg: string; color: string};
   paging?: {count: number; page: number; totalCount: number};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, paging: {count: number; page: number}, onOptionSetted: Signal<Array<any>>, utility: Utility) => void;
   opened?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, allGroup: ConfigForm, utility: Utility) => void;
   closed?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, allGroup: ConfigForm, utility: Utility) => void;
   remoteData: RxMethod<{param: any; externalStore: WritableSignal<any>}> | RxMethodRef;
   keyCombo?: {
      keyId: string | Array<string>;
      keyDescription: string | Array<string>;
      keySearch?: string;
   };
   options?: Signal<TypeComboOption>;
   paramsForRemoteData?: Signal<{[key: string]: any}>;
   optionsDisabled?: Signal<TypeComboOption>;
};

export declare type FormActionCheckbox = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.CHECKBOX;
   tipContent?: string;
   formGroup?: ConfigForm;
   info?: {msg: string; color: string};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
   utility?: {
      getFormByName: (formName: string, parse: (form: any) => any) => FormActionCombo;
      setDefaultOptions: (option: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>) => void;
   };
};

export declare type FormActionCurrency = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   optionNumber?: TypeOptionNumber;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.CURRENCY;
   tipContent?: string;
   formGroup?: ConfigForm;
   info?: {msg: string; color: string};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
   utility?: {
      getFormByName: (formName: string, parse: (form: any) => any) => FormActionCombo;
      setDefaultOptions: (option: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>) => void;
   };
};

export declare type FormActionDate = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.DATA;
   readonly: boolean;
   tipContent?: string;
   hint?: string;
   formGroup?: ConfigForm;
   optionDate?: TypeOptionDate;
   info?: {msg: string; color: string};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
   utility?: {
      getFormByName: (formName: string, parse: (form: any) => any) => FormActionCombo;
      setDefaultOptions: (option: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>) => void;
   };
};
export declare type FormActionYear = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.YEAR;
   readonly: boolean;
   tipContent?: string;
   hint?: string;
   formGroup?: ConfigForm;
   optionDate?: TypeOptionDate;
   info?: {msg: string; color: string};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
   utility?: {
      getFormByName: (formName: string, parse: (form: any) => any) => FormActionCombo;
      setDefaultOptions: (option: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>) => void;
   };
};

export declare type FormActionDateRange = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.DATARANGE;
   readonly: boolean;
   tipContent?: string;
   hint?: string;
   formGroup?: ConfigForm;
   optionDate?: TypeOptionDate;
   info?: {msg: string; color: string};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
   onClose(
      value: any,
      formControl: FormGroup<{
         from: FormControl<Date | null>;
         to: FormControl<Date | null>;
      }>,
      utility: Utility,
   );
   utility?: {
      getFormByName: (formName: string, parse: (form: any) => any) => FormActionCombo;
      setDefaultOptions: (option: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>) => void;
   };
};

export declare type FormActionDateTime = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.DATETIME;
   tipContent?: string;
   hint?: string;
   formGroup?: ConfigForm;
   info?: {msg: string; color: string};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
   utility?: {
      getFormByName: (formName: string, parse: (form: any) => any) => FormActionCombo;
      setDefaultOptions: (option: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>) => void;
   };
};

export declare type FormActionTime = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.TIME;
   tipContent?: string;
   optionsTime?: TypeOptionTime;
   hint?: string;
   formGroup?: ConfigForm;
   info?: {msg: string; color: string};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
   utility?: {
      getFormByName: (formName: string, parse: (form: any) => any) => FormActionCombo;
      setDefaultOptions: (option: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>) => void;
   };
};

export declare type FormActionFile = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.FILE;
   tipContent?: string;
   placeholder?: string;
   formGroup?: ConfigForm;
   hint?: string;
   size?: number;
   info?: {msg: string; color: string};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
   utility?: {
      getFormByName: (formName: string, parse: (form: any) => any) => FormActionCombo;
      setDefaultOptions: (option: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>) => void;
   };
   onError?: (message: string) => void;
};

export declare type FormActionText = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.TEXT;
   disableSpeech?: boolean;
   tipContent?: string;
   optionInputText?: TypeInputText;
   placeholder: string;
   formGroup?: ConfigForm;
   info?: {msg: string; color: string};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
   utility?: {
      getFormByName: (formName: string, parse: (form: any) => any) => FormActionCombo;
      setDefaultOptions: (option: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>) => void;
   };
};

export declare type FormActionNumber = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.NUMBER;
   tipContent?: string;
   optionNumber?: TypeOptionNumber;
   placeholder: string;
   formGroup?: ConfigForm;
   info?: {msg: string; color: string};
   hint?: string;
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
   utility?: {
      getFormByName: (formName: string, parse: (form: any) => any) => FormActionCombo;
      setDefaultOptions: (option: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>) => void;
   };
};

export declare type FormActionQuestion = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.RADIOGROUP;
   tipContent?: string;
   formGroup?: ConfigForm;
   options?: Signal<TypeComboOption>;
   info?: {msg: string; color: string};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
};

export declare type FormActionTextArea = {
   formName?: string;
   disabled?: boolean;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM.TEXTAREA;
   disableSpeech?: boolean;
   tipContent?: string;
   optionInputText?: TypeInputText;
   placeholder: string;
   formGroup?: ConfigForm;
   info?: {msg: string; color: string};
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
};

export declare type FormActionGeneric = {
   formName?: string;
   disabled?: boolean;
   componentRef?: Array<ComponentRef<FormComponentTemplate>>;
   title?: string;
   formControl?: FormControl | FormArray | FormGroup;
   css?: TypeCss;
   type?: TYPE_CONTROL_FORM;
   optionInputText?: TypeInputText;
   formGroup?: ConfigForm;
   tipContent?: string;
   info?: {msg: string; color: string};
   resetButton?: boolean;
   onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm, utility: Utility) => void;
   onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm, utility: Utility) => void;
   action?: (formControl: FormControl | FormArray | FormGroup) => void;
};
