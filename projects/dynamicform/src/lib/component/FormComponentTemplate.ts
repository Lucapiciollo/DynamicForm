/** @format */

import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ConfigForm, FormAction } from '../dynamic-form.interface';

/**
 * Classe astratta base per tutti i template di componenti del DynamicForm.
 *
 * Definisce il contratto minimo che ogni componente figlio deve soddisfare
 * esponendo i metodi di accesso al form control, alla configurazione del campo,
 * al controllo padre e alla lista completa dei gruppi.
 *
 * Il metodo `initialize()` viene chiamato da `LoadChildDirective` dopo la creazione
 * dinamica del componente per eseguire la logica di setup iniziale.
 */
@Component({
   template: '',
   standalone: false,
})
export abstract class FormComponentTemplate {
   public getFormControl: () => FormControl | FormGroup | FormArray;
   public getFormConfig: () => FormAction;
   public getFormParent: () => FormControl | FormGroup | FormArray;
   public getQuestions: () => ConfigForm;
   public initialize() { }
}
