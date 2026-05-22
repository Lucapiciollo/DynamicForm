/** @format */

import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';
@Directive({
   selector: '[fixSearchBox]',
   standalone: false,
})
export class FixSearchBox implements AfterViewInit {
   @Input() appStickyOffset: string = '-1px';
   @Input() cssClass: Array<string> = [];
   @Input({required: false}) fixSearchBox: any = true;
   constructor(
      private el: ElementRef,
      private renderer: Renderer2,
   ) {}

   ngAfterViewInit() {
      try {
         if (this.fixSearchBox) {
            this.cssClass?.forEach(cl => this.el?.nativeElement?.classList?.add(cl));
            this.renderer?.setStyle(this.el.nativeElement, 'position', 'sticky');
            this.renderer?.setStyle(this.el.nativeElement, 'top', this.appStickyOffset);
            this.renderer?.setStyle(this.el.nativeElement, 'z-index', '9999');
            // this.renderer?.setStyle(this.el.nativeElement, 'background-color', '#f0f0f0');
            this.renderer?.setStyle(this.el.nativeElement.parentElement, 'padding', '0px');
         }
      } catch (e) {}
   }
}
