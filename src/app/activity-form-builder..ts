

import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

import * as moment from "moment";
import { ConfigForm, Form, TYPE_CONTROL_FORM, TypeForm } from "./dynamicForm/dynamic-form.interface";
import { map, pipe, ReplaySubject } from "rxjs";
import { signal, WritableSignal } from "@angular/core";
import { rxMethod } from '@ngrx/signals/rxjs-interop';



export function activityForm(registry: any, context: any): ConfigForm {

  return [
    {
      title: "Anagrafica",
      formGroup: createRegistry(registry, context),
      actions: [{
        cssClassButton: ["col"],
        cssClassIcon: ["fa", "fa-plus", "mx-2"],
        label: "Add residenza",
        action(questions, idForm, formGroup) {
          (questions[0] as any).formGroup.push(createResidenza(registry, context));


        }
      }, {
        cssClassButton: ["col"],
        cssClassIcon: ["fa", "fa-plus", "mx-2"],
        label: "Add Documento",
        action(questions, idForm, formGroup) {
          (questions[0] as any).formGroup.push(createDocument(registry, context));


        }
      }]

    }
  ];
}




type FormControlType = FormControl | FormArray | FormGroup

export function createRegistry(object: any, context: any): TypeForm {

  let obs: ReplaySubject<any> = new ReplaySubject(1)
  return [
    // {
    //     formAction: {

    //         css: { hide: true },
    //         formControl: new FormControl(object?.registryId),
    //         formName: "registryId",
    //         onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



    //         }
    //     }
    // },

    // {

    //     formAction: {

    //         css: { hide: true },
    //         formControl: new FormControl(object?.registryId),
    //         formName: "domicile",
    //         onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


    //         }
    //     }
    // },

    // {
    //     formAction: {
    //         title: "NOME",
    //         type: TYPE_CONTROL_FORM.TEXT,
    //         css: { class: ["col-12"] },
    //         formControl: new FormControl(object?.name, { updateOn: "change", validators: [Validators.required, Validators.maxLength(20)] }),
    //         formName: "name",

    //         async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {
    //             console.log(formCOntrol.parent.value, prevValue)
    //         }
    //     }
    // },
    // {
    //     formAction: {

    //         title: "COGNOME",
    //         type: TYPE_CONTROL_FORM.TEXT,
    //         css: { class: ["col-12"] },
    //         formControl: new FormControl(object?.surname, { updateOn: "blur", validators: [Validators.required, Validators.maxLength(20)] }),
    //         formName: "surname",
    //         async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

    //         },
    //     }
    // },
    {
      formAction: {

        title: "SESSO",
        type: TYPE_CONTROL_FORM.COMBOPAGINATE,
        css: { class: ["col-12"] },
        formControl: new FormControl(["M", "F"], { updateOn: "change", validators: [] }),
        formName: "gender",

        onChange(idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup) {
          let option = context.generateUniqueItems(10);
          (formGroup[idForm + 1] as any).formAction.options.set(option.items.map(m => ({ id: m.id, description: m.description })));
          (formGroup[idForm + 1] as any).formAction.formControl.setValue([option.items[0].id]);

        },

        onInitialize(idGroup, idForm, formControl, formName, formGroup, type, allGroup, paging, onOptionSetted) {
          let option = context.generateUniqueItems(10);
          (formGroup[idForm] as any).formAction.options.set(option.items.map(m => ({ id: m.id, description: m.description })));
          (formGroup[idForm] as any).formAction.formControl.setValue([option.items[0].id, option.items[1].id]);
        },
        opened(idGroup, idForm, formControl, formName, formGroup, allGroup) { },
        closed(idGroup, idForm, formControl, formName, formGroup, allGroup) { },

        remoteData: rxMethod<{ param: any, externalStore: WritableSignal<any> }>(pipe(
          map(({ externalStore, param }) => externalStore.set(context.generateUniqueItems(100))),
        )),

        keyCombo: { keyDescription: ["description"], keyId: "id" },
        autocomplete: true,
        multiple: true,

      }
    },


    // {
    //     formAction: {
    //         title: "DATA DI ASCITA",
    //         type: TYPE_CONTROL_FORM.DATA,
    //         css: { class: ["col-12"] },
    //         formControl: new FormControl(object?.birthDate, [Validators.required]),
    //         formName: "birthDate",
    //         async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

    //         }

    //     }
    // },

    {
      formAction: {

        title: "PROVINCIA DI NASCITA",
        type: TYPE_CONTROL_FORM.COMBO,
        css: { class: ["col-12"] },
        formControl: new FormControl(null, [Validators.required]),
        formName: "province",
        onChange(idGroup, idForm, formCOntrol, formName, formGroup, typeControl, prevValue, allGroup, utils) {



        },

        onInitialize(idGroup, idForm, formControl, formName, formGroup, type, allGroup, paging, onOptionSetted, utils) {
          let option = context.generateUniqueItems(1000);
          (formGroup[idForm] as any).formAction.options.set(option.items.map(m => ({ id: m.id, description: m.description })));
          (formGroup[idForm] as any).formAction.formControl.setValue([option.items[0].id, option.items[2].id]);

          (formGroup[idForm] as any).formAction.optionsDisabled.set([option.items[3].id]);

          utils.getFormByName("townHall", (form,f) => {


            form.formControl.setValue(form.options()[0].id)

        });


        },
        multiple: true,
        autocomplete: true


      }
    },
    {
      formAction: {

        title: "COMUNE",
        type: TYPE_CONTROL_FORM.COMBO,
        css: { class: ["col-12"] },
        formControl: new FormControl(object?.townHall, []),
        formName: "townHall",
        multiple: false,
        onInitialize(idGroup, idForm, formControl, formName, formGroup, type, allGroup, paging, onOptionSetted) {
          let option = context.generateUniqueItems(1000);
          (formGroup[idForm] as any).formAction.options.set(option.items.map(m => ({ id: m.id, description: m.description })));
          (formGroup[idForm] as any).formAction.formControl.setValue([option.items[0].id, option.items[1].id]);
        },
        autocomplete: true
      }
    },
    // {
    //     formAction: {

    //         title: "CODICE FISCALE",
    //         type: TYPE_CONTROL_FORM.TEXT,
    //         css: { class: ["col-12"] },
    //         formControl: new FormControl(object?.fiscalCode, { updateOn: "blur", validators: [Validators.required] }),
    //         formName: "fiscalCode",
    //         onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



    //         }
    //     }
    // },
    // {
    //     formAction: {

    //         title: "CITTADINANZA",
    //         type: TYPE_CONTROL_FORM.COMBO,
    //         css: { class: ["col-12"] },
    //         formControl: new FormControl(object?.citizenship, { updateOn: "blur", validators: [] }),
    //         formName: "citizenship",
    //         onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



    //         },
    //         autocomplete: true,
    //         options: []
    //     }
    // },


    // {
    //     formAction: {

    //         title: "TELEFONO",
    //         type: TYPE_CONTROL_FORM.TEXT,
    //         css: { class: ["col-12"] },
    //         formControl: new FormControl(object?.phone, { updateOn: "blur", validators: [] }),
    //         formName: "phone",
    //         onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



    //         }

    //     }
    // },
    // {
    //     formAction: {

    //         title: "MOBILE",
    //         type: TYPE_CONTROL_FORM.TEXT,
    //         css: { class: ["col-12"] },
    //         formControl: new FormControl(object?.mobile, { updateOn: "blur", validators: [Validators.maxLength(10)] }),
    //         formName: "mobile",
    //         onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



    //         }
    //     }
    // },

    // {
    //     formAction: {

    //         title: "EMAIL",
    //         type: TYPE_CONTROL_FORM.TEXT,
    //         css: { class: ["col-12"] },
    //         formControl: new FormControl(object?.email, { updateOn: "blur", validators: [Validators.email] }),
    //         formName: "email",
    //         onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



    //         }
    //     }
    // },
    // {
    //     formAction: {

    //         title: "PEC",
    //         type: TYPE_CONTROL_FORM.TEXT,
    //         css: { class: ["col-12"] },
    //         formControl: new FormControl(object?.pec, { updateOn: "blur", validators: [Validators.email] }),
    //         formName: "pec",
    //         onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



    //         }
    //     }
    // }
  ]


}


