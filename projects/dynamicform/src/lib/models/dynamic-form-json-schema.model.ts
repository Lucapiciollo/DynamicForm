/** @format */

import {TYPE_CONTROL_FORM, TypeComboOption, TypeCss, TypeOptionDate, TypeOptionNumber, TypeOptionTime} from '../dynamic-form.interface';

export type DynamicJsonFieldType = keyof typeof TYPE_CONTROL_FORM | TYPE_CONTROL_FORM;

export type DynamicJsonValidatorType =
   | 'required'
   | 'requiredTrue'
   | 'email'
   | 'min'
   | 'max'
   | 'minLength'
   | 'maxlength'
   | 'maxLength'
   | 'pattern'
   | 'nullValidator';

export interface DynamicJsonValidator {
   type: DynamicJsonValidatorType;
   value?: any;
   message?: string;
}

export interface DynamicJsonFieldEvents {
   change?: string;
   initialize?: string;
   opened?: string;
   closed?: string;
   action?: string;
}

export interface DynamicJsonCondition {
   field: string;
   operator: 'eq' | 'neq' | 'in' | 'notIn' | 'truthy' | 'falsy' | 'gt' | 'gte' | 'lt' | 'lte';
   value?: any;
}

export interface DynamicJsonDatasource {
   type: 'static' | 'registry';
   name?: string;
   options?: TypeComboOption;
}

export interface DynamicJsonField {
   name: string;
   type: DynamicJsonFieldType;
   label?: string;
   title?: string;
   value?: any;
   disabled?: boolean;
   readonly?: boolean;
   hint?: string;
   tipContent?: string;
   class?: string[];
   css?: TypeCss;
   validators?: DynamicJsonValidator[];
   options?: TypeComboOption;
   disabledOptions?: TypeComboOption;
   datasource?: DynamicJsonDatasource;
   remoteData?: string;
   paging?: {count?: number; page?: number; totalCount?: number};
   paramsForRemoteData?: Record<string, any>;
   multiple?: boolean;
   autocomplete?: boolean;
   keyCombo?: {
      keyId: string | string[];
      keyDescription: string | string[];
      keySearch?: string;
   };
   optionNumber?: TypeOptionNumber;
   optionDate?: TypeOptionDate;
   optionTime?: TypeOptionTime;
   visibleWhen?: DynamicJsonCondition[];
   disabledWhen?: DynamicJsonCondition[];
   events?: DynamicJsonFieldEvents;
   props?: Record<string, any>;
   children?: DynamicJsonGroup[];
}

export interface DynamicJsonAction {
   label?: string;
   event?: string;
   cssClassIcon?: string[];
   cssClassButton?: string[];
   disabled?: boolean;
   visible?: boolean;
}

export interface DynamicJsonGroup {
   id?: string;
   title?: string;
   class?: string[];
   bottomLabel?: string;
   fields: DynamicJsonField[];
   actions?: DynamicJsonAction[];
}

export interface DynamicFormJsonSchema {
   id?: string;
   groups: DynamicJsonGroup[];
}
