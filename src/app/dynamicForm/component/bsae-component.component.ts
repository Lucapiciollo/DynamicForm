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
  ViewChild,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, combineLatest, map, pairwise, startWith } from 'rxjs';
import { IBaseComponent } from './base-component-interface';
import { GetErrorForm, GetErrorFormControl } from './error-message-utils';
import { Form, TYPE_CONTROL_FORM } from '../interface';
import { StepperService } from '../dynamic-form.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import moment from 'moment';
import { debug } from './custom.operator';
 

@Component({
  selector: '',
  template: ``,
  providers: [DatePipe]
})

export class BaseComponent implements IBaseComponent {

  @ViewChild('inp', { static: false }) inputText: ElementRef<HTMLInputElement>;

  @ViewChild('inp', { read: MatAutocompleteTrigger }) set autocomplete(triggerAutocompleteInput: MatAutocompleteTrigger) {
    if (triggerAutocompleteInput && !this._autocomplete && this.control.formAction.autocomplete && this.control.formAction.multiple) {
      this._autocomplete = triggerAutocompleteInput;
      this.listenerAutocomplete();



    }
  };

  @Output() onCaptureCam: EventEmitter<File> = new EventEmitter<File>();
  @Output() instance: EventEmitter<{ instance: BaseComponent, name: string }> = new EventEmitter<{ instance: BaseComponent, name: string }>();
  public filteredOptions: ReplaySubject<any> = new ReplaySubject(1);
  public getErrorForm: (formGroup: FormGroup, formName: string) => Array<string> = GetErrorForm;
  public getErrorFormControl: (formControl: FormControl) => Array<string> = GetErrorFormControl;
  public destroyRef: DestroyRef = inject(DestroyRef);
  private stepperService: StepperService = inject(StepperService);
  private obsQuestions: ReplaySubject<Form> = new ReplaySubject(1);
  private obsAllGroup: ReplaySubject<any> = new ReplaySubject(1);

  public control: any = { formAction: {} };
  public clonedOption;
  /************************************************************************************************************************************************************************ */

  @Input() formActionIndex: number = 0;
  @Input() formGroupIndex: number = 0;
  @Input() group: any = null;
  public _allGroup: any;
  @Input() set allGroup(allGroup: any) {
    this._allGroup = allGroup;
    this.obsAllGroup.next(this._allGroup)
  }

  @Input() set question(config: Form) {
    this.control = { formAction: config };
    this.obsQuestions.next(this.control);
  };

  public _autocomplete: MatAutocompleteTrigger = null;
  protected selectedItems: any[] = new Array<any>();
  /************************************************************************************************************************************************************************ */


  resetFilte(){
    this.filteredOptions.next(this._filter(''));
  }

  listenerAutocomplete() {
    this._autocomplete._handleFocus = () => { }
    this._autocomplete.panelClosingActions.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(response => {
      this.setValueForm()
      this.inputText.nativeElement.value = '';
      this.filteredOptions.next(this._filter(''));
    })

  }
  /************************************************************************************************************************************************************************ */

  setValueForm() {
    this.control.formAction.formControl.markAsDirty();
    this.control.formAction.formControl.markAsTouched();
    this.control.formAction.formControl.setValue(this.selectedItems.map(m => m?.id), { emitEvent: false });
    this.callOnhange();
  }

  ngOnInit() {



    combineLatest({
      control: this.obsQuestions,
      allGroup: this.obsAllGroup
    }).subscribe({
      next: ({ allGroup, control }) => {
        if (!control.formAction.autocomplete) {
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



          if (!control.formAction.multiple) {
            control.formAction?.formControl.valueChanges.pipe(
              takeUntilDestroyed(this.destroyRef),
              startWith(null),
              pairwise()).subscribe(async ([prevValue, next]: [any, any]) => {
                this.callOnhange();
              })
          }

          control.formAction?.formControl.valueChanges.pipe(
            debug(moment().format("HH:mm:ss")),
            takeUntilDestroyed(this.destroyRef),
            // minChars(control.formAction?.minFilterLength || 0),
            startWith(null),
            map(value => this._filter(value as any || '')),
            map(value => {
              this.clonedOption = value;
              if (value && value.length < 1) {
                control.formAction?.formControl.setValue(null, { emitEvent: false, });
                this.filteredOptions.next(this._filter(''))
              }
              this.filteredOptions.next(value)
            })
          ).subscribe( )


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
    let cloned = JSON.parse(JSON.stringify(this.control?.formAction?.options || []));
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


