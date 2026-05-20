# Combo freeze fix

Questo pacchetto parte dallo step 02 e corregge il blocco della pagina introdotto dalle combo.

## Causa principale

`BaseComponent` aveva un `effect()` che leggeva `options()` e dentro chiamava metodi dello store combo.
Quei metodi leggevano e scrivevano altri signal (`selectedOptions`, `filteredOptions`, ecc.).
Senza `untracked()`, Angular registrava anche quei signal come dipendenze dell effect e quindi `setFilteredOptions()` poteva retriggerare lo stesso effect all infinito.

## Fix applicati

- importato `untracked` in `base-component.component.ts`;
- avvolte le scritture allo store combo dentro `untracked(...)`;
- rimosso dal `ComboComponent` l effect duplicato che riscriveva nello store partendo da `setInitialOption`;
- `callRemoteData()` ora passa `externalStore: this.signalStore` e anche `setInitialOption` per compatibilita.

## Step contenuto

Contiene ancora:

- RADIOGROUP;
- COMBO semplice;
- COMBO autocomplete locale.

Non contiene ancora COMBOPAGINATE.
