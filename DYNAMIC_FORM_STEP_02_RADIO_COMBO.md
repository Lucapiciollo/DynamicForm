# DynamicForm Step 02 - RadioGroup e Combo semplice

Questo pacchetto parte dallo step 01 funzionante e aggiunge solo:

- `RADIOGROUP`
- `COMBO` semplice
- una combo autocomplete locale per `Regione`

Non include ancora:

- `COMBOPAGINATE`
- `DATARANGE`
- `FILE`
- `ARRAYSTRING`

## File principale di test

```text
src/app/dynamicForm/examples/ultra-safe-nested-actions.builder.ts
```

## Campi aggiunti

Nel gruppo `registry`:

- `gender` con `TYPE_CONTROL_FORM.RADIOGROUP`
- `customerCategory` con `TYPE_CONTROL_FORM.COMBO`

Nel gruppo `addresses`:

- `region` con `TYPE_CONTROL_FORM.COMBO` e `autocomplete: true`

## Nota importante

Le options sono passate con `signal([...])`, coerente con il motore attuale dei componenti combo/radio.
