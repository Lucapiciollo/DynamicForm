/** @format */

import {InjectionToken} from '@angular/core';

export const DYNAMIC_FORM_RUNTIME_CONFIG = new InjectionToken<any>('DYNAMIC_FORM_RUNTIME_CONFIG', {
   providedIn: 'root',
   factory: () => ({
      theme: {
         name: 'modern-dark',
         mode: 'dark',
         applyToBody: true,
         loadMaterialIcons: true,
         injectRuntimeStyles: true,
      },
   }),
});
