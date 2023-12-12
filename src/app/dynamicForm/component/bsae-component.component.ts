/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2023-03-10 18:26:22
 * @desc [description]
 */
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, ElementRef, EventEmitter, Injector, Input, Output, inject } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, Subject, distinctUntilChanged, map, pairwise, skip, startWith, takeUntil } from 'rxjs';
import { IBaseComponent } from './base-component-interface';
import { GetErrorForm, GetErrorFormControl } from './error-message-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TYPE_CONTROL_FORM } from '../interface';

@Component({
  selector: '',
  template: ``,
  providers: [DatePipe]
})

export class BaseComponent implements IBaseComponent {


  @Output() onCaptureCam: EventEmitter<File> = new EventEmitter<File>();
  @Output() instance: EventEmitter<{ instance: BaseComponent, name: string }> = new EventEmitter<{ instance: BaseComponent, name: string }>();
  public filteredOptions: Observable<Array<{ id: string; description: string; }>> | undefined;
  public getErrorForm: (formGroup: FormGroup, formName: string) => Array<string> = GetErrorForm;
  public getErrorFormControl: (formControl: FormControl) => Array<string> = GetErrorFormControl;
  private destroyRef: DestroyRef = inject(DestroyRef);


  public control: any = { formAction: {} };
  /************************************************************************************************************************************************************************ */

  @Input() formActionIndex: number = 0;
  @Input() formGroupIndex: number = 0;
  @Input() group: any = null;
  @Input() allGroup: any = null;



  @Input() set question(config: Form) {
    this.control = { formAction: config }

    if (!this.control.formAction.autocomplete) {
      this.control.formAction?.formControl.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(null),
        distinctUntilChanged((prev, curr) => prev === curr),
        pairwise(),
      ).subscribe(([prevValue, next]: [any, any]) => {
        if (this.control.formAction && this.control.formAction.onChange)
          this.control.formAction.onChange(this.formGroupIndex, this.formActionIndex, this.control.formAction?.formControl, this.control.formAction.formName, this.group, this.control.formAction.type, prevValue,this.allGroup);
      })
    }

    if (this.control.formAction.autocomplete == true) {
      this.filteredOptions = this.control?.formAction?.formControl?.valueChanges.pipe(
        startWith(null),
        map(value => this._filter(value as any || ''))
      )

    }

  };

  ngOnDestroy(): void { }

  constructor(protected injector: Injector, protected element: ElementRef) { }


  private _filter(value: string = ""): any {
    const filterValue = value.toString()?.toLowerCase();
    if (this.control?.formAction?.options)
      return this.control?.formAction?.options.filter((option: any) =>
        (filterValue && filterValue.length > 0) ? (option?.description as string)?.toLowerCase().includes(filterValue) : option
      );
  }



  callOnhange() {
    if (this.control.formAction && this.control.formAction.onChange)
      this.control.formAction.onChange(
        this.formGroupIndex,
        this.formActionIndex,
        this.control.formAction?.formControl,
        this.control.formAction.formName,
        this.group,
        this.control.formAction.type, null,this.allGroup);

  }

  // private setOption = (idGroup: number, formName: string, opt: TypeComboOption) => {
  //   if (this.groups)
  //     this.groups[idGroup]?.map((element: any) => {
  //       if (element.name == formName) {
  //         element.instance.config = { options: opt };
  //       }
  //     })
  // }
  // /************************************************************************************************************************************************************************ */

  // private update = (idGroup: number, formName: string, obj: TypeOption) => {
  //   this.groups[idGroup].forEach((element: any) => {
  //     if (element.name == formName) {
  //       element.instance.config = { ...obj };
  //     }
  //   })
  // }
}


