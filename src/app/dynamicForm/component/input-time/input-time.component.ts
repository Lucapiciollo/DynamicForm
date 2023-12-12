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
  selector: 'app-input-time',
  templateUrl: './input-time.component.html',
  styleUrls: ['../../dynamic-form.component.css']
})
export class InputTimeComponent extends BaseComponent {
  /************************************************************************************************************************************************************************ */
  
   /************************************************************************************************************************************************************************ */

 
  /************************************************************************************************************************************************************************ */

  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);

  }
  /************************************************************************************************************************************************************************ */

}


