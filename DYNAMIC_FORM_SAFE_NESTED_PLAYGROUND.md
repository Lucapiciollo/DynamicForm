# DynamicForm safe nested playground

Questo pacchetto parte dalla versione aggiornata e usa un playground conservativo che non blocca la pagina.

## Cosa contiene

- `src/app/dynamicForm/examples/nested-actions-form.builder.ts`
  - configurazione Angular completa
  - gruppi annidati
  - sottogruppi dentro sottogruppi
  - azioni sui gruppi
  - patch e validazione
  - helper per leggere gruppi dentro `FormArray`

- `src/app/dynamicForm/examples/nested-actions-json.schema.ts`
  - configurazione JSON completa equivalente
  - gruppi annidati tramite `children`
  - actions collegate tramite registry eventi

- `src/app/dynamicForm/examples/dynamic-form-nested-events.ts`
  - registry delle actions usate dal JSON

- `src/app/app.component.ts/html/scss`
  - switch tra `Angular config` e `JSON config`
  - patch demo
  - submit
  - reset
  - debug `value`, `rawValue`, `errors`

## Uso

```bash
npm install
npm start
```

Poi prova:

- Angular config
- JSON config
- Patch demo
- Submit
- Actions dentro i gruppi

## Nota sui gruppi annidati

Il motore attuale crea i gruppi annidati come `FormArray` contenenti un `FormGroup`.
Per questo nel builder sono stati aggiunti helper:

- `groupAt(form, 'registry')`
- `groupAt(form, 'mainAddress.cityInfo')`
- `controlAt(form, 'contract.amounts.total')`

In questo modo le actions funzionano anche con la struttura interna attuale del motore.

## Nota sulla combo paginata

Il playground safe non usa `COMBOPAGINATE`, così la pagina carica senza effetti remoti o scroll listener.
La combo paginata resta nel codice libreria, ma va testata separatamente dopo avere stabilizzato bene lo store e il contratto `remoteData`.
