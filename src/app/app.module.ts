import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { BROWSER, PlAmbientModeLoaderService, PlCoreModule } from 'pl-core-utils-library';
import { InitializerModule } from './core/module/initializer.module';
import { DynamicFormModule } from 'projects/dynamicform/src/public-api';
import { DYNAMIC_FORM_NESTED_EVENTS } from './minimal-form.json-schema-events';
import { NUTRITIONIST_EVENTS } from './nutritionist-form.events';

@NgModule({
   declarations: [AppComponent],
   imports: [

      InitializerModule,
      BrowserAnimationsModule,
      BrowserModule,
      DynamicFormModule.forRoot({
         events: {
            ...DYNAMIC_FORM_NESTED_EVENTS.events,
            ...NUTRITIONIST_EVENTS.events,
         },
         actions: {
            ...DYNAMIC_FORM_NESTED_EVENTS.actions,
            ...NUTRITIONIST_EVENTS.actions,
         },
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
