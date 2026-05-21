/** @format */

import {CommonModule} from '@angular/common';
import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Camera} from '@ionic-native/camera/ngx';
import {InputTextComponent} from './component/base-component.module';
import {ArrayStringComponent} from './component/arraystring/arraystring.component';
import {CheckboxComponent} from './component/checkbox/checkbox.component';
import {ComboComponent} from './component/combo/combo.component';
import {CurrencyComponent} from './component/currency/currency.component';
import {DateRangeComponent} from './component/date-range/date-range.component';
import {DateTimeComponent} from './component/date-time/date-time.component';
import {DateComponent} from './component/date/date.component';
import {FileComponent} from './component/file/file.component';
import {InputTimeComponent} from './component/input-time/input-time.component';
import {LabelComponent} from './component/label/label.component';
import {LinkComponent} from './component/link/link.component';
import {NumberComponent} from './component/number/number.component';
import {QuestionRadioButtonComponent} from './component/question-radion-button/question-radion-button.component';
import {SortActionComponent} from './component/sort-action/sort-action.component';
import {TextareaComponent} from './component/textarea/textarea.component';
import {CamScanDirective} from './directive/cam-scan';
import {LoadChildDirective} from './directive/load-child.directive';
import {SpeechDirective} from './directive/speech-recognition';
import {DynamicFormComponent} from './dynamic-form.component';
import {LanguagePipe, TimeToNumberPipe} from './pipe/form.pipe';
import {MaterialModule} from './material.module';
import {SeparatorComponent} from './component/separator/separator.component';
import {FixSearchBox} from './directive/fixSearchBox.directive';
import {DateYearComponent} from './component/date-year/date-year.component';
import moment from 'moment';
import {DynamicFormRuntimeConfig, provideDynamicFormForModule} from './providers/dynamic-form.providers';
import {DynamicFormAssetsService} from './services/dynamic-form-assets.service';
import {DynamicFormThemeService} from './services/dynamic-form-theme.service';
/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */

export const DATE_PIPE = new InjectionToken<any>('Default date pipe');
export const DATE_PIPE_TIME = new InjectionToken<any>('Default date pipe time');
export const COMBO_PAING_INIT = new InjectionToken<{count: number; page: number}>('Inizializzazione paginazione combo');
export const MAX_ELEMENT_COMBO_SHOW = new InjectionToken<{maxElementShow: number}>('Massimo elementi visibile nella descrizione della combo selezionata');
export const MAX_DATE_CALENDAR = new InjectionToken<string>('Massima data selezionabile nel calendario');
export const MIN_DATE_CALENDAR = new InjectionToken<string>('Minima data selezionabile nel calendario');

const maxYearCalendar = () => {
   return moment().add(1, 'year').endOf('year').toDate().toISOString();
};
const minYearCalendar = () => {
   return moment().subtract(5, 'year').endOf('year').toDate().toISOString();
};

@NgModule({
   providers: [
      Camera,
      {provide: DATE_PIPE, useValue: {dateFormat: 'yyyy-MM-dd'}},
      {
         provide: DATE_PIPE_TIME,
         useValue: {dateFormat: 'yyyy-MM-ddTHH:mm:ss'},
      },
      {provide: COMBO_PAING_INIT, useValue: {count: 10, page: 1}},
      {provide: MAX_ELEMENT_COMBO_SHOW, useValue: {maxElementShow: 3}},
      {provide: MAX_DATE_CALENDAR, useFactory: maxYearCalendar},
      {provide: MIN_DATE_CALENDAR, useFactory: minYearCalendar},
   ],

   declarations: [TimeToNumberPipe, ArrayStringComponent, SeparatorComponent, LanguagePipe, CamScanDirective, LoadChildDirective, InputTextComponent, ComboComponent, DynamicFormComponent, CheckboxComponent, CurrencyComponent, DateComponent, DateRangeComponent, DateTimeComponent, FileComponent, InputTimeComponent, LabelComponent, NumberComponent, QuestionRadioButtonComponent, TextareaComponent, LinkComponent, SpeechDirective, SortActionComponent, FixSearchBox, DateYearComponent],
   imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule],
   exports: [TimeToNumberPipe, DateYearComponent, ArrayStringComponent, SeparatorComponent, LanguagePipe, LoadChildDirective, CamScanDirective, SortActionComponent, ReactiveFormsModule, FormsModule, ComboComponent, CommonModule, DynamicFormComponent, InputTextComponent, CheckboxComponent, CurrencyComponent, DateComponent, DateRangeComponent, DateTimeComponent, FileComponent, InputTimeComponent, LabelComponent, NumberComponent, QuestionRadioButtonComponent, TextareaComponent, LinkComponent, MaterialModule, FixSearchBox],
})
export class DynamicFormModule {
   constructor(
      private readonly dynamicFormAssets: DynamicFormAssetsService,
      private readonly dynamicFormTheme: DynamicFormThemeService,
   ) {
      this.dynamicFormAssets.loadDefaultAssets();
      this.dynamicFormTheme.init();
   }

   static forRoot(config: DynamicFormRuntimeConfig = {}): ModuleWithProviders<DynamicFormModule> {
      return {
         ngModule: DynamicFormModule,
         providers: provideDynamicFormForModule(config),
      };
   }
}

