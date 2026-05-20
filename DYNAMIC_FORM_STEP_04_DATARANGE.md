# DynamicForm - Step 04 DATARANGE safe

Questo pacchetto parte dallo step 03b confermato funzionante e aggiunge solo `DATARANGE`.

## Componenti attivi nel playground

- TEXT
- NUMBER
- CHECKBOX
- TEXTAREA
- GROUP / sottogruppi
- actions
- DATA
- DATETIME
- RADIOGROUP
- COMBO semplice/autocomplete locale
- ARRAYSTRING
- FILE
- DATARANGE

## Nota DATARANGE

Il campo `DATARANGE` usa un `FormGroup` come `formControl`:

```ts
formControl: new FormGroup({
  from: new FormControl<Date | null>(null),
  to: new FormControl<Date | null>(null),
})
```

Il componente `DateRangeComponent` include anche una protezione interna: se `from` o `to` mancano, li crea prima del rendering/chiusura picker.

## Ancora escluso

`COMBOPAGINATE` con scroll bottom resta escluso da questo step. Lo aggiungiamo nello step successivo.
