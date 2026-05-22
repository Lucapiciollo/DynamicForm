/** @format */

import {EnvironmentProviders, Provider, makeEnvironmentProviders} from '@angular/core';
import {DynamicActionEventHandler, DynamicFieldEventHandler} from '../models/dynamic-form-event.model';
import {DynamicFormThemeConfig} from '../models/dynamic-form-theme-config.model';
import {DYNAMIC_FORM_RUNTIME_CONFIG} from '../tokens/dynamic-form-config.token';

export interface DynamicFormRuntimeConfig {
   events?: Record<string, DynamicFieldEventHandler>;
   actions?: Record<string, DynamicActionEventHandler>;
   theme?: DynamicFormThemeConfig;
}

export const DYNAMIC_FORM_DEFAULT_CONFIG: DynamicFormRuntimeConfig = {
   theme: {
      name: 'modern-light',
      mode: 'light',
      applyToBody: true,
      loadMaterialIcons: true,
      injectRuntimeStyles: true,
   },
};

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

export function provideDynamicForm(config: DynamicFormRuntimeConfig = {}): EnvironmentProviders {
   return makeEnvironmentProviders([{provide: DYNAMIC_FORM_RUNTIME_CONFIG, useValue: mergeDynamicFormConfig(config)}]);
}

export function provideDynamicFormForModule(config: DynamicFormRuntimeConfig = {}): Provider[] {
   return [{provide: DYNAMIC_FORM_RUNTIME_CONFIG, useValue: mergeDynamicFormConfig(config)}];
}
