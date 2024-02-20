import { CommonModule } from "@angular/common";
import { InjectionToken, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Camera } from "@ionic-native/camera/ngx";
import { InputTextComponent } from "./component/base.module";
import { CheckboxComponent } from "./component/checkbox/checkbox.component";
import { ComboComponent } from "./component/combo/combo.component";
import { CurrencyComponent } from "./component/currency/currency.component";
import { DateRangeComponent } from "./component/date-range/date-range.component";
import { DateTimeComponent } from "./component/date-time/date-time.component";
import { DateComponent } from "./component/date/date.component";
import { FileComponent } from "./component/file/file.component";
import { InputTimeComponent } from "./component/input-time/input-time.component";
import { LabelComponent } from "./component/label/label.component";
import { LinkComponent } from "./component/link/link.component";
import { NumberComponent } from "./component/number/number.component";
import { QuestionRadioButtonComponent } from "./component/question-radion-button/question-radion-button.component";
import { SortActionComponent } from "./component/sort-action/sort-action.component";
import { TextareaComponent } from "./component/textarea/textarea.component";
import { CamScanDirective } from "./directive/cam-scan";
import { LoadChildDirective } from "./directive/load-child.directive";
import { SpeechDirective } from "./directive/speech-recognition";
import { DynamicFormComponent } from "./dynamic-form.component";
import { LanguagePipe } from "./form.pipe";
import { MaterialModule } from "./material.module";
/**
* @author luca.piciollo
* @email lucapiciollo@gmail.com
* @create date 2022-03-29 19:47:50
* @modify date 2022-03-29 19:47:50
* @desc [description]
*/

export const DATE_PIPE = new InjectionToken<any>("Default date pipe");
export const DATE_PIPE_TIME = new InjectionToken<any>("Default date pipe time");

@NgModule({
  providers: [
    Camera,
    { provide: DATE_PIPE, useValue: { dateFormat: 'yyyy-MM-dd' } },
    { provide: DATE_PIPE_TIME, useValue: { dateFormat: 'yyyy-MM-ddTHH:mm:ss' } }
  ],
  declarations: [
    LanguagePipe,
    CamScanDirective,
    LoadChildDirective,
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

  ],
  exports: [
    LanguagePipe,
    LoadChildDirective,
    CamScanDirective,
    SortActionComponent,
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
