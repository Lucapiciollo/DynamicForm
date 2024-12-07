import { Component, Input } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { FormAction } from "../interface";

@Component({
    template:""
})
export abstract class FormComponentTemplate {
    @Input({ required: true }) abstract formControl: FormControl | FormGroup | FormArray;
    @Input({ required: true }) abstract formConfig: FormAction;
    @Input({ required: true }) abstract formParent: FormControl | FormGroup | FormArray;
}