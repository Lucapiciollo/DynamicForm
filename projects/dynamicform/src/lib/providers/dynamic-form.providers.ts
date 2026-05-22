/** @format */

import { EnvironmentProviders, Provider, makeEnvironmentProviders } from '@angular/core';
import { DynamicActionEventHandler, DynamicFieldEventHandler } from '../models/dynamic-form-event.model';
import { DynamicFormThemeConfig } from '../models/dynamic-form-theme-config.model';
import { DYNAMIC_FORM_RUNTIME_CONFIG } from '../tokens/dynamic-form-config.token';

/**
 * Interfaccia di configurazione runtime del DynamicForm.
 * Viene fornita tramite `provideDynamicForm()` o `DynamicFormModule.forRoot()`.
 */
export interface DynamicFormRuntimeConfig {
   events?: Record<string, DynamicFieldEventHandler>;
   actions?: Record<string, DynamicActionEventHandler>;
   theme?: DynamicFormThemeConfig;
}

/** Configurazione di default applicata se non viene fornita alcuna configurazione custom. */
export const DYNAMIC_FORM_DEFAULT_CONFIG: DynamicFormRuntimeConfig = {
   theme: {
      name: 'modern-light',
      mode: 'light',
      applyToBody: true,
      loadMaterialIcons: true,
      injectRuntimeStyles: true,
   },
};

/**
 * Unisce la configurazione utente con i default della libreria.
 * Esegue un merge profondo su `theme`, `events` e `actions`.
 *
 * @param config - Configurazione parziale fornita dall'utente.
 * @returns Configurazione completa con tutti i valori di default applicati.
 */
export function mergeDynamicFormConfig(config: DynamicFormRuntimeConfig = {}): DynamicFormRuntimeConfig {
   return {
      ...DYNAMIC_FORM_DEFAULT_CONFIG,
      ...config,
      theme: {
         ...DYNAMIC_FORM_DEFAULT_CONFIG.theme,
         ...(config.theme ?? {}),
         customTokens: {
            ...(DYNAMIC_FORM_DEFAULT_CONFIG.theme?.customTokens ?? {}),
            ...(config.theme?.customTokens ?? {}),
         },
      },
      events: {
         ...(DYNAMIC_FORM_DEFAULT_CONFIG.events ?? {}),
         ...(config.events ?? {}),
      },
      actions: {
         ...(DYNAMIC_FORM_DEFAULT_CONFIG.actions ?? {}),
         ...(config.actions ?? {}),
      },
   };
}

/**
 * Provider per applicazioni standalone (Angular 16+).
 * Da usare in `bootstrapApplication()` o `app.config.ts`.
 *
 * @example
 * ```ts
 * // main.ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideDynamicForm({
 *       events: { onNomeChange: ctx => console.log(ctx) },
 *       theme: { name: 'modern-dark' },
 *     }),
 *   ],
 * });
 * ```
 */
export function provideDynamicForm(config: DynamicFormRuntimeConfig = {}): EnvironmentProviders {
   return makeEnvironmentProviders([{ provide: DYNAMIC_FORM_RUNTIME_CONFIG, useValue: mergeDynamicFormConfig(config) }]);
}

/**
 * Provider per applicazioni con `NgModule` (Angular classico).
 * Da usare nell'array `providers` di `AppModule` o di un modulo feature.
 *
 * @example
 * ```ts
 * // app.module.ts
 * @NgModule({
 *   imports: [DynamicFormModule],
 *   providers: [
 *     ...provideDynamicFormForModule({
 *       events: { onNomeChange: ctx => console.log(ctx) },
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
export function provideDynamicFormForModule(config: DynamicFormRuntimeConfig = {}): Provider[] {
   return [{ provide: DYNAMIC_FORM_RUNTIME_CONFIG, useValue: mergeDynamicFormConfig(config) }];
}
