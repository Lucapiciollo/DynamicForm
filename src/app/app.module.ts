import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FormModule } from './dynamicForm/form.module';
import { PlCoreModule } from 'pl-core-utils-library';
import { InitializerModule } from './initializer.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // InitializerModule.forRoot(),
    BrowserAnimationsModule,
    BrowserModule,
    FormModule,
  ],
  exports: [ ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
