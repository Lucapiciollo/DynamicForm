/**
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, EffectRef, ElementRef, inject, Injector, OnChanges, Signal, signal, untracked, viewChild, ViewChild } from '@angular/core';
import { BaseComponent } from '../base-component.component';
import { C, COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, fromEvent, Subject, takeUntil } from 'rxjs';
import { TYPE_CONTROL_FORM } from '../../dynamic-form.interface';
import { Store } from './store';
import { patchState } from '@ngrx/signals';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['../../dynamic-form.component.scss', './combo.component.css'],
  providers: [Store],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComboComponent extends BaseComponent implements AfterViewInit, OnChanges {
  private selectedValues: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const
 
  private scrollListener: (event: any) => void;
  private reachedEnd: boolean = false;
  public onPanelCloseObs = new Subject<void>();
  public showOptionDefault = true;
  private resetOption = false;
  private inputSubject = new Subject<string>();
  private effectStore: Array<EffectRef> = [];
  private scrollTop = 0;
  private filterInput = viewChild("filterInput", { read: ElementRef<HTMLInputElement> });
  private searchTermSignal: Signal<string> = signal<string>(null);



  public signalStore = inject(Store);
  public loaderss = signal(false);

  /************************************************************************************************************************************************************************ */
  override toString(num: any): string {
    return String(num)
  }
  /************************************************************************************************************************************************************************ */
  constructor(protected override injector: Injector, protected override element: ElementRef) {
    super(injector, element);
    super.signalStoreValue = this.signalStore;


    this.searchTermSignal = toSignal(this.inputSubject.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.onPanelCloseObs)));


    (effect(() => {
      let value = this.mySignal();
      let keys = this.control?.formAction?.keyCombo;
      (this.onOptionSetted as any).set(value);
      if (value && keys) {
        this.signalStore.updateStoreData(value, keys);
      }
    }, { allowSignalWrites: true }));


    (effect(() => { this.searchTermSignal(); this.search(this.searchTermSignal()); }, { allowSignalWrites: true }));

  }

  /************************************************************************************************************************************************************************ */
  ngOnChanges(changes) {
    // if (this.control.formAction.onSearch)
    //   this._filter(this.control.formAction.formControl?.value)
    // else
    //   this.signalStore.updateFilterOption(this._filter(this.control.formAction.formControl?.value))
  }
  /************************************************************************************************************************************************************************ */
  search(value) {
    this.resetOption = value != null && value.trim() != "";
    if (this.control.formAction.remoteData)
      this._filter({ param: Object({ ...this.initPagination, search: this.resetOption ? value : null }).changeValues([null], undefined), externalStore: this.mySignal } as any);
    else
      this.signalStore.updateFilterOption(this._filter(value))

  }
  // /************************************************************************************************************************************************************************ */

  onInputChange(value: string): void {
    this.inputSubject.next(value);
  }

  /************************************************************************************************************************************************************************ */
  ngAfterViewInit(): void {
    super.ngAfterViewInit()
    if (this.control.formAction.opened == null)
      this.search(null);
    if (this.control?.formAction?.multiple && this.control?.formAction?.autocomplete) {
      this.control.formAction?.formControl?.value?.map(m => {
        this.selectedItems = this.signalStoreBase.getTotalOptions()?.filter(f => f.id == m)
      })
    }
  }
  /************************************************************************************************************************************************************************ */
  getValueCombo(formControl: FormControl, smal) {
    let opt= this.signalStoreBase.getTotalOptions() || this.control.formAction.options
    if (opt != null) {
      if (formControl?.value instanceof Array) {
        let description = formControl?.value?.map(id => opt?.find(f => f.id == id)?.description);
        if (smal)
          return description?.length < this.combotext.maxElementShow ? `${description?.join("; ")}` : description?.length > this.combotext.maxElementShow ? `${description?.slice(0, this.combotext.maxElementShow)?.join("; ")}  + ${description?.length - this.combotext.maxElementShow}` : `${description?.slice(0, this.combotext.maxElementShow)?.join("; ")}`
        else
          return `${description?.join("; ")}`
      }
      return opt?.find(f => f.id == formControl?.value)?.description || null
    }
    return null
  }
  /************************************************************************************************************************************************************************ */

  private distinctArray = (array) => {
    const seenIds = new Set();
    const disabledOptions = (this.control.formAction?.disabledOptions || []).map(f => f.id);
    return array.clone().filter(item => {
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);
      if (disabledOptions.includes(item.id)) item.disabled = true;
      return true;
    });
  }

  /************************************************************************************************************************************************************************ */

  onOpened = () => {
    this.showOptionDefault = false;
    if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) this.search(null);
    if (this.control?.formAction?.opened)
      this.control.formAction.opened(this.formGroupIndex, this.formActionIndex, this.control.formAction?.formControl, this.control.formAction.formName, this.group, this._allGroup, this.onOptionSetted);


    let oldremotedata = (this.control.formAction as any).remoteData;

    this._filter = oldremotedata != null ? (...args) => { this.signalStore.setIsLoading(true); oldremotedata(...args) } : this._filter;

    this.effectStore.push(effect(() => {
      const input = this.filterInput();
      if (input != null) {
        queueMicrotask(() => { input?.nativeElement?.focus(); });
      }
    }, { injector: this.injector }));




    // /**
    // * se spasso un osservatore come sorgente per le option, mi registro e resto in ascolto finche il pannello non si chiude,
    // * in caso si riapra, mi registro nuovamente
    // */
    if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) {
      if (this.control.formAction?.remoteData)
        this.control.formAction?.remoteData({ param: { ...this.control.formAction.paging }, externalStore: this.mySignal });
      this.control.formAction.paging = { ...this.control.formAction.paging, page: this.control.formAction.paging.page + 1, };
      this.effectStore.push(effect(() => {
        let value = this.signalStore.getStoreData();
        let distinctArray = [];
        if (!this.resetOption) {
          distinctArray = this.distinctArray([...untracked(() => this.signalStore.getSelectedOptions() || []), ...value?.items || []]);
        } else {
          distinctArray = this.distinctArray([...untracked(() => this.signalStore.getSelectedOptions() || []).filter(f => f.selected), ...value.items]);
        }
        distinctArray = this.distinctArray([...untracked(() => this.signalStore.getTotalOptions() || []), ...distinctArray || []]);
        untracked(() => this.signalStore.updateTotalOptions(distinctArray));
        (this.onOptionSetted as any).set(untracked(() => distinctArray));
        this.control.formAction.paging = { ...this.control.formAction.paging, totalCount: value?.totalCount || 0 };
        this.control.formAction.options = distinctArray;
        this.signalStore.setIsLoading(false)


      }, { injector: this.injector, allowSignalWrites: true }));
      this.addEventScroll()
    }else{
      this.signalStore.setIsLoading(false)

    }
  }
  /************************************************************************************************************************************************************************ */
  onPanelClose() {
    this.effectStore.map(m => m.destroy());
    
    if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) {
      let selected=this.signalStore.getSelectedOptions();
      this.signalStore.resetStore();
      this.signalStoreBase.updateTotalOptions(selected);
      this.control.formAction.paging = { ...this.initPagination };
      this.control.formAction.options = selected;
    }
    this.showOptionDefault = true;
    this.onPanelCloseObs.next();
    if (this.control?.formAction?.closed) {
      this.control.formAction.closed(
        this.formGroupIndex, this.formActionIndex, this.control.formAction?.formControl,
        this.control.formAction.formName, this.group, this._allGroup, this.onOptionSetted
      );
    }
  }

  /**************************************************************************************************************************************************/
  event() {
    if (this.control.formAction.event?.onClick) {
      this.control.formAction.event?.onClick(this.control.formAction.formControl.parent)
    }
  }
  /************************************************************************************************************************************************************************ */
  clearInput = () => {
    if (this.filterInput())
      this.filterInput().nativeElement.value = "";
  }
  /************************************************************************************************************************************************************************ */

  toggleOption(item: any, event: Event): void {
    if (this.control.formAction.multiple)
      event.stopPropagation();
    this.signalStore.updateOptionSelected(item.id, !item.selected, this.control.formAction.multiple);
  }
  /************************************************************************************************************************************************************************ */
  isSelected(item: any): boolean {
    return this.selectedValues.find((f: any) => f.id == item.id) != null;
  }
  /************************************************************************************************************************************************************************ */

  addEventScroll() {
    try {
      fromEvent(this.selectRef?.panel?.nativeElement, 'scroll')
        .pipe(
          debounceTime(10),
          takeUntil(this.onPanelCloseObs),
          distinctUntilChanged(),
        )
        .subscribe(() => {
          const panel = this.selectRef?.panel?.nativeElement;
          this.scrollTop = panel.scrollTop;
          const scrollHeight = panel.scrollHeight;
          const clientHeight = panel.clientHeight;
          const distanceFromBottom = scrollHeight - this.scrollTop - clientHeight;
          const threshold = 10
          if (distanceFromBottom <= threshold && !this.reachedEnd) {
            const paging = this.control.formAction?.paging;
            const currentPage = (paging?.page ?? 1);
            const totalPages = Math.ceil((paging?.totalCount ?? 0) / (paging?.count ?? 1));
            this.reachedEnd = true;
            if (currentPage <= totalPages && this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) {
              this.signalStore.setIsLoading(true)
              this.control.formAction.remoteData({ param: Object({ ...this.control.formAction.paging, search: this.filterInput()?.nativeElement?.value?.trim() != "" ? this.filterInput()?.nativeElement?.value : null }).changeValues([null], undefined), externalStore: this.mySignal });
              this.control.formAction.paging = { ...paging, page: currentPage + 1, };
            }
          } else {
            this.reachedEnd = false;
          }
        });
    } catch (e) {
      throw new Error(e)
    }
  }

  /************************************************************************************************************************************************************************ */

  @ViewChild('selectRef') selectRef: MatSelect;

  /************************************************************************************************************************************************************************ */
  ngOnDestroy() {
    this.effectStore.map(m => m.destroy());
  }
}
