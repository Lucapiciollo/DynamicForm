/** @format */

import {EnvironmentProviders, InjectionToken, ModuleWithProviders, Provider, makeEnvironmentProviders} from '@angular/core';
import {DynamicActionEventHandler, DynamicFieldEventHandler} from '../models/dynamic-form-event.model';

export interface DynamicFormRuntimeConfig {
   events?: Record<string, DynamicFieldEventHandler>;
   actions?: Record<string, DynamicActionEventHandler>;
}

export const DYNAMIC_FORM_RUNTIME_CONFIG = new InjectionToken<DynamicFormRuntimeConfig>('DYNAMIC_FORM_RUNTIME_CONFIG');

export function provideDynamicForm(config: DynamicFormRuntimeConfig): EnvironmentProviders {
   return makeEnvironmentProviders([{provide: DYNAMIC_FORM_RUNTIME_CONFIG, useValue: config}]);
}

export function provideDynamicFormForModule(config: DynamicFormRuntimeConfig): Provider[] {
   return [{provide: DYNAMIC_FORM_RUNTIME_CONFIG, useValue: config}];
}
