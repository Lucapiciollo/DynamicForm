/**
 * Injection tokens separati per evitare cicli di import tra BaseComponent e DynamicFormModule
 */
import { InjectionToken } from '@angular/core';

export const DATE_PIPE = new InjectionToken<any>('Default date pipe');
export const DATE_PIPE_TIME = new InjectionToken<any>('Default date pipe time');
export const COMBO_PAING_INIT = new InjectionToken<{ count: number; page: number }>('Inizializzazione paginazione combo');
export const MAX_ELEMENT_COMBO_SHOW = new InjectionToken<{ maxElementShow: number }>('Massimo elementi visibile nella descrizione della combo selezionata');
export const MAX_DATE_CALENDAR = new InjectionToken<string>('Massima data selezionabile nel calendario');
export const MIN_DATE_CALENDAR = new InjectionToken<string>('Minima data selezionabile nel calendario');
