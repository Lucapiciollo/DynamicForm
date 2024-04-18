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
    if (!this.control.formAction.formControl.disabled) {
      let res = this.control.formAction?.options?.find(f => f?.id == value?.id);
      this.filtercontrol.setValue(value != null ? res?.description || null : null, { emitEvent: true });
      this.control.formAction.formControl.setValue(value?.id || value);
      this.control.formAction.formControl.markAsDirty();
      this.control.formAction.formControl.markAsTouched();
      this.callOnhange();
    }

  }

  initialize() {
    if (this.filtercontrol.value == null) {
      this.filtercontrol.setValue(null, { emitEvent: true });
    }
  }


  clearButton(filtercontrol) {
    this.filtercontrol.reset();
    (this.control.formAction.formControl as FormControl).reset( )
    this.callOnhange();
  }

}
