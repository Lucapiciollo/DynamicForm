# DynamicForm - SCSS package, compilazione e test

## File SCSS aggiunti

```text
src/app/dynamicForm/styles/_tokens.scss
src/app/dynamicForm/styles/_mixins.scss
src/app/dynamicForm/styles/_components.scss
src/app/dynamicForm/styles/_material-overrides.scss
src/app/dynamicForm/styles/dynamic-form-theme.scss
```

## Motore SCSS

Il progetto Angular compila SCSS tramite Angular CLI / sass-loader. La configurazione è già presente in `angular.json`:

```json
"styles": [
  "src/styles.scss"
]
```

I componenti interni usano:

```ts
styleUrls: ['../../dynamic-form.component.scss']
```

Quindi il tema componente viene caricato da:

```scss
// src/app/dynamicForm/dynamic-form.component.scss
@use './styles/components';
```

Gli override globali per `mat-select`, `mat-datepicker` e overlay CDK vanno invece in `src/styles.scss`, perché i pannelli Angular Material vengono renderizzati fuori dal componente:

```scss
@import './app/dynamicForm/styles/material-overrides';
```

## Comandi

```bash
npm install
npm run start
npm run build -- --configuration development
```

Per produzione, attenzione ai budget `anyComponentStyle` in `angular.json`: il tema SCSS è più corposo di 4kb. Se serve, aumentare:

```json
{
  "type": "anyComponentStyle",
  "maximumWarning": "12kb",
  "maximumError": "20kb"
}
```

## Test aggiunti

```text
src/app/dynamicForm/examples/all-components-form.builder.ts
src/app/dynamicForm/examples/all-components-json.schema.ts
src/app/dynamicForm/examples/dynamic-form-test-events.ts
```

Nel playground puoi alternare:

```html
<app-dynamic-form [config]="angularConfig"></app-dynamic-form>
<app-dynamic-form [json]="jsonSchema"></app-dynamic-form>
```

## Combo paginata

La combo paginata usa:

```ts
remoteData: ({ param, externalStore }) => {
  externalStore.set({ items, totalCount });
}
```

Quando il pannello raggiunge il fondo, il componente incrementa `paging.page` e richiama `remoteData`. La ricerca usa `keyCombo.keySearch`, di default `search`.
