import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FormModule } from './dynamicForm/form.module';
import { MaterialModule } from './dynamicForm/material.module';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
