/**
 * @author @l.piciollo
 * @email lucapiciolo@gmail.com
 * @create date 2019-12-22 14:44:48
 * @modify date 2019-12-22 14:56:10
 * @desc [vengono inserite tutte le variabili d'ambiente ed eventuali puntamenti al BE o link vari. questo file deve essere
 * popolato con i dati relativi all'ambiente di sviluppo]
 */

export const environment = {
  production: false,
  /**
   * @author l.piciollo
   * URL base del BE Node.js (NutriCare API server)
   * Avviare il server con: npm run server:start
   */
  baseUrlRemoteApi: 'http://localhost:3000',

  http: {
    /**
     * @author l.piciollo
     * inserire qui le chiamate al BE, è possibile effettuare delle sotto categorie 
     */
    api: {
      /**
       *  @author l.piciollo
       *  si riporta un esempio di una api riconosciuta come storable, grazie al tag @cachable@ presente nella URL.
       *  si nota come i parametri sono passati con {0} e {1}.. il sistema è equipagiato da una funzionalita che specializza
       *  le stringhe ad avere il format function.. quindi .. è possibile formattare la url richimandola in questo modo:
       *  E.S. 
       *    let url = environment.exampleApi.format("P1","P2")
       *    quindi avviene una formattazione per posizione dei paraetri..
       *  
       *  exampleApi: `@cachable@/example/cacable/api?param1={0}&param2={1}`
       */
      exampleApi: `@cachable@/example/cache/api?param1={0}&param2={1}`,
      exampleApeNoCache: `example/no/cache/api?param1={0}&param2={1}`,

      /** Route combo — popolano i campi select del form nutrizionista via NgRx */
      combo: {
        livelloAttivita: 'api/livello-attivita',
        tipoAttivitaFisica: 'api/tipo-attivita-fisica',
        freqAllenamento: 'api/freq-allenamento',
      },
      /**
       *  @author l.piciollo
       *  è possibile dichiarare una chiamata ad un mock, si consiglia di rispettare il seguente formato dichiarativo
       *  E.S. 
       *    mock:{
       *            url: "/example/no/cache/api/122?param1={0}&param2={1}" ,
       *            mock: true
       *    }  
       *    il mock a true, impone al sistema di risalire alla folder assets/public/mock/example/no/cache/api/122 e prelevare il 
       *    json relativo al metodo utilizzato.. quindi post||get||put||delete||patch .json
       *  
       */
      mock: {
        url: "/example/:api/:files",
        mocked: true,
        method: "GET"
      }
    }
  }
};

