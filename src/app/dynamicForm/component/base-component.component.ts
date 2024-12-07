/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2024-11-24 11:29:45
 * @desc [description]
 */
import { DatePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  Output, inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject, Subscriber, Subscription, combineLatest, pairwise, startWith } from 'rxjs';
import { IBaseComponent } from './base-component-interface';
import { GetErrorForm, GetErrorFormControl } from './error-message-utils';
import { Form, FormActionDate, FormActionGeneric, TYPE_CONTROL_FORM } from '../interface';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { autoUnsubscribe, bufferWithMaxAwaitTime } from './custom.operator';


@Component({
  selector: '',
  template: ``,
  providers: [DatePipe]
})

export class BaseComponent implements IBaseComponent {


  @Output() onCaptureCam: EventEmitter<File> = new EventEmitter<File>();
  @Output() instance: EventEmitter<{ instance: BaseComponent, name: string }> = new EventEmitter<{ instance: BaseComponent, name: string }>();
  public filteredOptions: ReplaySubject<any> = new ReplaySubject(1);
  private callOnhangeSubject = new Subject<{ prevValue: any, next: any }>();
  public getErrorForm: (formGroup: FormGroup, formName: string) => Array<string> = GetErrorForm;
  public getErrorFormControl: (formControl: FormControl) => Array<string> = GetErrorFormControl;
  public destroyRef: DestroyRef = inject(DestroyRef);
  private obsQuestions: ReplaySubject<Form> = new ReplaySubject(1);
  private obsAllGroup: ReplaySubject<any> = new ReplaySubject(1);
  public control: any = { formAction: {} };
  public clonedOption;
  public obs: Subscriber<Subscription> = new Subscriber<Subscription>()


  /************************************************************************************************************************************************************************ */

  @Input() formActionIndex: number = 0;
  @Input() formGroupIndex: number = 0;
  @Input() group: any = null;
  public _allGroup: any;
  private internalValue;

  @Input() set allGroup(allGroup: any) {
    this._allGroup = allGroup;
    this.obsAllGroup.next(this._allGroup)
  }

  @Input() set question(config: Form) {
    this.control = {
      formAction: {
        ...config,
        resetButton: (config.formAction as FormActionGeneric)?.resetButton != null ? (config.formAction as FormActionGeneric)?.resetButton : true,
        readonly: (config.formAction as FormActionDate)?.readonly != null ? (config.formAction as FormActionDate)?.readonly : true
      }
    };
    this.obsQuestions.next(this.control);
  };


  protected selectedItems: any[] = new Array<any>();
  /************************************************************************************************************************************************************************ */

  onSetOption = () => {
    this.internalValue = this.control?.formAction?.options;
    Object.defineProperty(this.control.formAction, "options", {
      set: (newValue) => {
        this.internalValue = newValue;
        this.filteredOptions.next(this._filter(this.control.formAction.formControl?.value))
      },
      get: () => {
        return this.internalValue;
      },
      configurable: true
    });
  }
  /************************************************************************************************************************************************************************ */


  ngOnInit() {
    let app: Subscription = null
    combineLatest({
      control: this.obsQuestions,
      allGroup: this.obsAllGroup
    }).pipe(
      autoUnsubscribe(this.obs),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ allGroup, control }) => {
      if (app && !app.closed) app.unsubscribe();
      control.formAction.type == TYPE_CONTROL_FORM.COMBO ? this.onSetOption() : null;
      app = control.formAction?.formControl.valueChanges.pipe(
        autoUnsubscribe(this.obs),
        takeUntilDestroyed(this.destroyRef),
        startWith(null),
        pairwise()
      ).subscribe(async ([prevValue, next]: [any, any]) => {
        this.callOnhangeSubject.next({ prevValue, next })
      });

      (control.formAction.formControl.disabled) ? control.formAction.formControl.disable() : control.formAction.formControl.enable();
      if (control?.formAction?.css?.class) {
        control?.formAction?.css?.class.map((c: any) => {
          this.element?.nativeElement?.classList?.add(c);
        })
      }
      
      if (control.formAction && control.formAction.onInitialize) {
        control.formAction.onInitialize(this.formGroupIndex, this.formActionIndex, control.formAction?.formControl, control.formAction.formName as string, this.group, control.formAction.type as TYPE_CONTROL_FORM, allGroup);
      }
    })

  }
  /************************************************************************************************************************************************************************ */
  ngOnDestroy(): void { }
  /************************************************************************************************************************************************************************ */

  constructor(protected injector: Injector, protected element: ElementRef) {
    this.callOnhangeSubject.pipe(
      autoUnsubscribe(this.obs),
      takeUntilDestroyed(this.destroyRef),
      bufferWithMaxAwaitTime((value, length) => ({ value, length }), 500),
    ).subscribe(async ({ length, value }: any) => {
      this.onChange(value);
    })
  }


  /************************************************************************************************************************************************************************ */

  public _filter(value: string = ""): any {
    let cloned = JSON.parse(JSON.stringify(this.internalValue || []));
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

  onChange(bufferedChange) {
    if (this.control.formAction && this.control.formAction.onChange)
      this.control.formAction.onChange(
        this.formGroupIndex,
        this.formActionIndex,
        this.control.formAction?.formControl,
        this.control.formAction.formName,
        this.group,
        this.control.formAction.type,
        bufferedChange,
        this._allGroup);
  }

  /************************************************************************************************************************************************************************ */
}
