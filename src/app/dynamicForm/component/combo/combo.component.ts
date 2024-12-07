/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Injector, OnChanges, ViewChild } from '@angular/core';
import { BaseComponent } from '../base-component.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['../../dynamic-form.component.scss','./combo.component.css']
})
export class ComboComponent extends BaseComponent implements AfterViewInit, OnChanges {
  private selectedValues: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const
  private maxElementShow = 3;
  /************************************************************************************************************************************************************************ */
   override toString(num: any): string {
    return String(num)
  }
  /************************************************************************************************************************************************************************ */
  constructor(protected override injector: Injector, protected override element: ElementRef, private cf: ChangeDetectorRef) {
    super(injector, element);
  }
  /************************************************************************************************************************************************************************ */
  ngOnChanges(changes) {
    this.filteredOptions.next(this._filter(this.control.formAction.formControl?.value));
  }
  /************************************************************************************************************************************************************************ */
  search(value) {
    this.filteredOptions.next(this._filter(value));
  }
  /************************************************************************************************************************************************************************ */
  ngAfterViewInit(): void {
    this.search(null);
    if (this.control.formAction.multiple && this.control.formAction.autocomplete) {
      this.control.formAction.formControl.value?.map(m => {
        this.selectedItems = this.control?.formAction?.options.filter(f => f.id == m)
      })
    }
  }
  /************************************************************************************************************************************************************************ */
  getValueCombo(formControl: FormControl, smal) {
    if (this.control.formAction?.options != null) {
      if (formControl?.value instanceof Array) {
        let description = formControl?.value?.map(id => this.control.formAction?.options?.find(f => f.id == id)?.description);
        if (smal)
          return description?.length < this.maxElementShow ? `${description?.join("; ")}` : description?.length > this.maxElementShow ? `${description?.slice(0, this.maxElementShow)?.join("; ")}  + ${description?.length - this.maxElementShow}` : `${description?.slice(0, this.maxElementShow)?.join("; ")}`
        else
          return `${description?.join("; ")}`
      }
      return this.control.formAction?.options?.find(f => f.id == formControl?.value)?.description || null
    }
    return null
  }
  /************************************************************************************************************************************************************************ */

  private _filterInput: ElementRef;
  @ViewChild("filterInput") set filterInput(filterInput: ElementRef) {
    this._filterInput = filterInput;
  }
  /************************************************************************************************************************************************************************ */
  onOpened = () => {
    if (this._filterInput) {
      this._filterInput.nativeElement.focus()
    }
  }
  /************************************************************************************************************************************************************************ */

  event() {
    if (this.control.formAction.event?.onClick) {
      this.control.formAction.event?.onClick(this.control.formAction.formControl.parent)
    }
  }
  /************************************************************************************************************************************************************************ */
  clearInput = () => {
    if (this._filterInput) {
      this._filterInput.nativeElement.value = "";
    }
    this.search(null);
  }
  /************************************************************************************************************************************************************************ */

  toggleOption(item: any, event: Event): void {
    if (this.control.formAction.multiple) {
      if (this.isSelected(item)) {
        this.selectedValues = this.selectedValues.filter((f: any) => f.id != item.id);
      } else {
        this.selectedValues.push(item);
      }
      this.control.formAction.formControl.setValue([...this.selectedValues.map((m: any) => m.id)])
      event.stopPropagation();
    }
  }
  /************************************************************************************************************************************************************************ */
  isSelected(item: any): boolean {
    return this.selectedValues.find((f: any) => f.id == item.id) != null;
  }
  /************************************************************************************************************************************************************************ */
}
