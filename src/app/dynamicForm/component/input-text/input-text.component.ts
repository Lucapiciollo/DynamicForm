/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-30 00:30:41
 * @modify date 2022-03-30 00:30:41
 * @desc [description]
 */
import { Component, ComponentRef, ElementRef, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../base-component.component';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})
export class InputTextComponent extends BaseComponent {
  /************************************************************************************************************************************************************************ */




  /************************************************************************************************************************************************************************ */

  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);

  }
  /************************************************************************************************************************************************************************ */
  
}


