// import { FormControl, FormGroup, Validators } from "@angular/forms";
// import { ConfigForm, TypeForm, TYPE_CONTROL_FORM } from "./dynamicForm/interface";






// export function activityForm(context: any): ConfigForm {
//     return [
//         {
//             title: "Attivitàaaaaaaaa",
//             formGroup: createform(context),
//             actions: [{
//                 label: "test",
//                 action(fg, id, formArray, button) {
//                     console.log(fg, id, formArray, button)
//                 },
//             }]
//         } 

//     ];
// }



// function createform(context: any): TypeForm {

//     return [
//         {
//       formAction: { disableSpeech:true,
//             title: "CHECKBOX",
//             type: TYPE_CONTROL_FORM.CHECKBOX,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "CHECKBOX",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//       formAction: { disableSpeech:true,
//             title: "COMBOAUTOCOMPLETE",
//             type: TYPE_CONTROL_FORM.COMBO,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null, [Validators.required]),
//             options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
//             formName: "COMBOAUTOCOMPLETE",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {
//                    JSON.changeValuesByKey(JSON.findByKeyAndValue(fg, "formName", "cap", ["formControl"]), "options", [{ id: 1, description: "QUATTRO" }], ["formControl"]);
//             },
//             onInitialize(idGroup, idForm, formCOntrol, formName, fg, typeControl, allGroup) {
//                 // JSON.changeValuesByKey(JSON.findByKeyAndValue(allGroup, "formName", "cap", ["formControl"]), "options", [{ id: 1, description: "UNO" }], ["formControl"]);
//             },
//             autocomplete: true

//         },

//     }, {
//       formAction: { disableSpeech:true,
//             title: "COMBO",
//             type: TYPE_CONTROL_FORM.COMBO,
//             multiple: true,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null, [Validators.required]),
//             options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
//             formName: "COMBO",
//             autocomplete: false
//         },

//     }, {
//       formAction: { disableSpeech:true,
//             title: "RADIOGROUP",
//             type: TYPE_CONTROL_FORM.RADIOGROUP,
//             multiple: true,
//             css: { class: ["col-6"], classRadio: ["col-4"] },
//             formControl: new FormControl(null, [Validators.required]),
//             options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
//             formName: "RADIOGROUP",
//             autocomplete: false
//         },

//     }, {
//       formAction: { disableSpeech:true,
//             title: "CURRENCY",
//             type: TYPE_CONTROL_FORM.CURRENCY,
//             simbol: "€",
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "CURRENCY",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//       formAction: { disableSpeech:true,
//             title: "DATA",
//             type: TYPE_CONTROL_FORM.DATA,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "DATA",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//       formAction: { disableSpeech:true,
//             title: "DATARANGE",
//             type: TYPE_CONTROL_FORM.DATARANGE,
//             css: { class: ["col-3"] },
//             formControl: new FormGroup({ from: new FormControl(), to: new FormControl() }),
//             options: [],
//             formName: "DATARANGE",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//       formAction: { disableSpeech:true,
//             title: "DATETIME",
//             type: TYPE_CONTROL_FORM.DATETIME,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "DATETIME",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, 
//     {
//       formAction: { disableSpeech:true,
//             title: "FILE",
//             type: TYPE_CONTROL_FORM.FILE,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "FILE",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, 
//     {
//       formAction: { disableSpeech:true,
//             title: "TEXT",
//             type: TYPE_CONTROL_FORM.TEXT,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "TEXT",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }
//     , {
//       formAction: { disableSpeech:true,
//             title: "LABEL",
//             type: TYPE_CONTROL_FORM.LABEL,
//             css: { class: ["col-3"] },
//             formControl: new FormControl("LABEL"),
//             options: [],
//             formName: "LABEL",

