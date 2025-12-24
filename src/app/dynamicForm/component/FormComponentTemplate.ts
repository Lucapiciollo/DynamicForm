/** @format */

import {Component} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ConfigForm, FormAction} from '../dynamic-form.interface';

@Component({
   template: '',
})
export abstract class FormComponentTemplate {
   public getFormControl: () => FormControl | FormGroup | FormArray;
   public getFormConfig: () => FormAction;
   public getFormParent: () => FormControl | FormGroup | FormArray;
   public getQuestions: () => ConfigForm;
   public initialize() {}
}
