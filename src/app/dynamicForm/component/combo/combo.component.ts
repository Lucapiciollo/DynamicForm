/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */
import { Component, ElementRef, Injector } from '@angular/core';
import { BaseComponent } from '../bsae-component.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})
export class ComboComponent extends BaseComponent {



  override toString(num: any): string {
    return String(num)
  }

  /************************************************************************************************************************************************************************ */


  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);
  }
  /************************************************************************************************************************************************************************ */
  optionSelected(name: string, value: any) {
    this.control.formAction.formControl.setValue(value.description, { emitEvent: false });
    this.callOnhange();

  }

}
