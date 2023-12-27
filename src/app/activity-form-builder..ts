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
//         formAction: {
//             title: "CHECKBOX",
//             typeControlForm: TYPE_CONTROL_FORM.CHECKBOX,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "CHECKBOX",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//         formAction: {
//             title: "COMBOAUTOCOMPLETE",
//             typeControlForm: TYPE_CONTROL_FORM.COMBO,
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
//         formAction: {
//             title: "COMBO",
//             typeControlForm: TYPE_CONTROL_FORM.COMBO,
//             multiple: true,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null, [Validators.required]),
//             options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
//             formName: "COMBO",
//             autocomplete: false
//         },

//     }, {
//         formAction: {
//             title: "RADIOGROUP",
//             typeControlForm: TYPE_CONTROL_FORM.RADIOGROUP,
//             multiple: true,
//             css: { class: ["col-6"], classRadio: ["col-4"] },
//             formControl: new FormControl(null, [Validators.required]),
//             options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
//             formName: "RADIOGROUP",
//             autocomplete: false
//         },

//     }, {
//         formAction: {
//             title: "CURRENCY",
//             typeControlForm: TYPE_CONTROL_FORM.CURRENCY,
//             simbol: "€",
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "CURRENCY",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//         formAction: {
//             title: "DATA",
//             typeControlForm: TYPE_CONTROL_FORM.DATA,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "DATA",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//         formAction: {
//             title: "DATARANGE",
//             typeControlForm: TYPE_CONTROL_FORM.DATARANGE,
//             css: { class: ["col-3"] },
//             formControl: new FormGroup({ from: new FormControl(), to: new FormControl() }),
//             options: [],
//             formName: "DATARANGE",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//         formAction: {
//             title: "DATETIME",
//             typeControlForm: TYPE_CONTROL_FORM.DATETIME,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "DATETIME",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, 
//     {
//         formAction: {
//             title: "FILE",
//             typeControlForm: TYPE_CONTROL_FORM.FILE,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "FILE",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, 
//     {
//         formAction: {
//             title: "TEXT",
//             typeControlForm: TYPE_CONTROL_FORM.TEXT,
//             css: { class: ["col-3"] },
//             formControl: new FormControl(null),
//             options: [],
//             formName: "TEXT",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }
//     , {
//         formAction: {
//             title: "LABEL",
//             typeControlForm: TYPE_CONTROL_FORM.LABEL,
//             css: { class: ["col-3"] },
//             formControl: new FormControl("LABEL"),
//             options: [],
//             formName: "LABEL",

//         }
//     }, {
//         formAction: {
//             title: "SORTACTION",
//             typeControlForm: TYPE_CONTROL_FORM.SORTACTION,
//             css: { iconCss:"iconCss", class: ["col-1"], toggleIcons: ['assets/img/top-priority.svg', 'assets/img/bottom-priority.svg'] },
//             formControl: new FormControl<"ASC" | "DESC">({ value: "ASC", disabled: false }),
//             options: [],
//             formName: "SORTACTION",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//         formAction: {
//             title: "LINK",
//             typeControlForm: TYPE_CONTROL_FORM.LINK,
//             css: { class: ["col-3"] },
//             formControl: new FormControl({ value: "ASC", disabled: false }),
//             options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
//             formName: "LINK",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }, {
//         formAction: {
//             title: "NUMBER",
//             typeControlForm: TYPE_CONTROL_FORM.NUMBER,
//             css: { class: ["col-3"] },
//             formControl: new FormControl({ value: "ASC", disabled: false }),
//             formName: "NUMBER",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }
//     , {
//         formAction: {
//             title: "TEXTAREA",
//             typeControlForm: TYPE_CONTROL_FORM.TEXTAREA,
//             css: { class: ["col-3"] },
//             formControl: new FormControl({ value: "ASC", disabled: false }),
//             formName: "TEXTAREA",
//             onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
//         }
//     }
//  ]
// }


import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { inject } from "@angular/core";
import { ConfigForm, Form, TYPE_CONTROL_FORM, TypeForm } from "./dynamicForm/interface";





export function activityForm(registry: any, context: any): ConfigForm {

    return [
        {
            title: "Anagrafica",
            formGroup: createRegistry(registry, context),
            actions: [{
                label: "Add residenza",
                action(fg, id, formArray, button) {
                    console.log(fg, id, formArray, button);
                    (fg[0] as any).formGroup=[...(fg[0] as any).formGroup.push(createResidenza(registry, context))]
                }
            }],
        }
    ];
}



