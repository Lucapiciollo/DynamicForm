import { Component } from '@angular/core';
import { Observable, debounce, exhaustMap, merge, mergeAll, of, timer, toArray } from 'rxjs';
import { ConfigForm } from './dynamicForm/interface';
import { activityForm, createRegistry } from './activity-form-builder.';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  questions$: Observable<ConfigForm>;

  constructor() {
    this.questions$ = of(activityForm({}, null));



  }

  onFormCreate(formGroup: FormGroup | FormArray) {
    formGroup.valueChanges.pipe(debounce(() => timer(0, 1000))).subscribe(
      (value: any) =>
        console.log(value)
    )
  }
}
