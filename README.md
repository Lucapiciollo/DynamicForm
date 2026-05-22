# DynamicForm

> Libreria Angular per la generazione dichiarativa di form reattivi complessi, con supporto a temi, eventi, dati remoti paginati e schema JSON.

---

## Indice

- [Panoramica](#panoramica)
- [Installazione](#installazione)
- [Setup](#setup)
  - [Applicazioni NgModule](#applicazioni-ngmodule)
  - [Applicazioni Standalone](#applicazioni-standalone)
- [Utilizzo base](#utilizzo-base)
  - [Modalità ConfigForm (API Angular)](#modalità-configform-api-angular)
  - [Modalità JSON Schema](#modalità-json-schema)
- [Tipi di campo (TYPE_CONTROL_FORM)](#tipi-di-campo-type_control_form)
- [ConfigForm — struttura completa](#configform--struttura-completa)
  - [Group](#group)
  - [FormAction](#formaction)
  - [TypeComboOption](#typecombooption)
- [JSON Schema](#json-schema)
  - [DynamicFormJsonSchema](#dynamicformjsonschema)
  - [DynamicJsonField](#dynamicjsonfield)
  - [Validators JSON](#validators-json)
  - [Condizioni (visibleWhen / disabledWhen)](#condizioni-visiblewhen--disabledwhen)
- [Sistema di eventi](#sistema-di-eventi)
  - [Registrazione degli handler](#registrazione-degli-handler)
  - [DynamicFieldEventContext](#dynamicfieldeventcontext)
  - [Oggetto Utility](#oggetto-utility)
- [Dati remoti e paginazione](#dati-remoti-e-paginazione)
- [Temi e personalizzazione visiva](#temi-e-personalizzazione-visiva)
  - [Temi built-in](#temi-built-in)
  - [Custom tokens CSS](#custom-tokens-css)
- [Esempi completi](#esempi-completi)
  - [Form di registrazione con ConfigForm](#form-di-registrazione-con-configform)
  - [Form con JSON Schema](#form-con-json-schema)
  - [Form con dati remoti paginati](#form-con-dati-remoti-paginati)
  - [Form con condizioni dinamiche](#form-con-condizioni-dinamiche)
- [API di riferimento](#api-di-riferimento)
- [Build della libreria](#build-della-libreria)

---

## Panoramica

**DynamicForm** è una libreria Angular che permette di costruire form reattivi complessi in modo interamente dichiarativo, senza scrivere template HTML per ogni campo.

**Caratteristiche principali:**

- 🧩 **22 tipi di campo** — testo, numero, valuta, data, data-range, datetime, anno, orario, checkbox, radio, select, select paginata, file, textarea, label, link, separatore, array di stringhe, e altri
- 📋 **Doppia API** — `ConfigForm` (oggetti Angular) o `DynamicFormJsonSchema` (JSON puro, serializzabile)
- 🎣 **Sistema eventi** — `onChange`, `onInitialize`, `opened`, `closed`, `action`, `remoteData` risolti per nome da un registro centralizzato
- 📡 **Dati remoti paginati** — infinite scroll con Signal-based state management
- 🎨 **Tema CSS** — `modern-light` / `modern-dark` + token CSS custom completamente personalizzabili
- ✅ **Validators JSON** — `required`, `email`, `min`, `max`, `minLength`, `maxLength`, `pattern`
- 🔀 **Condizioni dichiarative** — `visibleWhen` / `disabledWhen` su qualsiasi campo
- 📱 **Speech recognition** e **camera scan** integrati nei campi testo/file

---

## Installazione

```bash
npm install dynamicform
```

Aggiungi gli stili globali in `angular.json`:

```json
"styles": [
  "src/styles.scss"
]
```

In `src/styles.scss` includi il tema della libreria:

```scss
@use 'path/to/dynamicform/src/lib/styles/dynamic-form-theme.scss' as *;
```

---

## Setup

### Applicazioni NgModule

```typescript
// app.module.ts
import { DynamicFormModule } from 'dynamicform';
import { provideDynamicFormForModule } from 'dynamicform';

@NgModule({
  imports: [DynamicFormModule],
  providers: [
    ...provideDynamicFormForModule({
      theme: { name: 'modern-light' },
      events: {
        onNomeChange: (ctx) => console.log('nome cambiato:', ctx.formControl.value),
      },
      actions: {
        onSalva: ({ formGroup }) => console.log('salva:', formGroup.value),
      },
    }),
  ],
})
export class AppModule {}
```

### Applicazioni Standalone

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideDynamicForm } from 'dynamicform';

bootstrapApplication(AppComponent, {
  providers: [
    provideDynamicForm({
      theme: { name: 'modern-dark' },
      events: { /* ... */ },
      actions: { /* ... */ },
    }),
  ],
});
```

---

## Utilizzo base

### Modalità ConfigForm (API Angular)

La `ConfigForm` è un array di `Group`, dove ogni gruppo contiene un array di `Form` (campi).

```typescript
// my-form.component.ts
import { ConfigForm, TYPE_CONTROL_FORM } from 'dynamicform';
import { FormControl, Validators } from '@angular/forms';
import { signal } from '@angular/core';

@Component({
  template: `
    <app-dynamic-form
      [config]="formConfig"
      (onFormCreate)="onFormReady($event)">
    </app-dynamic-form>
  `
})
export class MyFormComponent {
  formConfig: ConfigForm = [
    {
      title: 'Dati personali',
      formGroup: [
        {
          formAction: {
            formName: 'nome',
            title: 'Nome',
            type: TYPE_CONTROL_FORM.TEXT,
            formControl: new FormControl('', Validators.required),
            css: { class: ['col-md-6'] },
          }
        },
        {
          formAction: {
            formName: 'cognome',
            title: 'Cognome',
            type: TYPE_CONTROL_FORM.TEXT,
            formControl: new FormControl('', Validators.required),
            css: { class: ['col-md-6'] },
          }
        },
        {
          formAction: {
            formName: 'sesso',
            title: 'Sesso',
            type: TYPE_CONTROL_FORM.COMBO,
            formControl: new FormControl(null),
            options: signal([
              { id: 'M', description: 'Maschio' },
              { id: 'F', description: 'Femmina' },
            ]),
            css: { class: ['col-md-4'] },
          }
        },
      ],
      actions: [
        {
          label: 'Salva',
          cssClassButton: ['btn-primary'],
          action: (questions, idForm, formGroup) => {
            console.log('Form values:', formGroup.value);
          },
        },
      ],
    },
  ];

  onFormReady(fg: FormGroup | FormArray): void {
    console.log('Form creato:', fg);
  }
}
```

### Modalità JSON Schema

Perfetta per form definiti lato server o serializzati su database.

```typescript
// my-form.component.ts
import { DynamicFormJsonSchema } from 'dynamicform';

@Component({
  template: `
    <app-dynamic-form
      [json]="schema"
      (onFormCreate)="onFormReady($event)">
    </app-dynamic-form>
  `
})
export class MyFormComponent {
  schema: DynamicFormJsonSchema = {
    groups: [
      {
        title: 'Contatto',
        fields: [
          {
            name: 'email',
            type: 'EMAIL',
            label: 'Indirizzo email',
            validators: [{ type: 'required' }, { type: 'email' }],
            css: { class: ['col-md-6'] },
          },
          {
            name: 'telefono',
            type: 'TEXT',
            label: 'Telefono',
            css: { class: ['col-md-6'] },
          },
        ],
        actions: [
          {
            label: 'Conferma',
            cssClassButton: ['btn-success'],
            event: 'onConferma',
          },
        ],
      },
    ],
  };
}
```

---

## Tipi di campo (TYPE_CONTROL_FORM)

| Valore enum / stringa JSON | Componente | Descrizione |
|---|---|---|
| `TEXT` / `EMAIL` | `InputTextComponent` | Input testuale, supporta password e speech |
| `TEXTAREA` | `TextareaComponent` | Area di testo multiriga |
| `NUMBER` | `NumberComponent` | Input numerico con min/max/step |
| `CURRENCY` | `CurrencyComponent` | Input valuta con formattazione |
| `DATE` / `DATA` | `DateComponent` | Date picker (Angular Material) |
| `DATARANGE` | `DateRangeComponent` | Selezione intervallo date (from/to) |
| `DATETIME` | `DateTimeComponent` | Data + ora |
| `YEAR` | `DateYearComponent` | Selezione anno |
| `TIME` | `InputTimeComponent` | Selezione orario |
| `CHECKBOX` | `CheckboxComponent` | Checkbox singolo |
| `RADIOGROUP` | `QuestionRadioButtonComponent` | Gruppo di radio button |
| `COMBO` | `ComboComponent` | Select con ricerca |
| `COMBOPAGINATE` | `ComboComponent` | Select con ricerca e scroll infinito |
| `FILE` | `FileComponent` | Upload file, supporta camera scan |
| `ARRAYSTRING` | `ArrayStringComponent` | Input che accumula un array di stringhe (chips) |
| `LABEL` | `LabelComponent` | Testo informativo cliccabile |
| `LINK` | `LinkComponent` | Link ipertestuale |
| `SEPARATOR` | `SeparatorComponent` | Divisore visivo tra sezioni |
| `SORTACTION` | `SortActionComponent` | Pulsante di ordinamento toggle |
| `GROUP` | — | Campo contenitore per form annidati |

---

## ConfigForm — struttura completa

### Group

```typescript
type Group = {
  title?: string;                        // Titolo della sezione
  class?: string[];                      // Classi CSS sul contenitore del gruppo
  bottomLabel?: string;                  // Etichetta in fondo al gruppo
  formGroup?: Form[];                    // Array di campi
  actions?: DynamicFormActionButton[];   // Pulsanti di azione
};
```

### FormAction

```typescript
// Configurazione completa di un singolo campo
{
  formName: string;                      // Nome del campo nel FormGroup (chiave)
  title?: string;                        // Label visibile
  type: TYPE_CONTROL_FORM;              // Tipo di componente
  formControl: FormControl | FormGroup | FormArray; // Controllo Angular

  // Aspetto
  css?: TypeCss;                         // Classi CSS, icone, visibilità
  hint?: string;                         // Testo di aiuto sotto il campo
  tipContent?: string;                   // Tooltip informativo
  disabled?: boolean;
  readonly?: boolean;

  // Opzioni (per COMBO, COMBOPAGINATE, RADIOGROUP, TIME)
  options?: WritableSignal<TypeComboOption>;
  optionsDisabled?: Signal<TypeComboOption>;
  keyCombo?: { keyId: string|string[]; keyDescription: string|string[]; keySearch?: string };
  multiple?: boolean;                    // Selezione multipla
  autocomplete?: boolean;

  // Dati remoti
  remoteData?: Function;                 // Handler per fetch remoto
  paramsForRemoteData?: WritableSignal<Record<string, any>>;
  paging?: { count: number; page: number; totalCount?: number };

  // Opzioni specifiche per tipo
  optionDate?: TypeOptionDate;           // min/max per DATE
  optionTime?: TypeOptionTime;           // min/max per TIME
  optionNumber?: TypeOptionNumber;       // min/max/step per NUMBER

  // Form annidati (tipo GROUP)
  formGroup?: Group[];

  // Handler eventi
  onChange?: DynamicFormOnChange;
  onInitialize?: DynamicFormOnInitialize;
  opened?: DynamicFormOpenClose;
  closed?: DynamicFormOpenClose;
  action?: Function;                     // Azione inline del campo
}
```

### TypeComboOption

```typescript
type TypeComboOption = Array<{
  id: any;           // Valore salvato nel FormControl
  description: string; // Testo visualizzato
  img?: string;      // URL immagine affiancata alla voce
  extra?: any;       // Dati extra disponibili negli handler
  disabled?: boolean;
  default?: boolean; // Pre-selezionato di default
  hide?: boolean;    // Nascosto ma ancora presente
  tag?: { bgTag: string; bgText: string; name: string }; // Badge colorato
}>;
```

---

## JSON Schema

### DynamicFormJsonSchema

```typescript
interface DynamicFormJsonSchema {
  groups: DynamicJsonGroup[];
}

interface DynamicJsonGroup {
  title?: string;
  class?: string[];
  bottomLabel?: string;
  fields?: DynamicJsonField[];
  actions?: DynamicJsonAction[];
}

interface DynamicJsonAction {
  label: string;
  event: string;        // Nome dell'handler registrato in provideDynamicForm()
  cssClassButton?: string[];
  cssClassIcon?: string[];
  disabled?: boolean;
  visible?: boolean;
}
```

### DynamicJsonField

```typescript
interface DynamicJsonField {
  name: string;                          // formName
  type: keyof typeof TYPE_CONTROL_FORM;  // es. 'TEXT', 'COMBO', 'DATE'
  label?: string;
  value?: any;                           // Valore iniziale
  disabled?: boolean;
  readonly?: boolean;
  hint?: string;
  tipContent?: string;
  class?: string[];                      // Scorciatoia per css.class
  css?: TypeCss;
  validators?: DynamicJsonValidator[];
  options?: TypeComboOption;             // Opzioni statiche
  datasource?: DynamicJsonDatasource;    // Opzioni da registro
  remoteData?: string;                   // Nome handler dati remoti
  paging?: { count?: number; page?: number; totalCount?: number };
  paramsForRemoteData?: Record<string, any>;
  multiple?: boolean;
  autocomplete?: boolean;
  keyCombo?: { keyId: string|string[]; keyDescription: string|string[]; keySearch?: string };
  optionNumber?: TypeOptionNumber;
  optionDate?: TypeOptionDate;
  optionTime?: TypeOptionTime;
  visibleWhen?: DynamicJsonCondition[];  // Visibile solo se...
  disabledWhen?: DynamicJsonCondition[]; // Disabilitato solo se...
  events?: DynamicJsonFieldEvents;       // Nomi handler dal registro
  props?: Record<string, any>;           // Proprietà custom extra
  children?: DynamicJsonGroup[];         // Form annidati (tipo GROUP)
}
```

### Validators JSON

```typescript
// Disponibili come type in DynamicJsonValidator
{ type: 'required' }
{ type: 'requiredTrue' }
{ type: 'email' }
{ type: 'min',       value: 0 }
{ type: 'max',       value: 100 }
{ type: 'minLength', value: 3 }
{ type: 'maxLength', value: 50 }
{ type: 'pattern',   value: '^[a-z]+$' }
```

### Condizioni (visibleWhen / disabledWhen)

```typescript
interface DynamicJsonCondition {
  field: string;       // Nome del campo da osservare
  operator: 'eq' | 'neq' | 'in' | 'notIn' | 'truthy' | 'falsy'
           | 'gt' | 'gte' | 'lt' | 'lte';
  value?: any;
}

// Esempio: mostra il campo 'nota' solo quando 'tipo' === 'altro'
{
  name: 'nota',
  type: 'TEXTAREA',
  label: 'Nota',
  visibleWhen: [{ field: 'tipo', operator: 'eq', value: 'altro' }]
}
```

---

## Sistema di eventi

### Registrazione degli handler

Gli handler vengono registrati per nome nella configurazione della libreria.
Nello schema JSON (o nella `ConfigForm`) si referenzia il nome come stringa.

```typescript
provideDynamicForm({
  events: {
    // onChange
    onPaeseChange: (ctx) => {
      // Quando 'paese' cambia, aggiorna le opzioni di 'città'
      ctx.utility.getFormByName('citta', (formAction) => {
        (formAction.options as WritableSignal<TypeComboOption>).set(
          getCittaByPaese(ctx.formControl.value)
        );
      });
    },

    // onInitialize — carica dati all'avvio del campo
    onCategorieInit: async (ctx) => {
      const categorie = await fetchCategorie();
      (ctx.formAction?.options as WritableSignal<TypeComboOption>)?.set(categorie);
    },

    // remoteData — infinite scroll
    onProdottiRemote: (ctx) => {
      fetchProdotti(ctx.param?.search, ctx.paging).then(res => {
        ctx.externalStore?.set({ items: res.data, totalCount: res.total });
      });
    },
  },
  actions: {
    onSalva: ({ formGroup }) => {
      console.log('Dati:', formGroup.value);
    },
  },
})
```

### DynamicFieldEventContext

Tutti gli handler ricevono questo contesto:

```typescript
interface DynamicFieldEventContext {
  idGroup: number;          // Indice del gruppo corrente
  idForm: number;           // Indice del campo nel gruppo
  formControl: FormControl | FormArray | FormGroup;
  formName: string;         // Nome del campo
  formGroup: Form[];        // Tutti i campi del gruppo corrente
  type: TYPE_CONTROL_FORM;  // Tipo del campo
  prevValue?: any;          // Valore precedente (solo onChange)
  allGroup: ConfigForm;     // Intera struttura del form
  paging?: { count: number; page: number; totalCount?: number }; // Solo COMBOPAGINATE
  onOptionSetted?: Signal<any>; // Signal aggiornato quando le opzioni vengono impostate
  utility: Utility;         // Helper functions
  param?: any;              // Parametri di ricerca (solo remoteData)
  externalStore?: WritableSignal<any>; // Store Signal per remoteData
}
```

### Oggetto Utility

```typescript
// Disponibile come ctx.utility in tutti gli handler
utility.getFormByName('nomecampo', (formAction) => {
  // accede al FormAction del campo per nome
});

utility.getActionByName('nomeazione', (action) => {
  // accede a un DynamicFormActionButton per nome
});

utility.setDefaultOptions('nomecombo', () => [
  { id: 1, description: 'Opzione 1' }
]);

utility.getSelectedOptions('nomecombo', (signal) => {
  // legge le opzioni attualmente selezionate
});
```

---

## Dati remoti e paginazione

Il tipo `COMBOPAGINATE` supporta il caricamento lazy con infinite scroll.

**ConfigForm:**

```typescript
{
  formAction: {
    formName: 'prodotto',
    title: 'Prodotto',
    type: TYPE_CONTROL_FORM.COMBOPAGINATE,
    formControl: new FormControl(null),
    paging: { count: 25, page: 0, totalCount: 0 },
    paramsForRemoteData: signal({}),
    remoteData: (ctx) => {
      // ctx.param.search = testo cercato
      // ctx.paging = { count, page, totalCount }
      fetchProdotti(ctx.param?.search, ctx.paging).then(res => {
        ctx.externalStore.set({ items: res.data, totalCount: res.total });
      });
    },
  }
}
```

**JSON Schema:**

```json
{
  "name": "prodotto",
  "type": "COMBOPAGINATE",
  "label": "Prodotto",
  "paging": { "count": 25, "page": 0 },
  "events": {
    "remoteData": "onProdottiRemote"
  }
}
```

---

## Temi e personalizzazione visiva

### Temi built-in

| Nome | Descrizione |
|---|---|
| `modern-light` | Tema chiaro moderno (default) |
| `modern-dark` | Tema scuro moderno |
| `ivory-elegance` | Tema chiaro elegante caldo |
| `silk-compact` | Tema compatto con superfici seta |

```typescript
provideDynamicForm({
  theme: {
    name: 'modern-dark',
    mode: 'dark',
    applyToBody: true,     // true = applica su <body>, false = <html>
    rootSelector: null,    // es. '.my-shell' per scope limitato
  }
})
```

### Custom tokens CSS

Sovrascrittura precisa senza toccare i file SCSS:

```typescript
provideDynamicForm({
  theme: {
    name: 'modern-light',
    customTokens: {
      primary: '#7c3aed',
      primaryContrast: '#ffffff',
      primarySoft: '#ede9fe',
      accent: '#f59e0b',
      radiusMd: '8px',
      fieldHeight: '44px',
      shadowSm: '0 2px 8px rgba(0,0,0,0.08)',
    },
  },
})
```

Tutti i token sono CSS custom properties `--df-*` applicabili anche direttamente in SCSS:

```scss
.my-override {
  --df-primary: #e11d48;
  --df-radius-md: 4px;
}
```

---

## Esempi completi

### Form di registrazione con ConfigForm

```typescript
import { ConfigForm, TYPE_CONTROL_FORM } from 'dynamicform';
import { FormControl, Validators } from '@angular/forms';
import { signal } from '@angular/core';

export const registrationForm: ConfigForm = [
  {
    title: 'Dati anagrafici',
    formGroup: [
      {
        formAction: {
          formName: 'nome',
          title: 'Nome *',
          type: TYPE_CONTROL_FORM.TEXT,
          formControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
          css: { class: ['col-md-6'] },
        },
      },
      {
        formAction: {
          formName: 'cognome',
          title: 'Cognome *',
          type: TYPE_CONTROL_FORM.TEXT,
          formControl: new FormControl('', Validators.required),
          css: { class: ['col-md-6'] },
        },
      },
      {
        formAction: {
          formName: 'dataNascita',
          title: 'Data di nascita',
          type: TYPE_CONTROL_FORM.DATA,
          formControl: new FormControl(null),
          optionDate: { max: new Date().toISOString() },
          css: { class: ['col-md-4'] },
        },
      },
      {
        formAction: {
          formName: 'sesso',
          title: 'Sesso',
          type: TYPE_CONTROL_FORM.COMBO,
          formControl: new FormControl(null),
          options: signal([
            { id: 'M', description: 'Maschio' },
            { id: 'F', description: 'Femmina' },
            { id: 'NS', description: 'Non specificato' },
          ]),
          css: { class: ['col-md-4'] },
        },
      },
      {
        formAction: {
          formName: 'email',
          title: 'Email *',
          type: TYPE_CONTROL_FORM.EMAIL,
          formControl: new FormControl('', [Validators.required, Validators.email]),
          css: { class: ['col-md-8'] },
        },
      },
      {
        formAction: {
          formName: 'note',
          title: 'Note aggiuntive',
          type: TYPE_CONTROL_FORM.TEXTAREA,
          formControl: new FormControl(''),
          css: { class: ['col-12'], rows: 4 },
        },
      },
    ],
    actions: [
      {
        label: 'Registra',
        cssClassButton: ['btn-primary'],
        action: (questions, idForm, formGroup) => {
          if (formGroup.valid) {
            console.log('Dati registrazione:', formGroup.value);
          }
        },
      },
    ],
  },
];
```

### Form con JSON Schema

```typescript
import { DynamicFormJsonSchema } from 'dynamicform';

export const contactSchema: DynamicFormJsonSchema = {
  groups: [
    {
      title: 'Contattaci',
      fields: [
        {
          name: 'oggetto',
          type: 'COMBO',
          label: 'Oggetto *',
          validators: [{ type: 'required' }],
          options: [
            { id: 'info', description: 'Informazioni' },
            { id: 'support', description: 'Supporto tecnico' },
            { id: 'other', description: 'Altro' },
          ],
          css: { class: ['col-md-6'] },
        },
        {
          name: 'oggettoDettaglio',
          type: 'TEXT',
          label: 'Specifica',
          visibleWhen: [{ field: 'oggetto', operator: 'eq', value: 'other' }],
          validators: [{ type: 'required' }],
          css: { class: ['col-md-6'] },
        },
        {
          name: 'nome',
          type: 'TEXT',
          label: 'Nome *',
          validators: [{ type: 'required' }],
          css: { class: ['col-md-6'] },
        },
        {
          name: 'email',
          type: 'EMAIL',
          label: 'Email *',
          validators: [{ type: 'required' }, { type: 'email' }],
          css: { class: ['col-md-6'] },
        },
        {
          name: 'messaggio',
          type: 'TEXTAREA',
          label: 'Messaggio *',
          validators: [{ type: 'required' }, { type: 'minLength', value: 20 }],
          css: { class: ['col-12'], rows: 5 },
        },
        {
          name: 'privacy',
          type: 'CHECKBOX',
          label: 'Accetto la Privacy Policy *',
          validators: [{ type: 'requiredTrue' }],
          css: { class: ['col-12'] },
        },
      ],
      actions: [
        {
          label: 'Invia messaggio',
          cssClassButton: ['btn-primary'],
          event: 'onInviaContatto',
        },
      ],
    },
  ],
};
```

### Form con dati remoti paginati

```typescript
// provider setup
provideDynamicForm({
  events: {
    onRicercaProdotti: (ctx) => {
      const { search } = ctx.param ?? {};
      const { count, page } = ctx.paging ?? { count: 25, page: 0 };

      prodottiService.search({ query: search, size: count, page }).subscribe(res => {
        ctx.externalStore.set({
          items: res.content.map(p => ({ id: p.id, description: p.nome, extra: p })),
          totalCount: res.totalElements,
        });
      });
    },
  },
})

// ConfigForm
{
  formAction: {
    formName: 'prodotto',
    title: 'Prodotto',
    type: TYPE_CONTROL_FORM.COMBOPAGINATE,
    formControl: new FormControl(null, Validators.required),
    paging: { count: 25, page: 0, totalCount: 0 },
    paramsForRemoteData: signal({ categoria: 'elettronica' }),
    remoteData: ctx => { /* delegato all'handler del provider */ },
    keyCombo: { keyId: 'id', keyDescription: 'description' },
    css: { class: ['col-md-8'] },
  }
}
```

### Form con condizioni dinamiche

```json
{
  "groups": [{
    "title": "Pagamento",
    "fields": [
      {
        "name": "metodoPagamento",
        "type": "RADIOGROUP",
        "label": "Metodo di pagamento",
        "options": [
          { "id": "carta", "description": "Carta di credito" },
          { "id": "bonifico", "description": "Bonifico bancario" },
          { "id": "contanti", "description": "Contanti" }
        ]
      },
      {
        "name": "numeroCarta",
        "type": "TEXT",
        "label": "Numero carta",
        "visibleWhen": [{ "field": "metodoPagamento", "operator": "eq", "value": "carta" }],
        "validators": [{ "type": "required" }, { "type": "minLength", "value": 16 }]
      },
      {
        "name": "iban",
        "type": "TEXT",
        "label": "IBAN",
        "visibleWhen": [{ "field": "metodoPagamento", "operator": "eq", "value": "bonifico" }],
        "validators": [{ "type": "required" }]
      },
      {
        "name": "importoMassimo",
        "type": "CURRENCY",
        "label": "Importo massimo",
        "disabledWhen": [{ "field": "metodoPagamento", "operator": "eq", "value": "contanti" }]
      }
    ]
  }]
}
```

---

## API di riferimento

### DynamicFormComponent

| Input | Tipo | Descrizione |
|---|---|---|
| `[config]` | `ConfigForm` | Configurazione Angular runtime |
| `[questions]` | `ConfigForm` | Alias di `[config]` (retrocompatibilità) |
| `[json]` | `DynamicFormJsonSchema` | Schema JSON puro |

| Output | Tipo | Descrizione |
|---|---|---|
| `(onFormCreate)` | `EventEmitter<FormGroup\|FormArray>` | Emesso dopo la costruzione del form |
| `(onQuestionsCreate)` | `EventEmitter<ConfigForm>` | Emesso dopo la costruzione del form |

### DynamicFormEventRegistryService

| Metodo | Firma | Descrizione |
|---|---|---|
| `registerEvents` | `(events: Record<string, DynamicFieldEventHandler>) => void` | Aggiunge handler di campo |
| `registerActions` | `(actions: Record<string, DynamicActionEventHandler>) => void` | Aggiunge handler di azione |
| `getEvent` | `(name?: string) => DynamicFieldEventHandler \| undefined` | Recupera handler per nome |
| `getAction` | `(name?: string) => DynamicActionEventHandler \| undefined` | Recupera azione per nome |

### DynamicFormThemeService

| Metodo | Descrizione |
|---|---|
| `init()` | Inizializza tema e token dalla configurazione |
| `applyTheme(name)` | Applica classe `df-theme-{name}` |
| `applyCustomTokens(tokens)` | Inietta CSS custom properties |
| `getThemeRoot()` | Restituisce l'elemento DOM root del tema |

---

## Build della libreria

```bash
# Build libreria
ng build dynamicform

# Build produzione
ng build dynamicform --configuration production

# Watch mode (sviluppo)
ng build dynamicform --watch
```

La libreria compilata sarà in `dist/dynamicform/`.

Per usarla localmente in un'altra app Angular:

```bash
# nell'app consumer
npm install /percorso/assoluto/dist/dynamicform
```

---

*Libreria sviluppata da [Luca Piciollo](mailto:lucapiciollo@gmail.com)*