export function createRegistry(object: any, context: any): TypeForm {
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
                formName: "residence",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                }
            }
        },
        {

            formAction: {
                css: { hide: true },
                formControl: new FormControl(object?.registryId),
                formName: "document",
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
                typeControlForm: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
                formControl: new FormControl(object?.name, { updateOn: "blur", validators: [Validators.required, Validators.maxLength(20)] }),
                formName: "name",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                }
            }
        },
        {
            formAction: {
                title: "COGNOME",
                typeControlForm: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
                formControl: new FormControl(object?.surname, { updateOn: "blur", validators: [Validators.required, Validators.maxLength(20)] }),
                formName: "surname",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                }
            }
        },
        {
            formAction: {
                title: "SESSO",
                typeControlForm: TYPE_CONTROL_FORM.COMBO,
                css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
                formControl: new FormControl(object?.gender, [Validators.required]),
                formName: "gender",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                },
                options: [{ id: "M", description: "Maschio" }, { id: "F", description: "Femmina" }]
            }
        },


        {
            formAction: {
                title: "DATA DI ASCITA",
                typeControlForm: TYPE_CONTROL_FORM.DATA,
                css: { class: ["col-12", "col-sm-4", "col-md-3", "col-lg-3", "col-xl-3", "col-xxl-3"] },
                formControl: new FormControl(object?.birthDate, [Validators.required]),
                formName: "birthDate",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }
            }
        },

        {
            formAction: {
                title: "PROVINCIA DI NASCITA",
                typeControlForm: TYPE_CONTROL_FORM.COMBO,
                css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-3"] },
                formControl: new FormControl(object?.province, [Validators.required]),
                formName: "province",
                async onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {

                }

            }
        }, {
            formAction: {
                title: "COMUNE",
                typeControlForm: TYPE_CONTROL_FORM.COMBO,
                css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-3"] },
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
                typeControlForm: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-3", "col-lg-3", "col-xl-3", "col-xxl-3"] },
                formControl: new FormControl(object?.fiscalCode, { updateOn: "blur", validators: [Validators.required] }),
                formName: "fiscalCode",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }
            }
        },
        {
            formAction: {
                title: "CITTADINANZA",
                typeControlForm: TYPE_CONTROL_FORM.COMBO,
                css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
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
                typeControlForm: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
                formControl: new FormControl(object?.phone, { updateOn: "blur", validators: [] }),
                formName: "phone",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }

            }
        },
        {
            formAction: {
                title: "MOBILE",
                typeControlForm: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
                formControl: new FormControl(object?.mobile, { updateOn: "blur", validators: [Validators.maxLength(10)] }),
                formName: "mobile",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }
            }
        },

        {
            formAction: {
                title: "EMAIL",
                typeControlForm: TYPE_CONTROL_FORM.TEXT,
                css: { class: ["col-12", "col-sm-4", "col-md-6", "col-lg-6", "col-xl-6", "col-xxl-6"] },
                formControl: new FormControl(object?.email, { updateOn: "blur", validators: [Validators.email] }),
                formName: "email",
                onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {


                }
            }
        },
        {
            formAction: {
                title: "PEC",
                typeControlForm: TYPE_CONTROL_FORM.TEXT,
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
            title: "Residenza",
            typeControlForm: TYPE_CONTROL_FORM.GROUP,
            formControl: new FormControl(),
            formName: "residenza",
            formGroup: [{
                actions: [{
                    label: "test",
                    action(fg, id, formArray, button) {
                        console.log(fg, id, formArray, button);
                        (fg[0] as any).formGroup = [...(fg[0] as any).formGroup.push(createResidenza(object, context))]
                    }
                }],
                formGroup: [
                    {

                        formAction: {
                            title: "TEST",
                            typeControlForm: TYPE_CONTROL_FORM.TEXT,
                            formControl: new FormControl(object.fiscalCode, { updateOn: "blur" }),
                            formName: "fiscalCodePatient"
                        }
                    },

                    {
                        formAction: {
                            title: "VIA/PIAZZA",
                            typeControlForm: TYPE_CONTROL_FORM.TEXT,
                            css: { class: ["col-12", "col-sm-12", "col-md-12", "col-lg-6", "col-xl-6", "col-xxl-6"] },
                            formControl: new FormControl(object.street, { updateOn: "blur", validators: [Validators.required] }),
                            formName: "street"

                        }
                    },
                    {
                        formAction: {
                            title: "CIVICO",
                            typeControlForm: TYPE_CONTROL_FORM.TEXT,
                            css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
                            formControl: new FormControl(object.civic, { updateOn: "blur", validators: [Validators.required] }),
                            formName: "civic"
                        }
                    },
                    {
                        formAction: {
                            title: "CAP",
                            typeControlForm: TYPE_CONTROL_FORM.TEXT,
                            css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
                            formControl: new FormControl(object.cap, { updateOn: "blur", validators: [] }),
                            formName: "cap"
                        }
                    },
                    {
                        formAction: {
                            title: "REGIONE",
                            typeControlForm: TYPE_CONTROL_FORM.COMBO,
                            css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
                            formControl: new FormControl(object.city, { updateOn: "change" }),
                            formName: "city",
                            autocomplete: true,

                        }
                    },
                    {
                        formAction: {
                            title: "PROVINCIA",
                            typeControlForm: TYPE_CONTROL_FORM.COMBO,
                            css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
                            formControl: new FormControl(object.province, { updateOn: "change", validators: [Validators.required] }),
                            formName: "province"
                        }
                    },



                    {
                        formAction: {
                            title: "COMUNE",
                            typeControlForm: TYPE_CONTROL_FORM.COMBO,
                            css: { class: ["col-12", "col-sm-4", "col-md-2", "col-lg-2", "col-xl-2", "col-xxl-2"] },
                            formControl: new FormControl(object.townHall, { updateOn: "change" }),
                            formName: "townHall",
                            autocomplete: true
                        }
                    }]
            }]
        }
    }
}