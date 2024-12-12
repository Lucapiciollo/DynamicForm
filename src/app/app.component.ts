import { Component, Input } from '@angular/core';
import { Observable, debounce, exhaustMap, merge, mergeAll, of, timer, toArray } from 'rxjs';
import { ConfigForm, FormAction } from './dynamicForm/dynamic-form.interface';
import { activityForm, createRegistry } from './activity-form-builder.';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormComponentTemplate } from './dynamicForm/component/FormComponentTemplate';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  questions$: Observable<ConfigForm>;

  componentRef = DynamicComponent;
  options=this.generateUniqueItems(300);

  constructor() {
    this.questions$ = of(activityForm({}, this));



  }

  onFormCreate(formGroup: FormGroup | FormArray) {
    // formGroup.disable()
    // formGroup.valueChanges.pipe(debounce(() => timer(0, 1000))).subscribe(
    //   (value: any) =>
    //   console.log(value)
    //   )


    // formGroup.enable()
  }

  generateRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Funzione per creare una lista di item univoci
  generateUniqueItems(count) {
    const items = new Set();

    while (items.size < count) {
      const id = this.generateRandomString(4); // ID univoco di 4 caratteri
      const description = `Descrizione ${this.generateRandomString(6)}`; // Descrizione casuale

      items.add(JSON.stringify({ id, description })); // Usa JSON.stringify per mantenere l'unicità
    }

    return Array.from(items).map((item: any) => JSON.parse(item));
  }


}

@Component({
  template: `
            <button matSuffix mat-icon-button aria-label="Clear"   (click)="setConfig(null)">
                <mat-icon>sort</mat-icon>
            </button>
   `
})
export class DynamicComponent extends FormComponentTemplate {



  questions: ConfigForm;
  formParent: FormControl<any> | FormGroup<any> | FormArray<any>;
  formControl: FormControl<any>;
  formConfig: FormAction;

  setConfig(formConfig: FormAction) {
    (this.questions[0].formGroup[7].formAction as any).options = [...[{ id: 1, description: "test" }]];
    console.log(this.formParent, this.formConfig, this.formControl, this.questions);

  }

  public initialize(): void {
    this.questions = this.getQuestions();
  }






}