export function createResidenza(object: any, context: any): Form {
  return {
    formAction: {

      title: "Residenza",
      type: TYPE_CONTROL_FORM.GROUP,
      formControl: new FormControl(),
      formName: "residence",
      formGroup: [{
        actions: [{
          label: "Elimina",
          action(questions, idForm, formGroup) {
            let form = JSON.findByValue(questions, idForm, ["formControl"]);
            delete (questions[0] as any).formGroup[(form[0].key as string).split(".")[2]];
          }
        }],
        formGroup: [

          {
            formAction: {
              title: "VIA/PIAZZA",
              type: TYPE_CONTROL_FORM.TEXT,
              css: { class: ["col-12"] },
              formControl: new FormControl(object.street, { updateOn: "blur", validators: [Validators.required] }),
              formName: "street"

            }
          },
          {
            formAction: {

              title: "CIVICO",
              type: TYPE_CONTROL_FORM.TEXT,
              css: { class: ["col-12"] },
              formControl: new FormControl(object.civic, { updateOn: "blur", validators: [Validators.required] }),
              formName: "civic"
            }
          },
          {
            formAction: {

              title: "CAP",
              type: TYPE_CONTROL_FORM.TEXT,
              css: { class: ["col-12"] },
              formControl: new FormControl(object.cap, { updateOn: "blur", validators: [] }),
              formName: "cap"
            }
          },
          {
            formAction: {

              title: "REGIONE",
              type: TYPE_CONTROL_FORM.COMBO,
              css: { class: ["col-12"] },
              formControl: new FormControl(object.city, { updateOn: "change" }),
              formName: "city",
              autocomplete: true,

            }
          },
          {
            formAction: {

              title: "PROVINCIA",
              type: TYPE_CONTROL_FORM.COMBO,
              css: { class: ["col-12"] },
              formControl: new FormControl(object.province, { updateOn: "change", validators: [Validators.required] }),
              formName: "province"
            }
          },



          {
            formAction: {

              title: "COMUNE",
              type: TYPE_CONTROL_FORM.COMBO,
              css: { class: ["col-12"] },
              formControl: new FormControl(object.townHall, { updateOn: "change" }),
              formName: "townHall",
              autocomplete: true
            }
          }]
      }]
    }
  }
}


