

import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

import * as moment from "moment";
import { ConfigForm, Form, TYPE_CONTROL_FORM, TypeForm } from "./dynamicForm/dynamic-form.interface";
import { map, of, pipe, ReplaySubject, Subject, switchMap, tap } from "rxjs";
import { effect, WritableSignal } from "@angular/core";
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
                    (questions[0] as any).formGroup.push(createResidenza(registry, context))


                }
            }, {
                cssClassButton: ["col"],
                cssClassIcon: ["fa", "fa-plus", "mx-2"],
                label: "Add Documento",
                action(questions, idForm, formGroup) {
                    (questions[0] as any).formGroup.push(createDocument(registry, context))


                }
            }]
        }
    ];
}




type FormControlType = FormControl | FormArray | FormGroup

export function createRegistry(object: any, context: any): TypeForm {

    let obs: ReplaySubject<any> = new ReplaySubject(1)
    return [
        {
            formAction: {

                css: { hide: true },
                formControl: new FormControl(object?.registryId),
                formName: "registryId",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



                }
            }
        },

        {

            formAction: {

                css: { hide: true },
                formControl: new FormControl(object?.registryId),
                formName: "domicile",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }
            }
        },

        {
            formAction: {
                title: "NOME",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.name, { updateOn: "change", validators: [Validators.required, Validators.maxLength(20)] }),
                formName: "name",

                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {
                    console.log(formCOntrol.parent.value, prevValue)
                }
            }
        },
        {
            formAction: {

                title: "COGNOME",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.surname, { updateOn: "blur", validators: [Validators.required, Validators.maxLength(20)] }),
                formName: "surname",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                }
            }
        },
        {
            formAction: {

                title: "SESSO",
                type: TYPE_CONTROL_FORM.COMBOPAGINATE,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.gender, { updateOn: "change", validators: [] }),
                formName: "gender",

                onChange(idGroup: number, idForm: number, formControl: FormControlType, formName: string, formGroup: Array<Form>, type: TYPE_CONTROL_FORM, prevValue: any, allGroup: ConfigForm) {
                    console.log(formControl.value);

                    (formGroup[idForm+2] as any).formAction.options = [{ id: "M", description: "Maschio" }, { id: "F", description: "Femmina" }]

                },
                opened(idGroup, idForm, formControl, formName, formGroup, allGroup) {

                },
                onInitialize(idGroup, idForm, formControl, formName, formGroup, type, allGroup, paging, sn) {
                    (allGroup[0].formGroup[4].formAction as any).paging = { count: 25, page: 1, totalCount: context.options.length };
                    (allGroup[0].formGroup[4].formAction as any).options = context.options.slice((allGroup[0].formGroup[4].formAction as any).paging.page - 1, (allGroup[0].formGroup[4].formAction as any).paging.count)

                    effect(() => {
                        console.log(sn())
                    }, { injector: context.injector })

                },
                disabledOption: [],
                remoteData: rxMethod<{ param: any, externalStore: WritableSignal<any> }>(pipe(
                    map(({ externalStore, param }) => externalStore.set({ items: context.generateUniqueItems(10), totalCount: 30 })),
                )),

                keyCombo: { keyDescription: ["description"], keyId: "id" },
                autocomplete: true,
                multiple: true,
            }
        },


        {
            formAction: {
                title: "DATA DI ASCITA",
                type: TYPE_CONTROL_FORM.DATA,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.birthDate, [Validators.required]),
                formName: "birthDate",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                }
            }
        },

        {
            formAction: {

                title: "PROVINCIA DI NASCITA",
                type: TYPE_CONTROL_FORM.COMBO,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.province, [Validators.required]),
                formName: "province",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }

            }
        }, {
            formAction: {

                title: "COMUNE",
                type: TYPE_CONTROL_FORM.COMBO,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.townHall, []),
                formName: "townHall",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



                },
                autocomplete: true
            }
        },
        {
            formAction: {

                title: "CODICE FISCALE",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.fiscalCode, { updateOn: "blur", validators: [Validators.required] }),
                formName: "fiscalCode",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



                }
            }
        },
        {
            formAction: {

                title: "CITTADINANZA",
                type: TYPE_CONTROL_FORM.COMBO,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.citizenship, { updateOn: "blur", validators: [] }),
                formName: "citizenship",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



                },
                autocomplete: true,
                options: []
            }
        },


        {
            formAction: {

                title: "TELEFONO",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.phone, { updateOn: "blur", validators: [] }),
                formName: "phone",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



                }

            }
        },
        {
            formAction: {

                title: "MOBILE",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.mobile, { updateOn: "blur", validators: [Validators.maxLength(10)] }),
                formName: "mobile",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



                }
            }
        },

        {
            formAction: {

                title: "EMAIL",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.email, { updateOn: "blur", validators: [Validators.email] }),
                formName: "email",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



                }
            }
        },
        {
            formAction: {

                title: "PEC",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12"] },
                formControl: new FormControl(object?.pec, { updateOn: "blur", validators: [Validators.email] }),
                formName: "pec",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {



                }
            }
        }
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
                        options: [{ id: "Patente", description: "Patente" }, { id: "CartaIdentita", description: "Carta d'identità" }, { id: "Passaport", description: "Passaporto" }],
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

