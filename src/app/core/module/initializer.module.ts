/**
 * @author @l.piciollo
 * @email lucapiciolo@gmail.com
 * @create date 2019-12-21 12:30:36
 * @modify date 2019-12-21 12:30:36
 * @desc [modulo di inizializzazione applicativo.. viene inizializzata tutta la gestione degli errori, degli ambienti, della rete e altro
 *  in questo modulo non bisogna inserire componenti o altro, al difuori del gia presente, è un modulo di avvio applicativo 
 * 
 * ATTENZIONE, NON SI CONSIGLIA LA MODIFICA DI QUESTA CLASSE A CAUSA DI OSSERVATORI ESTERNI CHE NE FANNO USO SPECIFICO.
 * ]
 */
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BROWSER, PlAmbientModeLoaderService, PlCoreModule } from 'pl-core-utils-library';

import AmbientModeProviderFactory from '../initializer/AmbientModeLoader';




import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/it';

registerLocaleData(locale);







/**
 * @author l.piciollo
 * modulo di inizializzazione applicativo.. viene inizializzata tutta la gestione degli errori, degli ambienti, della rete e altro
 * in questo modulo non bisogna inserire componenti o altro, al difuori del gia presente, è un modulo di avvio applicativo
 * 
 * ATTENZIONE, NON SI CONSIGLIA LA MODIFICA DI QUESTA CLASSE A CAUSA DI OSSERVATORI ESTERNI CHE NE FANNO USO SPECIFICO.
 *
 */
@NgModule({
  declarations: [],
  imports: [
    PlCoreModule.forRoot({
      browserValid: [BROWSER.CHROME, BROWSER.EDGE, BROWSER.FIREFOX],
      disableLog: false,
      maxCacheAge: 300000,
      cacheTag: '@cachable@',
      mockPath: 'public/mock',
      enableAlert: true
    }),


  ],
  providers: [


    { provide: APP_INITIALIZER, useFactory: AmbientModeProviderFactory, deps: [PlAmbientModeLoaderService], multi: true },






  ],
  exports: [
    PlCoreModule,


  ]
})
export class InitializerModule {


  constructor() {

  }


  static forRoot() {
    return {
      ngModule: InitializerModule,
      providers: [],
      import: []
    }
  }
}
