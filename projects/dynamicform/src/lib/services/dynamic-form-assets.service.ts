/** @format */

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { DYNAMIC_FORM_RUNTIME_CONFIG } from '../tokens/dynamic-form-config.token';
import { DynamicFormRuntimeConfig } from '../providers/dynamic-form.providers';

/**
 * Carica gli asset globali necessari al DynamicForm senza obbligare l'app host
 * ad aggiungere link/font/stili nel proprio index.html o styles.scss.
 *
 * Nota: gli overlay Material/CDK vivono fuori dal componente, quindi alcuni stili
 * devono essere globali. Li iniettiamo una sola volta nel document head.
 */
@Injectable({ providedIn: 'root' })
export class DynamicFormAssetsService {
  private readonly materialIconsId = 'df-material-icons-font';
  private readonly materialSymbolsId = 'df-material-symbols-font';
  private readonly globalStylesId = 'df-global-runtime-styles';
  private readonly materialSymbolsUrl =
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,300..500,0..1,-50..200';

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional() @Inject(DYNAMIC_FORM_RUNTIME_CONFIG) private readonly config: DynamicFormRuntimeConfig | null,
  ) { }

  /**
   * Carica gli asset di default: font Material Icons/Symbols e stili globali runtime.
   * Può essere disabilitato selettivamente tramite `theme.loadMaterialIcons` e
   * `theme.injectRuntimeStyles` nella configurazione.
   */
  loadDefaultAssets(): void {
    const theme = this.config?.theme ?? {};

    if (theme.loadMaterialIcons !== false) {
      this.appendStylesheet(
        this.materialIconsId,
        'https://fonts.googleapis.com/icon?family=Material+Icons',
      );

      // this.appendStylesheet(
      //   this.materialSymbolsId,
      //   'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
      // );
      this.appendStylesheet(
        this.materialSymbolsId,
        this.materialSymbolsUrl,
      );
    }

    if (theme.injectRuntimeStyles !== false) {
      this.appendGlobalStyles();
    }
  }

  /**
   * Aggiunge un elemento `<link rel="stylesheet">` nell'`<head>` del documento.
   * Utilizza l'`id` come guard per evitare inserimenti duplicati.
   *
   * @param id - Identificatore univoco del tag link (usato come attributo `id`).
   * @param href - URL del foglio di stile da caricare.
   */
  private appendStylesheet(id: string, href: string): void {
    if (this.document.getElementById(id)) {
      return;
    }

    const link = this.document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    this.document.head.appendChild(link);
  }

  /**
   * Inietta un blocco `<style>` con i CSS custom property di default del tema
   * e gli stili globali per gli overlay Material/CDK (mat-select, mat-datepicker, ecc.).
   * Gli overlay CDK vivono fuori dall'incapsulamento dei componenti e richiedono
   * stili globali per essere tematizzati correttamente.
   */
  private appendGlobalStyles(): void {
    if (this.document.getElementById(this.globalStylesId)) {
      return;
    }

    const style = this.document.createElement('style');
    style.id = this.globalStylesId;
    style.textContent = `
/* DynamicForm runtime global styles. Injected once by DynamicFormModule. */
:root,
.df-theme-modern-light {
  --df-primary: #2563eb;
  --df-primary-contrast: #ffffff;
  --df-primary-soft: #eff6ff;
  --df-accent: #06b6d4;
  --df-accent-contrast: #ffffff;
  --df-success: #16a34a;
  --df-warning: #f59e0b;
  --df-danger: #dc2626;
  --df-info: #0284c7;
  --df-background: #f8fafc;
  --df-surface: #ffffff;
  --df-surface-soft: #f8fafc;
  --df-surface-alt: #f1f5f9;
  --df-text: #0f172a;
  --df-muted: #64748b;
  --df-muted-text: #64748b;
  --df-border: #dbe3ef;
  --df-border-strong: #b6c3d5;
  --df-radius-sm: 10px;
  --df-radius-md: 14px;
  --df-radius-lg: 18px;
  --df-radius-xl: 24px;
  --df-field-height: 48px;
  --df-field-gap: 16px;
  --df-field-padding-x: 14px;
  --df-shadow-sm: 0 8px 22px rgba(15, 23, 42, 0.08);
  --df-shadow-md: 0 20px 45px rgba(15, 23, 42, 0.16);
  --df-shadow-lg: 0 26px 70px rgba(15, 23, 42, 0.22);
  --df-transition: 180ms ease;
}

.df-theme-modern-dark {
  --df-primary: #60a5fa;
  --df-primary-contrast: #020617;
  --df-primary-soft: rgba(96, 165, 250, 0.16);
  --df-accent: #22d3ee;
  --df-accent-contrast: #020617;
  --df-success: #22c55e;
  --df-warning: #fbbf24;
  --df-danger: #f87171;
  --df-info: #38bdf8;
  --df-background: #020617;
  --df-surface: #0f172a;
  --df-surface-soft: #111827;
  --df-surface-alt: #1e293b;
  --df-text: #e5e7eb;
  --df-muted: #94a3b8;
  --df-muted-text: #94a3b8;
  --df-border: #334155;
  --df-border-strong: #475569;
  --df-shadow-sm: 0 8px 22px rgba(0, 0, 0, 0.28);
  --df-shadow-md: 0 20px 45px rgba(0, 0, 0, 0.42);
  --df-shadow-lg: 0 26px 70px rgba(0, 0, 0, 0.52);
}

body.df-theme-modern-light,
body.df-theme-modern-dark {
  background: var(--df-background);
  color: var(--df-text);
}

app-dynamic-form,
.df-form,
.df-section-main,
.df-card,
.df-sub-card {
  color: var(--df-text);
}

.df-section-main {
  background: var(--df-surface);
  border: 1px solid var(--df-border);
  border-radius: var(--df-radius-xl);
  box-shadow: var(--df-shadow-sm);
  padding: 18px;
  margin-bottom: 18px;
}

.df-card {
  background: var(--df-surface);
  border: 1px solid var(--df-border);
  border-radius: var(--df-radius-lg);
  box-shadow: var(--df-shadow-sm);
  padding: 16px;
  margin-bottom: 16px;
}

.df-sub-card {
  background: var(--df-surface-alt);
  border: 1px dashed var(--df-border-strong);
  border-radius: var(--df-radius-md);
  padding: 14px;
  margin-top: 10px;
}

/* Material icons loaded automatically by the dynamic form module. */
.mat-icon,
.material-icons,
.mat-ligature-font {
  font-family: 'Material Icons' !important;
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  font-feature-settings: 'liga';
}

.material-symbols-outlined,
.df-symbol-icon {
  font-family: 'Material Symbols Outlined' !important;
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.icon-mat,
.df-icon-mat,
.iconCss {
  width: 1.35rem;
  height: 1.35rem;
  min-width: 1.35rem;
  min-height: 1.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.icon-mat.primary,
.df-icon-mat.primary { color: var(--df-primary); }
.icon-mat.muted,
.df-icon-mat.muted { color: var(--df-muted); }
.icon-mat.danger,
.df-icon-mat.danger { color: var(--df-danger); }

.mat-mdc-form-field { width: 100%; }
.mat-mdc-text-field-wrapper { border-radius: var(--df-radius-md) !important; }

.cdk-overlay-pane .mat-mdc-select-panel,
.cdk-overlay-pane .mat-mdc-autocomplete-panel {
  background: var(--df-surface) !important;
  color: var(--df-text) !important;
  border-radius: var(--df-radius-lg) !important;
  box-shadow: var(--df-shadow-md) !important;
  padding: 4px !important;
}

.cdk-overlay-pane .mat-mdc-option {
  color: var(--df-text) !important;
  min-height: 44px !important;
  border-radius: var(--df-radius-sm) !important;
  margin: 2px 0 !important;
}

.cdk-overlay-pane .mat-mdc-option:hover:not(.mdc-list-item--disabled),
.cdk-overlay-pane .mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled) {
  background: var(--df-primary-soft) !important;
}

.cdk-overlay-pane .search-container {
  position: sticky;
  top: 0;
  z-index: 3;
  min-height: 48px;
  background: var(--df-surface);
  display: flex;
  align-items: center;
  border-radius: var(--df-radius-md);
  border: 1px solid var(--df-border);
  margin: 4px 4px 8px;
  overflow: hidden;
  box-shadow: var(--df-shadow-sm);
}

.cdk-overlay-pane .search-container input {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--df-text);
  min-height: 44px;
  padding-right: 12px;
}

.cdk-overlay-pane .search-icon {
  position: absolute;
  left: 12px;
  color: var(--df-muted);
  z-index: 1;
}

.cdk-overlay-pane .mat-datepicker-content,
.cdk-overlay-pane .mat-timepicker-panel {
  background: var(--df-surface) !important;
  color: var(--df-text) !important;
  border-radius: var(--df-radius-lg) !important;
  box-shadow: var(--df-shadow-md) !important;
}

.cdk-overlay-pane .mat-mdc-select-panel::-webkit-scrollbar,
.cdk-overlay-pane .mat-mdc-autocomplete-panel::-webkit-scrollbar { width: 10px; }
.cdk-overlay-pane .mat-mdc-select-panel::-webkit-scrollbar-thumb,
.cdk-overlay-pane .mat-mdc-autocomplete-panel::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--df-border-strong);
  border: 3px solid var(--df-surface);
}
`;
    this.document.head.appendChild(style);
  }
}
