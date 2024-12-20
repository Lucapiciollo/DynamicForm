import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[applySticky]'
})
export class StickyDirective implements OnInit {
  @Input() appStickyOffset: string = '-1px';
  @Input() cssClass: Array<string> = [];
  @Input({ required: false }) applySticky: any = true;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    if (this.applySticky) {
      this.cssClass.forEach(cl => this.el.nativeElement.classList.add(cl));
      this.renderer.setStyle(this.el.nativeElement, 'position', 'sticky');
      this.renderer.setStyle(this.el.nativeElement, 'top', this.appStickyOffset);
      this.renderer.setStyle(this.el.nativeElement, 'z-index', '9999');
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#f0f0f0');
      this.renderer.setStyle(this.el.nativeElement.parentElement, 'padding', '0px');
    }
  }
}

 