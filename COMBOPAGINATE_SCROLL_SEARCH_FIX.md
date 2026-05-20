# Fix ricerca su COMBOPAGINATE con scroll

Problema: nelle combo paginate con scroll infinito, digitando nella ricerca i risultati non venivano aggiornati correttamente oppure lo scroll continuava ad appendere pagine della ricerca precedente.

Correzione applicata:

- la ricerca remota riparte sempre da `page: 1`;
- quando cambia la ricerca viene passato `append: false`;
- quando si arriva in fondo allo scroll viene passato `append: true`;
- il valore della ricerca corrente viene salvato in `currentSearchValue` e riusato per le pagine successive;
- `paramsForRemoteData` non può più sovrascrivere `page/search/append`, perché viene applicato prima dei parametri correnti;
- se `keyCombo.keySearch` è un array viene usato il parametro remoto `search`;
- nel builder demo `enableInfiniteScroll` è impostato a `true`.

Test manuale:

1. Apri la combo `Operatore paginato - step 06 con scroll e ricerca`.
2. Scrivi `Tecnico`.
3. Verifica che in console `remoteData` riceva `page: 1`, `search: 'Tecnico'`, `append: false`.
4. Scorri in fondo al pannello.
5. Verifica che in console `remoteData` riceva `page: 2`, `search: 'Tecnico'`, `append: true`.
6. Cambia ricerca, ad esempio `HR`.
7. Verifica che riparta da `page: 1` e sostituisca i risultati.

Import importante:

```ts
import { untracked } from '@angular/core';
```

È presente dove viene usato `untracked(() => ...)`.
