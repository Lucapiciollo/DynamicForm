import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigForm } from './dynamicForm/interface';
import { activityForm } from './activity-form-builder.';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  questions$: Observable<ConfigForm>;

  constructor() {
     this.questions$ = of(activityForm(null));;
  }

  onFormCreate(formGroup:FormGroup){
    formGroup.valueChanges.subscribe(value=>console.log(JSON.stringify(value)))
  }
}