//         }
//     }, {
//       formAction: { disableSpeech:true,
//             title: "SORTACTION",
//             type: TYPE_CONTROL_FORM.SORTACTION,
//             css: { iconCss:"iconCss", class: ["col-1"], toggleIcons: ['assets/img/top-priority.svg', 'assets/img/bottom-priority.svg'] },
//             formControl: new FormControl<"ASC" | "DESC">({ value: "ASC", disabled: false }),
//             options: [],
//             formName: "SORTACTION",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//       formAction: { disableSpeech:true,
//             title: "LINK",
//             type: TYPE_CONTROL_FORM.LINK,
//             css: { class: ["col-3"] },
//             formControl: new FormControl({ value: "ASC", disabled: false }),
//             options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
//             formName: "LINK",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//       formAction: { disableSpeech:true,
//             title: "NUMBER",
//             type: TYPE_CONTROL_FORM.NUMBER,
//             css: { class: ["col-3"] },
//             formControl: new FormControl({ value: "ASC", disabled: false }),
//             formName: "NUMBER",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }
//     , {
//       formAction: { disableSpeech:true,
//             title: "TEXTAREA",
//             type: TYPE_CONTROL_FORM.TEXTAREA,
//             css: { class: ["col-3"] },
//             formControl: new FormControl({ value: "ASC", disabled: false }),
//             formName: "TEXTAREA",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }
//  ]
// }


import { FormControl, Validators } from "@angular/forms";

import * as moment from "moment";
import { ConfigForm, Form, TYPE_CONTROL_FORM, TypeForm } from "./dynamicForm/interface";




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



