/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2023-03-10 18:26:22
 * @desc [description]
 */
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, ElementRef, EventEmitter, Injector, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, Subject, combineLatest, debounceTime, distinctUntilChanged, map, pairwise, startWith, tap } from 'rxjs';
import { IBaseComponent } from './base-component-interface';
import { GetErrorForm, GetErrorFormControl } from './error-message-utils';
import { ConfigForm, Form, TYPE_CONTROL_FORM } from '../interface';
import { StepperService } from '../dynamic-form.service';

@Component({
  selector: '',
  template: ``,
  providers: [DatePipe]
})

export class BaseComponent implements IBaseComponent {


  @Output() onCaptureCam: EventEmitter<File> = new EventEmitter<File>();
  @Output() instance: EventEmitter<{ instance: BaseComponent, name: string }> = new EventEmitter<{ instance: BaseComponent, name: string }>();
  public filteredOptions: Observable<Array<{ id: string; description: string  }>> | undefined;
  public getErrorForm: (formGroup: FormGroup, formName: string) => Array<string> = GetErrorForm;
  public getErrorFormControl: (formControl: FormControl) => Array<string> = GetErrorFormControl;
  private destroyRef: DestroyRef = inject(DestroyRef);
  private stepperService: StepperService = inject(StepperService);
  private obsQuestions: ReplaySubject<Form> = new ReplaySubject(1);
  private obsAllGroup: ReplaySubject<any> = new ReplaySubject(1);

  public control: any = { formAction: {} };
  /************************************************************************************************************************************************************************ */

  @Input() formActionIndex: number = 0;
  @Input() formGroupIndex: number = 0;
  @Input() group: any = null;
  private _allGroup: any;
  @Input() set allGroup(allGroup: any) {
    this._allGroup = allGroup;
    this.obsAllGroup.next(this._allGroup)
  }

  @Input() set question(config: Form) {
    this.control = { formAction: config };
    this.obsQuestions.next(this.control);
  };


  /************************************************************************************************************************************************************************ */

  public filtercontrol: FormControl = new FormControl();

  ngOnInit() {



    combineLatest({
      control: this.obsQuestions,
      allGroup: this.obsAllGroup
    }).subscribe({
      next: ({ allGroup, control }) => {
        if (!control.formAction.autocomplete) {



          control.formAction?.formControl.statusChanges.pipe(
            takeUntilDestroyed(this.destroyRef)
          ).subscribe(status => {
             this.filtercontrol.disable()
          });

          control.formAction?.formControl.valueChanges.pipe(
            takeUntilDestroyed(this.destroyRef),
            startWith(null),
            // distinctUntilChanged((prev, curr) => prev === curr),
            pairwise()
          ).subscribe(([prevValue, next]: [any, any]) => {
            if (control.formAction && control.formAction.onChange)
              control.formAction.onChange(this.formGroupIndex, this.formActionIndex, control.formAction?.formControl, control.formAction.formName as string, this.group, control.formAction.type as TYPE_CONTROL_FORM, prevValue, this._allGroup);
          })
        }
        if (control.formAction.autocomplete == true) {
          this.filteredOptions = this.filtercontrol.valueChanges.pipe(
            startWith(null),
            map(value => this._filter(value as any || '')),
            map(value => {
              if (value && value.length < 1) {
                this.filtercontrol.setValue(null);
                control.formAction?.formControl.setValue(null, { emitEvent: false });
                return this._filter('')
              }
              return value
            })
          )
        }

        (control.formAction.readOnly || control.formAction.formControl.disabled) ? control.formAction.formControl.disable() : control.formAction.formControl.enable();
        if (control?.formAction?.css?.class) {
          control?.formAction?.css?.class.map((c: any) => {
            this.element?.nativeElement?.classList?.add(c);
          })
        }
        if (control.formAction && control.formAction.onInitialize) {
          control.formAction.onInitialize(this.formGroupIndex, this.formActionIndex, control.formAction?.formControl, control.formAction.formName as string, this.group, control.formAction.type as TYPE_CONTROL_FORM, allGroup);
        }
      }
    })
  }
  /************************************************************************************************************************************************************************ */

  ngOnDestroy(): void { }
  /************************************************************************************************************************************************************************ */

  constructor(protected injector: Injector, protected element: ElementRef) { }
  /************************************************************************************************************************************************************************ */

  private _filter(value: string = ""): any {
    const filterValue = value.toString()?.toLowerCase();
    if (this.control?.formAction?.options)
      return this.control?.formAction?.options.filter((option: any) =>
        (filterValue && filterValue.length > 0) ? (option?.description as string)?.toLowerCase().includes(filterValue) : option
      );
  }
  /************************************************************************************************************************************************************************ */

  callOnhange() {
    if (this.control.formAction && this.control.formAction.onChange)
      this.control.formAction.onChange(
        this.formGroupIndex,
        this.formActionIndex,
        this.control.formAction?.formControl,
        this.control.formAction.formName,
        this.group,
        this.control.formAction.type, null, this._allGroup);
  }

  /************************************************************************************************************************************************************************ */

  ngOnChane() { }
  /************************************************************************************************************************************************************************ */

}


