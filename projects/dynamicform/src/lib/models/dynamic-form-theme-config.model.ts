/** @format */

export type DynamicFormThemeName = 'modern-light' | 'modern-dark' | string;
export type DynamicFormThemeMode = 'light' | 'dark' | 'auto';

export interface DynamicFormThemeCustomTokens {
   primary?: string;
   primaryContrast?: string;
   primarySoft?: string;
   accent?: string;
   accentContrast?: string;
   success?: string;
   warning?: string;
   danger?: string;
   info?: string;

   background?: string;
   surface?: string;
   surfaceSoft?: string;
   surfaceAlt?: string;
   text?: string;
   muted?: string;
   mutedText?: string;
   border?: string;
   borderStrong?: string;

   radiusSm?: string;
   radiusMd?: string;
   radiusLg?: string;
   radiusXl?: string;

   fieldHeight?: string;
   fieldGap?: string;
   fieldPaddingX?: string;

   shadowSm?: string;
   shadowMd?: string;
   shadowLg?: string;
   transition?: string;
}

export interface DynamicFormThemeConfig {
   /** Nome tema. La classe applicata sarà df-theme-${name}. */
   name?: DynamicFormThemeName;

   /** Light/dark/auto, utile anche per attributi o override futuri. */
   mode?: DynamicFormThemeMode;

   /** true = classe tema su body; false = documentElement; rootSelector ha priorità. */
   applyToBody?: boolean;

   /** Selector custom dove applicare tema, es. '.my-form-shell'. */
   rootSelector?: string;

   /** Token runtime che sovrascrivono il tema base. */
   customTokens?: DynamicFormThemeCustomTokens;

   /** Caricamento automatico font Material Icons/Symbols. Default true. */
   loadMaterialIcons?: boolean;

   /** Iniezione CSS globale runtime per overlay Material/CDK. Default true. */
   injectRuntimeStyles?: boolean;
}
