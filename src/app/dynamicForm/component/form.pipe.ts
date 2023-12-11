import { ElementRef, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'language' })
export class LanguagePipe implements PipeTransform {
  transform(value: Array<{ language?: string, value?: string }>, languageCode: string): any {
    try {
      return value.find(lan => lan.language == languageCode)?.value;
    } catch (e) {
    }
  }
}



