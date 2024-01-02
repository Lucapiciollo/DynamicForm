import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextComponent } from "./component/base.module";
import { DynamicFormComponent } from "./dynamic-form.component";
import { MaterialModule } from "./material.module";
import { ComboComponent } from "./component/combo/combo.component";
import { CheckboxComponent } from "./component/checkbox/checkbox.component";
import { CurrencyComponent } from "./component/currency/currency.component";
import { DateComponent } from "./component/date/date.component";
import { DateRangeComponent } from "./component/date-range/date-range.component";
import { DateTimeComponent } from "./component/date-time/date-time.component";
import { FileComponent } from "./component/file/file.component";
import { InputTimeComponent } from "./component/input-time/input-time.component";
import { LabelComponent } from "./component/label/label.component";
import { NumberComponent } from "./component/number/number.component";
import { QuestionRadioButtonComponent } from "./component/question-radion-button/question-radion-button.component";
import { TextareaComponent } from "./component/textarea/textarea.component";
import { LinkComponent } from "./component/link/link.component";
import { SpeechDirective } from "./directive/speech-recognition";
import { SortActionComponent } from "./component/sort-action/sort-action.component";
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
    DynamicFormComponent,
    CheckboxComponent,
    CurrencyComponent,
    DateComponent,
    DateRangeComponent,
    DateTimeComponent,
    FileComponent,
    InputTimeComponent,
    LabelComponent,
    NumberComponent,
    QuestionRadioButtonComponent,
    TextareaComponent,
    LinkComponent,
    SpeechDirective,
    SortActionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CommonModule
  ],
  exports: [
    SortActionComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ComboComponent,
    CommonModule,
    DynamicFormComponent,
    InputTextComponent,
    CheckboxComponent,
    CurrencyComponent,
    DateComponent,
    DateRangeComponent,
    DateTimeComponent,
    FileComponent,
    InputTimeComponent,
    LabelComponent,
    NumberComponent,
    QuestionRadioButtonComponent,
    TextareaComponent,
    LinkComponent,
    MaterialModule
  ]

})
export class FormModule { }
