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
import { MatSelect } from '@angular/material/select';
@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['../../dynamic-form.component.scss', './combo.component.css']
})
export class ComboComponent extends BaseComponent implements AfterViewInit, OnChanges {
  private selectedValues: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const
  private maxElementShow = 3;
  private scrollListener: (event: any) => void;
  private previousScrollTop: number = 0;

  /************************************************************************************************************************************************************************ */
  override toString(num: any): string {
    return String(num)
  }
  /************************************************************************************************************************************************************************ */
  constructor(protected override injector: Injector, protected override element: ElementRef, private cf: ChangeDetectorRef) {
    super(injector, element);
    this.scrollListener = (event: any) => this.onScroll(event);
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
    super.ngAfterViewInit()
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
    if (this.control?.formAction?.opened) {
      this.control.formAction.opened(
        this.formGroupIndex,
        this.formActionIndex,
        this.control.formAction?.formControl,
        this.control.formAction.formName,
        this.group,
        this._allGroup);
    }
    if (this._filterInput) {
      this._filterInput.nativeElement.focus()
    }
    this.addEventScroll()

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

    if (this.control?.formAction?.closed) {
      this.control.formAction.closed(
        this.formGroupIndex,
        this.formActionIndex,
        this.control.formAction?.formControl,
        this.control.formAction.formName,
        this.group,
        this._allGroup);
    }
    this.removeEventScroll()
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

  addEventScroll() {
    try {
      const dropdownPanel = this.selectRef?.panel?.nativeElement;
      dropdownPanel?.addEventListener('scroll', this.scrollListener);
    } catch (e) {
      throw new Error(e)
    }
  }
  /************************************************************************************************************************************************************************ */

  removeEventScroll() {
    try {
      const dropdownPanel = this.selectRef?.panel?.nativeElement;
      dropdownPanel?.removeEventListener('scroll', this.scrollListener);
    } catch (e) {
      throw new Error(e)
    }
  }
  /************************************************************************************************************************************************************************ */


  getTotalPages() {
    return Math.ceil(this.control.formAction.paging.totalCount / this.control.formAction.paging.count);
  }

  @ViewChild('selectRef') selectRef: MatSelect;
  async onScroll(event: any) {
    const panel = event.target;
    const scrollTop = panel.scrollTop;
    const scrollHeight = panel.scrollHeight;
    const clientHeight = panel.clientHeight;
    if (scrollTop > this.previousScrollTop && !this.reachedEnd) {
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const threshold = 0;
      if (distanceFromBottom <= threshold) {
        if (this.control.formAction && this.control.formAction.onScrollEnd) {
          if (this.control.formAction.paging.page < this.getTotalPages()) {
            this.control.formAction.paging = { ...this.control.formAction.paging, page: this.control.formAction.paging.page + 1 }
            if (await this.control.formAction.onScrollEnd(this.control.formAction?.formControl, this.group, this.control.formAction.paging)) {
              this.resetReachedEnd();
              panel.scrollTop = 50
            }
          }
        }
        this.reachedEnd = true;
      }
      this.resetReachedTop();
    }
    if (scrollTop < this.previousScrollTop && !this.reachedTop) {
      const distanceFromTop = scrollTop;
      const threshold = 0;
      if (distanceFromTop <= threshold) {
        if (this.control.formAction && this.control.formAction.onScrollTop) {
          if (this.control.formAction.paging.page > 1) {
            this.control.formAction.paging = { ...this.control.formAction.paging, page: this.control.formAction.paging.page - 1 }
            if (await this.control.formAction.onScrollTop(this.control.formAction?.formControl, this.group, this.control.formAction.paging)) {
              this.resetReachedTop();
              panel.scrollTop = 50
            }
          }
        }
        this.reachedTop = true;
      }
      this.resetReachedEnd()
    }

    this.previousScrollTop = scrollTop;
  }

  /************************************************************************************************************************************************************************ */
  public reachedEnd: boolean = false;
  public reachedTop: boolean = false;
  /************************************************************************************************************************************************************************ */
  resetReachedEnd() {
    this.reachedEnd = false;
  }

  /************************************************************************************************************************************************************************ */
  resetReachedTop() {
    this.reachedTop = false;
  }

}
