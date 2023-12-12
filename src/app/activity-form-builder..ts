import { FormControl, FormGroup, Validators } from "@angular/forms";
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
                css: { class: [] },
                formControl: new FormControl("Name", [Validators.required]),
                options: [],
                formName: "Anagrafica",
                onChange(idGroup, idForm, formCOntrol, formName, fg, setOption, update, formGroupMain, typeControl, prevValue) { },
                required: true,
                formGroup: [
                    {
                        title: "Attivitàccccc",
                        formGroup: [
                            {
                                formAction: {
                                    title: "I",
                                    type: TYPE_CONTROL_FORM.COMBO,
                                    css: { class: [] },
                                    formControl: new FormControl(null, [Validators.required]),
                                    options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
                                    formName: "c",
                                    onChange(idGroup, idForm, formCOntrol, formName, fg: Array<any>, setOption, update, formGroupMain, typeControl, prevValue) {
                                        (formGroupMain as any)[0].formGroup[0].formAction.formGroup[0].formGroup[1].formAction.options = [{ id: 1, description: "UNO" }]
                                    },
                                    required: true,
                                    autocomplete: true

                                },
                                
                            }, {
                                formAction: {
                                    title: "L",
                                    type: TYPE_CONTROL_FORM.COMBO,
                                    css: { class: [] },
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
                                    type: TYPE_CONTROL_FORM.CHECKBOX,
                                    css: { class: [] },
                                    formControl: new FormControl(),
                                    options: [],
                                    formName: "e",
                                    onChange(idGroup, idForm, formCOntrol, formName, fg, setOption, update, formGroupMain, typeControl, prevValue) {
                                        console.log(formCOntrol.value)
                                    },
                                    formGroup: [
                                        {
                                            title: "Attivitàccccc",
                                            formGroup: [
                                                {
                                                    formAction: {
                                                        title: "I",
                                                        type: TYPE_CONTROL_FORM.COMBO,
                                                        css: { class: [] },
                                                        formControl: new FormControl(null, [Validators.required]),
                                                        options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
                                                        formName: "c",
                                                        onChange(idGroup, idForm, formCOntrol, formName, fg: Array<any>, setOption, update, formGroupMain, typeControl, prevValue) {
                                                            fg[1].formAction.options = [{ id: 1, description: "UNO" }]
                                                        },
                                                        required: true,
                                                        autocomplete: true

                                                    },

                                                }, {
                                                    formAction: {
                                                        title: "L",
                                                        type: TYPE_CONTROL_FORM.COMBO,
                                                        css: { class: [] },
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
                                                        type: TYPE_CONTROL_FORM.RADIOGROUP,
                                                        css: { class: [] },
                                                        formControl: new FormControl(null),
                                                        options: [{id:"1" , description :"Uno"},{id:"2" , description :"Due"}],
                                                        formName: "e",
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
