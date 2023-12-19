import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfigForm, TypeForm, TYPE_CONTROL_FORM } from "./dynamicForm/interface";






export function activityForm(context: any): ConfigForm {
    return [
        {
            title: "Attivitàaaaaaaaa",
            formGroup: createform(context),
            actions:[{
                label:"test",
                action(fg, id, formArray, button) {
                     console.log(fg, id, formArray, button)
                },
            }]
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
                css: { class: ["col-3", "col-sm-3", "col-md-3", "col-lg-3", "col-xl-3", "col-xxl-3"] },
                formControl: new FormControl("Name", [Validators.required]),
                options: [],
                formName: "anagrafica",
                onChange(idGroup, idForm, formCOntrol, formName, fg,  formGroupMain, typeControl, prevValue) { },
                required: true,
                formGroup: [
                    {
                        // title: "Attivitàccccc",
                        formGroup: [
                            {
                                formAction: {
                                    title: "Nome",
                                    type: TYPE_CONTROL_FORM.COMBO,
                                    css: { class: ["col-3", "col-sm-3", "col-md-3", "col-lg-3", "col-xl-3", "col-xxl-3"] },
                                    formControl: new FormControl(null, [Validators.required]),
                                    options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
                                    formName: "nome",
                                    onChange(idGroup, idForm, formCOntrol, formName, fg: Array<any>,  formGroupMain, typeControl, prevValue) {

                                        fg[2].formAction.formGroup[0].formGroup[1].formAction.options= [{ id: 1, description: "DUE" }];
                                    },
                                    required: true,
                                    autocomplete: true 

                                },
                                
                            }, {
                                formAction: {
                                    title: "Cognome",
                                    type: TYPE_CONTROL_FORM.COMBO,
                                    css: { class: ["col-3", "col-sm-3", "col-md-3", "col-lg-3", "col-xl-3", "col-xxl-3"] },
                                    formControl: new FormControl(null),
                                    options: [],
                                    formName: "cognome",
                                    onChange(idGroup, idForm, formCOntrol, formName, fg,  formGroupMain, typeControl, prevValue) {
                                        console.log(formCOntrol.value)
                                    }
                                }
                            }, {
                                formAction: {
                                    // title: "ssssssssss",
                                    type: TYPE_CONTROL_FORM.GROUP,
                                    css: { class: ["col-3", "col-sm-3", "col-md-3", "col-lg-3", "col-xl-3", "col-xxl-3" ] },
                                    formControl: new FormControl(),
                                    options: [],
                                    formName: "e",
                                    onChange(idGroup, idForm, formCOntrol, formName, fg,  formGroupMain, typeControl, prevValue) {
                                        console.log(formCOntrol.value)
                                    },
                                    formGroup: [
                                        {
                                            title: "Residenza",
                                            formGroup: [
                                                {
                                                    formAction: {
                                                        title: "Via",
                                                        type: TYPE_CONTROL_FORM.COMBO,
                                                        css: { class: ["col-3", "col-sm-3", "col-md-3", "col-lg-3", "col-xl-3", "col-xxl-3"] },
                                                        formControl: new FormControl(null, [Validators.required]),
                                                        options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
                                                        formName: "via",
                                                        onChange(idGroup, idForm, formCOntrol, formName, fg: Array<any>, formGroupMain, typeControl, prevValue) {
                                                            fg[1].formAction.options = [{ id: 1, description: "UNO" }]
                                                        },
                                                        onInitialize(idGroup, idForm, formCOntrol, formName, fg, typeControl, allGroup) {
                                                            fg[1].formAction.options = [{ id: 1, description: "UNO" }]
                                                        },
                                                        required: true,
                                                        autocomplete: true

                                                    },

                                                }, {
                                                    formAction: {
                                                        title: "CAP",
                                                        type: TYPE_CONTROL_FORM.COMBO,
                                                        css: { class: ["col-3", "col-sm-3", "col-md-3", "col-lg-3", "col-xl-3", "col-xxl-3"] },
                                                        formControl: new FormControl(null),
                                                        options: [],
                                                        formName: "cap",
                                                        onChange(idGroup, idForm, formCOntrol, formName, fg,  formGroupMain, typeControl, prevValue) {
                                                            console.log(formCOntrol.value)
                                                        }
                                                    }
                                                }, {
                                                    formAction: {
                                                        title: "Comune",
                                                        type: TYPE_CONTROL_FORM.RADIOGROUP,
                                                        css: {classRadio:["col-3"], class: ["col-3", "col-sm-3", "col-md-3", "col-lg-3", "col-xl-3", "col-xxl-3"] },
                                                        formControl: new FormControl(null),
                                                        options: [{id:"1" , description :"Uno"},{id:"2" , description :"Due"}],
                                                        formName: "comune",
                                                        onChange(idGroup, idForm, formCOntrol, formName, fg,  formGroupMain, typeControl, prevValue) {
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
