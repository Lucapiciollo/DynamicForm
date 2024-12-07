import { Component, Input } from '@angular/core';
import { Observable, debounce, exhaustMap, merge, mergeAll, of, timer, toArray } from 'rxjs';
import { ConfigForm, FormAction } from './dynamicForm/interface';
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
}

@Component({
  template: `
            <button   matSuffix mat-icon-button aria-label="Clear"   >
                <mat-icon>sort</mat-icon>
            </button>
            {{formControl.value | date}}
  `
})
export class DynamicComponent extends FormComponentTemplate {
  formParent: FormControl<any> | FormGroup<any> | FormArray<any>;
  formControl: FormControl<any>;
  formConfig: FormAction;

}