# DynamicForm - Step 05 COMBOPAGINATE senza scroll infinito

Questo pacchetto parte dallo step 04 funzionante e aggiunge solo il campo:

```ts
TYPE_CONTROL_FORM.COMBOPAGINATE
```

Obiettivo dello step:

- aprire la combo paginata;
- caricare la prima pagina tramite `remoteData`;
- cercare da input autocomplete tramite `remoteData`;
- aggiornare lo store della combo con `setTotalOptions` e `setFilteredOptions`;
- NON agganciare ancora lo scroll infinito.

## Modifica importante

In `combo.component.ts`, per `COMBOPAGINATE`, lo scroll viene agganciato solo se la configurazione contiene:

```ts
enableInfiniteScroll: true
```

Nel builder di test invece è impostato:

```ts
enableInfiniteScroll: false
```

Quindi lo step 05 testa solo apertura + ricerca remota paginata, senza listener di scroll.

## Import `untracked`

Nel componente combo è presente:

```ts
import { untracked } from '@angular/core';
```

perché viene usato in chiusura pannello e nelle correzioni sui signal/effect.

## Campo di test

Il campo si trova in:

```text
src/app/dynamicForm/examples/ultra-safe-nested-actions.builder.ts
```

Nome form control:

```ts
operatorId
```

Mock usato:

```ts
MOCK_OPERATORS
```

La funzione `remoteData` chiama:

```ts
writeComboPaginateResult(ctx, result)
```

che aggiorna lo store combo senza modificare direttamente `options.set(...)`, per evitare loop signal/effect.
