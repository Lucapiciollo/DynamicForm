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
  handleFileInputChange(l: FileList): void {
    if (l.length) {
      const f = l[0];
      const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
      this.control.formAction.formControl.setValue(l)
      this.display.patchValue(`${f.name} ${count}`);
    } else {
      this.display.patchValue("");
    }
  }
  /************************************************************************************************************************************************************************ */


}