export function createDocument<T extends Document>(object: T, context: any): Form {


  return {
    formAction: {

      title: "Documento",
      type: TYPE_CONTROL_FORM.GROUP,
      formControl: new FormControl(),
      formName: "document",
      formGroup: [{
        actions: [{
          label: "Elimina",
          action(questions, idForm, formGroup) {
            let form = JSON.findByValue(questions, idForm, ["formControl"]);
            delete (questions[0] as any).formGroup[(form[0].key as string).split(".")[2]]
          }
        }],
        formGroup: [{

          formAction: {

            css: { hide: true },
            formControl: new FormControl(null, { updateOn: "blur" }),
            formName: "documentId",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

            }
          }
        },
        {

          formAction: {

            css: { hide: true },
            formControl: new FormControl(null, { updateOn: "blur" }),
            formName: "fiscalCode",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

            }
          }
        },

        {
          formAction: {

            title: "TIPO",
            type: TYPE_CONTROL_FORM.COMBO,
            css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
            formControl: new FormControl(null, { updateOn: "blur", validators: [Validators.required] }),
            options: signal([{ id: "Patente", description: "Patente" }, { id: "CartaIdentita", description: "Carta d'identità" }, { id: "Passaport", description: "Passaporto" }]),
            formName: "type",

            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


            }
          }
        },
        {
          formAction: {

            title: "NUMERO",
            type: TYPE_CONTROL_FORM.TEXT,
            css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
            formControl: new FormControl(null, { updateOn: "blur", validators: [Validators.required] }),
            formName: "number",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


            }
          }
        },

        {
          formAction: {

            title: "RILASCIATA IL",
            optionDate: { min: moment().subtract(10, "year").format("yyyy-MM-DD"), max: moment().add(10, "year").format("yyyy-MM-DD") },
            type: TYPE_CONTROL_FORM.DATA,
            css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
            formControl: new FormControl(null, { updateOn: "blur", validators: [Validators.required] }),
            formName: "releaseDate",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


            }
          }
        },

        {
          formAction: {

            title: "DATA SCADENZA",
            type: TYPE_CONTROL_FORM.DATA,
            optionDate: { min: moment().subtract(10, "year").format("yyyy-MM-DD"), max: moment().add(10, "year").format("yyyy-MM-DD") },
            css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
            formControl: new FormControl(null, { updateOn: "blur", validators: [Validators.required] }),
            formName: "dateExpiration",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


            }
          }
        }
        ]
      }]
    }
  }
}

