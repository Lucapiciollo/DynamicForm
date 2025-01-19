/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2024-11-24 11:29:45
 * @desc [description]
 */
import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  Output, Signal, ViewChild, ViewContainerRef, WritableSignal, effect, inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subscriber, Subscription, combineLatest, pairwise, startWith } from 'rxjs';
import { IBaseComponent } from './base-component-interface';
import { GetErrorForm, GetErrorFormControl } from './error-message-utils';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormComponentTemplate } from './FormComponentTemplate';
import { Form, TYPE_CONTROL_FORM, TypeComboOption } from '../dynamic-form.interface';
import { autoUnsubscribe } from '../custom.operator';
import { COMBO_PAING_INIT, MAX_ELEMENT_COMBO_SHOW } from '../dynamic-form.module';


@Component({
  selector: '', template: ``
})
export class BaseComponent implements IBaseComponent {


  @Output() onCaptureCam: EventEmitter<File> = new EventEmitter<File>();
  @Output() instance: EventEmitter<{ instance: BaseComponent, name: string }> = new EventEmitter<{ instance: BaseComponent, name: string }>();
  private obsQuestions: ReplaySubject<Form> = new ReplaySubject(1);
  private obsAllGroup: ReplaySubject<any> = new ReplaySubject(1);
  public initPagination: { count: number, page: number } = inject(COMBO_PAING_INIT);
  public combotext: { maxElementShow: number } = inject(MAX_ELEMENT_COMBO_SHOW);
  public mySignal: WritableSignal<{ items: Array<any>, totalCount: number }> = signal(null);
  public readonly onOptionSetted: Signal<any> = signal(null);
  public destroyRef: DestroyRef = inject(DestroyRef);
  public getErrorForm: (formGroup: FormGroup, formName: string) => Array<string> = GetErrorForm;
  public getErrorFormControl: (formControl: FormControl) => Array<string> = GetErrorFormControl;
  public control: any = { formAction: {} };
  public obs: Subscriber<Subscription> = new Subscriber<Subscription>();
  public setDisabledOption: WritableSignal<Array<string>> = signal([]);
  public setInitialOption: WritableSignal<TypeComboOption | { items: Array<any>, totalCount: number }> = signal([]);
  /************************************************************************************************************************************************************************ */
  public _autocomplete: MatAutocompleteTrigger = null;
  protected selectedItems: any[] = new Array<any>();
  public _allGroup: any;
  public internalValue;
  /************************************************************************************************************************************************************************ */

  @Input() formActionIndex: number = 0;
  @Input() formGroupIndex: number = 0;
  @Input() group: any = null;
  @Input() set allGroup(allGroup: any) {
    this._allGroup = allGroup;
    this.obsAllGroup.next(this._allGroup)
  }
  /************************************************************************************************************************************************************************ */

  @Input() set question(config: Form) {
    this.control = { formAction: config };
    this.obsQuestions.next(this.control);
    this.control.formAction.options = signal(null);
  };


  /************************************************************************************************************************************************************************ */
  public signalStoreBase;
  public set signalStoreValue(value) {
    this.signalStoreBase = value;
  }
  /************************************************************************************************************************************************************************ */

  constructor(protected injector: Injector, protected element: ElementRef) {




  }


  /************************************************************************************************************************************************************************ */
  onSetOptionWithSearch = () => {


    if (typeof this.control?.formAction?.options != "function") {
      this.internalValue = this.control.formAction.options || [];
      Object.defineProperty(this.control.formAction, "options", {
        set: (newValue) => {
          this.internalValue = newValue;
          this.signalStoreBase.updateFilterOption(this._filter(null));
        },
        get: () => {
          return this.internalValue;
        },
        configurable: true
      });
    } else {

    }
  }
  /************************************************************************************************************************************************************************ */
  onSetOption = () => {

    if (typeof this.control?.formAction?.options != "function") {
      this.internalValue = this.control.formAction.options || [];
      Object.defineProperty(this.control.formAction, "options", {
        set: (newValue) => {
          this.internalValue = newValue;
          this.signalStoreBase.updateFilterOption(newValue);
        },
        get: () => {
          return this.internalValue;
        },
        configurable: true
      });
    } else {


    }
  }
  /************************************************************************************************************************************************************************ */

