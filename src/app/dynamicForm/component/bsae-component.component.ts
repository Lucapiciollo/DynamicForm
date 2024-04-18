/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2023-03-10 18:26:22
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
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, combineLatest, map, pairwise, startWith } from 'rxjs';
import { IBaseComponent } from './base-component-interface';
import { GetErrorForm, GetErrorFormControl } from './error-message-utils';
import { Form, TYPE_CONTROL_FORM } from '../interface';
import { StepperService } from '../dynamic-form.service';

@Component({
  selector: '',
  template: ``,
  providers: [DatePipe]
})

export class BaseComponent implements IBaseComponent {


  @Output() onCaptureCam: EventEmitter<File> = new EventEmitter<File>();
  @Output() instance: EventEmitter<{ instance: BaseComponent, name: string }> = new EventEmitter<{ instance: BaseComponent, name: string }>();
  public filteredOptions: Observable<Array<{ id: string; description: string }>> | undefined;
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
            // this.filtercontrol.disable()
          });

          control.formAction?.formControl.valueChanges.pipe(
            takeUntilDestroyed(this.destroyRef),
            startWith(null),
            pairwise()
          ).subscribe(async ([prevValue, next]: [any, any]) => {
            if (control.formAction && control.formAction.onChange)
              await control.formAction.onChange(this.formGroupIndex, this.formActionIndex, control.formAction?.formControl, control.formAction.formName as string, this.group, control.formAction.type as TYPE_CONTROL_FORM, prevValue, this._allGroup);
          })
        }

        if (control.formAction.autocomplete == true) {


          control.formAction?.formControl.disabled ? this.filtercontrol.disable() : this.filtercontrol.enable();

          control.formAction?.formControl.valueChanges.pipe(
            takeUntilDestroyed(this.destroyRef),
          ).subscribe(async (next) => {
            let res = this.control.formAction?.options?.find(f => f?.id == next);
            this.filtercontrol.setValue(next != null ? res?.description || null : null, { emitEvent: true });
            this.callOnhange();
          })


          this.filteredOptions = this.filtercontrol.valueChanges.pipe(
            takeUntilDestroyed(this.destroyRef),
            // distinctUntilChanged((a, b) => a?.id != b?.id),
            startWith(null),
            map(value => this._filter(value as any || '')),
            map(value => {
              if (value && value.length < 1) {
                control.formAction?.formControl.setValue(null, { emitEvent: false, });
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

  constructor(protected injector: Injector, protected element: ElementRef) {

  }
  /************************************************************************************************************************************************************************ */

  private _filter(value: string = ""): any {
    let cloned = JSON.parse(JSON.stringify(this.control?.formAction?.options));
    const filterValue = value?.toString()?.toLowerCase() || null;
    if (filterValue == null) {
      return cloned
    }
    if (cloned)
      return cloned.filter((option: any) => {
        if (filterValue != null) {
          if ((option?.description as string)?.toLowerCase().includes(filterValue) || option.id == filterValue)
            return option
        }
      });
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

  ngOnChanges(changes: SimpleChanges) {
  }
  /************************************************************************************************************************************************************************ */

}


