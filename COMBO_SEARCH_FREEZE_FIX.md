# Fix ricerca combo che blocca la pagina

Questo pacchetto parte dallo step 03 funzionante e corregge il blocco durante la ricerca nella combo.

## Cosa è stato cambiato

### `combo.component.ts`

La ricerca non usa più `toSignal(...) + effect(...)`.

Prima la digitazione aggiornava un signal, un `effect` chiamava `search()`, e `search()` scriveva nello store dei signals. Questo poteva creare dipendenze circolari tra input, filtro e store.

Ora la ricerca usa una normale pipeline RxJS:

```ts
this.inputSubject
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    takeUntilDestroyed(this.destroyRef),
  )
  .subscribe(valueSearch => {
    if (!this.isReady()) return;
    this.search(valueSearch ?? '');
  });
```

### `combo.component.html`

L'input di ricerca ferma `click` e `keydown`, così `mat-select` non intercetta i tasti della ricerca come typeahead interno:

```html
<input
  matInput
  class="ps-5 py-0"
  (click)="$event.stopPropagation()"
  (keydown)="$event.stopPropagation()"
  #filterInput
  (input)="onInputChange(filterInput.value)" />
```

### `onPanelOpen()`

Per `COMBO` locale l'apertura resetta il filtro senza passare da `inputSubject/search`, evitando loop nel rendering del pannello.

`COMBOPAGINATE` rimane separato e continuerà a usare `remoteData`.