export function createRegistry(object: any, context: any): TypeForm {
    return [
        {
            formAction: {
                disableSpeech: true,
                css: { hide: true },
                formControl: new FormControl(object?.registryId),
                formName: "registryId",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }
            }
        } ,
       
        {

            formAction: {
                disableSpeech: true,
                css: { hide: true },
                formControl: new FormControl(object?.registryId),
                formName: "domicile",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                }
            }
        },

        {
            formAction: {
                disableSpeech: true,
                title: "NOME",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-2"] },
                formControl: new FormControl(object?.name, { updateOn: "blur", validators: [Validators.required, Validators.maxLength(20)] }),
                formName: "name",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                }
            }
        },
        {
            formAction: {
                disableSpeech: true,
                title: "COGNOME",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-2"] },
                formControl: new FormControl(object?.surname, { updateOn: "blur", validators: [Validators.required, Validators.maxLength(20)] }),
                formName: "surname",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                }
            }
        },
        {
            formAction: {
                disableSpeech: true,
                title: "SESSO",
                type: TYPE_CONTROL_FORM.COMBO,
                css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-2"] },
                formControl: new FormControl(object?.gender, [Validators.required]),
                formName: "gender",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                },
                options: [{ id: "M", description: "Maschio" }, { id: "F", description: "Femmina" }],
                autocomplete:true
            }
        },


        {
            formAction: {
                disableSpeech: true,
                title: "DATA DI ASCITA",
                type: TYPE_CONTROL_FORM.DATA,
                css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-3", "col-xxl-3"] },
                formControl: new FormControl(object?.birthDate, [Validators.required]),
                formName: "birthDate",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }
            }
        },

        {
            formAction: {
                disableSpeech: true,
                title: "PROVINCIA DI NASCITA",
                type: TYPE_CONTROL_FORM.COMBO,
                css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-3"] },
                formControl: new FormControl(object?.province, [Validators.required]),
                formName: "province",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                }

            }
        }, {
            formAction: {
                disableSpeech: true,
                title: "COMUNE",
                type: TYPE_CONTROL_FORM.COMBO,
                css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-3"] },
                formControl: new FormControl(object?.townHall, []),
                formName: "townHall",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                },
                autocomplete: true
            }
        },
        {
            formAction: {
                disableSpeech: true,
                title: "CODICE FISCALE",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-3", "col-xxl-3"] },
                formControl: new FormControl(object?.fiscalCode, { updateOn: "blur", validators: [Validators.required] }),
                formName: "fiscalCode",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }
            }
        },
        {
            formAction: {
                disableSpeech: true,
                title: "CITTADINANZA",
                type: TYPE_CONTROL_FORM.COMBO,
                css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-2"] },
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
                disableSpeech: true,
                title: "TELEFONO",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-2"] },
                formControl: new FormControl(object?.phone, { updateOn: "blur", validators: [] }),
                formName: "phone",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }

            }
        },
        {
            formAction: {
                disableSpeech: true,
                title: "MOBILE",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-2"] },
                formControl: new FormControl(object?.mobile, { updateOn: "blur", validators: [Validators.maxLength(10)] }),
                formName: "mobile",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }
            }
        },

        {
            formAction: {
                disableSpeech: true,
                title: "EMAIL",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-6", "col-lg-6", "col-xl-6", "col-xxl-6"] },
                formControl: new FormControl(object?.email, { updateOn: "blur", validators: [Validators.email] }),
                formName: "email",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }
            }
        },
        {
            formAction: {
                disableSpeech: true,
                title: "PEC",
                type: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-6", "col-lg-6", "col-xl-6", "col-xxl-6"] },
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
            disableSpeech: true,
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
                            disableSpeech: true,
                            title: "VIA/PIAZZA",
                            type: TYPE_CONTROL_FORM.TEXT,
                            css: { class: ["col-12", "col-sm-12", "col-md-12", "col-lg-6", "col-xl-6", "col-xxl-6"] },
                            formControl: new FormControl(object.street, { updateOn: "blur", validators: [Validators.required] }),
                            formName: "street"

                        }
                    },
                    {
                        formAction: {
                            disableSpeech: true,
                            title: "CIVICO",
                            type: TYPE_CONTROL_FORM.TEXT,
                            css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-2"] },
                            formControl: new FormControl(object.civic, { updateOn: "blur", validators: [Validators.required] }),
                            formName: "civic"
                        }
                    },
                    {
                        formAction: {
                            disableSpeech: true,
                            title: "CAP",
                            type: TYPE_CONTROL_FORM.TEXT,
                            css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-2"] },
                            formControl: new FormControl(object.cap, { updateOn: "blur", validators: [] }),
                            formName: "cap"
                        }
                    },
                    {
                        formAction: {
                            disableSpeech: true,
                            title: "REGIONE",
                            type: TYPE_CONTROL_FORM.COMBO,
                            css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-2"] },
                            formControl: new FormControl(object.city, { updateOn: "change" }),
                            formName: "city",
                            autocomplete: true,

                        }
                    },
                    {
                        formAction: {
                            disableSpeech: true,
                            title: "PROVINCIA",
                            type: TYPE_CONTROL_FORM.COMBO,
                            css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-2"] },
                            formControl: new FormControl(object.province, { updateOn: "change", validators: [Validators.required] }),
                            formName: "province"
                        }
                    },



                    {
                        formAction: {
                            disableSpeech: true,
                            title: "COMUNE",
                            type: TYPE_CONTROL_FORM.COMBO,
                            css: { class: ["col-12", "col-sm-4", "col-md-4", "col-lg-3", "col-xl-2", "col-xxl-2"] },
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
            disableSpeech: true,
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
                        disableSpeech: true,
                        css: { hide: true },
                        formControl: new FormControl(null, { updateOn: "blur" }),
                        formName: "documentId",
                        onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                        }
                    }
                },
                {

                    formAction: {
                        disableSpeech: true,
                        css: { hide: true },
                        formControl: new FormControl(null, { updateOn: "blur" }),
                        formName: "fiscalCode",
                        onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                        }
                    }
                },

                {
                    formAction: {
                        disableSpeech: true,
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
                        disableSpeech: true,
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
                        disableSpeech: true,
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
                        disableSpeech: true,
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

