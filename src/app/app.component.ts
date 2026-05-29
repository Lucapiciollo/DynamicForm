import { Component, inject, Injector } from '@angular/core';
import { ConfigForm } from 'projects/dynamicform/src/public-api';
import { MINIMAL_FORM_JSON_SCHEMA } from './components/nutricare/form/minimal-form.json-schema';
import { buildComboTestForm } from './components/nutricare/form/nutritionist-form.builder';

/** Shell component — contiene solo header nav + router-outlet + footer. */
@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  // public nutritionistQuestions = MINIMAL_FORM_JSON_SCHEMA;
  public nutritionistQuestions: ConfigForm;
  public injector: Injector = inject(Injector);
  constructor() {
    this.nutritionistQuestions = buildComboTestForm<AppComponent>(this);
  }


  onFormCreate($event: any): void {
    console.log('Form created:', $event);
  }


}

