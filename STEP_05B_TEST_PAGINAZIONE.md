# Step 05B - Test paginazione COMBOPAGINATE senza scroll

Questo pacchetto parte dallo step 05 e aggiunge pulsanti/action per testare la paginazione della combo paginata senza usare ancora lo scroll infinito.

## Cosa testare

1. Avvia l'app.
2. Apri la combo `Operatore paginato - step 05 senza scroll`.
3. Dovresti vedere la pagina 1: `Operatore 1` ... `Operatore 10`.
4. Premi l'action `Operatori pagina 2`.
5. Riapri la combo: dovresti vedere `Operatore 11` ... `Operatore 20`.
6. Premi `Operatori pagina 3`.
7. Riapri la combo: dovresti vedere `Operatore 21` ... `Operatore 30`.
8. Premi `Cerca operatori Tecnico` per testare ricerca remota mock.

## Import untracked

Controllati i file che usano `untracked(() => ...)`:

- `base-component.component.ts`
- `combo.component.ts`
- `combo/store.ts`
- `arraystring.component.ts`

Tutti importano `untracked` da `@angular/core`.

## Nota

In questo step `enableInfiniteScroll` è ancora `false`. Lo scroll bottom verrà riattivato nello step successivo, dopo aver confermato che la paginazione manuale non blocca la pagina.
