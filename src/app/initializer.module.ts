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

import { NgModule } from "@angular/core";
import { BROWSER, BROWSER_VALID, CACHE_TAG, DEFAULT_PATH_MOCK, DISABLE_LOG, MAX_CACHE_AGE, PlCoreModule } from "pl-core-utils-library";
import { environment } from "src/environments/environment";




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
    PlCoreModule,
    /**
     * @author l.piciollo
     * inizializzazione di barre progressive, sono in ascolto sia sul cambio di rotta che durante le chiamate di rete
     * le progressioni sono configurabili tramite i file di configurazione
     * è possibile fare riferimento a https://github.com/t-ho/ngx-ui-loader/wiki/Custom-configuration-for-NgxUiLoaderModule
     */


  ],
  providers: [

    /**
    * @author l.piciollo
    * inizializzazione della base url per le chiamate al BE, la configurazione prevede che venga valorizzata la chiave di accesso
    * nel file environment.
    */

    /**
     * @author l.piciollo
     * vengono intercettati tutti gli errori applicativi e rediretti al servizio predisposto alla loro lavorazione,
     * è possibile specializzare il servizio per ogni eventualità di errore.    
     */

    /**
    * @author l.piciollo
    * configurazione per la pl-library, si tratta di settare una configurazione iniziale di tutti i parametri
    * d'inizializzazione dell'applicativo
    */
    { provide: BROWSER_VALID, useValue: [BROWSER.ALL] },  //Abilitati l'esecuzione del portale per il browser indicato
    { provide: DISABLE_LOG, useValue: environment.production }, //vengono disabilitati i log in caso di produzione
    { provide: MAX_CACHE_AGE, useValue: 300000 }, // viene impostato il tempo di validità per la cache di rete
    { provide: CACHE_TAG, useValue: '@cachable@' }, //indica come identificare le api che è possibile mettere in cache
    /**
     * @author l.piciollo
     * specializzazione di un intercettore di rete, per la gestione di request e response centralizzate.
     */

    /**
    * @author l.piciollo
    * viene intercettata la creazione del portale.. 
    * viene identificato il tipo di browwser e vengono adeguate le funzionalita per il tipo di browser. 
    * l'adeguamento riane trasparente all'applicazione, il core ne gestisce le funzionalità
    */


    /**
     * @author l.piciollo
     * viene iniettato il processo di login..
     * il servizio deve ritornare un ok che indica l'avvenuta login, altrimenti il portale non si avvia 
     */

    /**
     * @author l.piciollo
     * impostazione tempo massimo di attesa per richieste al BE
     */

    { provide: DEFAULT_PATH_MOCK, useValue: "public/mock" },

  ],
  exports: [
    // PlCoreModule,


  ]
})
export class InitializerModule {



  static forRoot() {
    return {
      ngModule: InitializerModule,
      providers: [],
      import: []
    }
  }
}
