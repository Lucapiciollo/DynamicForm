/** @format */

import {Inject, Injectable, Optional} from '@angular/core';
import {DynamicActionEventHandler, DynamicFieldEventHandler} from '../models/dynamic-form-event.model';
import {DynamicFormRuntimeConfig} from '../providers/dynamic-form.providers';
import {DYNAMIC_FORM_RUNTIME_CONFIG} from '../tokens/dynamic-form-config.token';

@Injectable({providedIn: 'root'})
export class DynamicFormEventRegistryService {
   private readonly events = new Map<string, DynamicFieldEventHandler>();
   private readonly actions = new Map<string, DynamicActionEventHandler>();

   constructor(@Optional() @Inject(DYNAMIC_FORM_RUNTIME_CONFIG) config?: DynamicFormRuntimeConfig) {
      if (config?.events) this.registerEvents(config.events);
      if (config?.actions) this.registerActions(config.actions);
   }

   registerEvents(events: Record<string, DynamicFieldEventHandler>): void {
      Object.entries(events || {}).forEach(([name, handler]) => this.events.set(name, handler));
   }

   registerActions(actions: Record<string, DynamicActionEventHandler>): void {
      Object.entries(actions || {}).forEach(([name, handler]) => this.actions.set(name, handler));
   }

   getEvent(name?: string): DynamicFieldEventHandler | undefined {
      return name ? this.events.get(name) : undefined;
   }

   getAction(name?: string): DynamicActionEventHandler | undefined {
      return name ? this.actions.get(name) : undefined;
   }
}
