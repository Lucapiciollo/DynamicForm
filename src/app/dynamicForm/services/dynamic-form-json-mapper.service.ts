/** @format */

import {Injectable, Signal, WritableSignal, signal} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ConfigForm, Form, FormAction, Group, TYPE_CONTROL_FORM, TypeComboOption} from '../dynamic-form.interface';
import {DynamicFormJsonSchema, DynamicJsonAction, DynamicJsonField, DynamicJsonGroup} from '../models/dynamic-form-json-schema.model';
import {DynamicFormEventRegistryService} from './dynamic-form-event-registry.service';
import {DynamicValidatorFactoryService} from './dynamic-validator-factory.service';

@Injectable({providedIn: 'root'})
export class DynamicFormJsonMapperService {
   constructor(
      private readonly validatorFactory: DynamicValidatorFactoryService,
      private readonly eventRegistry: DynamicFormEventRegistryService,
   ) {}

   toConfig(schema: DynamicFormJsonSchema): ConfigForm {
      return (schema?.groups || []).map((group, groupIndex) => this.mapGroup(group, groupIndex));
   }

   private mapGroup(group: DynamicJsonGroup, groupIndex: number): Group {
      return {
         title: group.title,
         class: group.class,
         bottomLabel: group.bottomLabel,
         formGroup: (group.fields || []).map((field, fieldIndex) => this.mapField(field, groupIndex, fieldIndex)),
         actions: (group.actions || []).map(action => this.mapAction(action)),
      };
   }

   private mapField(field: DynamicJsonField, groupIndex: number, fieldIndex: number): Form {
      const type = this.mapType(field.type);
      const validators = this.validatorFactory.create(field.validators);
      const control =
         type === TYPE_CONTROL_FORM.DATARANGE
            ? new FormGroup({
                 from: new FormControl((field.value as any)?.from ?? null),
                 to: new FormControl((field.value as any)?.to ?? null),
              })
            : new FormControl(
                 {
                    value: field.value ?? null,
                    disabled: field.disabled ?? false,
                 },
                 validators,
              );

      if (field.disabled && control instanceof FormGroup) control.disable();

      const formAction: FormAction = {
         ...(field.props || {}),
         formName: field.name,
         title: field.title || field.label,
         type,
         disabled: field.disabled,
         readonly: field.readonly ?? false,
         hint: field.hint,
         tipContent: field.tipContent,
         css: field.css || {class: field.class, hide: false},
         formControl: control,
         autocomplete: field.autocomplete,
         multiple: field.multiple,
         keyCombo: field.keyCombo,
         optionNumber: field.optionNumber,
         optionDate: field.optionDate,
         optionTime: field.optionTime,
         options: this.createOptionsSignal(field.options || field.datasource?.options),
         optionsDisabled: this.createReadonlyOptionsSignal(field.disabledOptions),
         paramsForRemoteData: field.paramsForRemoteData ? signal(field.paramsForRemoteData) : undefined,
         paging: field.paging ? {...field.paging, count: field.paging.count ?? 25, page: field.paging.page ?? 0, totalCount: field.paging.totalCount ?? 0} : undefined,
         remoteData: this.wrapRemoteData(field.remoteData),
         formGroup: field.children ? field.children.map((child, index) => this.mapGroup(child, index)) : undefined,
         onChange: this.wrapChangeEvent(field.events?.change),
         onInitialize: this.wrapInitializeEvent(field.events?.initialize),
         opened: this.wrapSimpleEvent(field.events?.opened),
         closed: this.wrapSimpleEvent(field.events?.closed),
         action: this.wrapControlAction(field.events?.action),
      } as FormAction;

      return {formAction};
   }

   private mapAction(action: DynamicJsonAction) {
      const handler = this.eventRegistry.getAction(action.event);
      return {
         label: action.label,
         cssClassIcon: action.cssClassIcon,
         cssClassButton: action.cssClassButton,
         disabled: action.disabled,
         visible: action.visible,
         action: (questions, idForm, formGroup) => handler?.({questions, idForm, formGroup}),
      };
   }

   private mapType(type: DynamicJsonField['type']): TYPE_CONTROL_FORM {
      if (typeof type === 'number') return type;
      const value = TYPE_CONTROL_FORM[type as keyof typeof TYPE_CONTROL_FORM];
      if (value === undefined) {
         throw new Error(`DynamicFormJsonMapperService: tipo controllo non valido: ${type}`);
      }
      return value;
   }

   private createOptionsSignal(options?: TypeComboOption): WritableSignal<TypeComboOption> | undefined {
      return options ? signal(options) : undefined;
   }

   private createReadonlyOptionsSignal(options?: TypeComboOption): Signal<TypeComboOption> | undefined {
      return options ? signal(options) : undefined;
   }

   private wrapChangeEvent(eventName?: string): any {
      const handler = this.eventRegistry.getEvent(eventName);
      if (!handler) return undefined;

      return (idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility) =>
         handler({idGroup, idForm, formControl, formName, formGroup, type, prevValue, allGroup, utility});
   }

   private wrapInitializeEvent(eventName?: string): any {
      const handler = this.eventRegistry.getEvent(eventName);
      if (!handler) return undefined;

      return (idGroup, idForm, formControl, formName, formGroup, type, allGroup, paging, onOptionSetted, utility) =>
         handler({idGroup, idForm, formControl, formName, formGroup, type, allGroup, paging, onOptionSetted, utility});
   }

   private wrapSimpleEvent(eventName?: string): any {
      const handler = this.eventRegistry.getEvent(eventName);
      if (!handler) return undefined;

      return (idGroup, idForm, formControl, formName, formGroup, allGroup, utility) =>
         handler({idGroup, idForm, formControl, formName, formGroup, type: undefined as any, allGroup, utility});
   }

   private wrapControlAction(eventName?: string): any {
      const handler = this.eventRegistry.getEvent(eventName);
      if (!handler) return undefined;

      return formControl => handler({idGroup: -1, idForm: -1, formControl, formName: '', formGroup: [], type: undefined as any, allGroup: [], utility: {}});
   }

   private wrapRemoteData(eventName?: string): any {
      const handler = this.eventRegistry.getEvent(eventName);
      if (!handler) return undefined;

      return (runtimeCtx: any = {}) =>
         handler({
            idGroup: -1,
            idForm: -1,
            formControl: undefined as any,
            formName: eventName,
            formGroup: runtimeCtx.formGroup ?? [],
            type: TYPE_CONTROL_FORM.COMBOPAGINATE,
            allGroup: [],
            utility: {},
            ...runtimeCtx,
         } as any);
   }
}
