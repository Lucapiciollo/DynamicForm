/** @format */

import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ConfigForm,
  TYPE_CONTROL_FORM,
  TypeForm,
} from '../dynamic-form.interface';

/**
 * STEP 01
 * Test minimo:
 * - 1 campo TEXT
 * - onInitialize
 * - onChange
 * - focus
 * - blur
 * - action Reset
 */

function logEvent(name: string, data?: any): void {
  console.groupCollapsed(
    `%c[STEP 01] ${name}`,
    'color:#7c5f2b;font-weight:bold',
  );
  console.log(data);
  console.groupEnd();
}
function createFormConfiguration(): TypeForm {
  return [
    {
      formAction: {
        title: 'Nome',
        translateId: 'step-01-first-name',

        css: {
          class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
        },

        formControl: new FormControl(
          { value: '', disabled: false },
          {
            updateOn: 'change',
            validators: [Validators.required],
          },
        ),

        formName: 'firstName',
        type: TYPE_CONTROL_FORM.TEXT,
        resetButton: true,

        onInitialize(
          idGroup: number,
          idForm: number,
          formControl: FormControl | FormArray | FormGroup,
          formName: string,
          formGroup: any,
          type: TYPE_CONTROL_FORM,
          allGroup: ConfigForm,
          paging: { count: number; page: number },
          onOptionSetted: any,
          utility: any,
        ) {
          logEvent('firstName:onInitialize', {
            idGroup,
            idForm,
            formName,
            value: formControl.value,
            type,
            paging,
          });
        },

        onChange(
          idGroup: number,
          idForm: number,
          formControl: FormControl | FormArray | FormGroup,
          formName: string,
          formGroup: any,
          type: TYPE_CONTROL_FORM,
          prevValue: any,
          allGroup: ConfigForm,
          utility: any,
        ) {
          logEvent('firstName:onChange', {
            idGroup,
            idForm,
            formName,
            value: formControl.value,
            prevValue,
            type,
          });

          utility?.getActionByName?.('Reset', (action: any) => {
            action.disabled = formControl.parent?.pristine ?? false;
          });
        },

        focus(
          idGroup: number,
          idForm: number,
          formControl: FormControl | FormArray | FormGroup,
          formName: string,
          formGroup: any,
          allGroup: ConfigForm,
        ) {
          logEvent('firstName:focus', {
            idGroup,
            idForm,
            formName,
            value: formControl.value,
          });
        },

        blur(
          idGroup: number,
          idForm: number,
          formControl: FormControl | FormArray | FormGroup,
          formName: string,
          formGroup: any,
          allGroup: ConfigForm,
        ) {
          logEvent('firstName:blur', {
            idGroup,
            idForm,
            formName,
            value: formControl.value,
            valid: formControl.valid,
            errors: formControl.errors,
          });

          formControl.markAsTouched();
          formControl.updateValueAndValidity();
        },
      },
    },

    {
      formAction: {
        title: 'Età',
        translateId: 'step-02-age',

        css: {
          class: ['col-12', 'col-sm-6', 'col-md-4', 'px-1'],
        },

        formControl: new FormControl(
          { value: null, disabled: false },
          {
            updateOn: 'change',
            validators: [Validators.min(18)],
          },
        ),

        formName: 'age',
        type: TYPE_CONTROL_FORM.NUMBER,
        resetButton: true,

        optionNumber: {
          min: 0,
          step: 1,
        },

        onInitialize(
          idGroup: number,
          idForm: number,
          formControl: FormControl | FormArray | FormGroup,
          formName: string,
          formGroup: any,
          type: TYPE_CONTROL_FORM,
          allGroup: ConfigForm,
          paging: { count: number; page: number },
          onOptionSetted: any,
          utility: any,
        ) {
          logEvent('age:onInitialize', {
            idGroup,
            idForm,
            formName,
            value: formControl.value,
            type,
            paging,
          });
        },

        onChange(
          idGroup: number,
          idForm: number,
          formControl: FormControl | FormArray | FormGroup,
          formName: string,
          formGroup: any,
          type: TYPE_CONTROL_FORM,
          prevValue: any,
          allGroup: ConfigForm,
          utility: any,
        ) {
          logEvent('age:onChange', {
            idGroup,
            idForm,
            formName,
            value: formControl.value,
            prevValue,
            valid: formControl.valid,
            errors: formControl.errors,
          });

          utility?.getActionByName?.('Reset', (action: any) => {
            action.disabled = formControl.parent?.pristine ?? false;
          });
        },

        focus(
          idGroup: number,
          idForm: number,
          formControl: FormControl | FormArray | FormGroup,
          formName: string,
          formGroup: any,
          allGroup: ConfigForm,
        ) {
          logEvent('age:focus', {
            idGroup,
            idForm,
            formName,
            value: formControl.value,
          });
        },

        blur(
          idGroup: number,
          idForm: number,
          formControl: FormControl | FormArray | FormGroup,
          formName: string,
          formGroup: any,
          allGroup: ConfigForm,
        ) {
          logEvent('age:blur', {
            idGroup,
            idForm,
            formName,
            value: formControl.value,
            valid: formControl.valid,
            errors: formControl.errors,
          });

          formControl.markAsTouched();
          formControl.updateValueAndValidity();
        },
      },
    },
  ];
}

export function buildUltraSafeNestedActionsForm(): ConfigForm {
  return [
    {
      formGroup: [...createFormConfiguration()],

      actions: [
        {
          label: 'Reset',
          cssClassButton: ['btn', 'btn-secondary', 'mx-1'],
          disabled: true,
          visible: true,

          action: (
            questions: any[],
            idForm: string,
            formGroup: FormGroup | FormArray,
          ) => {
            logEvent('ACTION:Reset', {
              questions,
              idForm,
              value: formGroup.value,
            });

            formGroup.reset();
            formGroup.markAsPristine();

            const firstGroup = questions?.[0] as any;
            const resetAction = firstGroup?.actions?.[0];

            if (resetAction) {
              resetAction.disabled = true;
            }
          },
        },
      ],
    },
  ] as ConfigForm;
}