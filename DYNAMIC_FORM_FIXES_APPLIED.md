# DynamicForm - fix applicati nel pacchetto completo

Questo pacchetto parte dalla versione con doppia modalità `config` Angular + `json` e aggiunge le correzioni emerse dai test runtime.

## Fix funzionali

### Date range

Il componente `DATARANGE` usa internamente i control name `from` e `to`.
Nel builder TypeScript e nel mapper JSON ora il controllo viene creato come:

```ts
new FormGroup({
  from: new FormControl<Date | null>(null),
  to: new FormControl<Date | null>(null),
})
```

In più `DateRangeComponent` ha una protezione: se riceve un control non corretto, crea comunque un `FormGroup` con `from` e `to` per evitare l'errore:

```text
Cannot find control with name: 'from'
Cannot find control with name: 'to'
```

### Combo store

Rimossi tutti gli usi di `.clone()` sugli array.
Ora lo store usa funzioni sicure:

```ts
Array.isArray(value) ? [...value] : []
```

Questo evita errori tipo:

```text
array.clone is not a function
this.getFilterOption(...).clone is not a function
```

### Combo paginata

La combo paginata continua a supportare:

- `COMBOPAGINATE`
- `remoteData`
- ricerca testuale
- scroll bottom sul pannello Material
- append delle pagine successive
- `paramsForRemoteData`
- `keyCombo.keySearch`

Il componente ora passa a `remoteData` anche questi riferimenti:

```ts
{
  param,
  externalStore,
  signalStore,
  formAction,
  formGroup,
  instance
}
```

Nel playground il datasource mock aggiorna `externalStore` con:

```ts
externalStore?.set?.({ items, totalCount })
```

### Sort action

`SortActionComponent` ora è robusto anche se non vengono passate icone SVG.
Se mancano `css.toggleIcons`, usa `mat-icon`:

```text
arrow_upward / arrow_downward
```

## File principali modificati

```text
src/app/dynamicForm/component/combo/store.ts
src/app/dynamicForm/component/combo/combo.component.ts
src/app/dynamicForm/component/date-range/date-range.component.ts
src/app/dynamicForm/services/dynamic-form-json-mapper.service.ts
src/app/dynamicForm/examples/all-components-form.builder.ts
src/app/dynamicForm/examples/all-components-json.schema.ts
src/app/dynamicForm/examples/dynamic-form-test-events.ts
src/app/dynamicForm/component/sort-action/*
src/app/dynamicForm/styles/*
```

## Test playground

Nel playground puoi testare entrambe le modalità:

```html
<app-dynamic-form [config]="angularConfig"></app-dynamic-form>
<app-dynamic-form [json]="jsonSchema"></app-dynamic-form>
```

I file demo sono:

```text
src/app/dynamicForm/examples/all-components-form.builder.ts
src/app/dynamicForm/examples/all-components-json.schema.ts
src/app/dynamicForm/examples/dynamic-form-test-events.ts
```
