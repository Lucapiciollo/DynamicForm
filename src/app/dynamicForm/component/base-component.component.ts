/**
 * @format
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2024-11-24 11:29:45
 * @desc [description]
 */

import {Component, DestroyRef, ElementRef, EventEmitter, Injector, Input, Output, Signal, ViewChild, ViewContainerRef, WritableSignal, effect, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup} from '@angular/forms';
import {ReplaySubject, Subscriber, Subscription, combineLatest, pairwise, startWith} from 'rxjs';
import {IBaseComponent} from './base-component-interface';
import {GetErrorForm, GetErrorFormControl, GetErrorFormControlFromObj} from './error-message-utils';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {FormComponentTemplate} from './FormComponentTemplate';
import {Form, FormAction, TYPE_CONTROL_FORM, TypeComboOption, Utility} from '../dynamic-form.interface';
import {autoUnsubscribe} from '../custom.operator';
import {COMBO_PAING_INIT, MAX_ELEMENT_COMBO_SHOW} from '../dynamic-form.module';

@Component({
   selector: '',
   template: ``,
})
export class BaseComponent implements IBaseComponent {
   @Output() onCaptureCam: EventEmitter<File> = new EventEmitter<File>();
   @Output() instance: EventEmitter<{instance: BaseComponent; name: string}> = new EventEmitter<{
      instance: BaseComponent;
      name: string;
   }>();
   private obsQuestions: ReplaySubject<Form> = new ReplaySubject(1);
   private obsAllGroup: ReplaySubject<any> = new ReplaySubject(1);
   public initPagination: {count: number; page: number} = inject(COMBO_PAING_INIT);
   public combotext: {maxElementShow: number} = inject(MAX_ELEMENT_COMBO_SHOW);
   public mySignal: WritableSignal<{items: Array<any>; totalCount: number}> = signal(null);
   public readonly onOptionSetted: Signal<any> = signal(null);
   public destroyRef: DestroyRef = inject(DestroyRef);
   public getErrorForm: (formGroup: FormGroup, formName: string) => Array<string> = GetErrorForm;
   public getErrorFormControl: (formControl: FormControl) => Array<string> = GetErrorFormControl;
   public getErrorFormControlFromObj: (errors: Object) => Array<string> = GetErrorFormControlFromObj;
   public control: any = {formAction: {}};
   public obs: Subscriber<Subscription> = new Subscriber<Subscription>();
   // public setDisabledOption: WritableSignal<Array<string>> = signal([]);
   public setInitialOption: WritableSignal<TypeComboOption | {items: Array<any>; totalCount: number}> = signal([]);
   /************************************************************************************************************************************************************************ */
   public _autocomplete: MatAutocompleteTrigger = null;
   protected selectedItems: any[] = new Array<any>();
   public _allGroup: any;
   public internalValue;
   public utils: Utility;
   /************************************************************************************************************************************************************************ */

   @Input() formActionIndex: number = 0;
   @Input() formGroupIndex: number = 0;
   @Input() group: any = null;
   @Input() set allGroup(allGroup: any) {
      this._allGroup = allGroup;
      this.obsAllGroup.next(this._allGroup);
   }
   /************************************************************************************************************************************************************************ */

   @Input() set question(config: Form) {
      this.utils = {
         getFormByName: this.getFormByName,
         setDefaultOptions: this.setDefaultOptions,
         getSelectedOptions: this.getSelectedOptions,
         onSettedOptions: this.onSettedOptions,
         getActionByName: this.getActionByName,
      };

      this.control = {formAction: config};

      this.control.formAction.instance = this;
      if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE || TYPE_CONTROL_FORM.TIME || this.control.formAction.type == TYPE_CONTROL_FORM.COMBO || this.control.formAction.type == TYPE_CONTROL_FORM.RADIOGROUP) {
         this.control.formAction.options = signal(null);
         this.control.formAction.optionsDisabled = signal(null);
         this.control.formAction.paramsForRemoteData = signal(null);
      }

