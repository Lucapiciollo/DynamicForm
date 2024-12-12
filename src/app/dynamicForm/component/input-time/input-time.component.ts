/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-30 00:30:41
 * @modify date 2022-03-30 00:30:41
 * @desc [description]
 */
import { Component, ElementRef, Injector } from '@angular/core';
import { BaseComponent } from '../base-component.component';
import moment from 'moment';

@Component({
  selector: 'app-input-time',
  templateUrl: './input-time.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})
export class InputTimeComponent extends BaseComponent {

  public hours = [];

  /************************************************************************************************************************************************************************ */

  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);
    Array.from({ length: 24 }, (_, i) => this.hours.push(moment().hour(i).minute(0).format("HH:00")))

  }

  /************************************************************************************************************************************************************************ */

  ngAfterViewInit(): void {
    if (this.control?.formAction?.optionsTime?.min)
      this.hours = this.hours.filter(f => (moment(f, 'HH:mm').hour()) >= (moment(this.control?.formAction?.optionsTime?.min, 'HH:mm:ss').hour()));
    if (this.control?.formAction?.optionsTime?.max)
      this.hours = this.hours.filter(f => (moment(f, 'HH:mm').hour()) <= (moment(this.control?.formAction?.optionsTime?.max, 'HH:mm:ss').hour()));
  }

}


