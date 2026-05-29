# DynamicForm

> Libreria Angular per la creazione dichiarativa di form reattivi complessi.  
> Niente template HTML manuali — descrivi il form in TypeScript, la libreria fa il resto.

---

## Indice

1. [Panoramica](#panoramica)
2. [Installazione e setup](#installazione-e-setup)
3. [Concetti fondamentali](#concetti-fondamentali)
4. [DynamicFormBuilder — API fluente](#dynamicformbuilder--api-fluente)
5. [Contesto tipizzato](#contesto-tipizzato)
6. [Catalogo componenti](#catalogo-componenti)
   - [TEXT](#text)
   - [TEXTAREA](#textarea)
   - [NUMBER](#number)
   - [CURRENCY](#currency)
   - [CHECKBOX](#checkbox)
   - [RADIOGROUP](#radiogroup)
   - [COMBO](#combo)
   - [COMBOPAGINATE](#combopaginate)
   - [ARRAYSTRING](#arraystring)
   - [DATA](#data)
   - [DATARANGE](#datarange)
   - [DATETIME](#datetime)
   - [TIME](#time)
   - [YEAR](#year)
   - [RATING](#rating)
   - [FILE](#file)
   - [BUTTON](#button)
   - [GROUP](#group)
7. [Parametri comuni (FormActionBase)](#parametri-comuni-formactionbase)
8. [Sistema di eventi](#sistema-di-eventi)
9. [Oggetto Utility](#oggetto-utility)
10. [formCompletion — statistiche di completamento](#formcompletion--statistiche-di-completamento)
11. [Combo statiche con tag e initialOptions](#combo-statiche-con-tag-e-initialoptions)
12. [Combo paginata remota — guida completa](#combo-paginata-remota--guida-completa)
13. [Rating — guida completa](#rating--guida-completa)
14. [Azioni (DynamicFormActionButton)](#azioni-dynamicformactionbutton)
15. [Utilizzo nel template](#utilizzo-nel-template)
16. [Esempio completo reale](#esempio-completo-reale)
17. [Riferimento tipi TypeScript](#riferimento-tipi-typescript)

---

## Panoramica

DynamicForm elimina la duplicazione nella scrittura di form Angular. Invece di un template HTML per ogni form, si descrive la struttura con oggetti TypeScript; la libreria genera automaticamente tutti i controlli, la validazione, gli eventi e il layout.

**Funzionalità principali:**

| Funzionalità             | Descrizione                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 18 tipi di campo         | TEXT, NUMBER, CURRENCY, COMBO, COMBOPAGINATE, DATA, DATARANGE, DATETIME, TIME, YEAR, RATING, CHECKBOX, RADIOGROUP, TEXTAREA, FILE, ARRAYSTRING, BUTTON, GROUP |
| Builder fluente generico | `DynamicFormBuilder.create(this)` inferisce il tipo del componente                                                                                            |
| Contesto tipizzato       | factory `(ctx: TCtx) => FormAction` con autocompletamento pieno                                                                                               |
| Tutti gli eventi         | `onChange`, `onInitialize`, `onFocus`, `onBlur`, `opened`, `closed`, `onSearch`, `onScrollEnd`                                                                |
| Utility globale          | `getFormByName`, `getActionByName`, `setDefaultOptions`, `getSelectedOptions`, `formCompletion`                                                               |
| Combo remote paginate    | infinite scroll, Signal-based, ricerca debounced                                                                                                              |
| initialOptions + tag     | opzioni fisse in cima alla lista con badge SVG colorati                                                                                                       |
| formCompletion Signal    | percentuale di completamento reattiva (totale + required)                                                                                                     |
| Stato disabled corretto  | `new FormControl({ value, disabled: true })` per bloccare interazioni                                                                                         |

---

## Installazione e setup

```bash
npm install dynamicform
npm install @angular/material @angular/cdk @angular/forms moment @angular/material-moment-adapter
```

### NgModule

```ts
import { DynamicFormModule } from 'dynamicform';

@NgModule({ imports: [DynamicFormModule] })
export class AppModule {}
```

### Standalone

```ts
import { DynamicFormModule } from 'dynamicform';

@Component({ standalone: true, imports: [DynamicFormModule] })
export class MyComponent {}
```

---

## Concetti fondamentali

```
ConfigForm = Array<Group>
  └── Group            { id, title, class, formGroup[], actions[] }
        └── Form       { formAction: FormAction }
              └── FormAction  { formName, type, formControl, eventi, opzioni, ... }
```

- **`ConfigForm`** — array di gruppi, è ciò che si passa al componente template
- **`Group`** — sezione visiva del form con titolo, classi CSS e bottoni in fondo
- **`Form`** — wrapper `{ formAction }` di un singolo campo
- **`FormAction`** — configurazione completa di un campo: tipo, `FormControl`, eventi, opzioni, validazioni, stile

---

## DynamicFormBuilder — API fluente

### Metodi

| Metodo        | Firma                                         | Descrizione                                    |
| ------------- | --------------------------------------------- | ---------------------------------------------- |
| `create()`    | `DynamicFormBuilder.create()`                 | Builder senza contesto                         |
| `create(ctx)` | `DynamicFormBuilder.create(this)`             | Builder con contesto tipizzato (tipo inferito) |
| `addGroup`    | `(title, classList?, id?) => this`            | Apre un nuovo gruppo                           |
| `addForm`     | `(formAction \| (ctx) => formAction) => this` | Aggiunge un campo al gruppo corrente           |
| `addActions`  | `(actions[] \| (ctx) => actions[]) => this`   | Aggiunge bottoni al gruppo corrente            |
| `build`       | `() => ConfigForm`                            | Restituisce la configurazione finale           |

### Regola base

`addGroup` deve sempre precedere `addForm`. Il builder lancia un errore esplicito altrimenti.

```ts
const config = DynamicFormBuilder.create()
  .addGroup('Dati personali', ['col-6'])  // apre gruppo
  .addForm({ formName: 'nome', ... })     // campo nel gruppo
  .addForm({ formName: 'email', ... })    // altro campo
  .addActions([{ label: 'Salva', ... }])  // bottoni del gruppo
  .addGroup('Note', ['col-12'])           // nuovo gruppo
  .addForm({ formName: 'note', ... })
  .build();
```

---

## Contesto tipizzato

Il generico `TCtx` di `DynamicFormBuilder<TCtx>` viene inferito automaticamente dal valore passato a `create()`. Quando presente, `addForm`, `addGroup` e `addActions` accettano una **factory function** `(ctx: TCtx) => valore` che riceve il componente tipizzato.

### Come si usa

```ts
// my.component.ts
@Component({ ... })
export class MyComponent {
  userName = 'Mario';
  myService = inject(MyService);

  config = DynamicFormBuilder.create(this)           // TCtx = MyComponent
    .addGroup(ctx => `Ciao ${ctx.userName}`)         // factory per il titolo
    .addForm(ctx => ({                               // factory per il campo
      formName: 'preferenza',
      type: TYPE_CONTROL_FORM.COMBO,
      formControl: new FormControl(null),
      options: ctx.myService.getOptions(),           // servizio del componente
      onChange: () => ctx.onPreferenzaChange(),      // metodo del componente
    }))
    .addActions(ctx => [{
      label: 'Salva',
      visible: true,
      action: () => ctx.save(),                      // metodo del componente
    }])
    .build();
}
```

### Pattern consigliato: builder esterno

Per form complessi è preferibile estrarre il builder in un file separato:

```ts
// form.builder.ts
export function buildMyForm<T extends MyComponent>(context: T): ConfigForm {
  return DynamicFormBuilder.create(context)
    .addGroup('Sezione')
    .addForm(ctx => ({
      formName: 'nome',
      type: TYPE_CONTROL_FORM.TEXT,
      formControl: new FormControl(''),
      onChange: () => ctx.onNomeChange(), // ctx tipizzato come MyComponent
    }))
    .build();
}

// my.component.ts
export class MyComponent {
  config = buildMyForm(this);
  onNomeChange() {
    /* ... */
  }
}
```

### Accesso all'injector dal contesto

Quando si usa `effect()` o `inject()` dentro `onInitialize`, passare l'injector dal contesto:

```ts
.addForm(ctx => ({
  formName: 'rating_automatico',
  type: TYPE_CONTROL_FORM.RATING,
  formControl: new FormControl({ value: null, disabled: true }),
  optionRating: { max: 10 },
  onInitialize: (_ig, _if, fc, _fn, _fg, _t, _all, _p, _o, utility) => {
    effect(() => {
      const stats = utility?.formCompletion?.();
      fc.setValue(Math.round((stats?.percentage ?? 0) / 10));
    }, { injector: ctx['injector'], allowSignalWrites: true });
  },
}))
```

---

## Catalogo componenti

### TEXT

Input testo a riga singola. Supporta modalità password e lunghezza massima.

```ts
{
  formName: 'nome',
  title: 'Nome completo',
  type: TYPE_CONTROL_FORM.TEXT,
  formControl: new FormControl('', Validators.required),
  placeholder: 'Es. Mario Rossi',
  optionInputText: {
    maxlength: 100,
    password: false,   // true per mascherare il testo
  },
  resetButton: true,   // mostra X per svuotare
  autocomplete: false,
}
```

---

### TEXTAREA

Area di testo multi-riga.

```ts
{
  formName: 'descrizione',
  title: 'Descrizione',
  type: TYPE_CONTROL_FORM.TEXTAREA,
  formControl: new FormControl(''),
  rows: 5,             // altezza in righe (default: 3)
  placeholder: 'Inserisci una descrizione...',
}
```

---

### NUMBER

Campo numerico con vincoli min/max/step. Mostra frecce su/giù.

```ts
{
  formName: 'eta',
  title: 'Età',
  type: TYPE_CONTROL_FORM.NUMBER,
  formControl: new FormControl(null, [Validators.min(0), Validators.max(120)]),
  optionNumber: {
    min: 0,
    max: 120,
    step: 1,
  },
}
```

---

### CURRENCY

Come NUMBER ma formattato come valuta. Gestisce separatori decimali e migliaia.

```ts
{
  formName: 'stipendio',
  title: 'Stipendio mensile',
  type: TYPE_CONTROL_FORM.CURRENCY,
  formControl: new FormControl(null),
  currency: 'EUR',            // simbolo usato nell'input (EUR, USD, £, ...)
  optionNumber: { min: 0 },
}
```

---

### CHECKBOX

Casella di spunta booleana. Il FormControl contiene `true` o `false`.

```ts
{
  formName: 'accetta_termini',
  title: 'Accetto i termini e condizioni',
  type: TYPE_CONTROL_FORM.CHECKBOX,
  formControl: new FormControl(false, Validators.requiredTrue),
}
```

---

### RADIOGROUP

Gruppo di opzioni mutuamente esclusive. Le opzioni sono fornite come Signal.

```ts
{
  formName: 'genere',
  title: 'Genere',
  type: TYPE_CONTROL_FORM.RADIOGROUP,
  formControl: new FormControl(null, Validators.required),
  options: signal([
    { id: 'M', description: 'Maschio' },
    { id: 'F', description: 'Femmina' },
    { id: 'A', description: 'Preferisco non specificare' },
    { id: 'X', description: 'Altro', disabled: true },   // opzione non selezionabile
  ]),
}
```

---

### COMBO

Select con lista di opzioni. Supporta singola selezione, selezione multipla e ricerca inline.

```ts
import { signal } from '@angular/core';

const categorieOptions = signal([
  { id: 1, description: 'Sport', tag: { bgTag: 'tag-blue', bgText: 'tag-text-blue', name: 'A' } },
  { id: 2, description: 'Nutrizione' },
  { id: 3, description: 'Benessere', disabled: true },
]);

// Singola selezione
{
  formName: 'categoria',
  title: 'Categoria',
  type: TYPE_CONTROL_FORM.COMBO,
  formControl: new FormControl(null, Validators.required),
  options: categorieOptions,
  multiple: false,
  resetButton: true,
  keyCombo: {
    keyId: 'id',                  // campo usato come valore del FormControl
    keyDescription: 'description', // campo mostrato nella lista
    keySearch: 'search',           // parametro inviato all'API (solo COMBOPAGINATE)
  },
  initialOptions: [
    { id: null, description: 'Nessuna selezione', tag: { bgTag: 'tag-gray', bgText: 'tag-text-gray', name: 'Default' } },
  ],
  opened: (_ig, _if, _fc, fn) => console.log(`${fn} aperto`),
  closed: (_ig, _if, _fc, fn) => console.log(`${fn} chiuso`),
}

// Selezione multipla
{
  formName: 'interessi',
  title: 'Interessi',
  type: TYPE_CONTROL_FORM.COMBO,
  formControl: new FormControl([]),
  options: categorieOptions,
  multiple: true,
  autocomplete: true,   // mostra campo di ricerca nella lista
}
```

**Aggiornamento dinamico delle opzioni:**

```ts
// Dal callback di un altro campo:
onChange: (_ig, _if, fc, _fn, _fg, _t, _prev, _all, utility) => {
  utility.setDefaultOptions('sottocategoria', () => [
    { id: 1, description: `Sotto A di ${fc.value}` },
    { id: 2, description: `Sotto B di ${fc.value}` },
  ]);
};
```

---

### COMBOPAGINATE

Select con caricamento dati remoto, paginazione e infinite scroll.  
Usa un Signal per le opzioni correnti e riceve la funzione `remoteData` per il caricamento.

#### Struttura base

```ts
import { signal } from '@angular/core';

// 1. Stato condiviso tra i callback
const options = signal<any[]>([]);
let total = 0;
let currentPage = 1;
let currentSearch = '';
const PAGE_SIZE = 10;

// 2. Funzione di caricamento
function loadItems(
  { page = 1, search = '', pageSize = PAGE_SIZE } = {},
  append = false
) {
  myApi.getItems({ page, pageSize, search }).subscribe(result => {
    total = result.totalCount;
    currentPage = page;
    currentSearch = search;

    if (append) {
      // Infinite scroll: aggiunge senza duplicati
      const existingIds = new Set(options().map(o => o.id));
      options.set([
        ...options(),
        ...result.items.filter(o => !existingIds.has(o.id))
      ]);
    } else {
      // Reset lista (nuova ricerca o prima pagina)
      options.set(result.items);
    }
  });
}

// 3. Campo nel form
{
  formName: 'utente',
  title: 'Utente',
  type: TYPE_CONTROL_FORM.COMBOPAGINATE,
  formControl: new FormControl(null, Validators.required),
  options,                              // Signal con i dati correnti
  totalCount: () => total,              // funzione che restituisce il totale
  enableInfiniteScroll: true,
  autocomplete: true,                   // mostra campo di ricerca
  multiple: false,                      // true per selezione multipla
  keyCombo: {
    keyId: 'id',
    keyDescription: 'description',
    keySearch: 'search',                // nome del parametro di ricerca per l'API
  },
  pageSize: PAGE_SIZE,
  paging: { page: 1, count: PAGE_SIZE, totalCount: 0 },

  // Chiamata remota — param contiene { page, count, search }
  remoteData: ({ param, append }) =>
    new Promise(resolve => {
      loadItems({ page: param.page, search: param.search, pageSize: param.count }, append);
      setTimeout(() => resolve({ items: options(), totalCount: total }), 100);
    }),

  // Caricamento iniziale
  onInitialize: () => loadItems({ page: 1 }),

  // Ricerca: l'utente digita nel campo di ricerca
  onSearch: (_ig, _if, _fc, _fn, _fg, search) => {
    loadItems({ page: 1, search });   // reset alla pagina 1 con nuovo testo
  },

  // Infinite scroll: raggiunto il fondo della lista
  onScrollEnd: () => {
    if (options().length < total) {
      loadItems({ page: currentPage + 1, search: currentSearch }, true);
    }
  },

  onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => {
    console.log(`${fn}:`, prev, '->', fc.value);
  },
}
```

#### Selezione multipla paginata

```ts
{
  formName: 'tags',
  title: 'Tag',
  type: TYPE_CONTROL_FORM.COMBOPAGINATE,
  formControl: new FormControl([]),    // array per multipla
  options: tagsOptions,
  multiple: true,                      // selezione multipla
  autocomplete: true,
  enableInfiniteScroll: true,
  keyCombo: { keyId: 'id', keyDescription: 'nome', keySearch: 'q' },
  pageSize: 15,
  paging: { page: 1, count: 15, totalCount: 0 },
  remoteData: ({ param, append }) => /* ... */,
  onInitialize: () => loadTags({ page: 1 }),
  onSearch: (_ig, _if, _fc, _fn, _fg, search) => loadTags({ page: 1, search }),
  onScrollEnd: () => { if (tagsOptions().length < totalTags) loadTags({ page: tagsPage + 1 }, true); },
}
```

#### Parametri specifici di COMBOPAGINATE

| Proprietà              | Tipo                          | Obbligatorio | Descrizione                      |
| ---------------------- | ----------------------------- | ------------ | -------------------------------- |
| `options`              | `Signal<any[]>`               | Sì           | Signal con le opzioni correnti   |
| `remoteData`           | `function`                    | Sì           | Funzione di caricamento dati     |
| `paging`               | `{ page, count, totalCount }` | Sì           | Stato iniziale della paginazione |
| `pageSize`             | `number`                      | Raccomandato | Elementi per pagina              |
| `totalCount`           | `() => number`                | Raccomandato | Totale elementi disponibili      |
| `enableInfiniteScroll` | `boolean`                     | No           | Caricamento auto allo scroll     |
| `autocomplete`         | `boolean`                     | No           | Mostra input di ricerca          |
| `keyCombo.keySearch`   | `string`                      | No           | Nome parametro ricerca per l'API |

---

### ARRAYSTRING

Input per inserimento di stringhe multiple come chip/token. Ogni `Enter` o `,` aggiunge un elemento. Il FormControl contiene un array di stringhe.

```ts
{
  formName: 'tags_liberi',
  title: 'Tag liberi',
  type: TYPE_CONTROL_FORM.ARRAYSTRING,
  formControl: new FormControl([]),
  placeholder: 'Scrivi e premi Invio...',
  onChange: (_ig, _if, fc) => console.log('Array:', fc.value), // es. ['tag1','tag2']
}
```

---

### DATA

Datepicker Angular Material. Il FormControl contiene un oggetto `Date` o `moment`.

```ts
{
  formName: 'data_nascita',
  title: 'Data di nascita',
  type: TYPE_CONTROL_FORM.DATA,
  formControl: new FormControl(null, Validators.required),
  optionDate: {
    min: '1920-01-01',                        // stringa ISO o moment
    max: new Date().toISOString().slice(0,10), // data massima = oggi
  },
  readonly: false,   // se true non è editabile ma è apribile
}
```

---

### DATARANGE

Selettore di intervallo date (from/to). Il FormControl contiene `{ start: Date | null, end: Date | null }`.

```ts
{
  formName: 'periodo',
  title: 'Periodo di riferimento',
  type: TYPE_CONTROL_FORM.DATARANGE,
  formControl: new FormControl(null),
  optionDate: { min: '2000-01-01', max: '2030-12-31' },
  onClose: (value, fc, utility) => {
    // chiamato quando si chiude il pannello del range
    console.log('Range:', value?.start, '->', value?.end);
  },
}
```

---

### DATETIME

Selettore combinato di data e ora.

```ts
{
  formName: 'appuntamento',
  title: 'Data e ora appuntamento',
  type: TYPE_CONTROL_FORM.DATETIME,
  formControl: new FormControl(null, Validators.required),
  optionDate: { min: new Date().toISOString() },
}
```

---

### TIME

Selettore solo orario. Il FormControl contiene una stringa `'HH:MM'`.

```ts
{
  formName: 'orario_apertura',
  title: 'Orario apertura',
  type: TYPE_CONTROL_FORM.TIME,
  formControl: new FormControl(null),
  optionsTime: {
    min: '07:00',
    max: '22:00',
  },
}
```

---

### YEAR

Selettore solo anno con frecce prev/next. Il FormControl contiene un numero (es. `2024`).

```ts
{
  formName: 'anno_diploma',
  title: 'Anno di diploma',
  type: TYPE_CONTROL_FORM.YEAR,
  formControl: new FormControl(null),
  optionDate: {
    min: '1970',    // anno minimo come stringa
    max: '2030',    // anno massimo come stringa
  },
}
```

---

### RATING

Valutazione a stelle. Il FormControl contiene un numero da `0` a `max` (0 = nessuna stella).

```ts
// Base — modificabile
{
  formName: 'valutazione',
  title: 'Valutazione',
  type: TYPE_CONTROL_FORM.RATING,
  formControl: new FormControl(null),
  optionRating: { max: 5 },   // numero di stelle (default: 5)
  resetButton: true,           // mostra X per tornare a null
}

// Sola lettura — non cliccabile, senza hover
{
  formName: 'punteggio_readonly',
  title: 'Punteggio calcolato',
  type: TYPE_CONTROL_FORM.RATING,
  formControl: new FormControl({ value: 3, disabled: true }),  // IMPORTANTE: disabled nel FormControl
  optionRating: { max: 10 },
}

// Rating reattivo — aggiornato automaticamente tramite effect
// Mostra la percentuale di completamento del form come stelle
.addForm(ctx => ({
  formName: 'completamento',
  title: 'Completamento form',
  type: TYPE_CONTROL_FORM.RATING,
  formControl: new FormControl({ value: 0, disabled: true }),
  optionRating: { max: 10 },
  onInitialize: (_ig, _if, fc, _fn, _fg, _t, _all, _p, _o, utility) => {
    effect(() => {
      const stats = utility?.formCompletion?.();
      const stelle = Math.round((stats?.percentage ?? 0) / 10);
      fc.setValue(stelle);
    }, { injector: ctx['injector'], allowSignalWrites: true });
  },
}))
```

> **Importante:** per disabilitare interamente il componente rating (no hover, no click), usare  
> `new FormControl({ value: ..., disabled: true })` invece di `disabled: true` sulla FormAction.  
> La proprietà `disabled` del FormAction è solo visiva e non blocca le interazioni.

**Comportamento click:**

- Click su stella non selezionata → seleziona quella stella
- Click sulla stessa stella già selezionata → porta il valore a `0` (nessuna stella)
- `resetButton: true` → mostra X che imposta il valore a `null`

---

### FILE

Upload file con validazione tipo e dimensione.

```ts
{
  formName: 'documento',
  title: 'Allega documento',
  type: TYPE_CONTROL_FORM.FILE,
  formControl: new FormControl(null),
  accept: 'application/pdf,image/*',  // MIME types accettati
  size: 10,                           // dimensione massima in MB
  hint: 'Max 10MB — PDF o immagini',
  onChange: (_ig, _if, fc) => {
    const file: File = fc.value;
    console.log('File:', file?.name, file?.size);
  },
}
```

**Upload multiplo:**

```ts
{
  formName: 'allegati',
  title: 'Allegati',
  type: TYPE_CONTROL_FORM.FILE,
  formControl: new FormControl([]),
  multiple: true,
  accept: '.pdf,.png,.jpg,.jpeg',
  onChange: (_ig, _if, fc) => {
    const files: File[] = fc.value;
    console.log('File selezionati:', files.map(f => f.name));
  },
}
```

> **Comportamento reset:**  
> Dopo aver chiamato `formGroup.reset()` o `formControl.reset()` il campo si svuota
> correttamente e il file browser può essere riaperto selezionando lo stesso file
> precedentemente scelto — il componente gestisce automaticamente il reset del DOM
> nativo per evitare il bug del browser che ignora la riselezione dello stesso file.

---

### BUTTON

Bottone con azione custom inline nel form (diverso dalle azioni di gruppo).

```ts
{
  formName: 'carica_dati',
  title: 'Carica dal profilo',
  type: TYPE_CONTROL_FORM.BUTTON,
  formControl: new FormControl(null),
  action: (fc) => {
    // logica al click
    console.log('Bottone premuto');
  },
  css: { class: ['btn-outline-primary'] },
}
```

---

### GROUP

Campo che contiene un sotto-form annidato (espandibile o sempre visibile).

```ts
{
  formName: 'indirizzo',
  title: 'Indirizzo',
  type: TYPE_CONTROL_FORM.GROUP,
  formControl: new FormControl(null),
  formGroup: DynamicFormBuilder.create()
    .addGroup('Indirizzo', ['col-12'])
    .addForm({ formName: 'via', title: 'Via', type: TYPE_CONTROL_FORM.TEXT, formControl: new FormControl('') })
    .addForm({ formName: 'cap', title: 'CAP', type: TYPE_CONTROL_FORM.NUMBER, formControl: new FormControl(null) })
    .addForm({ formName: 'citta', title: 'Città', type: TYPE_CONTROL_FORM.TEXT, formControl: new FormControl('') })
    .build(),
}
```

---

## Parametri comuni (FormActionBase)

Tutte le `FormAction` ereditano questi parametri:

| Proprietà        | Tipo                                  | Descrizione                                                                                         |
| ---------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `formName`       | `string`                              | **Identificatore univoco** del campo — usato da `getFormByName`                                     |
| `title`          | `string`                              | Label visualizzata sopra il campo                                                                   |
| `type`           | `TYPE_CONTROL_FORM`                   | Tipo del campo                                                                                      |
| `formControl`    | `FormControl / FormArray / FormGroup` | Control Angular Reactive Forms                                                                      |
| `disabled`       | `boolean`                             | Visivo — non blocca le interazioni; per bloccare usare `new FormControl({ value, disabled: true })` |
| `readonly`       | `boolean`                             | Campo visibile ma non modificabile                                                                  |
| `hidden`         | `boolean`                             | Nasconde il campo; il valore esiste comunque nel FormGroup                                          |
| `placeholder`    | `string`                              | Testo segnaposto                                                                                    |
| `hint`           | `string`                              | Testo di suggerimento sotto il campo                                                                |
| `info`           | `{ msg: string; color: string }`      | Icona info con tooltip                                                                              |
| `tipContent`     | `string`                              | Tooltip sull'intero campo                                                                           |
| `resetButton`    | `boolean`                             | Mostra bottone X per azzerare il valore                                                             |
| `autocomplete`   | `boolean`                             | Abilita autocomplete browser / ricerca inline combo                                                 |
| `multiple`       | `boolean`                             | Selezione multipla (COMBO / COMBOPAGINATE)                                                          |
| `css`            | `TypeCss`                             | Classi CSS custom, colore font, icone, ecc.                                                         |
| `formGroup`      | `ConfigForm`                          | Sotto-form annidato                                                                                 |
| `rows`           | `number`                              | Righe (TEXTAREA)                                                                                    |
| `options`        | `Signal / Array`                      | Opzioni per COMBO, COMBOPAGINATE, RADIOGROUP                                                        |
| `initialOptions` | `TypeComboOption`                     | Opzioni fisse sempre in cima alla lista                                                             |
| `onChange`       | `DynamicFormOnChange`                 | Callback al cambio valore                                                                           |
| `onInitialize`   | `DynamicFormOnInitialize`             | Callback all'init del campo                                                                         |
| `onFocus`        | `DynamicFormFocusBlur`                | Callback al focus                                                                                   |
| `onBlur`         | `DynamicFormFocusBlur`                | Callback alla perdita del focus                                                                     |
| `opened`         | `DynamicFormOpenClose`                | Callback apertura pannello                                                                          |
| `closed`         | `DynamicFormOpenClose`                | Callback chiusura pannello                                                                          |
| `onSearch`       | `DynamicFormSearch`                   | Callback digitazione nella ricerca                                                                  |
| `onScrollEnd`    | `DynamicFormScrollEnd`                | Callback fondo lista paginata                                                                       |

---

## Sistema di eventi

Tutti i callback hanno una firma consistente. L'ultimo parametro è sempre `utility`.

### Firme complete

```ts
// onChange — cambio valore
onChange: (
  idGroup: number,           // indice del Group nel ConfigForm
  idForm: number,            // indice del Form nel Group
  formControl: FormControl,  // FormControl con il NUOVO valore
  formName: string,          // formName del campo
  formGroup: Form[],         // campi del gruppo corrente
  type: TYPE_CONTROL_FORM,   // tipo del campo
  prevValue: any,            // valore PRECEDENTE
  allGroup: ConfigForm,      // intero ConfigForm
  utility: Utility,
) => void | Promise<void>

// onInitialize — montaggio del campo nel DOM
onInitialize: (
  idGroup: number,
  idForm: number,
  formControl: FormControl,
  formName: string,
  formGroup: Form[],
  type: TYPE_CONTROL_FORM,
  allGroup: ConfigForm,
  paging?: { count: number; page: number; totalCount?: number } | null,
  onOptionSetted?: Signal<any[]> | null,
  utility?: Utility,
) => void | Promise<void>

// onFocus / onBlur — focus sul campo
onFocus: (
  idGroup: number,
  idForm: number,
  formControl: FormControl,
  formName: string,
  formGroup: Form[],
  allGroup: ConfigForm,
  utility: Utility,
) => void | Promise<void>

// opened / closed — pannello aperto/chiuso (stessa firma di onFocus)

// onSearch — testo digitato nella ricerca della combo
onSearch: (
  idGroup: number,
  idForm: number,
  formControl: FormControl,
  formName: string,
  formGroup: Form[],
  search: string,     // testo corrente nel campo di ricerca
  utility: Utility,
) => void | Promise<void>

// onScrollEnd — fondo lista raggiunto (infinite scroll)
onScrollEnd: (
  idGroup: number,
  idForm: number,
  formControl: FormControl,
  formName: string,
  formGroup: Form[],
  paging: { count: number; page: number; totalCount?: number },
  utility: Utility,
) => void | Promise<void>
```

### Convenzione di nomenclatura parametri inutilizzati

```ts
// Usare il prefisso _ per i parametri non usati — chiarisce l'intenzione
onChange: (_ig, _if, fc, formName, _fg, _t, prevValue, _all, utility) => {
  console.log(`${formName}: ${prevValue} → ${fc.value}`);
};
```

---

## Oggetto Utility

Iniettato come ultimo parametro in **tutti** gli eventi. Fornisce accesso diretto ai campi e alle azioni del form senza navigare manualmente il `ConfigForm`.

### `getFormByName(formName, parse)`

Legge o modifica un altro campo del form per nome.

```ts
// Disabilitare un campo in base al valore di un altro
onChange: (_ig, _if, fc, _fn, _fg, _t, _prev, _all, utility) => {
  utility.getFormByName('campo_dipendente', fa => {
    if (fc.value === 'speciale') {
      fa.hidden = false;
      fa.formControl?.setValidators(Validators.required);
      fa.formControl?.updateValueAndValidity();
    } else {
      fa.hidden = true;
      fa.formControl?.clearValidators();
      fa.formControl?.updateValueAndValidity();
    }
  });
};
```

### `setDefaultOptions(formName, parse)`

Imposta dinamicamente le opzioni di una combo da un evento di un altro campo.

```ts
onChange: (_ig, _if, fc, _fn, _fg, _t, _prev, _all, utility) => {
  const regioneId = fc.value;
  myApi.getProvince(regioneId).subscribe(province => {
    utility.setDefaultOptions('provincia', () => province);
  });
};
```

### `getSelectedOptions(formName, parse)`

Recupera gli oggetti completi delle opzioni selezionate (non solo l'id).

```ts
utility.getSelectedOptions('categorie', opts => {
  const selezionati = opts(); // Signal — chiamare come funzione
  console.log('Selezionati completi:', selezionati);
  const nomi = selezionati.map(o => o.description).join(', ');
});
```

### `onSettedOptions(formName, parse)`

Si sottoscrive all'evento di settaggio delle opzioni di una combo.

### `getActionByName(name, parse)`

Recupera un bottone del form per nome e ne modifica lo stato.

```ts
// Disabilita il bottone Salva dinamicamente
onChange: (_ig, _if, _fc, _fn, _fg, _t, _prev, _all, utility) => {
  const stats = utility.formCompletion();
  utility.getActionByName('salva', action => {
    action.disabled = stats.required.percentage < 100;
  });
};
```

### `formCompletion`

Vedi [sezione dedicata](#formcompletion--statistiche-di-completamento).

---

## formCompletion — statistiche di completamento

`utility.formCompletion` è un `Signal<FormCompletionStats>` condiviso tra tutti i campi dello stesso form. Si aggiorna automaticamente a ogni `valueChange`.

### Struttura

```ts
type FormCompletionStats = {
  total: number; // campi tracciati (globale)
  filled: number; // campi con valore non vuoto (globale)
  percentage: number; // percentuale (0–100, intera) (globale)
  required: {
    total: number;
    filled: number;
    percentage: number;
  };
  /** Statistiche suddivise per gruppo */
  groups: Array<{
    id: string; // UUID del gruppo (assegnato dal builder)
    title: string; // titolo del gruppo
    total: number;
    filled: number;
    percentage: number;
    required: {
      total: number;
      filled: number;
      percentage: number;
    };
  }>;
};
```

### Campi esclusi dal conteggio

`GROUP` (i sotto-form annidati vengono conteggiati al loro interno)

### Un campo è "compilato" quando

- Non è `null`
- Non è `undefined`
- Non è stringa vuota `''`
- Se array: ha almeno un elemento

### Un campo è "required" quando

Il suo `FormControl` ha `Validators.required` tra i validatori.

### Utilizzo tipico

```ts
onChange: (_ig, _if, _fc, _fn, _fg, _t, _prev, _all, utility) => {
  const s = utility.formCompletion();

  // ── Statistiche globali ───────────────────────────────────────────────────
  console.log(`Completamento: ${s.percentage}% (${s.filled}/${s.total} campi)`);
  console.log(`Obbligatori: ${s.required.percentage}% (${s.required.filled}/${s.required.total})`);

  // ── Statistiche per gruppo ───────────────────────────────────────────────
  s.groups.forEach(g => {
    console.log(
      `Gruppo [${g.id}] "${g.title}":`,
      `${g.percentage}% (${g.filled}/${g.total})`,
      `| req: ${g.required.percentage}%`,
    );
  });

  // Esempio: trovare un gruppo per titolo
  const datiPersonali = s.groups.find(g => g.title === 'Dati Personali');
  if (datiPersonali) {
    console.log('Dati personali completati al', datiPersonali.percentage + '%');
  }

  // Abilita/disabilita il bottone Salva
  utility.getActionByName('salva', action => {
    action.disabled = s.required.percentage < 100;
  });

  // Aggiorna un campo di testo con la percentuale
  utility.getFormByName('campo_info', fa => {
    fa.formControl?.setValue(`Completato al ${s.percentage}%`, { emitEvent: false });
  });
};
```

### Rating reattivo come progress indicator

```ts
.addForm(ctx => ({
  formName: 'progress_indicator',
  title: 'Completamento',
  type: TYPE_CONTROL_FORM.RATING,
  formControl: new FormControl({ value: 0, disabled: true }),
  optionRating: { max: 10 },
  onInitialize: (_ig, _if, fc, _fn, _fg, _t, _all, _p, _o, utility) => {
    effect(
      () => {
        const stats = utility?.formCompletion?.();
        fc.setValue(Math.round((stats?.percentage ?? 0) / 10));
      },
      { injector: ctx['injector'], allowSignalWrites: true }
    );
  },
}))
```

---

## Combo statiche con tag e initialOptions

### Struttura TypeComboOption

```ts
type TypeComboOption = Array<{
  id: any;
  description: string;
  img?: string; // URL immagine (mostrata accanto alla descrizione)
  extra?: any; // dati extra non visualizzati
  disabled?: boolean; // opzione non selezionabile
  default?: boolean; // preselezione automatica
  hide?: boolean; // nascosta dalla lista
  selected?: boolean; // selezionata correntemente
  tag?: {
    bgTag: string; // classe CSS fill del rettangolo SVG
    bgText: string; // classe CSS fill del testo SVG
    name: string; // testo del badge
  };
}>;
```

### Tag colorati

I tag sono badge SVG affiancati alla descrizione. Le classi CSS devono essere definite globalmente in `styles.scss`:

```scss
// styles.scss
.tag-gray {
  fill: #6b7280;
}
.tag-blue {
  fill: #3b82f6;
}
.tag-green {
  fill: #16a34a;
}
.tag-red {
  fill: #dc2626;
}
.tag-orange {
  fill: #ea580c;
}
.tag-indigo {
  fill: #4f46e5;
}
.tag-purple {
  fill: #9333ea;
}
.tag-yellow {
  fill: #ca8a04;
}

.tag-text-gray,
.tag-text-blue,
.tag-text-green,
.tag-text-red,
.tag-text-orange,
.tag-text-indigo,
.tag-text-purple,
.tag-text-yellow {
  fill: #ffffff;
}
```

### initialOptions

Opzioni **sempre visibili in cima alla lista**, indipendentemente da ricerca o paginazione. Ideali per "Nessuna selezione", "Tutti", "Default".

```ts
{
  formName: 'stato',
  type: TYPE_CONTROL_FORM.COMBO,
  options: statiOptions,
  formControl: new FormControl(null),
  initialOptions: [
    {
      id: null,
      description: 'Qualsiasi stato',
      tag: { bgTag: 'tag-gray', bgText: 'tag-text-gray', name: 'Tutti' },
    },
    {
      id: 'urgente',
      description: 'Urgente',
      tag: { bgTag: 'tag-red', bgText: 'tag-text-red', name: 'HOT' },
    },
    {
      id: 'prioritario',
      description: 'Prioritario',
      tag: { bgTag: 'tag-orange', bgText: 'tag-text-orange', name: 'TOP' },
    },
  ],
}
```

---

## Combo paginata remota — guida completa

### Pattern con classe di stato

Per form complessi con più combo paginate è consigliabile incapsulare lo stato:

```ts
// combo-state.ts
export class ComboPaginatedState<T extends { id: any }> {
  private _options = signal<T[]>([]);
  private _total = 0;
  private _page = 1;
  private _search = '';

  readonly options = this._options.asReadonly();
  get total() { return this._total; }
  get page() { return this._page; }

  load(
    items: T[],
    total: number,
    page: number,
    search: string,
    append: boolean
  ) {
    this._total = total;
    this._page = page;
    this._search = search;
    if (append) {
      const ids = new Set(this._options().map(o => o.id));
      this._options.set([...this._options(), ...items.filter(o => !ids.has(o.id))]);
    } else {
      this._options.set(items);
    }
  }

  canLoadMore() {
    return this._options().length < this._total;
  }
}

// Nel builder:
const utentiState = new ComboPaginatedState<UserDto>();
const api = inject(UserApiService);

function fetchUtenti(page: number, search: string, append: boolean) {
  api.getUsers({ page, pageSize: 10, search }).subscribe(r =>
    utentiState.load(r.items, r.totalCount, page, search, append)
  );
}

{
  formName: 'utente_assegnato',
  type: TYPE_CONTROL_FORM.COMBOPAGINATE,
  formControl: new FormControl(null),
  options: utentiState.options,
  totalCount: () => utentiState.total,
  enableInfiniteScroll: true,
  autocomplete: true,
  keyCombo: { keyId: 'id', keyDescription: 'fullName', keySearch: 'q' },
  pageSize: 10,
  paging: { page: 1, count: 10, totalCount: 0 },
  remoteData: ({ param, append }) =>
    new Promise(resolve => {
      fetchUtenti(param.page, param.search ?? '', append);
      setTimeout(() => resolve({ items: utentiState.options(), totalCount: utentiState.total }), 80);
    }),
  onInitialize: () => fetchUtenti(1, '', false),
  onSearch: (_ig, _if, _fc, _fn, _fg, search) => fetchUtenti(1, search, false),
  onScrollEnd: () => {
    if (utentiState.canLoadMore()) fetchUtenti(utentiState.page + 1, '', true);
  },
}
```

---

## Rating — guida completa

### Modalità

| Modalità            | FormControl                                     | Descrizione                                |
| ------------------- | ----------------------------------------------- | ------------------------------------------ |
| Editabile           | `new FormControl(null)`                         | L'utente può cliccare e cambiare il valore |
| Sola lettura visiva | `new FormControl({ value: 3, disabled: true })` | No hover, no click — solo visualizzazione  |
| Progress indicator  | `disabled: true` + `effect()`                   | Aggiornato da un effect reattivo           |

### Comportamento click

| Situazione                         | Risultato                                          |
| ---------------------------------- | -------------------------------------------------- |
| Click su stella non selezionata    | Seleziona quella stella (valore = N)               |
| Click sulla stella già selezionata | Deseleziona → valore 0 (nessuna stella illuminata) |
| `resetButton: true` + click X      | Imposta valore a `null`                            |
| `disabled: true` (FormControl)     | Nessun hover, nessun click possibile               |

### Valori del FormControl

| Valore      | Stelle visualizzate                                         |
| ----------- | ----------------------------------------------------------- |
| `null`      | Nessuna stella (tutte spente) — campo non compilato         |
| `0`         | Nessuna stella (tutte spente) — campo considerato compilato |
| `N` (1–max) | N stelle illuminate                                         |

### Esempio completo

```ts
// Rating base — 5 stelle
{
  formName: 'soddisfazione',
  title: 'Soddisfazione',
  type: TYPE_CONTROL_FORM.RATING,
  formControl: new FormControl(null, Validators.required),
  optionRating: { max: 5 },
  resetButton: true,
  hint: 'Da 1 (pessimo) a 5 (ottimo)',
  onChange: (_ig, _if, fc, _fn, _fg, _t, prev, _all, utility) => {
    const s = utility.formCompletion();
    console.log(`Rating: ${prev} -> ${fc.value} | Form: ${s.percentage}%`);
  },
}

// Rating 10 stelle — sola lettura con valore dinamico
.addForm(ctx => ({
  formName: 'completamento_visivo',
  title: 'Completamento form',
  type: TYPE_CONTROL_FORM.RATING,
  formControl: new FormControl({ value: 0, disabled: true }),
  optionRating: { max: 10 },
  onInitialize: (_ig, _if, fc, _fn, _fg, _t, _all, _p, _o, utility) => {
    effect(
      () => {
        const pct = utility?.formCompletion?.()?.percentage ?? 0;
        fc.setValue(Math.round(pct / 10));   // 0–100% → 0–10 stelle
      },
      { injector: ctx['injector'], allowSignalWrites: true }
    );
  },
}))
```

---

## Azioni (DynamicFormActionButton)

I bottoni delle azioni vengono visualizzati nel **piede del gruppo** a cui appartengono, definiti con `.addActions()` dopo `.addGroup()`.

### Parametri `action` — firma completa

```ts
action: (
  questions: Array<Form>,           // campi del gruppo corrente
  idForm: string | number,          // id del gruppo (UUID o indice)
  groupForm: FormGroup | FormArray, // reactive form del solo gruppo — usare per reset, validazione locale
  group?: Group,                    // oggetto Group corrente
  idGroup?: number,                 // indice del gruppo nel ConfigForm
  allGroup?: ConfigForm,            // intera struttura ConfigForm
  totalForm?: FormGroup | FormArray,// reactive form di TUTTO il form (tutti i gruppi) — usare per submit
  utility?: Utility                 // helper — formCompletion, getFormByName, ecc.
) => void
```

> **`groupForm` vs `totalForm`:**
>
> - `groupForm` è il `FormGroup` del **solo gruppo** che contiene il bottone. Usalo per `reset()` o `getRawValue()` scoped al gruppo.
> - `totalForm` è il `FormGroup` o `FormArray` dell'**intero form** (tutti i gruppi). Usalo per submit, validazione globale o `getRawValue()` completo.

### Esempi

#### Salva con validazione globale + reset locale

```ts
.addActions([
  {
    label: 'Salva',
    name: 'salva',
    visible: true,
    icon: 'save',
    cssClassButton: ['btn', 'btn-primary'],
    action: (_questions, _id, groupForm, _group, _idGroup, _allGroup, totalForm, utility) => {
      const stats = utility?.formCompletion?.();

      if ((stats?.required.percentage ?? 0) < 100) {
        alert(`Completa i campi obbligatori! (${stats?.required.filled}/${stats?.required.total})`);
        return;
      }

      // totalForm contiene tutti i gruppi → getRawValue() restituisce i dati completi
      if (totalForm instanceof FormGroup) {
        console.log('Tutti i dati:', totalForm.getRawValue());
        // myService.save(totalForm.getRawValue());
      }

      // groupForm è solo questo gruppo
      console.log('Dati del gruppo corrente:', groupForm?.value);
    },
  },
  {
    label: 'Reset gruppo',
    visible: true,
    cssClassButton: ['btn', 'btn-outline-secondary'],
    // groupForm resetta SOLO i campi di questo gruppo, non l'intero form
    action: (_questions, _id, groupForm) => {
      groupForm?.reset?.();
    },
  },
])
```

#### Con factory per accedere al componente

```ts
.addActions(ctx => [
  {
    label: 'Registra',
    name: 'salva',
    visible: true,
    icon: 'person_add',
    cssClassButton: ['btn', 'btn-primary', 'px-4'],
    action: (_questions, _id, _groupForm, _group, _idGroup, _allGroup, totalForm, utility) => {
      const stats = utility?.formCompletion?.();
      if ((stats?.required.percentage ?? 0) < 100) return;

      if (totalForm instanceof FormGroup) {
        ctx.onRegistra(totalForm.getRawValue());  // metodo del componente
      }
    },
  },
  {
    label: 'Svuota tutto',
    visible: true,
    cssClassButton: ['btn', 'btn-outline-secondary'],
    // totalForm per resettare tutti i gruppi contemporaneamente
    action: (_questions, _id, _groupForm, _group, _idGroup, _allGroup, totalForm) => {
      totalForm?.reset?.();
    },
  },
])
```

#### Disabilita il bottone Salva dinamicamente

```ts
// In un onChange di un qualunque campo:
onChange: (_ig, _if, _fc, _fn, _fg, _t, _prev, _all, utility) => {
  const stats = utility.formCompletion();
  utility.getActionByName('salva', action => {
    action.disabled = stats.required.percentage < 100;
  });
},
```

#### Azioni per gruppo diverso — statistiche per gruppo

```ts
action: (_questions, _id, groupForm, group, idGroup, allGroup, totalForm, utility) => {
  const stats = utility?.formCompletion?.();

  // Trovare le statistiche del gruppo corrente
  const gruppoStats = stats?.groups.find(g => g.id === group?.id);
  console.log(`Gruppo "${gruppoStats?.title}": ${gruppoStats?.percentage}%`);

  // Confrontare tutti i gruppi
  stats?.groups.forEach(g => {
    console.log(`  [${g.title}] ${g.percentage}% | Req: ${g.required.percentage}%`);
  });
},
```

### Proprietà `DynamicFormActionButton`

| Proprietà        | Tipo       | Descrizione                                              |
| ---------------- | ---------- | -------------------------------------------------------- |
| `label`          | `string`   | Testo del bottone                                        |
| `name`           | `string`   | Identificatore per `getActionByName`                     |
| `icon`           | `string`   | Nome icona Material Icons (visualizzata prima del testo) |
| `cssClassButton` | `string[]` | Classi CSS del bottone                                   |
| `cssClassIcon`   | `string[]` | Classi CSS dell'icona                                    |
| `disabled`       | `boolean`  | Disabilita il bottone (modificabile runtime)             |
| `visible`        | `boolean`  | Mostra/nasconde il bottone                               |
| `action`         | `function` | Callback al click — vedi firma completa sopra            |

---

## Utilizzo nel template

```html
<app-dynamic-form
  [config]="myConfig"
  (onFormCreate)="onFormCreated($event)"
  (onQuestionsCreate)="onQuestionsCreated($event)"
>
</app-dynamic-form>
```

### Input

| Input                      | Tipo                    | Descrizione                      |
| -------------------------- | ----------------------- | -------------------------------- |
| `[config]` o `[questions]` | `ConfigForm`            | Configurazione completa del form |
| `[json]`                   | `DynamicFormJsonSchema` | Schema JSON alternativo          |

### Output

| Output                | Tipo                    | Descrizione                                |
| --------------------- | ----------------------- | ------------------------------------------ |
| `(onFormCreate)`      | `FormGroup / FormArray` | FormGroup generato dopo l'inizializzazione |
| `(onQuestionsCreate)` | `ConfigForm`            | ConfigForm risolto dopo l'inizializzazione |

```ts
@Component({ ... })
export class MyPageComponent {
  config = buildMyForm(this);
  formGroup!: FormGroup;

  onFormCreated(fg: FormGroup) {
    this.formGroup = fg;
    // ora si può usare formGroup.valueChanges, formGroup.get('campo'), ecc.
  }

  onQuestionsCreated(config: ConfigForm) {
    // ConfigForm risolto — utile per manipolazioni post-init
  }

  submit() {
    if (this.formGroup?.valid) {
      console.log(this.formGroup.getRawValue());
    }
  }
}
```

---

## Esempio completo reale

```ts
// registration-form.builder.ts
import { inject, signal, effect } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DynamicFormBuilder, TYPE_CONTROL_FORM, ConfigForm } from 'dynamicform';
import { UserApiService } from './user-api.service';

export function buildRegistrationForm<T extends RegistrationComponent>(context: T): ConfigForm {

  // ── Opzioni statiche ───────────────────────────────────────────────────────
  const genereOptions = signal([
    { id: 'M', description: 'Maschio' },
    { id: 'F', description: 'Femmina' },
    { id: 'A', description: 'Preferisco non specificare' },
  ]);

  // ── Stato combo paginate ───────────────────────────────────────────────────
  const cittaOptions = signal<any[]>([]);
  let cittaTotal = 0;
  let cittaPage = 1;
  let cittaSearch = '';

  const api = inject(UserApiService);

  function loadCitta({ page = 1, search = '' } = {}, append = false) {
    api.getCitta({ page, pageSize: 10, search }).subscribe(r => {
      cittaTotal = r.totalCount;
      cittaPage = page;
      cittaSearch = search;
      if (append) {
        const ids = new Set(cittaOptions().map(o => o.id));
        cittaOptions.set([...cittaOptions(), ...r.items.filter(o => !ids.has(o.id))]);
      } else {
        cittaOptions.set(r.items);
      }
    });
  }

  // ── Helper log ─────────────────────────────────────────────────────────────
  function log(event: string, field: string, utility?: any, extra?: any) {
    const s = utility?.formCompletion?.();
    const pct = s ? `[${s.percentage}% | Req:${s.required.percentage}%]` : '';
    console.log(`%c[${event}] ${field} ${pct}`, 'color:#6366f1;font-weight:600', extra ?? '');
  }

  return DynamicFormBuilder.create(context)

    // ── Dati personali ─────────────────────────────────────────────────────
    .addGroup('Dati Personali', ['col-6 px-3'])

    .addForm({
      formName: 'nome',
      title: 'Nome *',
      type: TYPE_CONTROL_FORM.TEXT,
      formControl: new FormControl('', Validators.required),
      placeholder: 'Es. Mario',
      resetButton: true,
      onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, _p, _o, utility) =>
        log('onInitialize', 'nome', utility),
      onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) =>
        log('onChange', fn, utility, { prev, curr: fc?.value }),
      onFocus: (_ig, _if, _fc, fn) => console.log(`Focus: ${fn}`),
      onBlur: (_ig, _if, fc, fn) => console.log(`Blur: ${fn} =`, fc?.value),
    })

    .addForm({
      formName: 'cognome',
      title: 'Cognome *',
      type: TYPE_CONTROL_FORM.TEXT,
      formControl: new FormControl('', Validators.required),
      onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) =>
        log('onChange', fn, utility, { prev, curr: fc?.value }),
    })

    .addForm({
      formName: 'data_nascita',
      title: 'Data di nascita',
      type: TYPE_CONTROL_FORM.DATA,
      formControl: new FormControl(null),
      optionDate: { min: '1920-01-01', max: new Date().toISOString().slice(0, 10) },
      onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) =>
        log('onChange', fn, utility, { prev, curr: fc?.value }),
    })

    .addForm({
      formName: 'genere',
      title: 'Genere',
      type: TYPE_CONTROL_FORM.RADIOGROUP,
      formControl: new FormControl(null, Validators.required),
      options: genereOptions,
      onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) =>
        log('onChange', fn, utility, { prev, curr: fc?.value }),
    })

    // Rating disabilitato come progress indicator
    .addForm(ctx => ({
      formName: 'progresso',
      title: 'Completamento form',
      type: TYPE_CONTROL_FORM.RATING,
      formControl: new FormControl({ value: 0, disabled: true }),
      optionRating: { max: 10 },
      onInitialize: (_ig, _if, fc, _fn, _fg, _t, _all, _p, _o, utility) => {
        effect(
          () => {
            const pct = utility?.formCompletion?.()?.percentage ?? 0;
            fc.setValue(Math.round(pct / 10));
          },
          { injector: ctx['injector'], allowSignalWrites: true }
        );
      },
    }))

    // ── Contatti ────────────────────────────────────────────────────────────
    .addGroup('Contatti', ['col-6 px-3'])

    .addForm({
      formName: 'email',
      title: 'Email *',
      type: TYPE_CONTROL_FORM.TEXT,
      formControl: new FormControl('', [Validators.required, Validators.email]),
      hint: 'Riceverai la conferma su questa email',
      onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) =>
        log('onChange', fn, utility, { prev, curr: fc?.value }),
    })

    .addForm({
      formName: 'telefono',
      title: 'Telefono',
      type: TYPE_CONTROL_FORM.TEXT,
      formControl: new FormControl(''),
      optionInputText: { maxlength: 15 },
      onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) =>
        log('onChange', fn, utility, { prev, curr: fc?.value }),
    })

    .addForm({
      formName: 'citta',
      title: 'Città',
      type: TYPE_CONTROL_FORM.COMBOPAGINATE,
      formControl: new FormControl(null),
      options: cittaOptions,
      totalCount: () => cittaTotal,
      enableInfiniteScroll: true,
      autocomplete: true,
      keyCombo: { keyId: 'id', keyDescription: 'nome', keySearch: 'q' },
      pageSize: 10,
      paging: { page: 1, count: 10, totalCount: 0 },
      initialOptions: [
        { id: null, description: 'Nessuna città', tag: { bgTag: 'tag-gray', bgText: 'tag-text-gray', name: 'Default' } },
      ],
      remoteData: ({ param, append }) =>
        new Promise(resolve => {
          loadCitta({ page: param.page, search: param.search ?? '' }, append);
          setTimeout(() => resolve({ items: cittaOptions(), totalCount: cittaTotal }), 80);
        }),
      onInitialize: () => loadCitta({ page: 1 }),
      onSearch: (_ig, _if, _fc, _fn, _fg, search) => loadCitta({ page: 1, search }),
      onScrollEnd: () => {
        if (cittaOptions().length < cittaTotal)
          loadCitta({ page: cittaPage + 1, search: cittaSearch }, true);
      },
      onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) =>
        log('onChange', fn, utility, { prev, curr: fc?.value }),
    })

    .addForm({
      formName: 'note',
      title: 'Note aggiuntive',
      type: TYPE_CONTROL_FORM.TEXTAREA,
      formControl: new FormControl(''),
      rows: 3,
      hint: 'Massimo 500 caratteri',
      optionInputText: { maxlength: 500 },
      onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) =>
        log('onChange', fn, utility, { prev, curr: fc?.value }),
    })

    // ── Azioni ──────────────────────────────────────────────────────────────
    .addActions(ctx => [
      {
        label: 'Registra',
        name: 'salva',
        visible: true,
        icon: 'person_add',
        cssClassButton: ['btn', 'btn-primary', 'px-4'],
        action: (_q, _id, _groupForm, _g, _ig, _all, totalForm, utility) => {
          const stats = utility?.formCompletion?.();
          if ((stats?.required.percentage ?? 0) < 100) {
            alert(`Compila i campi obbligatori (${stats?.required.filled}/${stats?.required.total})`);
            return;
          }
          if (totalForm instanceof FormGroup) {
            ctx.onRegistra(totalForm.getRawValue());
          }
        },
      },
      {
        label: 'Svuota',
        visible: true,
        cssClassButton: ['btn', 'btn-outline-secondary'],
        action: (_q, _id, _groupForm, _g, _ig, _all, totalForm) => totalForm?.reset?.(),
      },
    ])

    .build();
}

// ── Componente ────────────────────────────────────────────────────────────────
@Component({ ... })
export class RegistrationComponent {
  api = inject(UserApiService);
  config = buildRegistrationForm(this);
  formGroup!: FormGroup;

  onFormCreated(fg: FormGroup) {
    this.formGroup = fg;
  }

  onRegistra(data: any) {
    this.api.register(data).subscribe(() => {
      alert('Registrazione completata!');
      this.formGroup.reset();
    });
  }
}
```

---

## Riferimento tipi TypeScript

```
ConfigForm = Array<Group>
│
├── Group
│   ├── id?: string
│   ├── title?: string
│   ├── class?: string[]
│   ├── formGroup?: Array<Form>
│   │     └── Form { formAction: FormAction }
│   └── actions?: Array<DynamicFormActionButton>
│
├── DynamicFormActionButton
│   ├── label?, name?, icon?, translateId?
│   ├── cssClassButton?, cssClassIcon?
│   ├── disabled?, visible?
│   └── action(
│         questions,    // Array<Form> — campi del gruppo
│         idForm,       // string | number — id del gruppo
│         groupForm,    // FormGroup | FormArray — form del solo gruppo
│         group?,       // Group — oggetto gruppo corrente
│         idGroup?,     // number — indice del gruppo
│         allGroup?,    // ConfigForm — struttura completa
│         totalForm?,   // FormGroup | FormArray — form di TUTTO il form ← usa per submit/reset globale
│         utility?      // Utility
│       )
│
├── FormActionBase  (base di tutti i campi)
│   ├── Identità:   formName, title, label, type, id
│   ├── Control:    formControl
│   ├── Stato:      disabled*, readonly, hidden
│   ├── UI:         placeholder, hint, info, tipContent, css, resetButton
│   ├── Input:      autocomplete, multiple, rows, accept, size, currency
│   ├── Opzioni:    options, initialOptions, optionsDisabled, disabledOption
│   ├── Paginate:   keyCombo, paging, pageSize, remoteData, totalCount, enableInfiniteScroll
│   ├── Validazione: optionInputText, optionNumber, optionDate, optionsTime, optionRating
│   ├── Annidato:   formGroup (ConfigForm)
│   └── Eventi:     onChange, onInitialize, onFocus, onBlur, opened, closed,
│                   onSearch, onScrollEnd, action, onClose, onError
│
│   * disabled sulla FormAction è solo visivo. Per bloccare interazioni usare:
│     new FormControl({ value: ..., disabled: true })
│
├── Utility
│   ├── getFormByName(formName, parse)      → legge/modifica un campo per nome
│   ├── getActionByName(name, parse)         → legge/modifica un bottone per nome
│   ├── setDefaultOptions(formName, parse)   → imposta opzioni di una combo
│   ├── getSelectedOptions(formName, parse)  → oggetti completi opzioni selezionate
│   ├── onSettedOptions(formName, parse)     → sottoscrive al settaggio opzioni
│   └── formCompletion: Signal<FormCompletionStats>
│
├── FormCompletionStats
│   ├── total, filled, percentage
│   ├── required: { total, filled, percentage }
│   └── groups: Array<{
│         id: string           UUID del gruppo
│         title: string        titolo del gruppo
│         total, filled, percentage
│         required: { total, filled, percentage }
│       }>
│
└── DynamicFormBuilder<TCtx>
    ├── static create()                     → DynamicFormBuilder<unknown>
    ├── static create<T>(ctx: T)            → DynamicFormBuilder<T>  (tipo inferito)
    ├── addGroup(title | (ctx)=>string, classList?, id?)  → this
    ├── addForm(FormAction | (ctx)=>FormAction)           → this
    ├── addActions(actions[] | (ctx)=>actions[])          → this
    └── build()                             → ConfigForm
```

---

## Build e sviluppo

```bash
# Build libreria (genera dist/dynamicform)
ng build dynamicform

# Avvio app di sviluppo con hot reload
ng serve

# Test unitari
ng test dynamicform
```
