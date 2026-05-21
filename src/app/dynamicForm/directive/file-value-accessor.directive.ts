/**
 * @format
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-11-18 12:54:14
 * @modify date 2022-11-18 12:54:14
 * @desc [description]
 */

import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Directive({
   selector: 'input[type=file]',
   providers: [
      {
         provide: NG_VALUE_ACCESSOR,
         useExisting: FileValueAccessorDirective,
         multi: true,
      },
   ],
})
export class FileValueAccessorDirective implements ControlValueAccessor {
   public onChange;

   @HostListener('change', ['$event.target.files']) _handleInput(event) {
      try {
         this.onChange(event);
      } catch (e) {}
   }

   /************************************************************************************************************************************************************************ */

   constructor(
      private element: ElementRef,
      private render: Renderer2,
   ) {}

   /************************************************************************************************************************************************************************ */

   registerOnTouched(fn: any): void {}

   /************************************************************************************************************************************************************************ */

   setDisabledState?(isDisabled: boolean): void {}

   /************************************************************************************************************************************************************************ */

   writeValue(value: any) {
      try {
         const normalizedValue = value == null ? '' : value;
         this.render.setProperty(this.element.nativeElement, 'value', normalizedValue);
      } catch (e) {
         throw new Error(e);
      }
   }

   /************************************************************************************************************************************************************************ */

   registerOnChange(fn) {
      this.onChange = fn;
   }
}
