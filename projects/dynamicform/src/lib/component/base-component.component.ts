/**
 * @format
 */

import {
   Component,
   DestroyRef,
   ElementRef,
   EventEmitter,
   Injector,
   Input,
   Output,
   Signal,
   ViewChild,
   ViewContainerRef,
   WritableSignal,
   effect,
   inject,
   signal,
   untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { combineLatest, pairwise, ReplaySubject, startWith, Subscriber, Subscription } from 'rxjs';

import { IBaseComponent } from './base-component-interface';
import { FormComponentTemplate } from './FormComponentTemplate';
import { GetErrorForm, GetErrorFormControl, GetErrorFormControlFromObj } from './error-message-utils';

import { autoUnsubscribe } from '../custom.operator';
import { COMBO_PAING_INIT, MAX_ELEMENT_COMBO_SHOW } from '../tokens/dynamic-form-injection-tokens';
import {
   ConfigForm,
   DynamicFormActionButton,
   Form,
   FormAction,
   FormCompletionStats,
   TYPE_CONTROL_FORM,
   TypeComboOption,
   Utility,
} from '../dynamic-form.interface';

@Component({
   selector: '',
   template: ``,
   standalone: false,
})
export class BaseComponent implements IBaseComponent {
   @Output() onCaptureCam: EventEmitter<File> = new EventEmitter<File>();

   @Output() instance: EventEmitter<{ instance: BaseComponent; name: string }> = new EventEmitter<{
      instance: BaseComponent;
      name: string;
   }>();

   private obsQuestions: ReplaySubject<{ formAction: FormAction }> = new ReplaySubject(1);
   private obsAllGroup: ReplaySubject<ConfigForm> = new ReplaySubject(1);

   public initPagination: { count: number; page: number; totalCount?: number } = inject(COMBO_PAING_INIT);
   public combotext: { maxElementShow: number } = inject(MAX_ELEMENT_COMBO_SHOW);

   public mySignal: WritableSignal<{ items: Array<any>; totalCount: number } | null> = signal(null);
   public readonly onOptionSetted: Signal<any> = signal(null);

   public destroyRef: DestroyRef = inject(DestroyRef);

   public getErrorForm: (formGroup: FormGroup, formName: string) => Array<string> = GetErrorForm;
   public getErrorFormControl: (formControl: FormControl) => Array<string> = GetErrorFormControl;
   public getErrorFormControlFromObj: (errors: Object) => Array<string> = GetErrorFormControlFromObj;

   public control: { formAction: FormAction } = { formAction: {} as FormAction };

   public obs: Subscriber<Subscription> = new Subscriber<Subscription>();

   public setInitialOption: WritableSignal<TypeComboOption | { items: Array<any>; totalCount: number } | null> = signal(null);

   public _autocomplete: MatAutocompleteTrigger = null;
   protected selectedItems: any[] = new Array<any>();

   public _allGroup: ConfigForm;
   public internalValue: any;
   public utils: Utility;

   private readonly _completionSignal: WritableSignal<FormCompletionStats> = signal<FormCompletionStats>({
      total: 0, filled: 0, percentage: 0,
      required: { total: 0, filled: 0, percentage: 0 },
   });
   private _completionSub: import('rxjs').Subscription | null = null;

   public signalStoreBase: any;

   @Input() formActionIndex: number = 0;
   @Input() formGroupIndex: number = 0;

   /**
    * Questo è il gruppo corrente, cioè group.formGroup passato dal DynamicFormComponent.
    */
   @Input() group: Array<Form> = null;

   @Input() set allGroup(allGroup: ConfigForm) {
      this._allGroup = allGroup;
      this.obsAllGroup.next(this._allGroup);
      this._subscribeToCompletion();
   }

   /**
    * ATTENZIONE:
    * Dal template attuale arriva direttamente `formAction`, non il wrapper `{ formAction }`.
    *
    * dynamic-form.component.html:
    * [question]="formAction"
    *
    * Però manteniamo anche compatibilità con eventuale `{ formAction }`.
    */
   @Input() set question(config: FormAction | Form) {
      this.utils = {
         getFormByName: this.getFormByName,
         setDefaultOptions: this.setDefaultOptions,
         getSelectedOptions: this.getSelectedOptions,
         onSettedOptions: this.onSettedOptions,
         getActionByName: this.getActionByName,
         formCompletion: this._completionSignal.asReadonly(),
      };

      const normalizedControl = this.normalizeQuestion(config);

      this.control = normalizedControl;

      if (this.control?.formAction) {
         this.control.formAction.instance = this;
      }

      this.prepareSignalsForOptionBasedControls();

      this.obsQuestions.next(this.control);
   }

   public set signalStoreValue(value: any) {
      this.signalStoreBase = value;
   }

   constructor(
      protected injector: Injector,
      protected element: ElementRef,
   ) { }

   /***********************************************************************************************************************************
    * NORMALIZATION
    ***********************************************************************************************************************************/

   private normalizeQuestion(config: FormAction | Form): { formAction: FormAction } {
      if (!config) {
         return { formAction: {} as FormAction };
      }

      if ((config as Form)?.formAction) {
         return config as Form;
      }

      return {
         formAction: config as FormAction,
      };
   }

   private prepareSignalsForOptionBasedControls(): void {
      const type = this.control?.formAction?.type;

      if (
         type === TYPE_CONTROL_FORM.COMBOPAGINATE ||
         type === TYPE_CONTROL_FORM.TIME ||
         type === TYPE_CONTROL_FORM.COMBO ||
         type === TYPE_CONTROL_FORM.RADIOGROUP
      ) {
         this.control.formAction.options =
            typeof this.control.formAction.options === 'function'
               ? this.control.formAction.options
               : signal(this.control.formAction.options || null);

         this.control.formAction.optionsDisabled =
            typeof this.control.formAction.optionsDisabled === 'function'
               ? this.control.formAction.optionsDisabled
               : signal(this.control.formAction.optionsDisabled || null);

         this.control.formAction.paramsForRemoteData =
            typeof this.control.formAction.paramsForRemoteData === 'function'
               ? this.control.formAction.paramsForRemoteData
               : signal(this.control.formAction.paramsForRemoteData || null);
      }
   }

   /***********************************************************************************************************************************
    * INIT
    ***********************************************************************************************************************************/

   ngOnInit(): void {
      combineLatest({
         control: this.obsQuestions,
         allGroup: this.obsAllGroup,
      })
         .pipe(autoUnsubscribe(this.obs), takeUntilDestroyed(this.destroyRef))
         .subscribe(({ allGroup, control }) => {
            this.control = control;

            this.setupArrayStringSearchOptions(control);
            this.setupComboPagination(control);
            this.setupDisabledState(control);
            this.overrideComboPaginateReset(control, allGroup);
            this.setupComboEffects(control);
            this.applyCssClasses(control);
            this.emitInitialize(control, allGroup);
            this.listenValueChanges(control);
         });
   }

   ngOnDestroy(): void { }

   /***********************************************************************************************************************************
    * SETUP
    ***********************************************************************************************************************************/

   private setupArrayStringSearchOptions(control: { formAction: FormAction }): void {
      if (control?.formAction?.type === TYPE_CONTROL_FORM.ARRAYSTRING) {
         this.onSetOptionWithSearch();
      }
   }

   private setupComboPagination(control: { formAction: FormAction }): void {
      if (control?.formAction?.type === TYPE_CONTROL_FORM.COMBOPAGINATE) {
         control.formAction.paging = {
            ...this.initPagination,
            totalCount: control.formAction?.paging?.totalCount ?? this.initPagination?.totalCount ?? 0,
         };
      }
   }

   private setupDisabledState(control: { formAction: FormAction }): void {
      const formControl = control?.formAction?.formControl;

      if (!formControl) {
         return;
      }

      if (formControl.disabled) {
         formControl.disable({ emitEvent: false });
      } else {
         formControl.enable({ emitEvent: false });
      }
   }

   private overrideComboPaginateReset(control: { formAction: FormAction }, allGroup: ConfigForm): void {
      if (control?.formAction?.type !== TYPE_CONTROL_FORM.COMBOPAGINATE) {
         return;
      }

      const formControl = control?.formAction?.formControl;

      if (!formControl) {
         return;
      }

      const originalReset = formControl.reset.bind(formControl);

      formControl.reset = (args?: any) => {
         try {
            originalReset(args);
         } catch (e) {
            originalReset([args]);
         }

         this.emitInitialize(control, allGroup);
      };
   }

   private setupComboEffects(control: { formAction: FormAction }): void {
      if (
         control?.formAction?.type !== TYPE_CONTROL_FORM.COMBO &&
         control?.formAction?.type !== TYPE_CONTROL_FORM.COMBOPAGINATE
      ) {
         return;
      }

      if (!this.signalStoreBase) {
         return;
      }

      effect(
         () => {
            const optionsFn = this.control?.formAction?.options;

            if (typeof optionsFn !== 'function') {
               return;
            }

            const opt = optionsFn();

            if (opt != null) {
               untracked(() => {
                  this.signalStoreBase.setSelectedOptions([]);
                  this.signalStoreBase.setFilteredOptions(opt, this.control.formAction?.keyCombo);
                  this.signalStoreBase.setTotalOptions(opt, this.control.formAction?.keyCombo);
                  this.setInitialOption.set(opt);
               });
            }
         },
         { injector: this.injector, allowSignalWrites: true },
      );

      effect(
         () => {
            const disabledFn = this.control?.formAction?.optionsDisabled;

            if (typeof disabledFn !== 'function') {
               return;
            }

            const disable = disabledFn();

            untracked(() => this.signalStoreBase?.addDisabledOption(disable));
         },
         { injector: this.injector, allowSignalWrites: true },
      );
   }

   private applyCssClasses(control: { formAction: FormAction }): void {
      if (!control?.formAction?.css?.class?.length) {
         return;
      }

      control.formAction.css.class.forEach((c: string) => {
         this.element?.nativeElement?.classList?.add(c);
      });
   }

   private listenValueChanges(control: { formAction: FormAction }): void {
      const formControl = control?.formAction?.formControl;

      if (!formControl) {
         return;
      }

      formControl.valueChanges
         .pipe(autoUnsubscribe(this.obs), takeUntilDestroyed(this.destroyRef), startWith(null), pairwise())
         .subscribe(([prevValue, next]: [any, any]) => {
            const t = control?.formAction?.type;
            // Blocca il trigger generico per COMBO e COMBOPAGINATE (solo il componente custom deve chiamare onChange)
            if (
               t === TYPE_CONTROL_FORM.GROUP ||
               t === TYPE_CONTROL_FORM.ARRAYSTRING ||
               t === TYPE_CONTROL_FORM.RATING ||
               t === TYPE_CONTROL_FORM.COMBO ||
               t === TYPE_CONTROL_FORM.COMBOPAGINATE ||
               !control?.formAction?.onChange
            ) return;
            if (prevValue === next) return;
            if (prevValue === null && next === null) return;
            this.callOnChange(prevValue, next);
         });
   }

   /***********************************************************************************************************************************
    * OPTION SETTER FOR ARRAYSTRING
    ***********************************************************************************************************************************/

   public onSetOptionWithSearch = (): void => {
      if (typeof this.control?.formAction?.options !== 'function') {
         this.internalValue = this.control.formAction.options || [];

         Object.defineProperty(this.control.formAction, 'options', {
            set: newValue => {
               this.internalValue = newValue;
               this.signalStoreBase?.updateFilterOption?.(this._filter(null));
            },
            get: () => {
               return this.internalValue;
            },
            configurable: true,
         });
      }
   };

   /***********************************************************************************************************************************
    * EMIT EVENTS
    ***********************************************************************************************************************************/

   private emitInitialize(control: { formAction: FormAction }, allGroup: ConfigForm): void {
      const formAction = control?.formAction;

      if (!formAction?.onInitialize) {
         return;
      }

      formAction.onInitialize(
         this.formGroupIndex,
         this.formActionIndex,
         formAction.formControl,
         formAction.formName as string,
         this.group,
         formAction.type as TYPE_CONTROL_FORM,
         allGroup,
         formAction.paging ?? this.initPagination ?? null,
         this.getOptionSettedSignal(),
         this.utils,
      );
   }

   public callOnChange(prevValue: any, nextValue?: any): void {
      const formAction = this.control?.formAction;

      if (!formAction?.onChange) {
         return;
      }



      formAction.onChange(
         this.formGroupIndex,
         this.formActionIndex,
         formAction.formControl,
         formAction.formName as string,
         this.group,
         formAction.type as TYPE_CONTROL_FORM,
         prevValue,
         this._allGroup,
         this.utils,
      );
   }

   public emitOpened(): void {
      const formAction = this.control?.formAction;

      if (!formAction?.opened) {
         return;
      }

      formAction.opened(
         this.formGroupIndex,
         this.formActionIndex,
         formAction.formControl,
         formAction.formName as string,
         this.group,
         this._allGroup,
         this.utils,
      );
   }

   public emitClosed(): void {
      const formAction = this.control?.formAction;

      if (!formAction?.closed) {
         return;
      }

      formAction.closed(
         this.formGroupIndex,
         this.formActionIndex,
         formAction.formControl,
         formAction.formName as string,
         this.group,
         this._allGroup,
         this.utils,
      );
   }

   public emitFocus(): void {
      const formAction = this.control?.formAction;

      if (!formAction?.onFocus) {
         return;
      }

      formAction.onFocus(
         this.formGroupIndex,
         this.formActionIndex,
         formAction.formControl,
         formAction.formName as string,
         this.group,
         this._allGroup,
         this.utils,
      );
   }

   public emitBlur(): void {
      const formAction = this.control?.formAction;

      if (!formAction?.onBlur) {
         return;
      }

      formAction.onBlur(
         this.formGroupIndex,
         this.formActionIndex,
         formAction.formControl,
         formAction.formName as string,
         this.group,
         this._allGroup,
         this.utils,
      );
   }

   public emitSearch(search: string): void {
      const formAction = this.control?.formAction;

      if (!formAction?.onSearch) {
         return;
      }

      formAction.onSearch(
         this.formGroupIndex,
         this.formActionIndex,
         formAction.formControl,
         formAction.formName as string,
         this.group,
         search,
         this.utils,
      );
   }

   public emitScrollEnd(paging?: { count: number; page: number; totalCount?: number }): void {
      const formAction = this.control?.formAction;

      if (!formAction?.onScrollEnd) {
         return;
      }

      formAction.onScrollEnd(
         this.formGroupIndex,
         this.formActionIndex,
         formAction.formControl,
         formAction.formName as string,
         this.group,
         paging ?? formAction.paging ?? this.initPagination,
         this.utils,
      );
   }

   private getOptionSettedSignal(): Signal<Array<any>> | null {
      if (this.signalStoreBase?.totalOptions) {
         return this.signalStoreBase.totalOptions as Signal<Array<any>>;
      }

      if (this.signalStoreBase?.getSelectedOptionsFromTotal) {
         return this.signalStoreBase.getSelectedOptionsFromTotal as Signal<Array<any>>;
      }

      return this.onOptionSetted as Signal<Array<any>>;
   }

   /***********************************************************************************************************************************
    * FILTER
    ***********************************************************************************************************************************/

   public _filter(value: string = ''): any {
      const cloned = [...(this.signalStoreBase?.getTotalOptions?.() || [])];
      const filterValue = value?.toString()?.toLowerCase() || null;

      if (filterValue == null) {
         return cloned;
      }

      return cloned.filter((option: any) => {
         if (filterValue != null && option?.description) {
            return (option.description as string).toLowerCase().includes(filterValue) || option.id == filterValue;
         }

         return false;
      });
   }

   /***********************************************************************************************************************************
    * DYNAMIC COMPONENTS
    ***********************************************************************************************************************************/

   @ViewChild('dynamicContainer', { read: ViewContainerRef })
   container!: ViewContainerRef;

   private componentRef: Array<any> = [];

   ngAfterViewInit(): void {
      if (this.container && this.control?.formAction?.componentRef) {
         this.createDynamicComponent();
      }
   }

   createDynamicComponent(): void {
      this.container.clear();
      this.componentRef = [];

      this.control?.formAction?.componentRef?.forEach(component => {
         const componentRef = this.container.createComponent<FormComponentTemplate>(component as any);

         componentRef.instance.getFormControl = () => this.control?.formAction?.formControl;
         componentRef.instance.getFormConfig = () => this.control?.formAction;
         componentRef.instance.getFormParent = () => this.control?.formAction?.formControl?.parent;
         componentRef.instance.getQuestions = () => this._allGroup;
         componentRef.instance.initialize();

         this.componentRef.push(componentRef);
      });
   }

   destroyDynamicComponent(): void {
      if (this.componentRef) {
         this.componentRef.forEach(c => c.destroy());
      }
   }

   /***********************************************************************************************************************************
    * UTILITY
    ***********************************************************************************************************************************/

   private readonly getActionByName = (actionName: string, parse: (action: DynamicFormActionButton) => any): void => {
      const actions: Array<any> = JSON["findByKeyAndValue"](this._allGroup, 'label', `${actionName}`, ['formControl', 'instance']) ?? [];

      const response = actions?.length > 1
         ? actions.map(m => ({ name: m.object?.name || m.object?.label, value: m.object }))
         : actions[0]?.object || null;

      parse(response);
   };

   private readonly getFormByName = (formName: string, parse: (form: FormAction, formObject?: any) => any): void => {
      const forms: Array<any> = JSON["findByKeyAndValue"](this.group, 'formName', `${formName}`, ['formControl', 'instance']) ?? [];

      const response = forms?.length > 1
         ? forms.map(m => ({ name: m.object.formName, value: m.object }))
         : forms[0]?.object || null;

      parse(response, forms);
   };

   private readonly setDefaultOptions = (
      formName: string,
      parse: (response: any) => Partial<TypeComboOption | { items: Array<any>; totalCount: number }>,
   ): any => {
      const forms: Array<any> = JSON["findByKeyAndValue"](this.group, 'formName', `${formName}`, ['formControl', 'instance']) ?? [];

      const parsedForm = forms.length > 1
         ? forms.map(m => ({ name: m.object.formName, value: m.object }))
         : forms[0]?.object || null;

      const response = parse(parsedForm);

      if (Array.isArray(parsedForm)) {
         parsedForm.forEach((f: any) => {
            f?.value?.instance?.signalStoreBase?.setDefaultOptions(response || []);
         });
         return;
      }

      parsedForm?.instance?.signalStoreBase?.setDefaultOptions(response || []);
   };

   private readonly getSelectedOptions = (formName: string, parse: (option: Signal<TypeComboOption>) => any): TypeComboOption => {
      const forms: Array<any> = JSON["findByKeyAndValue"](this.group, 'formName', `${formName}`, ['formControl', 'instance']) ?? [];

      const parsedForm = forms.length > 1
         ? forms.map(m => ({ name: m.object.formName, value: m.object }))
         : forms[0]?.object || null;

      return parse(
         parsedForm?.length > 1
            ? parsedForm.map(m => m.value?.instance?.signalStoreBase?.getSelectedOptions)
            : parsedForm?.instance?.signalStoreBase?.getSelectedOptions || null,
      );
   };

   private readonly onSettedOptions = (formName: string, parse: (event: Signal<TypeComboOption>) => any): TypeComboOption => {
      const forms: Array<any> = JSON["findByKeyAndValue"](this.group, 'formName', `${formName}`, ['formControl', 'instance']) ?? [];

      const parsedForm = forms.length > 1
         ? forms.map(m => ({ name: m.object.formName, value: m.object }))
         : forms[0]?.object || null;

      return parse(
         parsedForm?.length > 1
            ? parsedForm.map(m => m.value?.instance?.signalStoreBase?.getSelectedOptionsFromTotal)
            : parsedForm?.instance?.signalStoreBase?.getSelectedOptionsFromTotal || null,
      );
   };

   /***********************************************************************************************************************************
    * FORM COMPLETION
    ***********************************************************************************************************************************/

   private _SKIP_COMPLETION = new Set<TYPE_CONTROL_FORM>([
      TYPE_CONTROL_FORM.SEPARATOR,
      TYPE_CONTROL_FORM.LABEL,
      TYPE_CONTROL_FORM.LINK,
      TYPE_CONTROL_FORM.GROUP,
   ]);

   private _getTrackableFormActions(): FormAction[] {
      if (!this._allGroup) return [];
      const result: FormAction[] = [];
      for (const group of this._allGroup) {
         for (const form of group.formGroup ?? []) {
            const fa = form?.formAction;
            if (fa?.formControl && !this._SKIP_COMPLETION.has(fa.type as unknown as TYPE_CONTROL_FORM)) {
               result.push(fa);
            }
         }
      }
      return result;
   }

   private _isFieldFilled(fa: FormAction): boolean {
      const value = fa.formControl?.value;
      if (value === null || value === undefined || value === '') return false;
      if (Array.isArray(value)) return value.length > 0;
      return true;
   }

   private _computeCompletion(): FormCompletionStats {
      const fas = this._getTrackableFormActions();
      const total = fas.length;
      const filled = fas.filter(fa => this._isFieldFilled(fa)).length;
      const percentage = total > 0 ? Math.round((filled / total) * 100) : 0;

      const requiredFas = fas.filter(fa => {
         try { return fa.formControl?.hasValidator?.(Validators.required) ?? false; }
         catch { return false; }
      });
      const requiredTotal = requiredFas.length;
      const requiredFilled = requiredFas.filter(fa => this._isFieldFilled(fa)).length;
      const requiredPercentage = requiredTotal > 0 ? Math.round((requiredFilled / requiredTotal) * 100) : 0;

      return { total, filled, percentage, required: { total: requiredTotal, filled: requiredFilled, percentage: requiredPercentage } };
   }

   private _subscribeToCompletion(): void {
      this._completionSub?.unsubscribe();
      this._completionSub = null;

      const fas = this._getTrackableFormActions();
      if (!fas.length) {
         this._completionSignal.set({ total: 0, filled: 0, percentage: 0, required: { total: 0, filled: 0, percentage: 0 } });
         return;
      }

      this._completionSignal.set(this._computeCompletion());

      this._completionSub = combineLatest(
         fas.map(fa => fa.formControl!.valueChanges.pipe(startWith(fa.formControl!.value)))
      ).pipe(
         takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
         this._completionSignal.set(this._computeCompletion());
      });
   }
}