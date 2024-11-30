/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */
import { Component, ElementRef, Injector } from '@angular/core';

import { BaseComponent } from '../base-component.component';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['../../dynamic-form.component.scss']
})
export class FileComponent extends BaseComponent {

  /************************************************************************************************************************************************************************ */
  display: FormControl = new FormControl("");
  file_store: FileList | undefined;
  file_list: Array<string> = [];
  /************************************************************************************************************************************************************************ */

  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);
  }

  /************************************************************************************************************************************************************************ */

  getRequired() {
    if (this.control?.formAction?.formControl?.validator)
      return this.control?.formAction?.formControl?.validator({} as AbstractControl)?.required == true;
    else
      return false
  }

  /************************************************************************************************************************************************************************ */

  handleFileInputChange(l: FileList): void {
    if (l.length) {
      const f = l[0];
      const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
      this.control.formAction.formControl.setValue(l);
      this.display.patchValue(`${f.name} ${count}`);
    } else {
      this.display.patchValue("");
    }
  }

  /************************************************************************************************************************************************************************ */

}
