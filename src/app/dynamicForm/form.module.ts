import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextComponent } from "./component/base.module";
import { DynamicFormComponent } from "./dynamic-form.component";
import { MaterialModule } from "./material.module";
import { ComboComponent } from "./component/combo/combo.component";

/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */
 


@NgModule({
 
  declarations: [
    InputTextComponent,
    ComboComponent,
    DynamicFormComponent 
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
     MaterialModule,
    CommonModule
  ], exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ComboComponent,
    CommonModule,
    DynamicFormComponent ,
    InputTextComponent
  ]

})
export class FormModule { }
