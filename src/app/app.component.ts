import { Component } from '@angular/core';
import { ConfigForm } from './dynamicForm/dynamic-form.interface';
import { buildUltraSafeNestedActionsForm } from './dynamicForm/examples/ultra-safe-nested-actions.builder';
 
@Component({
   standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  questions: ConfigForm = buildUltraSafeNestedActionsForm();

  constructor() {
    console.log('[APP] questions:', this.questions);
  }
}

 