/** @format */

import { Inject, Injectable, Optional } from '@angular/core';
import { DynamicActionEventHandler, DynamicFieldEventHandler } from '../models/dynamic-form-event.model';
import { DynamicFormRuntimeConfig } from '../providers/dynamic-form.providers';
import { DYNAMIC_FORM_RUNTIME_CONFIG } from '../tokens/dynamic-form-config.token';

/**
 * Registro centralizzato degli handler di eventi e azioni del DynamicForm.
 *
 * Mantiene due Map interne:
 * - `events` — handler per i campi (onChange, onInitialize, remoteData, ecc.)
 * - `actions` — handler per i pulsanti di azione dei gruppi
 *
 * Gli handler vengono registrati all'avvio tramite `provideDynamicForm()` e possono
 * essere aggiunti dinamicamente via `registerEvents` / `registerActions`.
 * Il mapping tra nome (stringa) e handler permette di referenziare le funzioni
 * per nome all'interno degli schemi JSON.
 */
@Injectable({ providedIn: 'root' })
export class DynamicFormEventRegistryService {
   private readonly events = new Map<string, DynamicFieldEventHandler>();
   private readonly actions = new Map<string, DynamicActionEventHandler>();

   constructor(@Optional() @Inject(DYNAMIC_FORM_RUNTIME_CONFIG) config?: DynamicFormRuntimeConfig) {
      if (config?.events) this.registerEvents(config.events);
      if (config?.actions) this.registerActions(config.actions);
   }

   /**
    * Registra un insieme di handler per i campi.
    * @param events - Mappa `{ nomeHandler: fn }` da aggiungere al registro.
    */
   registerEvents(events: Record<string, DynamicFieldEventHandler>): void {
      Object.entries(events || {}).forEach(([name, handler]) => this.events.set(name, handler));
   }

   /**
    * Registra un insieme di handler per i pulsanti di azione.
    * @param actions - Mappa `{ nomeHandler: fn }` da aggiungere al registro.
    */
   registerActions(actions: Record<string, DynamicActionEventHandler>): void {
      Object.entries(actions || {}).forEach(([name, handler]) => this.actions.set(name, handler));
   }

   /**
    * Restituisce l'handler di campo associato al nome dato, o `undefined` se assente.
    * @param name - Chiave usata nella configurazione del campo (es. `events.change`).
    */
   getEvent(name?: string): DynamicFieldEventHandler | undefined {
      return name ? this.events.get(name) : undefined;
   }

   /**
    * Restituisce l'handler di azione associato al nome dato, o `undefined` se assente.
    * @param name - Chiave usata nella configurazione dell'azione (es. `action.event`).
    */
   getAction(name?: string): DynamicActionEventHandler | undefined {
      return name ? this.actions.get(name) : undefined;
   }
}
