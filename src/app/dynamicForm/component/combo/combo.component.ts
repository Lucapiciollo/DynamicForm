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
import { distinctUntilChanged, fromEvent, Subject, takeUntil } from 'rxjs';
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
  private reachedEnd: boolean = false;
  private reachedTop: boolean = false;
  public onPanelCloseObs = new Subject<void>();

  /************************************************************************************************************************************************************************ */
  override toString(num: any): string {
    return String(num)
  }
  /************************************************************************************************************************************************************************ */
  constructor(protected override injector: Injector, protected override element: ElementRef, private cf: ChangeDetectorRef) {
    super(injector, element);
    // this.scrollListener = (event: any) => this.onScroll(event);
  }
  /************************************************************************************************************************************************************************ */
  ngOnChanges(changes) {
    if (this.control.formAction.onSearch)
      this._filter(this.control.formAction.formControl?.value)
    else
      this.filteredOptions.next(this._filter(this.control.formAction.formControl?.value));
  }
  /************************************************************************************************************************************************************************ */
  async search(value) {
    if (this.control.formAction.onSearch)
      this._filter(value)
    else
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
    /**
        * se spasso un osservatore come sorgente per le option, mi registro e resto in ascolto finche il pannello non si chiude,
        * in caso si riapra, mi registro nuovamente
        */
    if ((this.control.formAction as any).optionObs) {

      (this.control.formAction as any).optionObs.pipe(takeUntil(this.onPanelCloseObs)).subscribe(async response => {
        this.control.formAction.options = response.items;
        this.control.formAction.paging = { ...this.control.formAction.paging, totalCount: response.totalCount }
        this.filteredOptions.next(response.items)
        if (this.direction == "UP") {
          setTimeout(() => {
            const lastOption = this.selectRef?.panel?.nativeElement.children[this.selectRef?.panel?.nativeElement.children.length - 2];
            lastOption.scrollIntoView({ block: 'end' });
          }, 100);
        }
        if (this.direction == "DOWN") {
          const lastOption = this.selectRef?.panel?.nativeElement.children[2];
          lastOption.scrollIntoView({ block: 'start' });
        }
      }, error => { }, () => {
        /**
          * alla chiusura del pannello, libero le risorse come gli eventi e gli osservatori delle option
          */
        // this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE ? this.control.formAction.options = [{ id: null, description: null }] : null;
        this.removeEventScroll();
      });
    }

    /**
     * registro l'evento di scroll, sulla combo, quindi verranno lanciati gli eventi di scrollUp e scrolDown demandando alle funzioni registrate
     * l'eventuale paginazione
     */
    this.addEventScroll()

  }
  /************************************************************************************************************************************************************************ */


  onPanelClose() {
    this.onPanelCloseObs.next();
  }


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
        this.control.formAction.options.find(f => f.id == item.id)["selected"] = false;
      } else {
        this.selectedValues.push(item);
        this.control.formAction.options.find(f => f.id == item.id)["selected"] = true;
      }
      this.control.formAction.formControl.setValue([...this.selectedValues.map((m: any) => m.id)])
      event.stopPropagation();
    }
    else
      this.control.formAction.options.map(f => f.id == item.id ? f.selected = true : f.selected = false)
  }
  /************************************************************************************************************************************************************************ */
  isSelected(item: any): boolean {
    return this.selectedValues.find((f: any) => f.id == item.id) != null;
  }
  /************************************************************************************************************************************************************************ */
  public showDivDown = false;
  public showDivTop = false;
  public direction: "UP" | "DOWN" = null;


  addEventScroll() {
    try {
      fromEvent(this.selectRef?.panel?.nativeElement, 'scroll')
        .pipe(
          takeUntil(this.onPanelCloseObs),
          distinctUntilChanged(),

        )
        .subscribe(async () => {
          const panel = this.selectRef?.panel?.nativeElement;
          const scrollTop = panel.scrollTop;
          const scrollHeight = panel.scrollHeight;
          const clientHeight = panel.clientHeight;
          let distanceFromBottom;
          if (scrollTop > this.previousScrollTop && !this.reachedEnd) {
            distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            const threshold = 50;
            if (distanceFromBottom <= threshold && this.control.formAction.paging.page < Math.ceil(this.control.formAction.paging.totalCount / this.control.formAction.paging.count)) {
              if (this.control.formAction && this.control.formAction.onScrollEnd) {
                if (await this.control.formAction.onScrollEnd(this.control.formAction?.formControl, this.group, this.control.formAction.paging, this.control.formAction.options.filter(f => f.selected == true))) {
                  this.control.formAction.paging = { ...  this.control.formAction.paging, page: this.control.formAction.paging.page + 1 };
                  this.resetReachedEnd();
                  this.direction = "DOWN";
                }
              }
              this.reachedEnd = true;
            }
            this.resetReachedTop();
          }
          if (scrollTop < this.previousScrollTop && !this.reachedTop) {
            const distanceFromTop = scrollTop;
            const threshold = 70;
            if (distanceFromTop <= threshold) {
              if (this.control.formAction && this.control.formAction.onScrollTop) {
                if (this.control.formAction.paging.page > 1) {
                  this.control.formAction.paging = { ...this.control.formAction.paging, page: this.control.formAction.paging.page - 1 };
                  if (await this.control.formAction.onScrollTop(this.control.formAction?.formControl, this.group, this.control.formAction.paging, this.control.formAction.options.filter(f => f.selected == true))) {
                    this.resetReachedTop();
                    this.direction = "UP";
                  }
                }
              }
              this.reachedTop = true;
            }
            this.resetReachedEnd()
          }
          this.showDivDown = this.control.formAction.paging.page < Math.ceil(this.control.formAction.paging.totalCount / this.control.formAction.paging.count);
          this.showDivTop = this.control.formAction.paging.page > 1;
          this.previousScrollTop = scrollTop;
        });
    } catch (e) {
      throw new Error(e)
    }
  }
  /************************************************************************************************************************************************************************ */

  removeEventScroll() {
    try {

    } catch (e) {
      throw new Error(e)
    }
  }
  /************************************************************************************************************************************************************************ */

  @ViewChild('selectRef') selectRef: MatSelect;

  /************************************************************************************************************************************************************************ */
  resetReachedEnd() {
    this.reachedEnd = false;
  }

  /************************************************************************************************************************************************************************ */
  resetReachedTop() {
    this.reachedTop = false;
  }
  /************************************************************************************************************************************************************************ */

}
