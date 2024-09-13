


import { FormArray, FormControl, FormGroup } from "@angular/forms";

/*********************************************************************************************************************************** */

export type TypeOptionDate = { max?: string, min?: string, onClose?: (value: any, formgroup: FormGroup) => void };
export type TypeOptionNumber = { max?: number, min?: number, step?:number};
export type TypeComboOption = Array<{ id: any, description: string, img?: string ,extra?:any }>;
export type TypeCss = { iconCss?: string, classRadio?: Array<string>, class?: Array<string>, hide?: boolean, font?: { color?: string }, rows?: number, toggleIcons?: [string, string] };
export type TypeInputText = { maxlength?: number, password?: boolean };
export type TypeOption = { date?: TypeOptionDate, css?: TypeCss, inputText?: TypeInputText }
export type FormAction = {
  autocomplete?: boolean,
  multiple?: boolean,
  defaultValue?: any,
  formName?: string,
  title?: string,
  action?:( formControl: FormControl | FormArray | FormGroup,)=>void,
  formControl?: FormControl | FormArray | FormGroup,
  readOnly?: boolean,
  minFilterLength?:number,
  css?: TypeCss,
  hint?:string,
  type?: TYPE_CONTROL_FORM,
  optionDate?: TypeOptionDate,
  optionNumber?: TypeOptionNumber,
  optionInputText?: TypeInputText
  options?: TypeComboOption,
  tipContent?: string,
  simbol?: string,
  placeholder?: string,
  disableSpeech?: boolean,
  onChange?: (idGroup: number, idForm: number, formControl: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup:  ConfigForm ) => void,
  onInitialize?: (idGroup: number, idForm: number, formCOntrol: FormControl | FormArray | FormGroup, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, allGroup:  ConfigForm ) => void,
  optionSelected?: (name: string, formGroup: FormGroup ) => void,
  formGroup?: ConfigForm,
  event?: {onClick?: (formControl: any)=> void},
  info?: {msg:string, color:string},
}

export enum TYPE_CONTROL_FORM {
  BUTTON, DATETIME, LABEL, ACTIONREPORT, LINK, RADIOGROUP, TEXT, TEXTAREA, CHECKBOX, FILE, CURRENCY, NUMBER, COMBO, DATA, DATARANGE, EMAIL, TIME, GROUP, SORTACTION
}


export type Form = {
  formAction: FormAction
}

export type TypeForm = Array<Form>;

export type Group ={
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






