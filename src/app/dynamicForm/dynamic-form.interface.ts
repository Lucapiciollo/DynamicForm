


import { ComponentRef } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { FormComponentTemplate } from "./component/FormComponentTemplate";

/*********************************************************************************************************************************** */

export type TypeOptionDate = { max?: string, min?: string, onClose?: (value: any, formgroup: FormGroup) => void };
export type TypeOptionNumber = { max?: number, min?: number, step?: number };
export type TypeCss = { iconCss?: string, classRadio?: Array<string>, class?: Array<string>, hide?: boolean, font?: { color?: string }, rows?: number, toggleIcons?: [string, string] };
export type TypeInputText = { maxlength?: number, password?: boolean };
export type TypeOption = { date?: TypeOptionDate, css?: TypeCss, inputText?: TypeInputText }


export enum TYPE_CONTROL_FORM {
  SEPARATOR, BUTTON, DATETIME, LABEL, ACTIONREPORT, LINK, RADIOGROUP, TEXT, TEXTAREA, CHECKBOX, FILE, CURRENCY, NUMBER, COMBO, DATA, DATARANGE, EMAIL, TIME, GROUP, SORTACTION
}

export type Form = {
  formAction: FormAction
}

export type TypeForm = Array<Form>;

export type Group = {
  title?: string,
  class?: Array<string>,
  formGroup?: TypeForm,
  bottomLabel?: string,
  actions?: Array<{
    label?: string, action: (questions: Array<Form>, idForm: string, formGroup: FormGroup | FormArray) => void, cssClassIcon?: Array<string>, cssClassButton?: Array<string>,
    disabled?: boolean, visible?: boolean
  }>
}

export type ConfigForm = Array<Group>;

 
export type TypeRadioOption = Array<
  {
    id: any,
    description: string,
    disabled?: boolean
  }>;


export type TypeComboOption = Array<{
  id: any,
  description: string,
  img?: string, extra?: any,
  disabled?: boolean,
  hide?: boolean
}>;



export declare type FormAction = FormActionGeneric | FormActionTextArea | FormActionQuestion | FormActionNumber | FormActionText | FormActionCombo | FormActionCurrency | FormActionCheckbox | FormActionDateRange | FormActionDate | FormActionDateRange | FormActionDateTime | FormActionFile;
export declare type FormActionCombo = {
  autocomplete?: boolean,
  disabled?: boolean,
  multiple?: boolean,
  formName?: string,
  title?: string,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM.COMBO,
  options?: TypeComboOption,
  tipContent?: string,
  formGroup?: ConfigForm,
  info?: { msg: string, color: string },
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void
};

export declare type FormActionCheckbox = {
  formName?: string,
  disabled?: boolean,
  title?: string,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM.CHECKBOX,
  tipContent?: string,
  formGroup?: ConfigForm,
  info?: { msg: string, color: string },
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void
};




export declare type FormActionCurrency = {
  formName?: string,
  disabled?: boolean,
  title?: string,
  optionNumber?: TypeOptionNumber,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM.CURRENCY,
  tipContent?: string,
  formGroup?: ConfigForm,
  info?: { msg: string, color: string },
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void
};



export declare type FormActionDate = {
  formName?: string,
  disabled?: boolean,
  title?: string,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM.DATA,
  readonly: boolean,
  tipContent?: string,
  hint?: string,
  formGroup?: ConfigForm,
  optionDate?: TypeOptionDate,
  info?: { msg: string, color: string },
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void
};



export declare type FormActionDateRange = {
  formName?: string,
  disabled?: boolean,
  title?: string,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM.DATARANGE,
  readonly: boolean,
  tipContent?: string,
  hint?: string,
  formGroup?: ConfigForm,
  optionDate?: TypeOptionDate,
  info?: { msg: string, color: string },
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void,
  onClose(value: any, formControl: FormGroup<{ from: FormControl<Date | null>; to: FormControl<Date | null> }>)
};


export declare type FormActionDateTime = {
  formName?: string,
  disabled?: boolean,
  title?: string,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM.DATETIME,
  tipContent?: string,
  options?: TypeComboOption,
  hint?: string,
  formGroup?: ConfigForm,
  info?: { msg: string, color: string },
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void,
};




export declare type FormActionFile = {
  formName?: string,
  disabled?: boolean,
  title?: string,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM.FILE,
  tipContent?: string,
  placeholder?: string,
  formGroup?: ConfigForm,
  info?: { msg: string, color: string },
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void,
};



export declare type FormActionText = {
  formName?: string,
  disabled?: boolean,
  title?: string,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM.TEXT,
  disableSpeech?: boolean,
  tipContent?: string,
  optionInputText?: TypeInputText,
  placeholder: string,
  formGroup?: ConfigForm,
  info?: { msg: string, color: string },
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void,
};




export declare type FormActionNumber = {
  formName?: string,
  disabled?: boolean,
  title?: string,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM.NUMBER,
  tipContent?: string,
  optionNumber?: TypeOptionNumber,
  placeholder: string,
  formGroup?: ConfigForm,
  info?: { msg: string, color: string },
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void,
};



export declare type FormActionQuestion = {
  formName?: string,
  disabled?: boolean,
  title?: string,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM.RADIOGROUP,
  tipContent?: string,
  formGroup?: ConfigForm,
  options?: TypeRadioOption,
  info?: { msg: string, color: string },
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void,
};




export declare type FormActionTextArea = {
  formName?: string,
  disabled?: boolean,
  title?: string,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM.TEXTAREA,
  disableSpeech?: boolean,
  tipContent?: string,
  optionInputText?: TypeInputText,
  placeholder: string,
  formGroup?: ConfigForm,
  info?: { msg: string, color: string },
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void,
};



export declare type FormActionGeneric = {
  formName?: string,
  disabled?: boolean,
  componentRef?: Array<ComponentRef<FormComponentTemplate>>,
  title?: string,
  formControl?: FormControl | FormArray | FormGroup,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM,
  optionInputText?: TypeInputText,
  formGroup?: ConfigForm,
  options?: TypeComboOption,
  tipContent?: string,
  info?: { msg: string, color: string },
  resetButton?: boolean,
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) => void,
  onInitialize?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup: ConfigForm) => void,
  action?: (formControl: FormControl | FormArray | FormGroup,) => void,
};



