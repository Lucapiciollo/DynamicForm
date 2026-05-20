# DynamicForm ultra safe playground

Questa variante serve solo a verificare che il motore base carichi senza bloccare la pagina.

Sono stati rimossi dal playground iniziale:

- COMBO
- COMBOPAGINATE
- DATA / DATETIME / DATARANGE
- FILE
- ARRAYSTRING
- RADIOGROUP
- JSON mode iniziale

Restano invece:

- gruppi annidati
- sottogruppi
- TEXT
- NUMBER
- CHECKBOX
- TEXTAREA
- actions
- patchValue
- validazione
- getRawValue

Motivo: dai log precedenti i problemi arrivavano da `from/to`, `.clone()` e `externalStore.set` nella parte combo/date-range/remote store. Questa versione isola il core.

Quando questa carica correttamente, il passo successivo è riabilitare un componente per volta.
