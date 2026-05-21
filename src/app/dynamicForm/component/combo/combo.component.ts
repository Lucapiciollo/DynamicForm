/**
 * @format
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EffectRef,
  ElementRef,
  inject,
  Injector,
  signal,
  untracked,
  viewChild,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from '../base-component.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  Subject,
  takeUntil,
} from 'rxjs';
import { TYPE_CONTROL_FORM } from '../../dynamic-form.interface';
import { Store } from './store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['../../dynamic-form.component.scss', './combo.component.css'],
  providers: [Store],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboComponent extends BaseComponent implements AfterViewInit {
  private selectedValues: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private scrollListener: (event: any) => void;
  private reachedEnd: boolean = false;
  public onPanelCloseObs = new Subject<void>();
  public showOptionDefault = true;
  private resetOption = false;
  private inputSubject = new Subject<string>();
  private effectStore: Array<EffectRef> = [];
  private scrollTop = 0;
  private currentSearchValue: string | null = null;
  private filterInput = viewChild('filterInput', {
    read: ElementRef<HTMLInputElement>,
  });

  public signalStore = inject(Store);
  public loaderss = signal(false);

  private distinctArray = (array: any[] | null | undefined) => {
    const seenIds = new Set();
    return (Array.isArray(array) ? [...array] : []).filter((item) => {
      const key = item && typeof item === 'object' ? item.id : item;
      if (seenIds.has(key)) return false;
      seenIds.add(key);
      return true;
    });
  };

  private isReady(): boolean {
    return !!this.control?.formAction?.formControl;
  }

  private getOptionsValue(): any[] | { items: any[]; totalCount: number } {
    const options = this.control?.formAction?.options;
    const value = typeof options === 'function' ? options() : options;
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Array.isArray((value as any).items)
    )
      return value as any;
    return Array.isArray(value) ? value : [];
  }

  constructor(
    protected override injector: Injector,
    protected override element: ElementRef,
  ) {
    super(injector, element);
    super.signalStoreValue = this.signalStore;
    if (this.control?.formAction)
      this.control.formAction.paging = {
        ...this.initPagination,
        totalCount: 0,
      };

    // Ricerca sicura: niente effect/signal writes.
    // La ricerca della combo deve partire solo dall'input utente, con debounce,
    // senza creare dipendenze signal tra filtro e store.
    this.inputSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((valueSearch) => {
        if (!this.isReady()) return;
        this.search(valueSearch ?? '');
      });
  }

  areJsonEqual(json1: any, json2: any): boolean {
    if (typeof json1 !== typeof json2) return false;
    if (Array.isArray(json1) && Array.isArray(json2)) {
      if (json1.length !== json2.length) return false;
      return json1.every((item, index) =>
        this.areJsonEqual(item, json2[index]),
      );
    }
    if (typeof json1 === 'object' && json1 !== null && json2 !== null) {
      const keys1 = Object.keys(json1);
      const keys2 = Object.keys(json2);
      if (keys1.length !== keys2.length) return false;
      for (const key of keys1) {
        if (
          !keys2.includes(key) ||
          !this.areJsonEqual(json1[key], json2[key])
        ) {
          return false;
        }
      }
      return true;
    }
    return json1 === json2;
  }

  search(value: string | null) {
    if (!this.isReady()) return;
    this.signalStore.setIsLoading(true);
    this.resetOption = value != null && value.trim() !== '';

    if (
      this.control.formAction.remoteData &&
      this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE
    ) {
      const searchValue = this.resetOption ? (value ?? '').trim() : null;
      const currentPaging = this.control.formAction?.paging || this.initPagination;
      const count = currentPaging?.count ?? this.control.formAction?.pageSize ?? this.initPagination.count;

      this.currentSearchValue = searchValue;
      this.reachedEnd = false;
      this.scrollTop = 0;

      this.control.formAction.paging = {
        ...currentPaging,
        page: 1,
        count,
        totalCount: 0,
      };

      // Ricerca remota paginata: quando cambia la ricerca si riparte sempre da pagina 1
      // e si sostituiscono i risultati. Le pagine successive verranno aggiunte solo dallo scroll.
      this.callRemoteData({
        ...this.getRemoteParams(),
        ...this.control.formAction.paging,
        [this.getSearchKey()]: searchValue,
        append: false,
      });

      queueMicrotask(() => {
        const panel = this.selectRef?.panel?.nativeElement;
        if (panel) panel.scrollTop = 0;
      });

      return;
    }

    if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBO) {
      let filtered = this._filter(value);
      this.signalStore.setFilteredOptions(
        filtered,
        this.control.formAction.keyCombo,
        !this.resetOption,
      );
      return;
    }

    this.signalStore.setIsLoading(false);
  }

  getValueCombo(formControl: FormControl, smal) {
    // Backward compatibility: keep the old public method but route it to the safe trigger label.
    return this.getSelectedLabel(smal);
  }

  /**
   * Label mostrata nel mat-select-trigger.
   * Deve dipendere solo dal valore reale del FormControl e non dalle opzioni filtrate/caricate
   * durante lo scroll della COMBOPAGINATE. In questo modo lo scroll aggiorna la lista,
   * ma non fa comparire valori nel campo se l'utente non li ha selezionati.
   */
  getSelectedLabel(small = true): string {
    if (!this.isReady()) return '';

    const value = this.control.formAction.formControl.value;

    if (value === null || value === undefined || value === '') {
      return '';
    }

    const options = this.getAllKnownOptionsSafe();

    if (this.control.formAction.multiple) {
      const values = Array.isArray(value) ? value : [];
      const descriptions = values
        .map((id) => this.findOptionDescriptionByValue(id, options))
        .filter((description) => !!description);

      if (!small) return descriptions.join('; ');

      return descriptions.length <= this.combotext.maxElementShow
        ? descriptions.join('; ')
        : `${descriptions.slice(0, this.combotext.maxElementShow).join('; ')}  + ${descriptions.length - this.combotext.maxElementShow}`;
    }

    return this.findOptionDescriptionByValue(value, options);
  }

  getOptionValue(option: any): any {
    const keyId = this.control?.formAction?.keyCombo?.keyId ?? 'id';

    if (Array.isArray(keyId)) {
      return keyId
        .map((key) => option?.[key])
        .filter((value) => value !== null && value !== undefined)
        .join('|');
    }

    return option?.[keyId] ?? option?.id;
  }

  getOptionDescription(option: any): string {
    if (!option) return '';

    const keys = this.control?.formAction?.keyCombo?.keyDescription ?? ['description'];
    const keyList = Array.isArray(keys) ? keys : [keys];

    return keyList
      .map((key: string) => option?.[key])
      .filter((value: any) => value !== null && value !== undefined && value !== '')
      .join(' - ');
  }

  private findOptionDescriptionByValue(value: any, options: any[]): string {
    const option = options.find((item) => this.optionEqualsValue(item, value));

    if (!option) {
      return typeof value === 'object' ? '' : String(value ?? '');
    }

    return option.description || this.getOptionDescription(option);
  }

  private optionEqualsValue(option: any, value: any): boolean {
    if (option === null || option === undefined || value === null || value === undefined) {
      return false;
    }

    const optionValue = this.getOptionValue(option);

    if (typeof value === 'object') {
      const keyId = this.control?.formAction?.keyCombo?.keyId ?? 'id';
      if (Array.isArray(keyId)) {
        const valueKey = keyId
          .map((key) => value?.[key])
          .filter((v) => v !== null && v !== undefined)
          .join('|');
        return optionValue == valueKey;
      }
      return optionValue == value?.[keyId];
    }

    return optionValue == value;
  }

  private getAllKnownOptionsSafe(): any[] {
    const fromTotal = this.signalStore?.getTotalOptions?.() || [];
    const fromSelected = this.signalStore?.getSelectedOptions?.() || [];
    const fromDefault = this.signalStore?.getDefaultOptions?.() || [];
    const fromFiltered = this.signalStore?.getFilterOption?.() || [];
    const fromAction = this.normalizeActionOptions(this.getOptionsValue());

    const key = this.control?.formAction?.keyCombo?.keyId ?? 'id';
    const map = new Map<any, any>();

    for (const item of [
      ...fromTotal,
      ...fromSelected,
      ...fromDefault,
      ...fromFiltered,
      ...fromAction,
    ]) {
      if (!item) continue;
      const normalized = this.normalizeOption(item);
      const mapKey = this.resolveOptionKey(normalized, key);
      map.set(mapKey, normalized);
    }

    return Array.from(map.values());
  }

  private normalizeActionOptions(value: any[] | { items: any[]; totalCount: number }): any[] {
    if (value && typeof value === 'object' && !Array.isArray(value) && Array.isArray(value.items)) {
      return value.items.map((item) => this.normalizeOption(item));
    }

    return Array.isArray(value) ? value.map((item) => this.normalizeOption(item)) : [];
  }

  private normalizeOption(option: any): any {
    if (!option) return option;

    return {
      ...option,
      id: option.id ?? this.getOptionValue(option),
      description: option.description ?? this.getOptionDescription(option),
    };
  }

  private resolveOptionKey(option: any, key: string | string[]): any {
    if (Array.isArray(key)) {
      return key
        .map((k) => option?.[k])
        .filter((value) => value !== null && value !== undefined)
        .join('|');
    }

    return option?.[key] ?? option?.id ?? JSON.stringify(option);
  }

  toggleOption(option: any, event: Event): void {
    if (this.control.formAction.multiple) event.stopPropagation();
    const optionValue = this.getOptionValue(option);
    this.signalStore.updateOptionSelected(
      optionValue,
      !option.selected,
      this.control.formAction.multiple,
    );
  }

  @ViewChild('selectRef') selectRef: MatSelect;
  onPanelOpen() {
    if (!this.isReady()) return;
    try {
      this.signalStore.setIsLoading(false);

      queueMicrotask(() => {
        const input = this.filterInput();
        input?.nativeElement?.focus();
      });

      if (this.control?.formAction?.opened)
        this.control.formAction.opened(
          this.formGroupIndex,
          this.formActionIndex,
          this.control.formAction?.formControl,
          this.control.formAction.formName,
          this.group,
          this._allGroup,
          this.utils,
        );

      if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBO) {
        // Reset locale del filtro all'apertura: non passare da inputSubject/search,
        // così evitiamo cicli con il template del mat-select.
        const filtered = this._filter('');
        this.signalStore.setFilteredOptions(
          filtered,
          this.control.formAction.keyCombo,
          false,
        );
        this.signalStore.setIsLoading(false);
        return;
      }

      if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) {
        this.search('');

        // Step 05: per sicurezza la combo paginata può caricare la prima pagina
        // senza agganciare lo scroll infinito. Lo scroll verrà riattivato nello step successivo
        // impostando enableInfiniteScroll: true nella configurazione del campo.
        if (this.control.formAction?.enableInfiniteScroll === true) {
          this.addEventScroll();
        }

        return;
      }

      this.signalStore.setIsLoading(false);
    } catch (e) {
      throw new Error(e);
    }
  }

  addEventScroll() {
    try {
      const panel = this.selectRef?.panel?.nativeElement;
      if (!panel) return;

      fromEvent(panel, 'scroll')
        .pipe(debounceTime(40), takeUntil(this.onPanelCloseObs))
        .subscribe(() => {
          if (this.control.formAction.type !== TYPE_CONTROL_FORM.COMBOPAGINATE)
            return;
          if (this.signalStore.getIsLoading()) return;

          const currentPanel = this.selectRef?.panel?.nativeElement;
          if (!currentPanel) return;

          this.scrollTop = currentPanel.scrollTop;
          const distanceFromBottom =
            currentPanel.scrollHeight -
            this.scrollTop -
            currentPanel.clientHeight;
          const threshold = this.control.formAction?.scrollThreshold ?? 48;

          if (distanceFromBottom > threshold) {
            this.reachedEnd = false;
            return;
          }

          if (this.reachedEnd || !this.canLoadNextPage()) return;

          this.reachedEnd = true;
          const paging = this.control.formAction?.paging || this.initPagination;
          const nextPage = (paging?.page ?? 0) + 1;

          this.control.formAction.paging = {
            ...paging,
            page: nextPage,
          };

          this.callRemoteData({
            ...this.getRemoteParams(),
            ...this.control.formAction.paging,
            [this.getSearchKey()]: this.currentSearchValue ?? this.getSearchValue(),
            append: true,
          });
        });
    } catch (e) {
      throw new Error(e);
    }
  }

  private getSearchKey(): string {
    const keySearch = this.control?.formAction?.keyCombo?.keySearch;
    // keySearch può essere un array per il filtro locale; per una chiamata remota
    // deve diventare un nome parametro stabile. Default: search.
    return typeof keySearch === 'string' ? keySearch : 'search';
  }

  private getSearchValue(): string | null {
    const value = this.filterInput()?.nativeElement?.value?.trim();
    return value ? value : null;
  }

  private getRemoteParams(): Record<string, any> {
    const params = this.control?.formAction?.paramsForRemoteData;
    if (typeof params === 'function') return params() || {};
    return params || {};
  }

  private compactParams(params: Record<string, any>): Record<string, any> {
    return Object.entries(params || {}).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '')
          acc[key] = value;
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  private callRemoteData(param: Record<string, any>): void {
    const remoteData = this.control?.formAction?.remoteData;
    if (!remoteData) {
      this.signalStore.setIsLoading(false);
      return;
    }

    this.signalStore.setIsLoading(true);
    remoteData({
      param: this.compactParams(param),
      // backward compatibility: externalStore used to be a signal setter in some tests.
      externalStore: this.signalStore,
      setInitialOption: this.setInitialOption,
      signalStore: this.signalStore,
      formAction: this.control?.formAction,
      formGroup: this.group,
      instance: this,
    });
  }

  private canLoadNextPage(): boolean {
    const paging = this.control.formAction?.paging || this.initPagination;
    const page = paging?.page ?? 0;
    const count = paging?.count ?? 25;
    const totalCount = paging?.totalCount ?? 0;

    if (!totalCount || totalCount <= 0) return true;

    const loaded = page * count;
    return loaded < totalCount;
  }

  clearInput = () => {
    try {
      if (this.filterInput()) this.filterInput().nativeElement.value = '';
    } catch (e) {
      throw new Error(e);
    }
  };

  onPanelClose() {
    if (!this.isReady()) return;
    try {
      this.signalStore.setIsLoading(false);
      this.effectStore.map((m) => m.destroy());
      this.showOptionDefault = true;
      this.reachedEnd = false;
      this.onPanelCloseObs.next();
      if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) {
        let selected = this.signalStore.getSelectedOptions();
        this.signalStore.setFilteredOptions(
          [],
          this.control.formAction.keyCombo,
          false,
        );
        this.signalStore.setTotalOptions(
          untracked(() => this.signalStore.getSelectedOptions()),
        );
        this.control.formAction.paging = { ...this.initPagination };
      }
      if (this.control?.formAction?.closed) {
        this.control.formAction.closed(
          this.formGroupIndex,
          this.formActionIndex,
          this.control.formAction?.formControl,
          this.control.formAction.formName,
          this.group,
          this._allGroup,
          this.utils,
        );
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  onInputChange(value: string): void {
    this.inputSubject.next(value);
  }
}
