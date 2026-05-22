import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { BROWSER, PlAmbientModeLoaderService, PlCoreModule } from 'pl-core-utils-library';
import { InitializerModule } from './core/module/initializer.module';
import { DYNAMIC_FORM_NESTED_EVENTS, DynamicFormModule } from 'projects/dynamicform/src/public-api';

@NgModule({
   declarations: [AppComponent],
   imports: [

      InitializerModule,
      BrowserAnimationsModule,
      BrowserModule,
      DynamicFormModule.forRoot({
         ...DYNAMIC_FORM_NESTED_EVENTS,
         theme: {
            name: 'silk-compact',
            mode: 'light',
            applyToBody: true,
            loadMaterialIcons: true,
            injectRuntimeStyles: true,
         },
      }),

   ],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {

}
