/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */
import { Component, ElementRef, Injector } from '@angular/core';
import { BaseComponent } from '../bsae-component.component';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})
export class TextareaComponent extends BaseComponent {


  /************************************************************************************************************************************************************************ */


 
  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);

  }
  /************************************************************************************************************************************************************************ */


}
