import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent, DynamicComponent } from './app.component';
import { FormModule } from './dynamicForm/form.module';
import { PlCoreModule } from 'pl-core-utils-library';
import { InitializerModule } from './core/module/initializer.module';
 
@NgModule({
  declarations: [
    AppComponent,DynamicComponent
  ],
  imports: [
    InitializerModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormModule,
  ],
  exports: [ ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
