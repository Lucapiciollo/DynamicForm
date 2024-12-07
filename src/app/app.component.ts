import { Component, Input } from '@angular/core';
import { Observable, debounce, exhaustMap, merge, mergeAll, of, timer, toArray } from 'rxjs';
import { ConfigForm } from './dynamicForm/interface';
import { activityForm, createRegistry } from './activity-form-builder.';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  questions$: Observable<ConfigForm>;

  componentRef=DynamicComponent;

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
  selector: 'app-dynamic-component',
  template: `
            <button   matSuffix mat-icon-button aria-label="Clear" (click)="test()" >
                <mat-icon>sort</mat-icon>
            </button>
  `
})
export class DynamicComponent {
  @Input({required:true}) form!: FormControl;
  test(){
    alert(this.form.value)
  }

}