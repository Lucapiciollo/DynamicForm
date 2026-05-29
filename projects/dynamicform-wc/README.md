# DynamicForm — Web Component

> `<dynamic-form>` come **Custom Element** (Web Component), utilizzabile in qualsiasi contesto HTML/JS senza dipendenze Angular nel consumer.

---

## Indice

- [Panoramica](#panoramica)
- [Build e distribuzione](#build-e-distribuzione)
  - [Script disponibili](#script-disponibili)
  - [File generati](#file-generati)
- [Integrazione HTML minima](#integrazione-html-minima)
- [Proprietà del Custom Element](#proprietà-del-custom-element)
  - [Input — come impostare la configurazione](#input--come-impostare-la-configurazione)
  - [Output — eventi del Custom Element](#output--eventi-del-custom-element)
- [window.DynamicFormLib](#windowdynamicformlib)
  - [Oggetti esposti](#oggetti-esposti)
  - [Come aspettare che sia disponibile](#come-aspettare-che-sia-disponibile)
- [DynamicFormBuilder — API completa](#dynamicformbuilder--api-completa)
  - [DynamicFormBuilder.create()](#dynamicformbuildercreate)
  - [.addGroup()](#addgroup)
  - [.addForm()](#addform)
  - [.addActions()](#addactions)
  - [.build()](#build)
  - [Chaining e ordine delle chiamate](#chaining-e-ordine-delle-chiamate)
- [FormAction — proprietà di un campo](#formaction--proprietà-di-un-campo)
  - [Proprietà comuni](#proprietà-comuni)
  - [Aspetto e layout (TypeCss)](#aspetto-e-layout-typecss)
  - [Opzioni specifiche per tipo](#opzioni-specifiche-per-tipo)
  - [Combo e Select (COMBO / COMBOPAGINATE)](#combo-e-select-combo--combopaginate)
  - [Dati remoti paginati (COMBOPAGINATE)](#dati-remoti-paginati-combopaginate)
  - [Handler eventi del campo](#handler-eventi-del-campo)
- [DynamicFormActionButton — pulsanti di gruppo](#dynamicformactionbutton--pulsanti-di-gruppo)
- [Firme complete degli handler](#firme-complete-degli-handler)
  - [onChange](#onchange)
  - [onInitialize](#oninitialize)
  - [opened / closed](#opened--closed)
  - [onFocus / onBlur](#onfocus--onblur)
  - [onSearch](#onsearch)
  - [onScrollEnd](#onscrollend)
  - [onClose (DateRange)](#onclose-daterange)
  - [action (pulsante di gruppo)](#action-pulsante-di-gruppo)
- [TYPE_CONTROL_FORM — tipi di campo](#type_control_form--tipi-di-campo)
- [TypeComboOption](#typecombooption)
- [Layout del form](#layout-del-form)
- [Oggetto Utility](#oggetto-utility)
- [Server di supporto (combo remote)](#server-di-supporto-combo-remote)
- [Registro eventi DEMO_WC_EVENTS](#registro-eventi-demo_wc_events)
- [Esempi completi](#esempi-completi)
  - [Esempio 1 — Form base senza Angular](#esempio-1--form-base-senza-angular)
  - [Esempio 2 — Combo paginata con fetch remoto](#esempio-2--combo-paginata-con-fetch-remoto)
  - [Esempio 3 — Layout tabs con condizioni](#esempio-3--layout-tabs-con-condizioni)
  - [Esempio 4 — Ascolto eventi sul form](#esempio-4--ascolto-eventi-sul-form)

---

## Panoramica

Il progetto `dynamicform-wc` compila la libreria Angular DynamicForm come un singolo file JavaScript distribuibile (`dynamicform-wc.js`).  
Il file registra il Custom Element `<dynamic-form>` tramite `@angular/elements` e, al bootstrap, espone su `window.DynamicFormLib` tutte le classi Angular/Forms necessarie per costruire la configurazione del form direttamente in JavaScript puro, senza avere Angular installato nel progetto consumer.

**Caratteristiche chiave:**

- Un singolo `<script>` da includere — nessuna dipendenza npm nel consumer
- API dichiarativa via `DynamicFormBuilder` (fluent builder)
- Supporto ai 20 tipi di campo della libreria (testo, numero, combo, date, file, ecc.)
- Dati remoti paginati con infinite scroll (COMBOPAGINATE)
- Layout `default` / `tabs` / `steps` configurabile a runtime via property JS
- Output events (`onFormCreate`, `onQuestionsCreate`) come Custom Events del DOM
- Handler di campo (`onChange`, `onInitialize`, `opened`, `closed`, ecc.) come funzioni JS inline
- `window.DynamicFormLib` esposto al bootstrap: `DynamicFormBuilder`, `FormControl`, `FormGroup`, `FormArray`, `Validators`, `TYPE_CONTROL_FORM`, `signal`

---

## Build e distribuzione

### Script disponibili

Eseguiti dalla root del workspace (`d:\project\personal\DynamicForm`):

| Comando npm               | Descrizione                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| `npm run build:wc`        | Build produzione → `dist/dynamicform-wc/dynamicform-wc.js` + `.css` |
| `npm run build:wc:dev`    | Build development (sourcemap, no ottimizzazione)                    |
| `npm run demo:wc`         | Avvia http-server porta 8080 (build solo se bundle non esiste)      |
| `npm run demo:wc:rebuild` | Forza rebuild + avvia http-server + apre il browser sulla demo      |

Il build internamente chiama `scripts/build-wc.ps1` che:

1. Esegue `ng build dynamicform-wc --configuration production`
2. Concatena `runtime.js` + `polyfills.js` + `main.js` in un unico `dynamicform-wc.js`
3. Concatena i file CSS in `dynamicform-wc.css`

### File generati

```
dist/
  dynamicform-wc/
    dynamicform-wc.js    ← bundle unico (~1.8 MB non minificato, ~320 kB gzip)
    dynamicform-wc.css   ← stili del bundle (vuoto se nessuno stile globale)
```

---

## Integrazione HTML minima

```html
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="utf-8" />

    <!-- Material Icons (richiesto dalla libreria) -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

    <!-- Angular Material prebuilt theme (richiesto dalla libreria) -->
    <link rel="stylesheet" href="path/to/@angular/material/prebuilt-themes/indigo-pink.css" />

    <!-- Bootstrap grid (opzionale, usato per le classi col-*) -->
    <link rel="stylesheet" href="path/to/bootstrap/dist/css/bootstrap.min.css" />

    <!-- Bundle WC — DEVE essere caricato con defer o alla fine del body -->
    <link rel="stylesheet" href="path/to/dist/dynamicform-wc/dynamicform-wc.css" />
    <script src="path/to/dist/dynamicform-wc/dynamicform-wc.js" defer></script>
  </head>
  <body>
    <dynamic-form id="myForm"></dynamic-form>

    <script>
      customElements.whenDefined('dynamic-form').then(() => {
        const { DynamicFormBuilder, FormControl, Validators, TYPE_CONTROL_FORM } = window.DynamicFormLib;

        const el = document.getElementById('myForm');

        el.config = DynamicFormBuilder.create()
          .addGroup('Dati', ['col-12'])
          .addForm({
            formName: 'nome',
            title: 'Nome',
            type: TYPE_CONTROL_FORM.TEXT,
            formControl: new FormControl(null, Validators.required),
            css: { class: ['col-md-6'] },
          })
          .addActions([
            {
              label: 'Salva',
              visible: true,
              cssClassButton: ['btn-primary'],
              action: (_q, _id, _fg, _g, _ig, _ag, totalForm) => {
                console.log('Valori:', totalForm.getRawValue());
              },
            },
          ])
          .build();
      });
    </script>
  </body>
</html>
```

> **Importante:** il `<script>` del WC deve essere caricato con `defer` (oppure posizionato prima di `</body>`) per garantire che il DOM sia disponibile prima dell'esecuzione. `customElements.whenDefined('dynamic-form')` è il punto di ingresso sicuro: risolve quando Angular ha completato il bootstrap e `window.DynamicFormLib` è già popolato.

---

## Proprietà del Custom Element

Le proprietà si impostano **via JavaScript** direttamente sull'elemento DOM (non come attributi HTML, perché i valori sono oggetti complessi):

```js
const el = document.getElementById('myForm');
el.config = configForm; // ConfigForm (array di Group)
el.layout = 'tabs'; // 'default' | 'tabs' | 'steps'
el.stepperOrientation = 'vertical'; // 'horizontal' | 'vertical' (solo layout=steps)
```

### Input — come impostare la configurazione

| Proprietà JS            | Tipo                       | Descrizione                                                                  |
| ----------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| `el.config`             | `ConfigForm` (array)       | Configurazione costruita con `DynamicFormBuilder`. **Modalità principale.**  |
| `el.questions`          | `ConfigForm` (array)       | Alias di `el.config` — retrocompatibilità                                    |
| `el.json`               | `DynamicFormJsonSchema`    | Schema JSON puro (oggetto serializzabile, senza funzioni)                    |
| `el.layout`             | `'default'│'tabs'│'steps'` | Modalità di visualizzazione dei gruppi. Default: `'default'`                 |
| `el.stepperOrientation` | `'horizontal'│'vertical'`  | Orientamento stepper (solo quando `layout='steps'`). Default: `'horizontal'` |

**Differenza tra `config` e `json`:**

- `el.config` accetta una `ConfigForm` (array di `Group`) costruita con il builder. Può contenere **funzioni** (handler, `remoteData`, `FormControl` Angular). È la modalità consigliata quando il WC è usato da JavaScript.
- `el.json` accetta un `DynamicFormJsonSchema` (JSON serializzabile). I riferimenti a funzioni (remoteData, eventi) sono **stringhe** che vengono risolte nel registro `DEMO_WC_EVENTS` del bundle. Adatto per schemi provenienti dal server.

### Output — eventi del Custom Element

Gli output Angular Elements vengono emessi come **Custom Events** sull'elemento DOM. Si ascoltano con `addEventListener`:

```js
const el = document.getElementById('myForm');

// Emesso dopo che Angular ha costruito il FormGroup interno
// e.detail = FormGroup | FormArray dell'intero form
el.addEventListener('onFormCreate', e => {
  const formGroup = e.detail;
  console.log('Valori iniziali:', formGroup.value);
  console.log('Valore raw (include disabled):', formGroup.getRawValue());
  console.log('Form valido:', formGroup.valid);
});

// Emesso dopo che la struttura ConfigForm interna è stata costruita
// e.detail = ConfigForm (array di Group con i FormAction risolti)
el.addEventListener('onQuestionsCreate', e => {
  const groups = e.detail; // Array<Group>
  console.log('Numero di gruppi:', groups.length);
});
```

| Evento DOM          | `e.detail`                      | Quando viene emesso                                                               |
| ------------------- | ------------------------------- | --------------------------------------------------------------------------------- |
| `onFormCreate`      | `FormGroup \| FormArray`        | Angular ha costruito il FormGroup. Da qui in poi `formGroup.value` è accessibile. |
| `onQuestionsCreate` | `ConfigForm` (array di `Group`) | La struttura ConfigForm interna è pronta (subito prima di `onFormCreate`).        |

---

## window.DynamicFormLib

Al termine del bootstrap Angular (cioè quando `customElements.whenDefined('dynamic-form')` si risolve), il modulo WC inietta su `window.DynamicFormLib` tutte le classi necessarie per costruire la configurazione del form in JavaScript puro.

### Oggetti esposti

```js
const lib = window.DynamicFormLib;
```

| Chiave               | Tipo / Origine                     | Descrizione                                                                                                                |
| -------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `DynamicFormBuilder` | Classe (`dynamic-form.builder.ts`) | Builder fluente per creare `ConfigForm`. Vedere [sezione dedicata](#dynamicformbuilder--api-completa).                     |
| `FormControl`        | `@angular/forms`                   | Crea un controllo di form reattivo con valore iniziale e validatori.                                                       |
| `FormGroup`          | `@angular/forms`                   | Crea un gruppo di controlli (usato per campi tipo GROUP / annidati).                                                       |
| `FormArray`          | `@angular/forms`                   | Crea un array di controlli (usato per campi tipo ARRAYSTRING e simili).                                                    |
| `Validators`         | `@angular/forms`                   | Oggetto con i validatori built-in: `required`, `email`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `requiredTrue`. |
| `TYPE_CONTROL_FORM`  | Enum (`dynamic-form.interface.ts`) | Enumerazione numerica di tutti i tipi di campo supportati.                                                                 |
| `signal`             | `@angular/core`                    | Funzione Angular Signal per creare un `WritableSignal<T>` (usato per `options` delle combo).                               |

### Come aspettare che sia disponibile

```js
// Metodo 1 — customElements.whenDefined (consigliato)
customElements.whenDefined('dynamic-form').then(() => {
  const { DynamicFormBuilder, FormControl, TYPE_CONTROL_FORM } = window.DynamicFormLib;
  // window.DynamicFormLib è garantito disponibile qui
});

// Metodo 2 — se il CE è già registrato (es. in un listener tardivo)
if (customElements.get('dynamic-form')) {
  const { DynamicFormBuilder } = window.DynamicFormLib;
  // ...
} else {
  customElements.whenDefined('dynamic-form').then(/* ... */);
}
```

---

## DynamicFormBuilder — API completa

`DynamicFormBuilder` è un **builder fluente** che costruisce la struttura `ConfigForm` (array di `Group`) in modo tipizzato e validato.

### DynamicFormBuilder.create()

```js
// Senza contesto (uso da HTML/JS puro)
const builder = DynamicFormBuilder.create();

// Con contesto tipizzato (uso da Angular Component TypeScript)
// Il tipo TCtx viene inferito automaticamente
const builder = DynamicFormBuilder.create(this);
// I callback (.addGroup, .addForm, .addActions) accettano factory (ctx) => valore
// dove ctx è il Component Angular tipizzato
```

`create()` è un metodo statico. Non accetta parametri obbligatori. Il parametro opzionale `context` serve solo negli ambienti TypeScript/Angular per avere i callback delle factory tipizzati.

### .addGroup()

```js
builder.addGroup(title, classList?, id?)
```

| Parametro   | Tipo                        | Obbligatorio | Descrizione                                                                                                                |
| ----------- | --------------------------- | :----------: | -------------------------------------------------------------------------------------------------------------------------- |
| `title`     | `string \| (ctx) => string` |      ✅      | Titolo della sezione visualizzato nell'intestazione del gruppo. Può essere una factory function quando si usa il contesto. |
| `classList` | `string[]`                  |      ❌      | Classi CSS applicate al contenitore del gruppo (es. `['col-12']`, `['col-md-8', 'offset-md-2']`).                          |
| `id`        | `string`                    |      ❌      | ID univoco del gruppo. Se omesso viene generato automaticamente (UUID v4).                                                 |

`addGroup` rende il nuovo gruppo **attivo**: le successive chiamate `.addForm()` e `.addActions()` aggiungono elementi a questo gruppo. Richiamare `addGroup` di nuovo chiude il gruppo precedente e ne apre uno nuovo.

```js
DynamicFormBuilder.create()
  .addGroup('Sezione 1', ['col-12'])          // gruppo 0 attivo
    .addForm({ formName: 'nome', ... })        // → gruppo 0
    .addForm({ formName: 'cognome', ... })     // → gruppo 0
  .addGroup('Sezione 2', ['col-md-6'])        // gruppo 1 attivo
    .addForm({ formName: 'email', ... })       // → gruppo 1
  .build();
```

### .addForm()

```js
builder.addForm(formAction);
```

| Parametro    | Tipo                                | Obbligatorio | Descrizione                                                                                                                 |
| ------------ | ----------------------------------- | :----------: | --------------------------------------------------------------------------------------------------------------------------- |
| `formAction` | `FormAction \| (ctx) => FormAction` |      ✅      | Configurazione del singolo campo. Vedere [FormAction](#formaction--proprietà-di-un-campo). Può essere una factory function. |

Lancia `Error` se chiamata prima di `addGroup`.  
Ogni campo viene internamente wrappato in `{ formAction: ... }` e aggiunto a `group.formGroup[]`.  
Se `formAction.id` è assente, viene assegnato un UUID v4.

### .addActions()

```js
builder.addActions(actions);
```

| Parametro | Tipo                                                              | Obbligatorio | Descrizione                                                                                                                                       |
| --------- | ----------------------------------------------------------------- | :----------: | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `actions` | `DynamicFormActionButton[] \| (ctx) => DynamicFormActionButton[]` |      ✅      | Array di pulsanti da renderizzare nella footer del gruppo attivo. Vedere [DynamicFormActionButton](#dynamicformactionbutton--pulsanti-di-gruppo). |

Lancia `Error` se chiamata prima di `addGroup`.  
Sovrascrive interamente `group.actions` — non fa append. Chiamare più volte sostituisce i pulsanti precedenti.

### .build()

```js
const config = builder.build(); // → ConfigForm (Array<Group>)
```

Restituisce la `ConfigForm` pronta. Lancia `Error` se:

- Non è stato chiamato nessun `addGroup`
- Qualsiasi gruppo non contiene almeno un campo (`addForm` mai chiamato su quel gruppo)

Il risultato va passato direttamente a `el.config`:

```js
el.config = DynamicFormBuilder.create()
  /* ... */
  .build();
```

### Chaining e ordine delle chiamate

```
create()
  └─ addGroup(titolo, classi?)          ← OBBLIGATORIO prima di addForm/addActions
       ├─ addForm(campo1)               ← zero o più
       ├─ addForm(campo2)
       ├─ addActions([btn1, btn2])      ← zero o uno per gruppo
  └─ addGroup(titolo2)                  ← nuovo gruppo
       ├─ addForm(campo3)
  └─ build()                            ← OBBLIGATORIO alla fine
```

---

## FormAction — proprietà di un campo

`FormAction` è l'oggetto di configurazione di un singolo campo. Viene passato a `.addForm()`.

### Proprietà comuni

| Proprietà       | Tipo                                    | Obbligatorio | Descrizione                                                                                        |
| --------------- | --------------------------------------- | :----------: | -------------------------------------------------------------------------------------------------- |
| `formName`      | `string`                                |      ✅      | Chiave del campo nel `FormGroup`. Deve essere univoca nel gruppo.                                  |
| `type`          | `TYPE_CONTROL_FORM`                     |      ✅      | Tipo di componente da renderizzare. Vedere [TYPE_CONTROL_FORM](#type_control_form--tipi-di-campo). |
| `formControl`   | `FormControl \| FormGroup \| FormArray` |  ✅ (quasi)  | Istanza Angular del controllo. Contiene valore iniziale, validatori, stato.                        |
| `title`         | `string`                                |      ❌      | Label visibile sopra il campo.                                                                     |
| `placeholder`   | `string`                                |      ❌      | Placeholder del campo (dove applicabile).                                                          |
| `hint`          | `string`                                |      ❌      | Testo di aiuto visualizzato sotto il campo.                                                        |
| `tipContent`    | `string`                                |      ❌      | Tooltip informativo (icona `?` affiancata al label).                                               |
| `disabled`      | `boolean`                               |      ❌      | Disabilita il campo. Alternativa a `formControl.disable()`.                                        |
| `readonly`      | `boolean`                               |      ❌      | Campo in sola lettura (visualizzato ma non modificabile).                                          |
| `hidden`        | `boolean`                               |      ❌      | Nasconde il campo (rimane nel FormGroup ma non è renderizzato).                                    |
| `id`            | `string`                                |      ❌      | UUID del campo. Assegnato automaticamente se omesso.                                               |
| `props`         | `Record<string, any>`                   |      ❌      | Mappa di proprietà custom aggiuntive (non standard). Accessibile negli handler.                    |
| `resetButton`   | `boolean`                               |      ❌      | Mostra un pulsante di reset inline nel campo (X per svuotare).                                     |
| `disableSpeech` | `boolean`                               |      ❌      | Disabilita il riconoscimento vocale (per campi `TEXT`).                                            |

### Aspetto e layout (TypeCss)

```js
css: {
  class?: string[];          // Classi Bootstrap/CSS sul wrapper del campo (es. ['col-md-6'])
  iconCss?: string | string[]; // Icona Material prefissa al campo
  classRadio?: string[];     // Classi extra per i radio button (RADIOGROUP)
  hide?: boolean;            // Nasconde il campo (equivalente a hidden:true)
  font?: { color?: string }; // Colore testo personalizzato
  rows?: number;             // Numero di righe visibili (TEXTAREA)
  toggleIcons?: [string, string]; // [iconaStato0, iconaStato1] per SORTACTION
}
```

### Opzioni specifiche per tipo

**NUMBER:**

```js
optionNumber: {
  min?: number;   // Valore minimo
  max?: number;   // Valore massimo
  step?: number;  // Incremento dei controlli +/-
}
```

**DATE / DATA:**

```js
optionDate: {
  min?: string;  // Data minima ISO (es. '2020-01-01')
  max?: string;  // Data massima ISO (es. new Date().toISOString())
  onClose?: (value: any, formGroup: FormGroup) => void; // Callback alla chiusura del picker
}
```

**TIME:**

```js
optionTime: {
  min?: string;  // Orario minimo (es. '08:00')
  max?: string;  // Orario massimo (es. '18:00')
}
```

**TEXT (input testuale):**

```js
optionInputText: {
  maxlength?: number;  // Lunghezza massima
  password?: boolean;  // Maschera il testo (toggle visibilità)
}
```

**CURRENCY:**

```js
currency: string; // Codice valuta ISO 4217 (es. 'EUR', 'USD')
```

**FILE:**

```js
accept: string; // MIME types accettati (es. 'image/*', '.pdf,.docx')
```

**RATING:**

```js
optionRating: {
  max?: number;  // Numero massimo di stelle (default: 5)
}
```

**LINK:**

```js
href: string; // URL del link
target: string; // Target del link (es. '_blank', '_self')
```

### Combo e Select (COMBO / COMBOPAGINATE)

```js
// Opzioni statiche (segnale Angular WritableSignal o array diretto)
options: signal([
  { id: 'M',  description: 'Maschio' },
  { id: 'F',  description: 'Femmina' },
  { id: 'NS', description: 'Non specificato' },
]),

// Opzioni statiche disabilitate (non selezionabili ma visibili)
optionsDisabled: signal([{ id: 'X', description: 'Non disponibile' }]),

// Opzioni fisse sempre visibili in cima (es. voci speciali con tag)
initialOptions: [{ id: 0, description: 'Tutti', tag: { bgTag: '#eee', bgText: '#333', name: 'default' } }],

// Chiavi di mappatura ID e descrizione
keyCombo: {
  keyId: 'id',           // Proprietà dell'oggetto usata come valore
  keyDescription: 'description', // Proprietà mostrata nel dropdown
  keySearch: 'description',      // Proprietà su cui filtrare la ricerca (default: keyDescription)
},

// Selezione multipla
multiple: boolean,

// Autocomplete (abilita la ricerca testuale nel dropdown)
autocomplete: boolean,
```

**TypeComboOption — struttura di ogni opzione:**

```js
{
  id: any;           // Valore salvato nel FormControl alla selezione
  description: string; // Testo visualizzato nell'elenco e nel campo selezionato

  img?: string;      // URL immagine affiancata alla voce nell'elenco
  extra?: any;       // Dati extra passati agli handler ma non salvati nel FormControl
  disabled?: boolean; // Opzione non selezionabile (grigiata)
  default?: boolean; // Selezionata automaticamente all'inizializzazione
  hide?: boolean;    // Nascosta dalla lista ma mantenuta nella struttura
  selected?: boolean; // Marcata come selezionata (selezione multipla)

  tag?: {
    bgTag: string;   // Background color del badge (es. '#e0f2fe')
    bgText: string;  // Colore testo del badge (es. '#0369a1')
    name: string;    // Testo del badge
  };
}
```

### Dati remoti paginati (COMBOPAGINATE)

Il tipo `COMBOPAGINATE` supporta caricamento lazy con infinite scroll. La funzione `remoteData` viene invocata automaticamente all'apertura del dropdown, allo scroll verso il fondo e alla digitazione nel campo di ricerca.

```js
{
  formName: 'prodotto',
  type: TYPE_CONTROL_FORM.COMBOPAGINATE,
  formControl: new FormControl(null),

  // Configurazione paginazione iniziale
  paging: {
    count: 10,       // Elementi per pagina (page size)
    page: 1,         // Pagina iniziale (1-based o 0-based secondo il server)
    totalCount: 0,   // Totale elementi (aggiornato dalla risposta del server)
  },

  // Chiavi di mappatura (come per COMBO)
  keyCombo: { keyId: 'id', keyDescription: 'description' },

  // Parametri aggiuntivi passati al loader (es. filtri fissi)
  paramsForRemoteData: signal({ categoria: 'elettronica', attivo: true }),

  // Funzione di caricamento remoto
  // ctx.param     = { page, count, search, ...paramsForRemoteData }
  // Deve restituire { items: Array<TypeComboOption>, totalCount: number }
  remoteData: (ctx) => {
    const { page, count, search } = ctx.param ?? {};
    const url = new URL('https://api.example.com/prodotti');
    url.searchParams.set('page',     String(page ?? 1));
    url.searchParams.set('pageSize', String(count ?? 10));
    if (search) url.searchParams.set('q', search);

    return fetch(url.toString())
      .then(r => r.json())
      .then(res => ({ items: res.data, totalCount: res.total }))
      .catch(() => ({ items: [], totalCount: 0 }));
  },
}
```

**Struttura di `ctx.param` in `remoteData`:**

| Proprietà | Tipo     | Descrizione                                                        |
| --------- | -------- | ------------------------------------------------------------------ |
| `page`    | `number` | Pagina richiesta (valore di `paging.page` incrementato dal CE)     |
| `count`   | `number` | Elementi per pagina (valore di `paging.count`)                     |
| `search`  | `string` | Testo digitato dall'utente nel campo di ricerca del dropdown       |
| `...`     | `any`    | Tutte le proprietà del segnale `paramsForRemoteData` (se definito) |

**Risposta attesa da `remoteData`:**

```js
{
  items: TypeComboOption[],  // Elementi della pagina corrente
  totalCount: number,        // Totale elementi (per sapere se caricare altra pagina)
}
```

### Handler eventi del campo

Tutti gli handler sono funzioni JavaScript dirette (non stringhe). Vengono chiamati dal CE durante il ciclo di vita del campo.

```js
{
  formName: 'nome',
  type: TYPE_CONTROL_FORM.TEXT,
  formControl: new FormControl(null),

  // Chiamato ogni volta che il valore del campo cambia
  onChange: (idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility) => {
    console.log(`${formName} cambiato:`, formControl.value, '← era:', prevValue);
  },

  // Chiamato una volta sola all'inizializzazione del campo
  onInitialize: (idGroup, idForm, formControl, formName, formGroup, type, allGroup, paging, onOptionSetted, utility) => {
    console.log(`${formName} inizializzato`);
  },

  // Solo per COMBO / COMBOPAGINATE / DATE / DATETIME / TIME / YEAR
  opened: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
    console.log(`${formName} aperto`);
  },
  closed: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {
    console.log(`${formName} chiuso`);
  },

  // Solo per TEXT / NUMBER / CURRENCY / TEXTAREA / EMAIL / TIME
  onFocus: (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {},
  onBlur:  (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) => {},

  // Solo per COMBO con autocomplete / COMBOPAGINATE
  onSearch: (idGroup, idForm, formControl, formName, formGroup, search, utility) => {
    console.log('Testo cercato:', search);
  },

  // Solo per COMBOPAGINATE — chiamato allo scroll verso il fondo
  onScrollEnd: (idGroup, idForm, formControl, formName, formGroup, paging, utility) => {
    console.log('Scroll fine, paging:', paging);
  },

  // Solo per DATARANGE — chiamato alla chiusura del date range picker
  onClose: (value, formControl, utility) => {
    console.log('Range selezionato:', value.from, '→', value.to);
  },

  // Azione inline del campo (es. pulsante custom associato al campo)
  action: (formControl) => {
    console.log('Azione campo, valore corrente:', formControl.value);
  },
}
```

---

## DynamicFormActionButton — pulsanti di gruppo

I pulsanti vengono renderizzati nella footer del gruppo. Si passano tramite `.addActions([...])`.

```js
{
  label?: string;              // Testo visibile sul pulsante
  name?: string;               // Nome identificativo (usato da utility.getActionByName)
  icon?: string;               // Nome icona Material Icons (es. 'save', 'refresh')

  cssClassButton?: string[];   // Classi CSS sul pulsante (es. ['btn-primary', 'col-4'])
  cssClassIcon?: string[];     // Classi CSS sull'icona

  disabled?: boolean;          // Pulsante disabilitato
  visible?: boolean;           // Pulsante visibile (default: true se presente)

  // Callback chiamato al click del pulsante
  // Riceve l'intero stato del form al momento del click
  action: (
    questions,   // Array<Form>   — campi del gruppo corrente
    idForm,      // string|number — ID del gruppo
    formGroup,   // FormGroup|FormArray — form group del solo gruppo
    group,       // Group         — oggetto Group corrente
    idGroup,     // number        — indice del gruppo nell'array
    allGroup,    // ConfigForm    — intera struttura del form
    totalForm,   // FormGroup|FormArray — FormGroup dell'intero form (tutti i gruppi)
    utility,     // Utility       — helper functions
  ) => void
}
```

**Esempio pulsante Salva che legge tutti i valori:**

```js
{
  label: 'Salva',
  icon: 'save',
  visible: true,
  cssClassButton: ['btn-primary'],
  action: (_q, _id, _fg, _g, _ig, _ag, totalForm) => {
    // totalForm è il FormGroup dell'INTERO form (tutti i gruppi)
    if (totalForm.valid) {
      const data = totalForm.getRawValue(); // include anche i campi disabled
      console.log('Dati da inviare:', data);
    } else {
      console.warn('Form non valido:', totalForm.errors);
    }
  },
}
```

**Esempio pulsante Reset:**

```js
{
  label: 'Reset',
  icon: 'restart_alt',
  visible: true,
  cssClassButton: ['btn-secondary'],
  action: (_q, _id, _fg, _g, _ig, _ag, totalForm) => {
    totalForm.reset();
  },
}
```

---

## Firme complete degli handler

### onChange

```ts
(
  idGroup:     number,                            // Indice del gruppo (0-based)
  idForm:      number,                            // Indice del campo nel gruppo (0-based)
  formControl: FormControl | FormArray | FormGroup, // Controllo Angular del campo
  formName:    string,                            // Nome del campo (formName)
  formGroup:   Array<Form>,                       // Tutti i campi del gruppo corrente
  type:        TYPE_CONTROL_FORM,                 // Tipo del campo
  prevValue:   any,                               // Valore precedente (prima del change)
  allGroup:    ConfigForm,                        // Intera struttura del form
  utility:     Utility,                           // Helper functions
) => void | Promise<void>
```

### onInitialize

```ts
(
  idGroup:       number,
  idForm:        number,
  formControl:   FormControl | FormArray | FormGroup,
  formName:      string,
  formGroup:     Array<Form>,
  type:          TYPE_CONTROL_FORM,
  allGroup:      ConfigForm,
  paging?:       { count: number; page: number; totalCount?: number } | null,
  onOptionSetted?: Signal<Array<any>> | null,  // Signal che si aggiorna quando le opzioni vengono settate
  utility?:      Utility,
) => void | Promise<void>
```

### opened / closed

```ts
(
  idGroup:     number,
  idForm:      number,
  formControl: FormControl | FormArray | FormGroup,
  formName:    string,
  formGroup:   Array<Form>,
  allGroup:    ConfigForm,
  utility:     Utility,
) => void | Promise<void>
```

### onFocus / onBlur

Stessa firma di `opened / closed`.

### onSearch

```ts
(
  idGroup:     number,
  idForm:      number,
  formControl: FormControl | FormArray | FormGroup,
  formName:    string,
  formGroup:   Array<Form>,
  search:      string,   // Testo digitato
  utility:     Utility,
) => void | Promise<void>
```

### onScrollEnd

```ts
(
  idGroup:     number,
  idForm:      number,
  formControl: FormControl | FormArray | FormGroup,
  formName:    string,
  formGroup:   Array<Form>,
  paging:      { count: number; page: number; totalCount?: number },
  utility:     Utility,
) => void | Promise<void>
```

### onClose (DateRange)

```ts
(
  value: any,                                          // Oggetto { from: Date|null, to: Date|null }
  formControl: FormGroup<{                             // FormGroup del date range
    from: FormControl<Date | null>;
    to:   FormControl<Date | null>;
  }>,
  utility: Utility,
) => void | Promise<void>
```

### action (pulsante di gruppo)

```ts
(
  questions: Array<Form>,                              // Campi del gruppo
  idForm:    string | number,                          // ID del gruppo
  formGroup: FormGroup | FormArray,                    // FormGroup/Array del gruppo
  group?:    Group,                                    // Oggetto Group corrente
  idGroup?:  number,                                   // Indice del gruppo
  allGroup?: ConfigForm,                               // Intera struttura del form
  totalForm?: FormGroup | FormArray,                   // FormGroup dell'intero form
  utility?:  Utility,                                  // Helper functions
) => void
```

---

## TYPE_CONTROL_FORM — tipi di campo

L'enum `TYPE_CONTROL_FORM` è disponibile su `window.DynamicFormLib.TYPE_CONTROL_FORM`.  
Ogni valore corrisponde a un componente Angular della libreria.

| Costante enum   | Valore numerico | Componente                     | Note                                                                   |
| --------------- | :-------------: | ------------------------------ | ---------------------------------------------------------------------- |
| `ARRAYSTRING`   |        0        | `ArrayStringComponent`         | Input chip: accumula un array di stringhe (premi Enter per aggiungere) |
| `COMBOPAGINATE` |        1        | `ComboComponent` (paginata)    | Select con scroll infinito e ricerca. Richiede `remoteData`            |
| `BUTTON`        |        2        | Pulsante inline                | Pulsante custom associato al campo (usa `action`)                      |
| `DATETIME`      |        3        | `DateTimeComponent`            | Data + orario combinati                                                |
| `ACTIONREPORT`  |        4        | `ActionReportComponent`        | Pulsante report/azione speciale                                        |
| `RADIOGROUP`    |        5        | `QuestionRadioButtonComponent` | Gruppo di radio button orizzontale/verticale                           |
| `TEXT`          |        6        | `InputTextComponent`           | Input testo. Supporta `password`, `maxlength`, speech recognition      |
| `TEXTAREA`      |        7        | `TextareaComponent`            | Area di testo multiriga. `css.rows` controlla l'altezza                |
| `CHECKBOX`      |        8        | `CheckboxComponent`            | Checkbox singolo. `formControl` di tipo `boolean`                      |
| `FILE`          |        9        | `FileComponent`                | Upload file. `accept` filtra i tipi. Supporta camera scan              |
| `CURRENCY`      |       10        | `CurrencyComponent`            | Input valuta con formattazione. Richiede `currency` (es. `'EUR'`)      |
| `NUMBER`        |       11        | `NumberComponent`              | Input numerico con min/max/step e controlli +/-                        |
| `COMBO`         |       12        | `ComboComponent`               | Select con ricerca testuale. Richiede `options` (Signal o array)       |
| `DATA`          |       13        | `DateComponent`                | Date picker Angular Material. Alias: `DATE`                            |
| `DATARANGE`     |       14        | `DateRangeComponent`           | Selezione intervallo date (from / to)                                  |
| `TIME`          |       15        | `InputTimeComponent`           | Selezione orario con min/max                                           |
| `GROUP`         |       16        | —                              | Contenitore per form annidati. Usa `formGroup: ConfigForm`             |
| `SORTACTION`    |       17        | `SortActionComponent`          | Pulsante toggle ordinamento ASC/DESC                                   |
| `YEAR`          |       18        | `DateYearComponent`            | Selezione anno (picker solo anno)                                      |
| `RATING`        |       19        | `RatingComponent`              | Valutazione a stelle. `optionRating.max` controlla il numero           |

---

## Layout del form

Il layout controlla come vengono visualizzati i **gruppi** (non i campi singoli).

| Valore      | Comportamento                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------- |
| `'default'` | Tutti i gruppi impilati verticalmente nella stessa pagina (scroll classico)                         |
| `'tabs'`    | Ogni gruppo in un tab Angular Material (`mat-tab-group`). Tab navigabile con click.                 |
| `'steps'`   | Ogni gruppo in uno step Angular Material Stepper (`mat-stepper`). Navigazione sequenziale o libera. |

```js
el.layout = 'steps';
el.stepperOrientation = 'vertical'; // 'horizontal' (default) | 'vertical'
```

In modalità `tabs` e `steps` il componente mostra automaticamente un **indicatore di errori** sul tab/step se il gruppo contiene campi non validi (validators non soddisfatti e campo touched).

---

## Oggetto Utility

`utility` è un helper iniettato in tutti gli handler (`onChange`, `onInitialize`, `action`, ecc.). Fornisce accesso programmatico ai campi e alle azioni del form.

```js
// Accede a un FormAction per nome e permette di modificarlo
utility.getFormByName('nomeCampo', (formAction, form) => {
  formAction.disabled = true;
  // formAction è l'oggetto FormAction live del campo
  // form è l'oggetto Form = { formAction }
});

// Accede a un DynamicFormActionButton per nome (richiede name sulla action)
utility.getActionByName('nomeAzione', action => {
  action.disabled = true;
});

// Imposta opzioni di default su una combo (COMBO o COMBOPAGINATE)
// Il callback deve restituire l'array di opzioni o { items, totalCount }
utility.setDefaultOptions('nomeCombo', () => [
  { id: 1, description: 'Prima opzione' },
  { id: 2, description: 'Seconda opzione' },
]);

// Legge le opzioni attualmente selezionate su una combo multipla
utility.getSelectedOptions('nomeCombo', signal => {
  console.log('Opzioni selezionate:', signal());
});

// Si registra per essere notificato quando le opzioni vengono impostate
utility.onSettedOptions('nomeCombo', signal => {
  console.log('Opzioni appena impostate:', signal());
});

// Signal reattivo con statistiche di compilazione del form
const stats = utility.formCompletion(); // Signal<FormCompletionStats>
console.log('Completamento:', stats.percentage, '%');
console.log('Campi obbligatori compilati:', stats.required.filled, '/', stats.required.total);
```

---

## Server di supporto (combo remote)

La demo del WC utilizza un server Node.js (`server/server.js`) sulla porta `3000` per servire i dati delle combo paginate.

**Avvio:**

```bash
node server/server.js
```

**Endpoint disponibili:**

| Endpoint                        | Query params                 | Risposta                          |
| ------------------------------- | ---------------------------- | --------------------------------- |
| `GET /api/livello-attivita`     | `page`, `pageSize`, `search` | `{ items: [...], totalCount: N }` |
| `GET /api/tipo-attivita-fisica` | `page`, `pageSize`, `search` | `{ items: [...], totalCount: N }` |
| `GET /api/freq-allenamento`     | `page`, `pageSize`, `search` | `{ items: [...], totalCount: N }` |

Ogni `items[]` contiene oggetti `{ id: number, description: string }`, compatibili con `keyCombo: { keyId: 'id', keyDescription: 'description' }`.

---

## Registro eventi DEMO_WC_EVENTS

Il file `projects/dynamicform-wc/src/app/wc-demo-events.ts` definisce `DEMO_WC_EVENTS: DynamicFormRuntimeConfig`, che viene registrato in `DynamicFormModule.forRoot()` nel bootstrap del WC.

Questo registro serve per **risolvere i nomi stringa** quando si usa la modalità `el.json` (JSON Schema). Quando si usa `el.config` (builder), i riferimenti a funzione sono inline e il registro non è necessario.

**Handler `events` registrati:**

| Chiave stringa           | Tipo           | Comportamento                                                              |
| ------------------------ | -------------- | -------------------------------------------------------------------------- |
| `loadLivelloAttivita`    | `remoteData`   | Fetch `GET /api/livello-attivita?page=&pageSize=&search=`                  |
| `loadTipoAttivitaFisica` | `remoteData`   | Fetch `GET /api/tipo-attivita-fisica?page=&pageSize=&search=`              |
| `loadFreqAllenamento`    | `remoteData`   | Fetch `GET /api/freq-allenamento?page=&pageSize=&search=`                  |
| `onFieldChange`          | `onChange`     | Spara `window CustomEvent 'dfChange'` con `{ formName, value, prevValue }` |
| `onFieldInit`            | `onInitialize` | Spara `window CustomEvent 'dfInit'` con `{ formName, type }`               |

**Handler `actions` registrati:**

| Chiave stringa | Tipo     | Comportamento                                                 |
| -------------- | -------- | ------------------------------------------------------------- |
| `onSalva`      | `action` | Spara `window CustomEvent 'dfAction'` con `{ type: 'salva' }` |
| `onReset`      | `action` | Spara `window CustomEvent 'dfAction'` con `{ type: 'reset' }` |

**Uso da JSON Schema (`el.json`):**

```json
{
  "groups": [
    {
      "title": "Dati",
      "fields": [
        {
          "name": "livello",
          "type": "COMBOPAGINATE",
          "label": "Livello attività",
          "remoteData": "loadLivelloAttivita",
          "paging": { "count": 5, "page": 1 },
          "keyCombo": { "keyId": "id", "keyDescription": "description" },
          "events": { "change": "onFieldChange", "initialize": "onFieldInit" }
        }
      ],
      "actions": [{ "label": "Salva", "event": "onSalva", "visible": true }]
    }
  ]
}
```

---

## Esempi completi

### Esempio 1 — Form base senza Angular

Form con tre campi di testo, una checkbox e un pulsante Salva. Nessuna dipendenza Angular nel consumer.

```html
<!DOCTYPE html>
<html lang="it">
  <head>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    <link rel="stylesheet" href="dist/dynamicform-wc/dynamicform-wc.css" />
    <script src="dist/dynamicform-wc/dynamicform-wc.js" defer></script>
  </head>
  <body>
    <dynamic-form id="form1"></dynamic-form>

    <script>
      customElements.whenDefined('dynamic-form').then(() => {
        const { DynamicFormBuilder, FormControl, Validators, TYPE_CONTROL_FORM } = window.DynamicFormLib;
        const el = document.getElementById('form1');

        // Cattura il FormGroup dopo la creazione
        let fg = null;
        el.addEventListener('onFormCreate', e => {
          fg = e.detail;
        });

        el.config = DynamicFormBuilder.create()
          .addGroup('Registrazione', ['col-12'])
          .addForm({
            formName: 'nome',
            title: 'Nome *',
            type: TYPE_CONTROL_FORM.TEXT,
            formControl: new FormControl(null, Validators.required),
            css: { class: ['col-md-4'] },
          })
          .addForm({
            formName: 'cognome',
            title: 'Cognome *',
            type: TYPE_CONTROL_FORM.TEXT,
            formControl: new FormControl(null, Validators.required),
            css: { class: ['col-md-4'] },
          })
          .addForm({
            formName: 'email',
            title: 'Email *',
            type: TYPE_CONTROL_FORM.TEXT,
            formControl: new FormControl(null, [Validators.required, Validators.email]),
            css: { class: ['col-md-4'] },
          })
          .addForm({
            formName: 'privacy',
            title: 'Accetto la Privacy Policy',
            type: TYPE_CONTROL_FORM.CHECKBOX,
            formControl: new FormControl(false, Validators.requiredTrue),
            css: { class: ['col-12'] },
          })
          .addActions([
            {
              label: 'Invia',
              icon: 'send',
              visible: true,
              cssClassButton: ['mat-raised-button', 'mat-primary'],
              action: (_q, _id, _fg, _g, _ig, _ag, totalForm) => {
                if (totalForm.valid) {
                  alert('Dati: ' + JSON.stringify(totalForm.getRawValue(), null, 2));
                } else {
                  alert('Compila tutti i campi obbligatori');
                }
              },
            },
          ])
          .build();
      });
    </script>
  </body>
</html>
```

---

### Esempio 2 — Combo paginata con fetch remoto

```html
<dynamic-form id="form2"></dynamic-form>

<script>
  customElements.whenDefined('dynamic-form').then(() => {
    const { DynamicFormBuilder, FormControl, Validators, TYPE_CONTROL_FORM } = window.DynamicFormLib;

    const API = 'http://localhost:3000';

    // Helper per costruire la funzione remoteData
    function remoteLoader(endpoint) {
      return ctx => {
        const p = ctx.param ?? {};
        const url = new URL(API + endpoint);
        if (p.page != null) url.searchParams.set('page', String(p.page));
        if (p.count != null) url.searchParams.set('pageSize', String(p.count));
        if (p.search) url.searchParams.set('search', String(p.search));
        return fetch(url.toString())
          .then(r => r.json())
          .catch(() => ({ items: [], totalCount: 0 }));
      };
    }

    document.getElementById('form2').config = DynamicFormBuilder.create()
      .addGroup('Attività', ['col-12'])
      .addForm({
        formName: 'livello',
        title: 'Livello di attività *',
        type: TYPE_CONTROL_FORM.COMBOPAGINATE,
        formControl: new FormControl(null, Validators.required),
        css: { class: ['col-md-6'] },
        remoteData: remoteLoader('/api/livello-attivita'),
        paging: { count: 5, page: 1 },
        keyCombo: { keyId: 'id', keyDescription: 'description' },
      })
      .addForm({
        formName: 'tipo',
        title: 'Tipo di attività',
        type: TYPE_CONTROL_FORM.COMBOPAGINATE,
        formControl: new FormControl(null),
        css: { class: ['col-md-6'] },
        remoteData: remoteLoader('/api/tipo-attivita-fisica'),
        paging: { count: 5, page: 1 },
        keyCombo: { keyId: 'id', keyDescription: 'description' },
      })
      .addActions([
        {
          label: 'Salva',
          visible: true,
          cssClassButton: ['mat-raised-button', 'mat-primary'],
          action: (_q, _id, _fg, _g, _ig, _ag, totalForm) => {
            console.log('Valori:', totalForm.getRawValue());
          },
        },
      ])
      .build();
  });
</script>
```

---

### Esempio 3 — Layout tabs con condizioni

```js
customElements.whenDefined('dynamic-form').then(() => {
  const { DynamicFormBuilder, FormControl, Validators, TYPE_CONTROL_FORM, signal } = window.DynamicFormLib;
  const el = document.getElementById('form3');

  el.layout = 'tabs'; // Ogni addGroup diventa un tab

  el.config = DynamicFormBuilder.create()

    .addGroup('Dati personali', ['col-12'])
    .addForm({
      formName: 'nome',
      title: 'Nome',
      type: TYPE_CONTROL_FORM.TEXT,
      formControl: new FormControl(null, Validators.required),
      css: { class: ['col-md-6'] },
    })
    .addForm({
      formName: 'sesso',
      title: 'Sesso',
      type: TYPE_CONTROL_FORM.COMBO,
      formControl: new FormControl(null),
      css: { class: ['col-md-6'] },
      options: signal([
        { id: 'M', description: 'Maschio' },
        { id: 'F', description: 'Femmina' },
        { id: 'A', description: 'Altro' },
      ]),
      keyCombo: { keyId: 'id', keyDescription: 'description' },
    })
    .addForm({
      formName: 'altroSesso',
      title: 'Specifica sesso',
      type: TYPE_CONTROL_FORM.TEXT,
      formControl: new FormControl(null),
      css: { class: ['col-md-6'] },
      hidden: false,
      // Questo campo viene mostrato solo se sesso === 'A'
      // visibleWhen funziona solo in modalità el.json
      // in modalità el.config usa onChange sul campo 'sesso' per mostrare/nascondere
    })

    .addGroup('Contatti', ['col-12'])
    .addForm({
      formName: 'email',
      title: 'Email',
      type: TYPE_CONTROL_FORM.TEXT,
      formControl: new FormControl(null, [Validators.required, Validators.email]),
      css: { class: ['col-12'] },
    })
    .addActions([
      {
        label: 'Conferma',
        visible: true,
        action: (_q, _id, _fg, _g, _ig, _ag, totalForm) => {
          console.log('Tutti i dati:', totalForm.getRawValue());
        },
      },
    ])

    .build();
});
```

---

### Esempio 4 — Ascolto eventi sul form

Pattern completo per intercettare tutti gli eventi del CE e gli handler di campo:

```js
customElements.whenDefined('dynamic-form').then(() => {
  const { DynamicFormBuilder, FormControl, Validators, TYPE_CONTROL_FORM } = window.DynamicFormLib;
  const el = document.getElementById('form4');

  let formGroup = null;

  // ── Output events del Custom Element ────────────────────────────────────
  el.addEventListener('onFormCreate', e => {
    formGroup = e.detail; // FormGroup Angular dell'intero form
    console.log('Form pronto. Valore iniziale:', formGroup.value);
    console.log('Form valido:', formGroup.valid);
  });

  el.addEventListener('onQuestionsCreate', e => {
    console.log('Struttura:', e.detail.length, 'gruppi');
  });

  // ── Custom Events sparati dagli handler inline ───────────────────────────
  window.addEventListener('dfChange', e => {
    const { formName, value, prevValue } = e.detail;
    console.log(`Campo "${formName}" cambiato:`, prevValue, '→', value);
  });

  window.addEventListener('dfInit', e => {
    console.log(`Campo "${e.detail.formName}" inizializzato`);
  });

  window.addEventListener('dfAction', e => {
    const { type, value } = e.detail;
    if (type === 'salva') {
      console.log('SALVA cliccato. Dati:', value);
      // qui: POST verso API, validazione, navigazione, ecc.
    } else if (type === 'reset') {
      console.log('RESET eseguito');
    }
  });

  // ── Configurazione ───────────────────────────────────────────────────────
  el.config = DynamicFormBuilder.create()
    .addGroup('Demo eventi', ['col-12'])
    .addForm({
      formName: 'campo1',
      title: 'Campo con onChange',
      type: TYPE_CONTROL_FORM.TEXT,
      formControl: new FormControl(null),
      css: { class: ['col-md-6'] },
      onChange: (_ig, _if, fc, formName, _fg, _type, prevValue) => {
        // Inviato su window come CustomEvent 'dfChange'
        window.dispatchEvent(
          new CustomEvent('dfChange', {
            detail: { formName, value: fc?.value, prevValue },
          }),
        );
      },
      onInitialize: (_ig, _if, _fc, formName) => {
        window.dispatchEvent(new CustomEvent('dfInit', { detail: { formName } }));
      },
    })
    .addActions([
      {
        label: 'Salva',
        visible: true,
        action: (_q, _id, _fg, _g, _ig, _ag, totalForm) => {
          window.dispatchEvent(
            new CustomEvent('dfAction', {
              detail: { type: 'salva', value: totalForm?.getRawValue() },
            }),
          );
        },
      },
      {
        label: 'Reset',
        visible: true,
        action: (_q, _id, _fg, _g, _ig, _ag, totalForm) => {
          totalForm?.reset();
          window.dispatchEvent(
            new CustomEvent('dfAction', {
              detail: { type: 'reset' },
            }),
          );
        },
      },
    ])
    .build();

  // ── Lettura programmatica del valore ─────────────────────────────────────
  function leggiValori() {
    if (!formGroup) return null;
    return formGroup.getRawValue(); // include anche i campi disabled
  }

  // ── Reset programmatico ──────────────────────────────────────────────────
  function resetForm() {
    formGroup?.reset();
  }
});
```

---

_Libreria sviluppata da [Luca Piciollo](mailto:lucapiciollo@gmail.com)_
