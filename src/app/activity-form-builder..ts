import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfigForm, TypeForm, TYPE_CONTROL_FORM } from "./dynamicForm/interface";






export function activityForm(context: any): ConfigForm {
    return [
        {
            title: "Attivitàaaaaaaaa",
            formGroup: createform(context),
            actions: [{
                label: "test",
                action(fg, id, formArray, button) {
                    console.log(fg, id, formArray, button)
                },
            }]
        }
    ];
}



function createform(context: any): TypeForm {

    return [{
        formAction: {
            title: "CHECKBOX",
            type: TYPE_CONTROL_FORM.CHECKBOX,
            css: { class: ["col-3"] },
            formControl: new FormControl(null),
            options: [],
            formName: "CHECKBOX",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }, {
        formAction: {
            title: "COMBO",
            type: TYPE_CONTROL_FORM.COMBO,
            css: { class: ["col-3"] },
            formControl: new FormControl(null, [Validators.required]),
            options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
            formName: "COMBO",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) {
                //    JSON.changeValuesByKey(JSON.findByKeyAndValue(fg, "formName", "cap", ["formControl"]), "options", [{ id: 1, description: "QUATTRO" }], ["formControl"]);
            },
            onInitialize(idGroup, idForm, formCOntrol, formName, fg, typeControl, allGroup) {
                // JSON.changeValuesByKey(JSON.findByKeyAndValue(allGroup, "formName", "cap", ["formControl"]), "options", [{ id: 1, description: "UNO" }], ["formControl"]);
            },
            required: true,
            autocomplete: true
        },

    }, {
        formAction: {
            title: "CURRENCY",
            type: TYPE_CONTROL_FORM.CURRENCY,
            simbol: "€",
            css: { class: ["col-3"] },
            formControl: new FormControl(null),
            options: [],
            formName: "CURRENCY",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }, {
        formAction: {
            title: "DATA",
            type: TYPE_CONTROL_FORM.DATA,
            css: { class: ["col-3"] },
            formControl: new FormControl(null),
            options: [],
            formName: "DATA",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }, {
        formAction: {
            title: "DATARANGE",
            type: TYPE_CONTROL_FORM.DATARANGE,
            css: { class: ["col-3"] },
            formControl: new FormGroup({ from: new FormControl(), to: new FormControl() }),
            options: [],
            formName: "DATARANGE",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }, {
        formAction: {
            title: "DATETIME",
            type: TYPE_CONTROL_FORM.DATETIME,
            css: { class: ["col-3"] },
            formControl: new FormControl(null),
            options: [],
            formName: "DATETIME",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }, {
        formAction: {
            title: "FILE",
            type: TYPE_CONTROL_FORM.FILE,
            css: { class: ["col-3"] },
            formControl: new FormControl(null),
            options: [],
            formName: "FILE",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }, {
        formAction: {
            title: "TEXT",
            type: TYPE_CONTROL_FORM.TEXT,
            css: { class: ["col-3"] },
            formControl: new FormControl(null),
            options: [],
            formName: "TEXT",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }, {
        formAction: {
            title: "LABEL",
            type: TYPE_CONTROL_FORM.LABEL,
            css: { class: ["col-3"] },
            formControl: new FormControl("LABEL"),
            options: [],
            formName: "LABEL",
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }, {
        formAction: {
            title: "SORTACTION",
            type: TYPE_CONTROL_FORM.SORTACTION,
            css: { class: ["col-1" ], toggleIcons:['assets/img/top-priority.svg' , 'assets/img/bottom-priority.svg'] },
            formControl: new FormControl<"ASC"|"DESC">({value:"ASC",disabled:false}),
            options: [],
            formName: "SORTACTION", 
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }, {
        formAction: {
            title: "LINK",
            type: TYPE_CONTROL_FORM.LINK,
            css: { class: ["col-3" ]  },
            formControl: new FormControl({value:"ASC",disabled:false}),
            options: [{ id: 1, description: "UNO" }, { id: 2, description: "DUE" }, { id: 3, description: "TRE" }],
            formName: "LINK", 
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }, {
        formAction: {
            title: "NUMBER",
            type: TYPE_CONTROL_FORM.NUMBER,
            css: { class: ["col-3" ]  },
            formControl: new FormControl({value:"ASC",disabled:false}),
            formName: "NUMBER", 
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }, {
        formAction: {
            title: "TEXTAREA",
            type: TYPE_CONTROL_FORM.TEXTAREA,
            css: { class: ["col-3" ]  },
            formControl: new FormControl({value:"ASC",disabled:false}),
            formName: "TEXTAREA", 
            onChange(idGroup, idForm, formCOntrol, formName, fg, typeControl, prevValue, allGroup) { }
        }
    }]
}