      this.obsQuestions.next(this.control);
   }

   /************************************************************************************************************************************************************************ */
   public signalStoreBase;
   public set signalStoreValue(value) {
      this.signalStoreBase = value;
   }
   /************************************************************************************************************************************************************************ */

   constructor(
      protected injector: Injector,
      protected element: ElementRef,
   ) {}

   /************************************************************************************************************************************************************************ */
   onSetOptionWithSearch = () => {
      if (typeof this.control?.formAction?.options != 'function') {
         this.internalValue = this.control.formAction.options || [];
         Object.defineProperty(this.control.formAction, 'options', {
            set: newValue => {
               this.internalValue = newValue;
               this.signalStoreBase.updateFilterOption(this._filter(null));
            },
            get: () => {
               return this.internalValue;
            },
            configurable: true,
         });
      } else {
      }
   };
   /************************************************************************************************************************************************************************ */
   // onSetOption = () => {

   //   if (typeof this.control?.formAction?.options != "function") {
   //     this.internalValue = this.control.formAction.options || [];
   //     Object.defineProperty(this.control.formAction, "options", {
   //       set: (newValue) => {
   //         this.internalValue = newValue;
   //         this.signalStoreBase.updateFilterOption(newValue);
   //       },
   //       get: () => {
   //         return this.internalValue;
   //       },
   //       configurable: true
   //     });
   //   } else {

   //   }
   // }
   /************************************************************************************************************************************************************************ */

   ngOnInit() {
      combineLatest({
         control: this.obsQuestions,
         allGroup: this.obsAllGroup,
      })
         .pipe(autoUnsubscribe(this.obs), takeUntilDestroyed(this.destroyRef))
         .subscribe(({allGroup, control}) => {
            control.formAction.type == TYPE_CONTROL_FORM.ARRAYSTRING ? this.onSetOptionWithSearch() : null;
            control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE ? (this.control.formAction.paging = this.initPagination) : null;
            control.formAction.formControl.disabled ? control.formAction.formControl.disable() : control.formAction.formControl.enable();

            if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) {
               const originalReset = control.formAction.formControl.reset.bind(control.formAction.formControl);

               control.formAction.formControl.reset = args => {
                  try {
                     originalReset(args);
                  } catch (e) {
                     originalReset([args]);
                  }
                  if (control.formAction.onInitialize) {
                     control.formAction.onInitialize(this.formGroupIndex, this.formActionIndex, control.formAction?.formControl, control.formAction.formName as string, this.group, control.formAction.type as TYPE_CONTROL_FORM, allGroup, this.initPagination as any, this.signalStoreBase?.totalOptions as any, this.utils);
                  }
               };
            }

            if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBO || this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) {
               effect(
                  () => {
                     let opt = this.control.formAction.options();
                     if (opt != null) {
                        this.signalStoreBase.setSelectedOptions([]);
                        this.signalStoreBase.setFilteredOptions(opt, this.control.formAction?.keyCombo);
                        this.signalStoreBase.setTotalOptions(opt);
                        this.setInitialOption.set(opt);
                     }
                  },
                  {injector: this.injector, allowSignalWrites: true},
               );

               effect(
                  () => {
                     let disable = this.control.formAction.optionsDisabled();
                     this.signalStoreBase?.addDisabledOption(disable);
                  },
                  {injector: this.injector, allowSignalWrites: true},
               );
            }

            if (control?.formAction?.css?.class) {
               control?.formAction?.css?.class.map((c: any) => {
                  this.element?.nativeElement?.classList?.add(c);
               });
            }

            if (control.formAction) {
               if ((control.formAction.type as TYPE_CONTROL_FORM) == TYPE_CONTROL_FORM.COMBOPAGINATE || (control.formAction.type as TYPE_CONTROL_FORM) == TYPE_CONTROL_FORM.COMBO) {
                  if (control.formAction.onInitialize) {
                     control.formAction.onInitialize(this.formGroupIndex, this.formActionIndex, control.formAction?.formControl, control.formAction.formName as string, this.group, control.formAction.type as TYPE_CONTROL_FORM, allGroup, this.initPagination as any, this.signalStoreBase.totalOptions as any, this.utils);
                  }
               } else if (control.formAction.onInitialize) control.formAction.onInitialize(this.formGroupIndex, this.formActionIndex, control.formAction?.formControl, control.formAction.formName as string, this.group, control.formAction.type as TYPE_CONTROL_FORM, allGroup, null, this.signalStoreBase?.totalOptions as any, this.utils);

               control.formAction?.formControl.valueChanges.pipe(autoUnsubscribe(this.obs), takeUntilDestroyed(this.destroyRef), startWith(null), pairwise()).subscribe(async ([prevValue, next]: [any, any]) => {
                  this.callOnhange(prevValue, next);
               });
            }
         });
   }
   /************************************************************************************************************************************************************************ */
   ngOnDestroy(): void {}
   /************************************************************************************************************************************************************************ */
   public _filter(value: string = ''): any {
      let cloned = [...(this.signalStoreBase.getTotalOptions() || [])]; // JSON.parse(JSON.stringify(this.internalValue || []));
      const filterValue = value?.toString()?.toLowerCase() || null;
      if (filterValue == null) {
         return cloned;
      }
      if (cloned)
         return cloned.filter((option: any) => {
            if (filterValue != null && option?.description) {
               if ((option?.description as string)?.toLowerCase().includes(filterValue) || option.id == filterValue) return option;
            }
         });
   }
   /************************************************************************************************************************************************************************ */
   callOnhange(prevValue, next) {
      if (this.control.formAction && this.control.formAction.onChange) this.control.formAction.onChange(this.formGroupIndex, this.formActionIndex, this.control.formAction?.formControl, this.control.formAction.formName, this.group, this.control.formAction.type, prevValue, this._allGroup, this.utils);
   }
   /************************************************************************************************************************************************************************ */
   @ViewChild('dynamicContainer', {read: ViewContainerRef})
   container!: ViewContainerRef;
   private componentRef = [];
   /************************************************************************************************************************************************************************ */
   ngAfterViewInit() {
      if (this.container && this.control?.formAction?.componentRef) {
         this.createDynamicComponent();
      }
   }
   /************************************************************************************************************************************************************************ */
   createDynamicComponent() {
      this.container.clear();
      this.componentRef = [];
      this.control?.formAction?.componentRef?.map(component => {
         const componentRef = this.container.createComponent<FormComponentTemplate>(component);
         componentRef.instance.getFormControl = () => this.control?.formAction?.formControl;
         componentRef.instance.getFormConfig = () => this.control?.formAction;
         componentRef.instance.getFormParent = () => this.control?.formAction?.formControl?.parent;
         componentRef.instance.getQuestions = () => this._allGroup;
         componentRef.instance.initialize();
         this.componentRef.push(componentRef);
      });
   }
   /************************************************************************************************************************************************************************ */
   destroyDynamicComponent() {
      if (this.componentRef) {
         this.componentRef.map(c => c.destroy());
      }
   }
   /************************************************************************************************************************************************************************ */

   private readonly getActionByName = (actionName: string, parse: (form: FormAction) => any): void => {
      const forms: Array<any> = JSON.findByKeyAndValue(this._allGroup, 'label', `${actionName}`, ['formControl', 'instance']) ?? [];
      parse(forms?.length > 1 ? forms.map(m => ({name: m.object.formName, value: m.object})) : forms[0]?.object || null);
   };
   private readonly getFormByName = (formName: string, parse: (form: FormAction) => any): void => {
      const forms: Array<any> = JSON.findByKeyAndValue(this.group, 'formName', `${formName}`, ['formControl', 'instance']) ?? [];
      parse(forms?.length > 1 ? forms.map(m => ({name: m.object.formName, value: m.object})) : forms[0]?.object || null);
   };

   private readonly setDefaultOptions = (formName: string, parse: (response: any) => Partial<TypeComboOption | {items: Array<any>; totalCount: number}>): any => {
      const forms: Array<any> = JSON.findByKeyAndValue(this.group, 'formName', `${formName}`, ['formControl', 'instance']) ?? [];
      let parsedForm = forms.length > 1 ? forms.map(m => ({name: m.object.formName, value: m.object})) : forms[0]?.object || null;
      let response = parse(forms.length > 1 ? forms.map(m => ({name: m.object.formName, value: m.object})) : forms[0]?.object || null);
      parsedForm?.instance?.signalStoreBase?.setDefaultOptions(response || []);
   };

   private readonly getSelectedOptions = (formName: string, parse: (option: Signal<TypeComboOption>) => any): TypeComboOption => {
      const forms: Array<any> = JSON.findByKeyAndValue(this.group, 'formName', `${formName}`, ['formControl', 'instance']) ?? [];
      let parsedForm = forms.length > 1 ? forms.map(m => ({name: m.object.formName, value: m.object})) : forms[0]?.object || null;
      return parse(parsedForm?.length > 1 ? parsedForm.map(m => m.instance?.signalStoreBase?.getSelectedOptions) : parsedForm.instance?.signalStoreBase?.getSelectedOptions || null);
   };

   private readonly onSettedOptions = (formName: string, parse: (event: Signal<TypeComboOption>) => any): TypeComboOption => {
      const forms: Array<any> = JSON.findByKeyAndValue(this.group, 'formName', `${formName}`, ['formControl', 'instance']) ?? [];
      let parsedForm = forms.length > 1 ? forms.map(m => ({name: m.object.formName, value: m.object})) : forms[0]?.object || null;
      return parse(parsedForm?.length > 1 ? parsedForm.map(m => m.instance?.signalStoreBase?.getSelectedOptionsFromTotal) : parsedForm.instance?.signalStoreBase.getSelectedOptionsFromTotal || null);
   };
}
