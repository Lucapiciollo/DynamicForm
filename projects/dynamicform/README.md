# DynamicForm

**DynamicForm** è una libreria open source per Angular che consente di generare form dinamici, complessi e completamente configurabili tramite oggetti TypeScript o JSON, senza scrivere template HTML manualmente.

---

## Indice

1. [Cos'è DynamicForm](#cosè-dynamicform)
2. [Caratteristiche e Vantaggi](#caratteristiche-e-vantaggi)
3. [Quando usarla](#quando-usarla)
4. [Installazione](#installazione)
5. [Configurazione e Import](#configurazione-e-import)
6. [Utilizzo Base](#utilizzo-base)
7. [Tipi di Campo e Parametri](#tipi-di-campo-e-parametri)
8. [Action, Eventi e Utility](#action-eventi-e-utility)
9. [Esempi Avanzati](#esempi-avanzati)
10. [Best Practice](#best-practice)
11. [Estensione e Personalizzazione](#estensione-e-personalizzazione)
12. [Supporto](#supporto)

---

## Cos'è DynamicForm

DynamicForm nasce per semplificare la creazione di interfacce di input avanzate, wizard, anagrafiche, configuratori e qualsiasi scenario in cui la struttura del form può cambiare a runtime o deriva da dati esterni (API, configurazioni, database, ecc.).

## Caratteristiche e Vantaggi

- **Zero template HTML**: definisci la struttura del form in modo dichiarativo, il rendering è automatico.
- **Supporto a tutti i tipi di campo**: text, combo, multi-combo, paginati, date, file, textarea, checkbox, radio, array di stringhe, gruppi annidati, ecc.
- **Eventi e azioni custom**: puoi reagire a ogni cambiamento, ricerca, scroll, validazione, click su pulsanti custom.
- **Paginazione e ricerca remota**: combo e multi-combo con caricamento asincrono e paginazione.
- **Temi e personalizzazione**: supporto a Material, dark/light mode, custom CSS.
- **Injection token/config provider**: configurazione centralizzata e override per moduli/feature.
- **Estendibile**: aggiungi facilmente nuovi tipi di campo o comportamenti.

## Quando usarla

- Quando vuoi generare form da configurazione (anche da backend)
- Quando la struttura del form può cambiare a runtime
- Per wizard, anagrafiche, configuratori, CRUD generici, backend form builder
- Per ridurre la duplicazione di codice nei form Angular

---


## Installazione

```bash
npm install dynamicform
```

> **Attenzione:** DynamicForm richiede alcune dipendenze esterne come peerDependencies. Se usi la libreria in un tuo progetto, assicurati di installare anche queste (versioni >=19 per Angular, >=5 per ionic-native/camera, >=2.29 per moment):

```bash
npm install @angular/material @angular/cdk @angular/forms @ionic-native/camera moment @angular/material-moment-adapter
```

La libreria è compatibile con tutte le versioni di Angular dalla 19 in su (>=19.0.0).

---


## Configurazione e Import


### Modulo classico (NgModule)

```ts
import { DynamicFormModule } from 'dynamicform';

@NgModule({
  imports: [DynamicFormModule],
})
export class AppModule {}
```


### Standalone (Angular 16+)
---

## Compatibilità e dipendenze

- DynamicForm è compatibile con Angular >=19.
- Tutte le dipendenze principali sono dichiarate come peerDependencies: il tuo progetto deve già includerle o installarle.
- Se ricevi errori come "Cannot find module '@angular/material'" o simili, installa le dipendenze mancanti come indicato sopra.

```ts
import { provideDynamicForm } from 'dynamicform';
bootstrapApplication(AppComponent, {
  providers: [
    provideDynamicForm({
      theme: { name: 'modern-dark' },
      events: { onNomeChange: ctx => console.log(ctx) },
    }),
  ],
});
```

---

## Utilizzo Base

### 1. Configurazione TypeScript (`ConfigForm`)

```ts
import { TYPE_CONTROL_FORM, ConfigForm } from 'dynamicform';

const myForm: ConfigForm = [
   {
      title: 'Dati Anagrafici',
      formGroup: [
         { formAction: { formName: 'nome', label: 'Nome', type: TYPE_CONTROL_FORM.TEXT, required: true } },
         { formAction: { formName: 'cognome', label: 'Cognome', type: TYPE_CONTROL_FORM.TEXT } },
         { formAction: { formName: 'sesso', label: 'Sesso', type: TYPE_CONTROL_FORM.COMBO, options: [ { id: 'M', description: 'Maschio' }, { id: 'F', description: 'Femmina' } ] } },
      ],
      actions: [
         { label: 'Salva', action: (questions, idForm, formGroup) => { ... } }
      ]
   }
];
```

### 2. Configurazione JSON

```json
{
  "groups": [
    {
      "title": "Dati Anagrafici",
      "formGroup": [
        { "formAction": { "formName": "nome", "label": "Nome", "type": "TEXT", "required": true } },
        { "formAction": { "formName": "cognome", "label": "Cognome", "type": "TEXT" } },
        {
          "formAction": {
            "formName": "sesso",
            "label": "Sesso",
            "type": "COMBO",
            "options": [
              { "id": "M", "description": "Maschio" },
              { "id": "F", "description": "Femmina" }
            ]
          }
        }
      ],
      "actions": [{ "label": "Salva" }]
    }
  ]
}
```

### Utilizzo nel template

```html
<!-- Con configurazione TypeScript -->
<app-dynamic-form [config]="myForm" (onFormCreate)="onForm($event)"></app-dynamic-form>

<!-- Con schema JSON -->
<app-dynamic-form [json]="myJsonSchema" (onFormCreate)="onForm($event)"></app-dynamic-form>
```

---

## Tipi di Campo e Parametri

### Tipi di campo (`TYPE_CONTROL_FORM`)

- `TEXT`, `TEXTAREA`, `NUMBER`, `CHECKBOX`, `COMBO`, `COMBOPAGINATE`, `ARRAYSTRING`, `DATE`, `DATETIME`, `DATARANGE`, `YEAR`, `CURRENCY`, `FILE`, `RADIOGROUP`, `LABEL`, `LINK`, `SEPARATOR`, `SORTACTION`, ...

### Parametri comuni (`FormActionBase`)

- `formName`: nome univoco del campo
- `label`: etichetta visualizzata
- `type`: tipo di campo (vedi sopra)
- `formControl`: FormControl associato (opzionale)
- `options`: per combo/radio, array di opzioni `{ id, description }`
- `multiple`: multi-selezione (combo)
- `remoteData`: funzione per caricamento asincrono (combo paginate)
- `onChange`, `onSearch`, `onScrollEnd`, `onInitialize`: handler eventi
- `disabled`, `readonly`, `hidden`, `placeholder`, `hint`, `info`, `css`, ...

### Combo, Multi-combo, Paginazione

- **Combo**: usa `options` statiche o caricate da API
- **Multi-combo**: aggiungi `multiple: true`
- **Combo paginata**: usa `type: COMBOPAGINATE`, `remoteData`, `paging`, `onScrollEnd`

---

## Action, Eventi e Utility

### Action sui pulsanti

Ogni gruppo può avere un array di `actions` che genera pulsanti custom. Ogni action riceve:

- `questions`: la configurazione del form (ConfigForm)
- `idForm`: indice del gruppo
- `formGroup`: il FormGroup/FormArray associato

Esempio:

```ts
actions: [
  {
    label: 'Valida',
    action: (questions, idForm, formGroup) => {
      formGroup.markAllAsTouched();
      console.log('Valido:', formGroup.valid);
    },
  },
  {
    label: 'Aggiungi indirizzo',
    action: (questions, idForm, formGroup) => {
      // Aggiunge un nuovo gruppo indirizzo (fratello)
      const addresses = formGroup.get('addresses') as FormArray;
      addresses.push(
        new FormGroup({
          street: new FormControl(''),
          city: new FormControl(''),
        }),
      );
    },
  },
];
```

### Utility helpers

Per manipolare facilmente la struttura del form puoi usare funzioni helper come:

- `groupAt(formGroup, 'mainAddress')`: ottieni un gruppo annidato
- `controlAt(formGroup, 'mainAddress.city')`: ottieni un controllo annidato
- `collectFormErrors(formGroup)`: raccogli tutti gli errori
  Queste funzioni sono disponibili in `nested-actions-form.builder.ts` e possono essere copiate nei tuoi servizi.

### Esempio avanzato: aggiungere/rimuovere gruppi dinamicamente

Supponiamo di voler permettere all'utente di aggiungere più indirizzi:

```ts
actions: [
  {
    label: 'Aggiungi indirizzo',
    action: (questions, idForm, formGroup) => {
      const indirizzi = formGroup.get('addresses') as FormArray;
      indirizzi.push(
        new FormGroup({
          street: new FormControl(''),
          city: new FormControl(''),
        }),
      );
    },
  },
  {
    label: 'Rimuovi ultimo indirizzo',
    action: (questions, idForm, formGroup) => {
      const indirizzi = formGroup.get('addresses') as FormArray;
      if (indirizzi.length > 0) indirizzi.removeAt(indirizzi.length - 1);
    },
  },
];
```

### Modifica della configurazione (questions)

Puoi anche modificare la configurazione `questions` per aggiungere/rimuovere campi a runtime (ad esempio per mostrare/nascondere campi in base a scelte dell'utente). Dopo la modifica, puoi forzare la ricompilazione del form aggiornando l'input `[config]`.

---

---

## Action, Eventi e Utility

### Action sui pulsanti

Ogni gruppo può avere un array di `actions` che genera pulsanti custom. Ogni action riceve:

- `questions`: la configurazione del form (ConfigForm)
- `idForm`: indice del gruppo
- `formGroup`: il FormGroup/FormArray associato

Esempio:

```ts
actions: [
  {
    label: 'Valida',
    action: (questions, idForm, formGroup) => {
      formGroup.markAllAsTouched();
      console.log('Valido:', formGroup.valid);
    },
  },
  {
    label: 'Aggiungi indirizzo',
    action: (questions, idForm, formGroup) => {
      // Aggiunge un nuovo gruppo indirizzo (fratello)
      const addresses = formGroup.get('addresses') as FormArray;
      addresses.push(
        new FormGroup({
          street: new FormControl(''),
          city: new FormControl(''),
        }),
      );
    },
  },
];
```

### Utility helpers

Per manipolare facilmente la struttura del form puoi usare funzioni helper come:

- `groupAt(formGroup, 'mainAddress')`: ottieni un gruppo annidato
- `controlAt(formGroup, 'mainAddress.city')`: ottieni un controllo annidato
- `collectFormErrors(formGroup)`: raccogli tutti gli errori
  Queste funzioni sono disponibili in `nested-actions-form.builder.ts` e possono essere copiate nei tuoi servizi.

### Esempio avanzato: aggiungere/rimuovere gruppi dinamicamente

Supponiamo di voler permettere all'utente di aggiungere più indirizzi:

```ts
actions: [
  {
    label: 'Aggiungi indirizzo',
    action: (questions, idForm, formGroup) => {
      const indirizzi = formGroup.get('addresses') as FormArray;
      indirizzi.push(
        new FormGroup({
          street: new FormControl(''),
          city: new FormControl(''),
        }),
      );
    },
  },
  {
    label: 'Rimuovi ultimo indirizzo',
    action: (questions, idForm, formGroup) => {
      const indirizzi = formGroup.get('addresses') as FormArray;
      if (indirizzi.length > 0) indirizzi.removeAt(indirizzi.length - 1);
    },
  },
];
```

### Modifica della configurazione (questions)

Puoi anche modificare la configurazione `questions` per aggiungere/rimuovere campi a runtime (ad esempio per mostrare/nascondere campi in base a scelte dell'utente). Dopo la modifica, puoi forzare la ricompilazione del form aggiornando l'input `[config]`.

---

## Esempi Avanzati

Consulta il file `nested-actions-form.builder.ts` per esempi di form annidati, action avanzate, validazione, patch dinamico dei dati, calcoli automatici, copia di sezioni, ecc.

---

## Best Practice

- Usa `formName` univoci per ogni campo
- Gestisci eventi con funzioni pure o servizi
- Per combo remote, gestisci cache e paginazione lato API
- Personalizza il tema tramite provider
- Usa `onFormCreate` per accedere al FormGroup e integrarlo nella tua logica

---

## Estensione e Personalizzazione

- Puoi aggiungere nuovi tipi di campo estendendo `BaseComponent`
- Puoi fornire nuovi handler eventi tramite provider
- Puoi customizzare il tema e i CSS

---


## Supporto

Per domande, segnalazioni o supporto: lucapiciollo@gmail.com

## Vantaggi

- **Zero template HTML**: definisci tutto da configurazione.
- **Supporto a tutti i tipi di campo**: text, combo, multi-combo, paginati, date, file, textarea, checkbox, radio, array di stringhe, ecc.
- **Paginazione e ricerca remota**: combo e multi-combo con caricamento asincrono e paginazione.
- **Eventi e azioni custom**: onChange, onSearch, onScrollEnd, onInitialize, ecc.
- **Temi e personalizzazione**: supporto a Material, dark/light mode, custom CSS.
- **Injection token/config provider**: configurazione centralizzata e override per moduli/feature.
- **Estendibile**: aggiungi facilmente nuovi tipi di campo o comportamenti.

---

## Installazione e Import

1. Installa la libreria (se pubblicata su npm):

   ```bash
   npm install dynamicform
   ```

2. Importa il modulo nel tuo `AppModule` o modulo feature:

   ```ts
   import { DynamicFormModule } from 'dynamicform';

   @NgModule({
     imports: [DynamicFormModule],
   })
   export class AppModule {}
   ```

3. Oppure, per applicazioni standalone Angular 16+:
   ```ts
   import { provideDynamicForm } from 'dynamicform';
   bootstrapApplication(AppComponent, {
     providers: [
       provideDynamicForm({
         theme: { name: 'modern-dark' },
         events: { onNomeChange: ctx => console.log(ctx) },
       }),
     ],
   });
   ```

---

## Configurazione (Injection Token)

DynamicForm supporta la configurazione globale tramite provider:

- **Standalone**: `provideDynamicForm(config)`
- **NgModule**: `...provideDynamicFormForModule(config)`

Esempio:

```ts
import { provideDynamicFormForModule } from 'dynamicform';

@NgModule({
   imports: [DynamicFormModule],
   providers: [
      ...provideDynamicFormForModule({
         theme: { name: 'modern-light' },
         events: { onFieldChange: ctx => ... },
         actions: { onSave: ctx => ... },
      }),
   ],
})
export class AppModule {}
```

---

## Come si crea un form (TS/JSON)

### 1. Configurazione TypeScript (`ConfigForm`)

```ts
import { TYPE_CONTROL_FORM, ConfigForm } from 'dynamicform';

const myForm: ConfigForm = [
   {
      title: 'Dati Anagrafici',
      formGroup: [
         { formAction: { formName: 'nome', label: 'Nome', type: TYPE_CONTROL_FORM.TEXT, required: true } },
         { formAction: { formName: 'cognome', label: 'Cognome', type: TYPE_CONTROL_FORM.TEXT } },
         { formAction: { formName: 'sesso', label: 'Sesso', type: TYPE_CONTROL_FORM.COMBO, options: [ { id: 'M', description: 'Maschio' }, { id: 'F', description: 'Femmina' } ] } },
      ],
      actions: [
         { label: 'Salva', action: (questions, idForm, formGroup) => { ... } }
      ]
   }
];
```

### 2. Configurazione JSON

```json
{
  "groups": [
    {
      "title": "Dati Anagrafici",
      "formGroup": [
        { "formAction": { "formName": "nome", "label": "Nome", "type": "TEXT", "required": true } },
        { "formAction": { "formName": "cognome", "label": "Cognome", "type": "TEXT" } },
        {
          "formAction": {
            "formName": "sesso",
            "label": "Sesso",
            "type": "COMBO",
            "options": [
              { "id": "M", "description": "Maschio" },
              { "id": "F", "description": "Femmina" }
            ]
          }
        }
      ],
      "actions": [{ "label": "Salva" }]
    }
  ]
}
```

---

## Utilizzo nel template

```html
<!-- Con configurazione TypeScript -->
<app-dynamic-form [config]="myForm" (onFormCreate)="onForm($event)"></app-dynamic-form>

<!-- Con schema JSON -->
<app-dynamic-form [json]="myJsonSchema" (onFormCreate)="onForm($event)"></app-dynamic-form>
```

---

## Componenti supportati e parametri

### Tipi di campo (`TYPE_CONTROL_FORM`)

- `TEXT`, `TEXTAREA`, `NUMBER`, `CHECKBOX`, `COMBO`, `COMBOPAGINATE`, `ARRAYSTRING`, `DATE`, `DATETIME`, `DATARANGE`, `YEAR`, `CURRENCY`, `FILE`, `RADIOGROUP`, `LABEL`, `LINK`, `SEPARATOR`, `SORTACTION`, ...

### Parametri comuni (`FormActionBase`)

- `formName`: nome univoco del campo
- `label`: etichetta visualizzata
- `type`: tipo di campo (vedi sopra)
- `formControl`: FormControl associato (opzionale)
- `options`: per combo/radio, array di opzioni `{ id, description }`
- `multiple`: multi-selezione (combo)
- `remoteData`: funzione per caricamento asincrono (combo paginate)
- `onChange`, `onSearch`, `onScrollEnd`, `onInitialize`: handler eventi
- `disabled`, `readonly`, `hidden`, `placeholder`, `hint`, `info`, `css`, ...

### Combo, Multi-combo, Paginazione

- **Combo**: usa `options` statiche o caricate da API
- **Multi-combo**: aggiungi `multiple: true`
- **Combo paginata**: usa `type: COMBOPAGINATE`, `remoteData`, `paging`, `onScrollEnd`

Esempio combo paginata:

````ts
{
   formAction: {
      formName: 'prodotti',
      label: 'Prodotti',
      type: TYPE_CONTROL_FORM.COMBOPAGINATE,
      remoteData: (input, config) => { ... },
      paging: { count: 20, page: 1, totalCount: 100 },

      # DynamicForm

      DynamicForm è una libreria open source per Angular che permette di generare form dinamici e complessi tramite configurazione TypeScript o JSON, senza scrivere template HTML manuali.

      ---

      ## Caratteristiche principali

      - Generazione automatica di form da oggetti di configurazione
      - Supporto a tutti i tipi di campo: text, combo, multi-combo, paginati, date, file, textarea, checkbox, radio, array di stringhe, gruppi annidati, ecc.
      - Eventi e azioni custom: onChange, onSearch, onScrollEnd, onInitialize, click su pulsanti custom
      - Paginazione e ricerca remota su combo e multi-combo
      - Injection token/config provider per configurazione centralizzata
      - Estendibile: puoi aggiungere nuovi tipi di campo o comportamenti

      ---

      ## Installazione

      ```bash
      npm install dynamicform
      ```

      ---

      ## Import e configurazione

      ### Modulo classico (NgModule)
      ```ts
      import { DynamicFormModule } from 'dynamicform';

      @NgModule({
         imports: [DynamicFormModule],
      })
      export class AppModule {}
      ```

      ### Standalone (Angular 16+)
      ```ts
      import { provideDynamicForm } from 'dynamicform';
      bootstrapApplication(AppComponent, {
         providers: [
            provideDynamicForm({
               // puoi aggiungere qui handler eventi globali
               events: { onFieldChange: ctx => ... },
               actions: { onSave: ctx => ... },
            }),
         ],
      });
      ```

      ---

      ## Utilizzo base


      ### Esempio base: form anagrafica semplice
      ```ts
      import { TYPE_CONTROL_FORM, ConfigForm } from 'dynamicform';

      export const anagraficaForm: ConfigForm = [
         {
            title: 'Dati Anagrafici',
            formGroup: [
               { formAction: { formName: 'nome', label: 'Nome', type: TYPE_CONTROL_FORM.TEXT, required: true } },
               { formAction: { formName: 'cognome', label: 'Cognome', type: TYPE_CONTROL_FORM.TEXT } },
               { formAction: { formName: 'sesso', label: 'Sesso', type: TYPE_CONTROL_FORM.COMBO, options: [
                  { id: 'M', description: 'Maschio' },
                  { id: 'F', description: 'Femmina' },
                  { id: 'N', description: 'Non specificato' }
               ] } },
            ],
            actions: [
               {
                  label: 'Salva',
                  action: (_questions, _idForm, formGroup) => {
                     alert('Valore del form: ' + JSON.stringify(formGroup.value));
                  }
               }
            ]
         }
      ];
      ```

      ### Esempio: combo multi-selezione
      ```ts
      {
         formAction: {
            formName: 'ruoli',
            label: 'Ruoli',
            type: TYPE_CONTROL_FORM.COMBO,
            options: [
               { id: 'admin', description: 'Amministratore' },
               { id: 'user', description: 'Utente' },
               { id: 'guest', description: 'Ospite' }
            ],
            multiple: true
         }
      }
      ```

      ### Esempio: combo paginata e caricamento remoto
      ```ts
      {
         formAction: {
            formName: 'prodotti',
            label: 'Prodotti',
            type: TYPE_CONTROL_FORM.COMBOPAGINATE,
            remoteData: (input, config) => {
               // Simula chiamata API asincrona
               config?.injector?.get(HttpClient).get('/api/prodotti', { params: { search: input } });
            },
            paging: { count: 20, page: 1, totalCount: 100 },
            onScrollEnd: (idGroup, idForm, formControl, formName, formGroup, paging, utility) => {
               // Carica altre pagine
            }
         }
      }
      ```

      ### Esempio: action che aggiunge dinamicamente un gruppo indirizzo
      ```ts
      actions: [
         {
            label: 'Aggiungi indirizzo',
            action: (questions, idForm, formGroup) => {
               const indirizzi = formGroup.get('addresses') as FormArray;
               indirizzi.push(new FormGroup({
                  street: new FormControl(''),
                  city: new FormControl(''),
               }));
            }
         }
      ]
      ```

      ### Esempio JSON equivalente
      ```json
      {
         "groups": [
            {
               "title": "Dati Anagrafici",
               "formGroup": [
                  { "formAction": { "formName": "nome", "label": "Nome", "type": "TEXT", "required": true } },
                  { "formAction": { "formName": "cognome", "label": "Cognome", "type": "TEXT" } },
                  { "formAction": { "formName": "sesso", "label": "Sesso", "type": "COMBO", "options": [
                     { "id": "M", "description": "Maschio" },
                     { "id": "F", "description": "Femmina" },
                     { "id": "N", "description": "Non specificato" }
                  ] } }
               ],
               "actions": [
                  { "label": "Salva" }
               ]
            }
         ]
      }
      ```


      ### Utilizzo nel template Angular
      ```html
      <!-- Con configurazione TypeScript -->
      <app-dynamic-form [config]="anagraficaForm" (onFormCreate)="onForm($event)"></app-dynamic-form>

      <!-- Con schema JSON -->
      <app-dynamic-form [json]="myJsonSchema" (onFormCreate)="onForm($event)"></app-dynamic-form>
      ```

      ---

      ## Tipi di campo supportati

      `TYPE_CONTROL_FORM`:

      - TEXT, TEXTAREA, NUMBER, CHECKBOX, COMBO, COMBOPAGINATE, ARRAYSTRING, DATE, DATETIME, DATARANGE, YEAR, CURRENCY, FILE, RADIOGROUP, LABEL, LINK, SEPARATOR, SORTACTION, ...

      ---

      ## Parametri principali dei campi

      - `formName`: nome univoco del campo
      - `label`: etichetta visualizzata
      - `type`: tipo di campo (vedi sopra)
      - `formControl`: FormControl associato (opzionale)
      - `options`: per combo/radio, array di opzioni `{ id, description }`
      - `multiple`: multi-selezione (combo)
      - `remoteData`: funzione per caricamento asincrono (combo paginate)
      - `onChange`, `onSearch`, `onScrollEnd`, `onInitialize`: handler eventi
      - `disabled`, `readonly`, `hidden`, `placeholder`, `hint`, `info`, `css`, ...

      ---

      ## Action, eventi e manipolazione dinamica

      ### Action sui pulsanti
      Ogni gruppo può avere un array di `actions` che genera pulsanti custom. Ogni action riceve:
      - `questions`: la configurazione del form (ConfigForm)
      - `idForm`: indice del gruppo
      - `formGroup`: il FormGroup/FormArray associato

      Esempio:
      ```ts
      actions: [
         {
            label: 'Valida',
            action: (questions, idForm, formGroup) => {
               formGroup.markAllAsTouched();
               console.log('Valido:', formGroup.valid);
            }
         },
         {
            label: 'Aggiungi indirizzo',
            action: (questions, idForm, formGroup) => {
               const addresses = formGroup.get('addresses') as FormArray;
               addresses.push(new FormGroup({
                  street: new FormControl(''),
                  city: new FormControl(''),
               }));
            }
         }
      ]
      ```

      ### Utility helpers
      Per manipolare facilmente la struttura del form puoi usare funzioni helper come:
      - `groupAt(formGroup, 'mainAddress')`: ottieni un gruppo annidato
      - `controlAt(formGroup, 'mainAddress.city')`: ottieni un controllo annidato
      - `collectFormErrors(formGroup)`: raccogli tutti gli errori
      Queste funzioni sono disponibili in `nested-actions-form.builder.ts`.

      ### Esempio avanzato: aggiungere/rimuovere gruppi dinamicamente
      ```ts
      actions: [
         {
            label: 'Aggiungi indirizzo',
            action: (questions, idForm, formGroup) => {
               const indirizzi = formGroup.get('addresses') as FormArray;
               indirizzi.push(new FormGroup({
                  street: new FormControl(''),
                  city: new FormControl(''),
               }));
            }
         },
         {
            label: 'Rimuovi ultimo indirizzo',
            action: (questions, idForm, formGroup) => {
               const indirizzi = formGroup.get('addresses') as FormArray;
               if (indirizzi.length > 0) indirizzi.removeAt(indirizzi.length - 1);
            }
         }
      ]
      ```

      ### Modifica della configurazione (questions)
      Puoi anche modificare la configurazione `questions` per aggiungere/rimuovere campi a runtime (ad esempio per mostrare/nascondere campi in base a scelte dell'utente). Dopo la modifica, puoi forzare la ricompilazione del form aggiornando l'input `[config]`.

      ---


      ## Esempi pratici avanzati

      - Consulta il file `nested-actions-form.builder.ts` per esempi di:
         - Form annidati (gruppi dentro gruppi)
         - Action avanzate (validazione, patch dinamico dei dati, calcoli automatici, copia di sezioni)
         - Manipolazione runtime della struttura del form

      ---

      ## Best practice

      - Usa `formName` univoci per ogni campo
      - Gestisci eventi con funzioni pure o servizi
      - Per combo remote, gestisci cache e paginazione lato API
      - Usa `onFormCreate` per accedere al FormGroup e integrarlo nella tua logica

      ---

      ## Estensione e personalizzazione

      - Puoi aggiungere nuovi tipi di campo estendendo `BaseComponent`
      - Puoi fornire nuovi handler eventi tramite provider
      - Puoi customizzare i CSS

      ---

      ## Supporto

      Per domande o supporto: lucapiciollo@gmail.com
````
