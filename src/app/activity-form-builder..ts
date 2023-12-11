import { FormControl, Validators } from "@angular/forms";
import { ConfigForm, TypeForm, TYPE_CONTROL_FORM } from "./dynamicForm/interface";






export function activityForm(context: any): ConfigForm {
    return [
        {
            title: "Attivitàaaaaaaaa",
            formGroup: createform(context)
        }
    ];
}



function createform(context: any): TypeForm {

    return [
        {
            formAction: {
                title: "Anagrafica",
                type: TYPE_CONTROL_FORM.TEXT,
                autocomplete: true,
                css: { class: ["col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12", "col-xxl-12"] },
                formControl: new FormControl("Name", [Validators.required]),
                options: [],
                formName: "Anagrafica",
                onChange(idGroup, idForm, formCOntrol, formName, fg, setOption, update, formGroupMain, typeControl, prevValue) { },
                required: true,
                formGroup: [
                    {
                        title: "Identità",
                        formGroup: [
                            {
                                formAction: {
                                    title: "Nome",
                                    type: TYPE_CONTROL_FORM.TEXT,
                                    css: { class: ["col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12", "col-xxl-12"] },
                                    formControl: new FormControl("Luca", [Validators.required]),
                                    options: [],
                                    formName: "Nome",
                                    onChange(idGroup, idForm, formCOntrol, formName, fg, setOption, update, formGroupMain, typeControl, prevValue) {
                                        console.log(formCOntrol.value)
                                    },
                                    required: true

                                },

                            }, {
                                formAction: {
                                    title: "Cognome",
                                    type: TYPE_CONTROL_FORM.TEXT,
                                    css: { class: ["col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12", "col-xxl-12"] },
                                    formControl: new FormControl("Piciollo"),
                                    options: [],
                                    formName: "Cognome",
                                    onChange(idGroup, idForm, formCOntrol, formName, fg, setOption, update, formGroupMain, typeControl, prevValue) {
                                        console.log(formCOntrol.value)
                                    }, formGroup: [
                                        {
                                            title: "Attivitàccccc",
                                            formGroup: [
                                                {
                                                    formAction: {
                                                        title: "I",
                                                        type: TYPE_CONTROL_FORM.COMBO,
                                                        css: { class: ["col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12", "col-xxl-12"] },
                                                        formControl: new FormControl(null, [Validators.required]),
                                                        options: [{id:1,description:"UNO"},{id:2,description:"DUE"},{id:3,description:"TRE"}],
                                                        formName: "c",
                                                        onChange(idGroup, idForm, formCOntrol, formName, fg:Array<any>, setOption, update, formGroupMain, typeControl, prevValue) {
                                                            fg[1].formAction.options= [{id:1,description:"UNO"}]
                                                        },
                                                        required: true,
                                                        autocomplete:true

                                                    },

                                                }, {
                                                    formAction: {
                                                        title: "L",
                                                        type: TYPE_CONTROL_FORM.COMBO,
                                                        css: { class: ["col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12", "col-xxl-12"] },
                                                        formControl: new FormControl(null),
                                                        options: [],
                                                        formName: "d",
                                                        onChange(idGroup, idForm, formCOntrol, formName, fg, setOption, update, formGroupMain, typeControl, prevValue) {
                                                            console.log(formCOntrol.value)
                                                        }
                                                    }
                                                }, {
                                                    formAction: {
                                                        title: "L",
                                                        type: TYPE_CONTROL_FORM.TEXT,
                                                        css: { class: ["col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12", "col-xxl-12"] },
                                                        formControl: new FormControl("llllllllll"),
                                                        options: [],
                                                        formName: "d",
                                                        onChange(idGroup, idForm, formCOntrol, formName, fg, setOption, update, formGroupMain, typeControl, prevValue) {
                                                            console.log(formCOntrol.value)
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            title: "Attivitàccccc",
                                            formGroup: [
                                                {
                                                    formAction: {
                                                        title: "I",
                                                        type: TYPE_CONTROL_FORM.TEXT,
                                                        css: { class: ["col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12", "col-xxl-12"] },
                                                        formControl: new FormControl("iiiiiiiiiiiii", [Validators.required]),
                                                        options: [],
                                                        formName: "c",
                                                        onChange(idGroup, idForm, formCOntrol, formName, fg, setOption, update, formGroupMain, typeControl, prevValue) {
                                                            console.log(formCOntrol.value)
                                                        },
                                                        required: true

                                                    },

                                                }, {
                                                    formAction: {
                                                        title: "L",
                                                        type: TYPE_CONTROL_FORM.TEXT,
                                                        css: { class: ["col-12", "col-sm-12", "col-md-12", "col-lg-12", "col-xl-12", "col-xxl-12"] },
                                                        formControl: new FormControl("llllllllll"),
                                                        options: [],
                                                        formName: "d",
                                                        onChange(idGroup, idForm, formCOntrol, formName, fg, setOption, update, formGroupMain, typeControl, prevValue) {
                                                            console.log(formCOntrol.value)
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        } 
    ]
}
