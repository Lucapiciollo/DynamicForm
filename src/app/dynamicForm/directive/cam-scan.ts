/** @format */

import {Directive, ElementRef, EventEmitter, Output, Renderer2, inject} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {AlertController, Platform} from '@ionic/angular';
import {DocumentScanner, ResponseType} from 'capacitor-document-scanner';
import moment from 'moment';
import {Unsubscribe} from 'pl-decorator';
import {fromEvent, throttleTime} from 'rxjs';

@Directive({
   
  standalone: false,selector: '[camscan]',
})
@Unsubscribe()
export class CamScanDirective {
   @Output() onCaptureCam: EventEmitter<FileList> = new EventEmitter<FileList>();
   public platform: Platform = inject(Platform);
   public fileName: string = null;
   private camera: Camera = inject(Camera);
   private alertController: AlertController = inject(AlertController);
   private options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
   };

   private divRowELement: HTMLElement;
   private divColELement: HTMLElement;
   private buttonElement: HTMLElement;
   private iELement: HTMLElement;

   constructor(
      private element: ElementRef,
      private renderer: Renderer2,
      private sanitizer: DomSanitizer,
   ) {
      if (this.platform.is('cordova')) {
         this.divRowELement = this.renderer.createElement('div');
         this.divColELement = this.renderer.createElement('div');
         this.buttonElement = this.renderer.createElement('button');
         this.iELement = this.renderer.createElement('span');

         this.divRowELement.classList.add('row', 'w-100');
         this.divRowELement.classList.add('col-12', 'text-end');
         this.iELement.classList.add('fa', 'fa-camera', 'mat-icon', 'notranslate', 'material-icons', 'mat-ligature-font', 'mat-icon-no-color');
         this.iELement.style.color = 'var(--primary)';

         this.renderer.appendChild(this.buttonElement, this.iELement);
         this.renderer.appendChild(this.divColELement, this.buttonElement);
         this.renderer.appendChild(this.divRowELement, this.divColELement);
         this.renderer.appendChild(this.element.nativeElement, this.divRowELement);
      }
   }

   scanDocument = async () => {
      const {scannedImages} = await DocumentScanner.scanDocument({
         responseType: ResponseType.Base64,
      });
      if (scannedImages.length > 0) {
         return scannedImages[0];
      }
   };

   async ngAfterViewInit(): Promise<void> {
      if (this.platform.is('cordova'))
         fromEvent(this.buttonElement, 'click')
            .pipe(throttleTime(200))
            .subscribe(async val => {
               try {
                  this.scanDocument().then(
                     async imageData => {
                        // this.camera.getPicture(this.options).then((imageData) => {
                        let base64Image = `data:image/jpeg;base64,${imageData}`;
                        fetch(base64Image)
                           .then(res => res.blob())
                           .then(async blob => {
                              (
                                 await this.alertController.create({
                                    message: `<img src="${base64Image}"  >`,
                                    header: 'Nome file',
                                    mode: 'ios',
                                    cssClass: 'basic-alert-success',
                                    subHeader: 'Inserire il nome del file',
                                    inputs: [
                                       {
                                          placeholder: 'Nome',
                                          type: 'text',
                                          name: 'nameFile',
                                       },
                                    ],
                                    buttons: [
                                       {
                                          text: 'OK',
                                          handler: value => {
                                             if (value && value.nameFile.trim() != '' && value.nameFile != null) {
                                                this.onCaptureCam.emit([new File([blob], `${value.nameFile || String(moment().milliseconds())}.jpg`, {type: 'image/jpg'})] as any);
                                             }
                                          },
                                       },
                                       {
                                          text: 'Annulla',
                                       },
                                    ],
                                 })
                              ).present();
                           });
                     },
                     err => {
                        throw new Error(err);
                     },
                  );
               } catch (error) {
                  throw new Error(error);
               }
            });
   }
}

