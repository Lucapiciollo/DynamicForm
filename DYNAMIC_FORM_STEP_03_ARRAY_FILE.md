# DynamicForm step 03

Base funzionante dello step 02b + aggiunta controllata di:

- `ARRAYSTRING`
- `FILE`

Non include ancora `DATARANGE` e `COMBOPAGINATE`.

Correzioni safe:

- `ArrayStringComponent`: effect con `untracked()` e controllo null-safe.
- `FileComponent`: reset e input null-safe.
- Builder aggiornato con `tags` e `attachment` nel gruppo `contract`.
