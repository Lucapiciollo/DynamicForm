import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { DynamicFormModule } from './dynamicForm/dynamic-form.module';
import { DYNAMIC_FORM_NESTED_EVENTS } from './dynamicForm/examples/dynamic-form-nested-events';

@NgModule({
   declarations: [AppComponent],
   imports: [
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
export class AppModule { }
