import { Component } from '@angular/core';
import { buildUltraSafeNestedActionsForm } from './ultra-safe-nested-actions.builder';
import { ConfigForm } from 'projects/dynamicform/src/public-api';


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

