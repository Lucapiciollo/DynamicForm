/**
 * @format
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-30 00:30:41
 * @modify date 2022-03-30 00:30:41
 * @desc [description]
 */

import {Component, ComponentRef, ElementRef, Injector, viewChild, ViewChild, ViewContainerRef} from '@angular/core';
import {BaseComponent} from '../base-component.component';

@Component({
   
  standalone: false,selector: 'app-input-text',
   templateUrl: './input-text.component.html',
   styleUrls: ['../../dynamic-form.component.scss', './input-text.component.scss'],
})
export class InputTextComponent extends BaseComponent {
   /************************************************************************************************************************************************************************ */
   @ViewChild('inputs') inputs: ElementRef;
   /************************************************************************************************************************************************************************ */

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
   }
   /************************************************************************************************************************************************************************ */

   onChangeByMic(e) {
      if (e && e.detail && e.detail.frommic == true) {
         // this.inputs.nativeElement.value=e.detail.value;
         this.control.formAction?.formControl.markAsPristine();
         this.control.formAction?.formControl.markAsDirty();
         this.control.formAction?.formControl.setValue(e.detail.value);
      }
   }
}

