/** @format */

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { DynamicFormThemeConfig, DynamicFormThemeCustomTokens, DynamicFormThemeName } from '../models/dynamic-form-theme-config.model';
import { DYNAMIC_FORM_RUNTIME_CONFIG } from '../tokens/dynamic-form-config.token';
import { DynamicFormRuntimeConfig } from '../providers/dynamic-form.providers';

/**
 * Servizio per la gestione del tema visivo del DynamicForm.
 *
 * Applica la classe CSS `df-theme-{nome}` sull'elemento root (body o elemento custom)
 * e inietta CSS custom token per permettere la personalizzazione completa dei colori,
 * tipografia e spaziatura senza modificare i file SCSS della libreria.
 *
 * Temi built-in: `modern-light`, `modern-dark`.
 * È possibile definire temi custom passando un nome arbitrario e i `customTokens`.
 */
@Injectable({ providedIn: 'root' })
export class DynamicFormThemeService {
   private readonly themeClassPrefix = 'df-theme-';

   constructor(
      @Inject(DOCUMENT) private readonly document: Document,
      @Optional() @Inject(DYNAMIC_FORM_RUNTIME_CONFIG) private readonly config: DynamicFormRuntimeConfig | null,
   ) { }

   /**
    * Inizializza il tema applicando nome e custom token dalla configurazione fornita.
    * Viene chiamato automaticamente da `DynamicFormModule` all'avvio.
    */
   init(): void {
      const theme = this.getThemeConfig();
      this.applyTheme(theme.name ?? 'modern-light');

      if (theme.customTokens) {
         this.applyCustomTokens(theme.customTokens);
      }
   }

   /**
    * Applica la classe `df-theme-{themeName}` sull'elemento root rimuovendo
    * le classi di tema precedenti. Imposta anche l'attributo `data-df-theme`
    * e `data-df-theme-mode` per eventuali query CSS.
    *
    * @param themeName - Nome del tema da applicare (es. `'modern-dark'`).
    */
   applyTheme(themeName: DynamicFormThemeName): void {
      const root = this.getThemeRoot();
      const theme = this.getThemeConfig();

      this.removePreviousThemeClasses(root);
      root.classList.add(`${this.themeClassPrefix}${themeName}`);
      root.setAttribute('data-df-theme', themeName);

      if (theme.mode) {
         root.setAttribute('data-df-theme-mode', theme.mode);
      }
   }

   /**
    * Inietta i custom token come CSS custom properties (`--df-*`) sull'elemento root.
    * Permette di sovrascrivere singoli valori del tema senza ridefinire l'intero tema.
    *
    * @param tokens - Oggetto con i token da sovrascrivere (solo le chiavi valorizzate vengono applicate).
    */
   applyCustomTokens(tokens: DynamicFormThemeCustomTokens): void {
      const root = this.getThemeRoot();
      const tokenMap: Record<keyof DynamicFormThemeCustomTokens, string> = {
         primary: '--df-primary',
         primaryContrast: '--df-primary-contrast',
         primarySoft: '--df-primary-soft',
         accent: '--df-accent',
         accentContrast: '--df-accent-contrast',
         success: '--df-success',
         warning: '--df-warning',
         danger: '--df-danger',
         info: '--df-info',
         background: '--df-background',
         surface: '--df-surface',
         surfaceSoft: '--df-surface-soft',
         surfaceAlt: '--df-surface-alt',
         text: '--df-text',
         muted: '--df-muted',
         mutedText: '--df-muted-text',
         border: '--df-border',
         borderStrong: '--df-border-strong',
         radiusSm: '--df-radius-sm',
         radiusMd: '--df-radius-md',
         radiusLg: '--df-radius-lg',
         radiusXl: '--df-radius-xl',
         fieldHeight: '--df-field-height',
         fieldGap: '--df-field-gap',
         fieldPaddingX: '--df-field-padding-x',
         shadowSm: '--df-shadow-sm',
         shadowMd: '--df-shadow-md',
         shadowLg: '--df-shadow-lg',
         transition: '--df-transition',
      };

      Object.entries(tokens).forEach(([key, value]) => {
         if (value === undefined || value === null || value === '') {
            return;
         }

         const cssVar = tokenMap[key as keyof DynamicFormThemeCustomTokens];
         if (cssVar) {
            root.style.setProperty(cssVar, String(value));
         }
      });
   }

   /**
    * Restituisce l'elemento HTML su cui applicare le classi di tema.
    * Priorità: `rootSelector` > `applyToBody` (body) > documentElement.
    */
   getThemeRoot(): HTMLElement {
      const theme = this.getThemeConfig();

      if (theme.rootSelector) {
         const customRoot = this.document.querySelector<HTMLElement>(theme.rootSelector);
         if (customRoot) {
            return customRoot;
         }
      }

      return theme.applyToBody === false ? this.document.documentElement : this.document.body;
   }

   /**
    * Restituisce la configurazione tema effettiva, unendo i default con
    * la configurazione opzionale iniettata via `provideDynamicForm()`.
    */
   getThemeConfig(): DynamicFormThemeConfig {
      return {
         name: 'modern-light',
         mode: 'light',
         applyToBody: true,
         loadMaterialIcons: true,
         injectRuntimeStyles: true,
         ...(this.config?.theme ?? {}),
      };
   }

   /** Rimuove dall'elemento root tutte le classi CSS che iniziano con `df-theme-`. */
   private removePreviousThemeClasses(root: HTMLElement): void {
      Array.from(root.classList)
         .filter(className => className.startsWith(this.themeClassPrefix))
         .forEach(className => root.classList.remove(className));
   }
}
