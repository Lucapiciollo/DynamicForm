/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */
import { Component, ElementRef, Injector } from '@angular/core';
import { BaseComponent } from '../base-component.component';


@Component({
  selector: 'app-radiobutton',
  templateUrl: './question-radion-button.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})
export class QuestionRadioButtonComponent extends BaseComponent {


  override toString(num: any): string {
    return String(num)
  }

  /************************************************************************************************************************************************************************ */


  /************************************************************************************************************************************************************************ */
  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);

  }
  /************************************************************************************************************************************************************************ */

}
