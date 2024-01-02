/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-11-18 12:55:27
 * @modify date 2022-11-18 12:55:27
 * @desc [description]
 */
import { Component, ElementRef, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../bsae-component.component';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})
export class CurrencyComponent extends BaseComponent {

  /************************************************************************************************************************************************************************ */
  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);
  }
  /************************************************************************************************************************************************************************ */

}
