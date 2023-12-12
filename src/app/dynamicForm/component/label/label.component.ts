/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-30 00:30:41
 * @modify date 2022-03-30 00:30:41
 * @desc [description]
 */
import { Component, ElementRef, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../bsae-component.component';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['../../dynamic-form.component.css']
})
export class LabelComponent extends BaseComponent {
  /************************************************************************************************************************************************************************ */


  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);

  }
  /************************************************************************************************************************************************************************ */

  getValue() {
    return this.control.formAction.formControl.value
  }
}


