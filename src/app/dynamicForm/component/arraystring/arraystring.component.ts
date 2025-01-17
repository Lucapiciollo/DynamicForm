/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */
import { Component, effect, ElementRef, inject, Injector, signal } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BaseComponent } from '../base-component.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-arraystring',
  templateUrl: './arraystring.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})
export class ArrayStringComponent extends BaseComponent {

  public getList = signal<Array<string>>([]);
  /************************************************************************************************************************************************************************ */

  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);

    effect(() => {
      this.control?.formAction?.formControl.setValue(this.getList());
    })
  }
  /************************************************************************************************************************************************************************ */
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    let ccs = this.control?.formAction?.formControl.value || [];
    if (value) {
      ccs = [...ccs, value];
      this.getList.set(ccs);
    }
    event.chipInput!.clear();
  }

  remove(value: string): void {
    let ccs = this.control?.formAction?.formControl.value || [];
    ccs = ccs.filter(f => f != value);
    this.getList.set(ccs);
  }

  ngOnInit(): void {
    let ccs = this.control?.formAction?.formControl.value || [];
    this.getList.set(ccs);
  }

}
