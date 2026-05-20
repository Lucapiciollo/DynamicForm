# DynamicForm - Step DATA + DATETIME safe

Questo pacchetto parte dalla versione `ultra-safe` che non si bloccava e aggiunge solo due componenti:

- `TYPE_CONTROL_FORM.DATA` con `FormControl<Date | null>`
- `TYPE_CONTROL_FORM.DATETIME` in modalità sicura, perché nel template attuale è un `mat-select` e quindi richiede `options: Array<{ id, description }>`

Non sono stati riattivati:

- `COMBO`
- `COMBOPAGINATE`
- `DATARANGE`
- `FILE`
- `ARRAYSTRING`
- `RADIOGROUP`

Se questa versione carica, il prossimo step consigliato è aggiungere `RADIOGROUP`, poi `COMBO` semplice, e solo alla fine `COMBOPAGINATE`.

## File principale

```ts
src/app/dynamicForm/examples/ultra-safe-nested-actions.builder.ts
```

Nel gruppo `registry` sono stati aggiunti:

```ts
birthDate: TYPE_CONTROL_FORM.DATA
appointmentSlot: TYPE_CONTROL_FORM.DATETIME
```

Nota importante: il componente `DATETIME` della libreria, in questa versione, non usa un input `datetime-local`, ma un `mat-select` su `control.formAction.options`.
Per questo il builder passa un array `options`, non un `Date` diretto.
