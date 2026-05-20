/** @format */

import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
   
  standalone: false,selector: '[speech]',
})
export class SpeechDirective {
   private recognition: any = null;
   @Input() e: any;

   constructor(
      private element: ElementRef,
      private renderer: Renderer2,
   ) {
      try {
         this.recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
         if (this.recognition) {
            this.recognition.interimResults = false;
            this.recognition.lang = 'it-IT';
            this.recognition.continuous = false;
         }
      } catch (error) {}
   }

   @HostListener('touchstart', ['$event'])
   @HostListener('mousedown', ['$event'])
   start() {
      this.renderer.setStyle(this.element.nativeElement, 'color', 'red');
      this.recognition.start();
      this.recognition.onresult = (event: any) => {
         for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
               const content = event.results[i][0].transcript.trim();
               const start = this.e.selectionStart;
               const end = this.e.selectionEnd;

               if (this.e) {
                  // this.e.value = (this.e.value + ' ' + content).trim();
                  const text = this.e.value;

                  this.e.value = text.slice(0, start) + content.trim() + text.slice(end);
                  const newPos = start + content.length;
                  this.e.setSelectionRange(newPos, newPos);
                  this.e.focus();
                  // this.formControl.setValue((value + " " + content).trim());
                  // (this.e as HTMLInputElement).dispatchEvent(new Event('change'));
                  (this.e as HTMLInputElement).dispatchEvent(
                     new CustomEvent('change', {
                        detail: {value: this.e.value, frommic: true},
                     }),
                  );
               }
            }
         }
      };
   }

   @HostListener('touchend', ['$event'])
   @HostListener('mouseup', ['$event'])
   stop() {
      setTimeout(() => {
         this.renderer.setStyle(this.element.nativeElement, 'color', '');
         this.recognition.stop();
      }, 1500);
   }
}

