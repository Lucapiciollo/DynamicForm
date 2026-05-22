/** @format */

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'language', standalone: false})
export class LanguagePipe implements PipeTransform {
   transform(value: Array<{language?: string; value?: string}>, languageCode: string): string {
      try {
         return value.find(lan => lan.language == languageCode).value;
      } catch (e) {}
   }
}

@Pipe({
   name: 'timeToNumber',
   standalone: false,
})
export class TimeToNumberPipe implements PipeTransform {
   transform(time: string): number | null {
      if (!time || !/^\d{2}:\d{2}:\d{2}?$/.test(time)) {
         return null; // Se il formato non è valido, ritorna null
      }
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 100 + minutes;
   }
}
