export const mapNestedDietJsonToConfigForm: () => any = () => (   {
  "id": "dietCollectionForm",
  "title": "Raccolta informazioni dieta settimanale",
  "type": "GROUP",
  "formName": "root",
  "actions": [
    {
      "label": "Patch anagrafica demo",
      "event": "patchRegistryDemo"
    },
    {
      "label": "Valida anagrafica",
      "event": "validateRegistry"
    },
    {
      "label": "Genera settimana demo",
      "event": "patchWeekDemo"
    },
    {
      "label": "Copia lunedì su tutta la settimana",
      "event": "copyMondayToWholeWeek"
    },
    {
      "label": "Calcola riepilogo",
      "event": "calculateDietSummary"
    },
    {
      "label": "Leggi form completo",
      "event": "readWholeDietForm"
    },
    {
      "label": "Reset",
      "event": "resetDietForm"
    }
  ],
  "children": [
    {
      "id": "registry",
      "title": "Anagrafica",
      "type": "GROUP",
      "formName": "registry",
      "children": [
        {
          "id": "person",
          "title": "Dati personali",
          "type": "GROUP",
          "formName": "person",
          "children": [
            {
              "type": "TEXT",
              "formName": "firstName",
              "title": "Nome",
              "placeholder": "Inserisci nome",
              "validators": [{ "type": "required" }],
              "events": {
                "initialize": "logFieldInitialize",
                "change": "logFieldChange"
              }
            },
            {
              "type": "TEXT",
              "formName": "lastName",
              "title": "Cognome",
              "placeholder": "Inserisci cognome",
              "validators": [{ "type": "required" }],
              "events": {
                "initialize": "logFieldInitialize",
                "change": "logFieldChange"
              }
            },
            {
              "type": "NUMBER",
              "formName": "age",
              "title": "Età",
              "placeholder": "Inserisci età",
              "validators": [
                { "type": "required" },
                { "type": "min", "value": 14 }
              ],
              "events": {
                "change": "updateSummaryOnBodyChange"
              }
            },
            {
              "type": "RADIOGROUP",
              "formName": "gender",
              "title": "Sesso",
              "value": "M",
              "options": [
                { "id": "M", "description": "Maschio" },
                { "id": "F", "description": "Femmina" }
              ],
              "events": {
                "change": "updateSummaryOnBodyChange"
              }
            }
          ]
        },
        {
          "id": "body",
          "title": "Dati corporei",
          "type": "GROUP",
          "formName": "body",
          "children": [
            {
              "type": "NUMBER",
              "formName": "height",
              "title": "Altezza cm",
              "value": null,
              "optionNumber": { "min": 120, "max": 230, "step": 1 },
              "validators": [{ "type": "required" }],
              "events": {
                "change": "updateSummaryOnBodyChange"
              }
            },
            {
              "type": "NUMBER",
              "formName": "weight",
              "title": "Peso attuale kg",
              "value": null,
              "optionNumber": { "min": 30, "max": 250, "step": 0.1 },
              "validators": [{ "type": "required" }],
              "events": {
                "change": "updateSummaryOnBodyChange"
              }
            },
            {
              "type": "NUMBER",
              "formName": "targetWeight",
              "title": "Peso obiettivo kg",
              "value": null,
              "optionNumber": { "min": 30, "max": 250, "step": 0.1 },
              "events": {
                "change": "logFieldChange"
              }
            },
            {
              "type": "COMBO",
              "formName": "goal",
              "title": "Obiettivo",
              "value": "lose_weight",
              "options": [
                { "id": "lose_weight", "description": "Dimagrimento" },
                { "id": "maintenance", "description": "Mantenimento" },
                { "id": "gain_mass", "description": "Massa muscolare" }
              ],
              "events": {
                "change": "updateSummaryOnGoalChange"
              }
            }
          ]
        },
        {
          "id": "preferences",
          "title": "Preferenze e vincoli",
          "type": "GROUP",
          "formName": "preferences",
          "children": [
            {
              "type": "COMBO",
              "formName": "activityLevel",
              "title": "Livello attività",
              "value": "medium",
              "options": [
                { "id": "low", "description": "Bassa" },
                { "id": "medium", "description": "Media" },
                { "id": "high", "description": "Alta" }
              ],
              "events": {
                "change": "updateSummaryOnBodyChange"
              }
            },
            {
              "type": "ARRAYSTRING",
              "formName": "allergies",
              "title": "Allergie",
              "value": [],
              "events": {
                "change": "logArrayChange"
              }
            },
            {
              "type": "ARRAYSTRING",
              "formName": "dislikedFoods",
              "title": "Alimenti non graditi",
              "value": [],
              "events": {
                "change": "logArrayChange"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "week",
      "title": "Piano alimentare settimanale",
      "type": "GROUP",
      "formName": "week",
      "children": [
        {
          "id": "monday",
          "title": "Lunedì",
          "type": "GROUP",
          "formName": "monday",
          "children": [
            { "type": "TEXTAREA", "formName": "breakfast", "title": "Colazione", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "morningSnack", "title": "Spuntino mattina", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "lunch", "title": "Pranzo", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "afternoonSnack", "title": "Merenda", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "dinner", "title": "Cena", "events": { "change": "logMealChange" } },
            { "type": "NUMBER", "formName": "waterLiters", "title": "Acqua litri", "value": 2, "optionNumber": { "min": 0, "max": 5, "step": 0.25 }, "events": { "change": "logWaterChange" } },
            { "type": "TEXTAREA", "formName": "notes", "title": "Note lunedì", "events": { "change": "logMealChange" } }
          ]
        },
        {
          "id": "tuesday",
          "title": "Martedì",
          "type": "GROUP",
          "formName": "tuesday",
          "children": [
            { "type": "TEXTAREA", "formName": "breakfast", "title": "Colazione", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "morningSnack", "title": "Spuntino mattina", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "lunch", "title": "Pranzo", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "afternoonSnack", "title": "Merenda", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "dinner", "title": "Cena", "events": { "change": "logMealChange" } },
            { "type": "NUMBER", "formName": "waterLiters", "title": "Acqua litri", "value": 2, "optionNumber": { "min": 0, "max": 5, "step": 0.25 }, "events": { "change": "logWaterChange" } },
            { "type": "TEXTAREA", "formName": "notes", "title": "Note martedì", "events": { "change": "logMealChange" } }
          ]
        },
        {
          "id": "wednesday",
          "title": "Mercoledì",
          "type": "GROUP",
          "formName": "wednesday",
          "children": [
            { "type": "TEXTAREA", "formName": "breakfast", "title": "Colazione", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "morningSnack", "title": "Spuntino mattina", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "lunch", "title": "Pranzo", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "afternoonSnack", "title": "Merenda", "events": { "change": "logMealChange" } },
            { "type": "TEXTAREA", "formName": "dinner", "title": "Cena", "events": { "change": "logMealChange" } },
            { "type": "NUMBER", "formName": "waterLiters", "title": "Acqua litri", "value": 2, "optionNumber": { "min": 0, "max": 5, "step": 0.25 }, "events": { "change": "logWaterChange" } },
            { "type": "TEXTAREA", "formName": "notes", "title": "Note mercoledì", "events": { "change": "logMealChange" } }
          ]
        }
      ]
    },
    {
      "id": "summary",
      "title": "Riepilogo",
      "type": "GROUP",
      "formName": "summary",
      "children": [
        {
          "type": "NUMBER",
          "formName": "bmi",
          "title": "BMI",
          "readonly": true
        },
        {
          "type": "NUMBER",
          "formName": "calculatedCalories",
          "title": "Calorie giornaliere stimate",
          "readonly": true
        },
        {
          "type": "TEXTAREA",
          "formName": "notes",
          "title": "Note generali dieta",
          "events": {
            "change": "logFieldChange"
          }
        }
      ]
    }
  ]
}  );