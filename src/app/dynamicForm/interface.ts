


import { FormArray, FormControl, FormGroup } from "@angular/forms";

/*********************************************************************************************************************************** */

export type TypeOptionDate = { max?: string, min?: string, onClose?: (value: any, formgroup: FormGroup) => void };
export type TypeComboOption = Array<{ id: any, description: string, img?: string }>;
export type TypeCss = { classRadio?: Array<string>, class?: Array<string>, col?: string, hide?: boolean, font?: { color?: string }, rows?: number };
export type TypeInputText = { maxlength?: number, password?: boolean };
export type TypeOption = { date?: TypeOptionDate, css?: TypeCss, inputText?: TypeInputText }
export type FormAction = {
  autocomplete?: boolean,
  defaultValue?: any,
  formName?: string,
  title?: string,
  formControl: FormControl | FormArray | FormGroup,
  readOnly?: boolean,
  css?: TypeCss,
  type?: TYPE_CONTROL_FORM,
  date?: TypeOptionDate,
  inputText?: TypeInputText
  options?: TypeComboOption,
  tipContent?: string,
  simbol?: string,
  placeholder?: string,
  placeholderStart?: string,
  placeholderEnd?: string,
  required?: boolean
  disableSpeech?: boolean,
  onChange?:     (idGroup: number, idForm: number, formCOntrol: FormControl | FormArray | FormGroup, formName: string, fg: Array<Form>, typeControl: TYPE_CONTROL_FORM, prevValue: any, allGroup: Array<ConfigForm>) => void,
  onInitialize?: (idGroup: number, idForm: number, formCOntrol: FormControl | FormArray | FormGroup, formName: string, fg: Array<Form>, typeControl: TYPE_CONTROL_FORM, allGroup: Array<ConfigForm>) => void,
  optionSelected?: (name: string, fg: FormGroup, value: any) => void,
  formGroup?: ConfigForm,
}

export enum TYPE_CONTROL_FORM {
  BUTTON, DATETIME, LABEL, ACTIONREPORT, LINK, RADIOGROUP, TEXT, TEXTAREA, CHECKBOX, FILE, CURRENCY, NUMBER, COMBO, DATA, DATARANGE, EMAIL, TIME, GROUP
}


export type Form = {
  formAction: FormAction
}

export type TypeForm = Array<Form>;

export type ConfigForm = Array<{
  title?: string,
  formGroup?: TypeForm,
  bottomLabel?: Label,
  actions?: Array<{ label: string, action: (fg: Array<Form>, id: number, formArray: Array<any>, button: HTMLElement) => void, cssClassIcon?: Array<string>, cssClassButton?: Array<string> }>
}>;



export type TranslatedLabel = {
  language?: string,
  value?: string
}


export type Label = {
  index?: number,
  id?: string,
  translations: Array<TranslatedLabel>,
  logicName?: string,
}