  ngOnInit() {
    combineLatest({
      control: this.obsQuestions,
      allGroup: this.obsAllGroup
    }).pipe(
      autoUnsubscribe(this.obs),
      takeUntilDestroyed(this.destroyRef)).subscribe(({ allGroup, control }) => {
        // (control.formAction.type == TYPE_CONTROL_FORM.COMBO) ? this.onSetOptionWithSearch() : null;
        // (control.formAction.type == TYPE_CONTROL_FORM.ARRAYSTRING) ? this.onSetOptionWithSearch() : null;
        // (control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) ? this.onSetOption() : null;
        control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE ? this.control.formAction.paging = this.initPagination : null;
        (control.formAction.formControl.disabled) ? control.formAction.formControl.disable() : control.formAction.formControl.enable();

        effect(() => {
          let opt = this.control.formAction.options();
          if (opt != null) {
            this.signalStoreBase.setSelectedOptions([]);
            this.signalStoreBase.setFilteredOptions(opt);
            this.signalStoreBase.setTotalOptions(opt);
          }
        }, { injector: this.injector, allowSignalWrites: true });

        if (control?.formAction?.css?.class) {
          control?.formAction?.css?.class.map((c: any) => {
            this.element?.nativeElement?.classList?.add(c);
          })
        }
        if (control.formAction) {
          if (control.formAction.type as TYPE_CONTROL_FORM == TYPE_CONTROL_FORM.COMBOPAGINATE) {
            if (control.formAction.onInitialize)
              control.formAction.onInitialize(this.formGroupIndex, this.formActionIndex, control.formAction?.formControl, control.formAction.formName as string, this.group, control.formAction.type as TYPE_CONTROL_FORM, allGroup, this.initPagination as any, this.signalStoreBase.totalOptions as any, this.setDisabledOption, this.setInitialOption);

          } else if (control.formAction.onInitialize)
            control.formAction.onInitialize(this.formGroupIndex, this.formActionIndex, control.formAction?.formControl, control.formAction.formName as string, this.group, control.formAction.type as TYPE_CONTROL_FORM, allGroup, null, null, this.setDisabledOption, this.setInitialOption);

          control.formAction?.formControl.valueChanges.pipe(
            autoUnsubscribe(this.obs),
            takeUntilDestroyed(this.destroyRef),
            startWith(null),
            pairwise()
          ).subscribe(async ([prevValue, next]: [any, any]) => {
            this.callOnhange(prevValue, next);
          })

        }
      })
  }
  /************************************************************************************************************************************************************************ */
  ngOnDestroy(): void { }
  /************************************************************************************************************************************************************************ */
  public _filter(value: string = ""): any {
    let cloned = [...this.signalStoreBase.getTotalOptions() || []] // JSON.parse(JSON.stringify(this.internalValue || []));
    const filterValue = value?.toString()?.toLowerCase() || null;
    if (filterValue == null) {
      return cloned
    }
    if (cloned)
      return cloned.filter((option: any) => {
        if (filterValue != null && option?.description) {
          if ((option?.description as string)?.toLowerCase().includes(filterValue) || option.id == filterValue)
            return option
        }
      });
  }
  /************************************************************************************************************************************************************************ */
  callOnhange(prevValue, next) {
    if (this.control.formAction && this.control.formAction.onChange)
      this.control.formAction.onChange(this.formGroupIndex, this.formActionIndex, this.control.formAction?.formControl, this.control.formAction.formName, this.group, this.control.formAction.type, prevValue, this._allGroup);
  }
  /************************************************************************************************************************************************************************ */
  @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
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
      this.componentRef.push(componentRef)
    })
  }
  /************************************************************************************************************************************************************************ */
  destroyDynamicComponent() {
    if (this.componentRef) {
      this.componentRef.map(c => c.destroy());
    }
  }
  /************************************************************************************************************************************************************************ */

}
