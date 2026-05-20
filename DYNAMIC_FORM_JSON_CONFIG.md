# DynamicForm - doppia configurazione Angular + JSON

Questo pacchetto mantiene la configurazione Angular esistente tramite `[questions]` e aggiunge due alias nuovi:

```html
<app-dynamic-form [questions]="questions"></app-dynamic-form>
<app-dynamic-form [config]="angularConfig"></app-dynamic-form>
<app-dynamic-form [json]="jsonSchema"></app-dynamic-form>
```

## Modalità Angular runtime

È la modalità più potente. Puoi continuare a passare `ConfigForm` con `FormControl`, `Validators`, funzioni `onChange`, `onInitialize`, `remoteData`, `signal`, `rxMethod`, componenti custom, ecc.

```ts
questions: ConfigForm = [
  {
    title: 'Anagrafica',
    formGroup: [
      {
        formAction: {
          formName: 'firstName',
          title: 'Nome',
          type: TYPE_CONTROL_FORM.TEXT,
          formControl: new FormControl(null, Validators.required),
          css: { class: ['col-6'] },
          onChange: (idGroup, idForm, control) => console.log(control.value)
        }
      }
    ]
  }
];
```

## Modalità JSON puro

È la modalità serializzabile e salvabile su backend. Non contiene funzioni Angular, `FormControl` o `Validators` diretti.

```ts
jsonSchema: DynamicFormJsonSchema = {
  id: 'customer-form',
  groups: [
    {
      id: 'registry',
      title: 'Anagrafica',
      fields: [
        {
          name: 'firstName',
          type: 'TEXT',
          label: 'Nome',
          class: ['col-6'],
          validators: [{ type: 'required', message: 'Il nome è obbligatorio' }],
          events: { change: 'firstNameChanged' }
        }
      ]
    }
  ]
};
```

## Registry eventi

Per collegare gli eventi dichiarati nel JSON alle funzioni Angular:

```ts
DynamicFormModule.forRoot({
  events: {
    firstNameChanged: ({ formControl }) => {
      console.log('Nome cambiato', formControl.value);
    }
  },
  actions: {
    saveCustomer: ({ formGroup }) => {
      console.log(formGroup.value);
    }
  }
})
```

Oppure con bootstrap standalone:

```ts
provideDynamicForm({
  events: {
    firstNameChanged: ({ formControl }) => console.log(formControl.value)
  }
})
```

## File aggiunti

```text
src/app/dynamicForm/models/dynamic-form-json-schema.model.ts
src/app/dynamicForm/models/dynamic-form-event.model.ts
src/app/dynamicForm/providers/dynamic-form.providers.ts
src/app/dynamicForm/services/dynamic-form-json-mapper.service.ts
src/app/dynamicForm/services/dynamic-form-event-registry.service.ts
src/app/dynamicForm/services/dynamic-validator-factory.service.ts
src/app/dynamicForm/services/dynamic-condition-evaluator.service.ts
src/app/dynamicForm/examples/json-config.example.ts
```

## File modificati

```text
src/app/dynamicForm/dynamic-form.component.ts
src/app/dynamicForm/dynamic-form.service.ts
src/app/dynamicForm/dynamic-form.module.ts
src/app/dynamicForm/component/base-component.component.ts
```

## Note

- `[questions]` rimane compatibile con il progetto attuale.
- `[config]` è un alias più leggibile di `[questions]`.
- `[json]` converte uno schema JSON in `ConfigForm` tramite `DynamicFormJsonMapperService`.
- Corretto anche il bug della condizione `TYPE_CONTROL_FORM.TIME` che risultava sempre vera.
