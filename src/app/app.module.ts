import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent, DynamicComponent } from './app.component';
import { PlCoreModule } from 'pl-core-utils-library';
import { InitializerModule } from './core/module/initializer.module';
import { DynamicFormModule } from './dynamicForm/dynamic-form.module';

@NgModule({
  declarations: [
    AppComponent, DynamicComponent
  ],
  imports: [
    InitializerModule,
    BrowserAnimationsModule,
    BrowserModule,
    DynamicFormModule,
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
