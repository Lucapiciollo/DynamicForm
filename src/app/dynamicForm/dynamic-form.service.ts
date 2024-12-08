import { Injectable } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { v4 as uuidv4 } from 'uuid';
import { ConfigForm, TYPE_CONTROL_FORM } from "./dynamic-form.interface";

@Injectable()
export class StepperService {

  toFormGroup(questions: ConfigForm, formArray: FormArray<any> = new FormArray<any>([])): FormArray {
    questions?.forEach(question => {
      let uuid = uuidv4();
      if (question.formGroup) {
        formArray.push(new FormGroup({}));
        (question as any)["id"] = uuid;
        question.formGroup?.forEach(fg => {
          if (fg.formAction.formGroup) {
            fg.formAction.type = TYPE_CONTROL_FORM.GROUP;
            (formArray.controls[formArray.controls.length - 1] as FormGroup).addControl(fg.formAction.formName as string, new FormArray<any>([]))
            this.toFormGroup(fg.formAction.formGroup, (formArray.controls[formArray.controls.length - 1] as FormGroup).get(fg.formAction.formName as string) as FormArray)
          } else
            (formArray.controls[formArray.controls.length - 1] as FormGroup).addControl(fg.formAction.formName as string, fg.formAction.formControl);
        })
      }
    });
    return formArray;
  }

}