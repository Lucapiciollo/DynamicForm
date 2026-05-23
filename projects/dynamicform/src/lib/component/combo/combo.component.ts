/**
 * @format
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EffectRef,
  ElementRef,
  inject,
  Injector,
  OnInit,
  isSignal,
  signal,
  untracked,
  viewChild,
  ViewChild,
} from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormControl } from "@angular/forms";
import { MatSelect, MatSelectChange } from "@angular/material/select";
import {
  debounceTime,
  distinctUntilChanged,
  isObservable,
  Subject,
} from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { BaseComponent } from "../base-component.component";
import { TYPE_CONTROL_FORM } from "../../dynamic-form.interface";
import { Store } from "./store";

@Component({
  selector: "app-combo",
  templateUrl: "./combo.component.html",
  standalone: false,
  styleUrls: ["../../dynamic-form.component.scss", "./combo.component.css"],
  providers: [Store],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboComponent extends BaseComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  private reachedEnd = false;
  private resetOption = false;
  private inputSubject = new Subject<string>();
  private effectStore: Array<EffectRef> = [];
  private scrollTop = 0;
  private currentSearchValue: string | null = null;
  private removeScrollListener: (() => void) | null = null;
  private scrollBindRetry = 0;
  private remoteRequestCounter = 0;
  private lastLoadedItemsCount = 0;

  public onPanelCloseObs = new Subject<void>();
  public showOptionDefault = true;

  /**
   * Testo visuale del trigger.
   * Rimane solo come cache visuale, ma il valore vero è sempre nel FormControl reale.
   */
  public readonly selectedLabelText = signal<string>("");

  /**
   * Cache degli oggetti option completi selezionati.
   * Serve per combo remote/paginate: il FormControl conserva gli id,
   * ma quando cambi pagina/ricerca le option complete potrebbero non essere più
   * nella lista corrente.
   */
  private readonly selectedOptionsCache = new Map<string, any>();

  private filterInput = viewChild("filterInput", {
    read: ElementRef<HTMLInputElement>,
  });

  public signalStore = inject(Store);
  public loaderss = signal(false);

  @ViewChild("selectRef") selectRef: MatSelect;

  /**
   * compareWith per mat-select.
   * Fondamentale per array multipli, oggetti e id numerici/stringa.
   */
  public compareMatSelectValues = (a: any, b: any): boolean => {
    return this.compareValue(a, b);
  };

  constructor(
    protected override injector: Injector,
    protected override element: ElementRef,
    private readonly cdr: ChangeDetectorRef,
  ) {
    super(injector, element);
    super.signalStoreValue = this.signalStore;

    this.inputSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((valueSearch) => {
        if (!this.isReady()) {
          return;
        }

        this.search(valueSearch ?? "");
      });
  }

  ngOnInit(): void {
    /**
     * Mantiene eventuali lifecycle ereditati da BaseComponent senza legarci
     * alla firma reale della classe base.
     */
    const baseNgOnInit = Object.getPrototypeOf(ComboComponent.prototype)?.ngOnInit;

    if (typeof baseNgOnInit === "function") {
      baseNgOnInit.call(this);
    }

    queueMicrotask(() => {
      if (!this.isReady()) {
        return;
      }

      this.normalizeControlValueForMultiple();
      this.cacheInitialOptions();
      this.hydrateSelectedOptionsFromCurrentValue();
      this.cacheSelectedVisibleOptions();
      this.keepSelectedOptionsInStores();
      this.refreshSelectedView();
      this.cdr.markForCheck();
    });

    this.control?.formAction?.formControl?.valueChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      ?.subscribe(() => {
        this.normalizeControlValueForMultiple();
        this.hydrateSelectedOptionsFromCurrentValue();
        this.cacheSelectedVisibleOptions();
        this.keepSelectedOptionsInStores();
        this.refreshSelectedView();
        this.cdr.markForCheck();
      });
  }

  private isReady(): boolean {
    return !!this.control?.formAction?.formControl;
  }

  hasComboValue(): boolean {
    const value = this.control?.formAction?.formControl?.value;

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== null && value !== undefined && value !== "";
  }

  private refreshSelectedView(): void {
    if (!this.isReady()) {
      return;
    }

    this.selectedLabelText.set(this.getSelectedLabel(true));
    this.cdr.markForCheck();
  }

  private getIdForm(): any {
    return (
      this.control?.formAction?.idForm ??
      this.control?.formAction?.id ??
      this.control?.formAction?.name ??
      this.control?.formAction?.key ??
      null
    );
  }

  private getOptionsValue(): any[] | { items: any[]; totalCount: number } {
    const options = this.control?.formAction?.options;
    const value = typeof options === "function" ? options() : options;

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Array.isArray((value as any).items)
    ) {
      return value as any;
    }

    return Array.isArray(value) ? value : [];
  }

  areJsonEqual(json1: any, json2: any): boolean {
    if (typeof json1 !== typeof json2) {
      return false;
    }

    if (Array.isArray(json1) && Array.isArray(json2)) {
      if (json1.length !== json2.length) {
        return false;
      }

      return json1.every((item, index) =>
        this.areJsonEqual(item, json2[index]),
      );
    }

    if (typeof json1 === "object" && json1 !== null && json2 !== null) {
      const keys1 = Object.keys(json1);
      const keys2 = Object.keys(json2);

      if (keys1.length !== keys2.length) {
        return false;
      }

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

  /***********************************************************************************************************************************
   * OPEN / CLOSE
   ***********************************************************************************************************************************/

  onOpenedChange(opened: boolean): void {
    if (opened) {
      this.onPanelOpen();
    } else {
      this.clearInput();
      this.onPanelClose();
    }
  }

  onPanelOpen(): void {
    if (!this.isReady()) {
      return;
    }

    try {
      this.normalizeControlValueForMultiple();
      this.cacheInitialOptions();
      this.hydrateSelectedOptionsFromCurrentValue();
      this.cacheSelectedVisibleOptions();
      this.keepSelectedOptionsInStores();
      this.refreshSelectedView();

      this.signalStore.setIsLoading(false);
      this.emitOpened();

      queueMicrotask(() => {
        const input = this.filterInput();
        input?.nativeElement?.focus();
      });

      if (this.control.formAction.type === TYPE_CONTROL_FORM.COMBO) {
        const filtered = this._filter("");

        this.signalStore.setFilteredOptions(
          filtered,
          this.control.formAction.keyCombo,
          false,
        );

        this.cacheOptions(filtered);
        this.hydrateSelectedOptionsFromCurrentValue();
        this.cacheSelectedVisibleOptions();
        this.keepSelectedOptionsInStores();
        this.refreshSelectedView();
        this.signalStore.setIsLoading(false);
        return;
      }

      if (this.control.formAction.type === TYPE_CONTROL_FORM.COMBOPAGINATE) {
        this.search("");

        if (this.control.formAction?.enableInfiniteScroll === true) {
          this.bindPanelScrollWithRetry();
        }

        return;
      }

      this.signalStore.setIsLoading(false);
    } catch (e) {
      throw new Error(e as any);
    }
  }

  onPanelClose(): void {
    if (!this.isReady()) {
      return;
    }

    try {
      this.hydrateSelectedOptionsFromCurrentValue();
      this.cacheSelectedVisibleOptions();
      this.keepSelectedOptionsInStores();

      this.signalStore.setIsLoading(false);
      this.removePanelScrollListener();

      this.effectStore.forEach((m) => m.destroy());
      this.effectStore = [];

      this.showOptionDefault = true;
      this.reachedEnd = false;
      this.scrollBindRetry = 0;
      this.onPanelCloseObs.next();

      /**
       * Non svuotiamo più filteredOptions/totalOptions per le combo multiple.
       * La lista remota/paginata deve conservare selezionati + pagina corrente.
       * Per le combo singole manteniamo il reset storico.
       */
      if (
        this.control.formAction.type === TYPE_CONTROL_FORM.COMBOPAGINATE &&
        !this.isMultipleSelection()
      ) {
        this.signalStore.setFilteredOptions(
          [],
          this.control.formAction.keyCombo,
          false,
        );

        this.control.formAction.paging = {
          ...this.initPagination,
        };
      }

      if (this.control.formAction.type === TYPE_CONTROL_FORM.COMBOPAGINATE) {
        this.control.formAction.paging = {
          ...this.initPagination,
        };
      }

      this.refreshSelectedView();
      this.cdr.markForCheck();
      this.emitClosed();
    } catch (e) {
      throw new Error(e as any);
    }
  }

  clearInput = (): void => {
    try {
      const input = this.filterInput();

      if (input) {
        input.nativeElement.value = "";
      }
    } catch (e) {
      throw new Error(e as any);
    }
  };

  /***********************************************************************************************************************************
   * SEARCH
   ***********************************************************************************************************************************/

  onInputChange(value: string): void {
    this.inputSubject.next(value ?? "");
  }

  search(value: string | null): void {
    if (!this.isReady()) {
      return;
    }

    const valueSearch = value ?? "";

    this.emitSearch(valueSearch);

    this.signalStore.setIsLoading(true);

    this.hydrateSelectedOptionsFromCurrentValue();
    this.keepSelectedOptionsInStores();

    this.resetOption = valueSearch.trim() !== "";

    if (
      this.control.formAction.remoteData &&
      this.control.formAction.type === TYPE_CONTROL_FORM.COMBOPAGINATE
    ) {
      const searchValue = this.resetOption ? valueSearch.trim() : null;
      const currentPaging =
        this.control.formAction?.paging || this.initPagination;

      const count =
        currentPaging?.count ??
        this.control.formAction?.pageSize ??
        this.initPagination.count;

      this.currentSearchValue = searchValue;
      this.reachedEnd = false;
      this.scrollTop = 0;

      this.control.formAction.paging = {
        ...currentPaging,
        page: 1,
        count,
        totalCount: 0,
      };

      this.callRemoteData({
        ...this.getRemoteParams(),
        ...this.control.formAction.paging,
        [this.getSearchKey()]: searchValue,
        append: false,
      });

      queueMicrotask(() => {
        const panel = this.selectRef?.panel?.nativeElement;

        if (panel) {
          panel.scrollTop = 0;
        }
      });

      return;
    }

    if (this.control.formAction.type === TYPE_CONTROL_FORM.COMBO) {
      const filtered = this._filter(valueSearch);

      this.signalStore.setFilteredOptions(
        filtered,
        this.control.formAction.keyCombo,
        false,
      );

      this.cacheOptions(filtered);
      this.hydrateSelectedOptionsFromCurrentValue();
      this.cacheSelectedVisibleOptions();
      this.keepSelectedOptionsInStores();

      this.refreshSelectedView();
      this.signalStore.setIsLoading(false);
      return;
    }

    this.signalStore.setIsLoading(false);
  }

  /***********************************************************************************************************************************
   * SCROLL PAGINATO
   ***********************************************************************************************************************************/

  addEventScroll(): void {
    this.bindPanelScrollWithRetry();
  }

  private canLoadNextPage(): boolean {
    const paging = this.control.formAction?.paging || this.initPagination;
    const page = Number(paging?.page ?? 0);
    const count = Number(
      paging?.count ?? this.control.formAction?.pageSize ?? 25,
    );
    const totalCount = Number(paging?.totalCount ?? 0);

    if (this.lastLoadedItemsCount === 0 && page >= 1) {
      return false;
    }

    if (!totalCount || totalCount <= 0) {
      return this.lastLoadedItemsCount >= count;
    }

    return page * count < totalCount;
  }

  private bindPanelScrollWithRetry(): void {
    this.removePanelScrollListener();

    this.scrollBindRetry = 0;

    const tryBind = () => {
      const panel = this.getSelectPanelElement();

      if (!panel) {
        this.scrollBindRetry++;

        if (this.scrollBindRetry <= 10) {
          setTimeout(tryBind, 50);
        }

        return;
      }

      this.bindPanelScroll(panel);
    };

    setTimeout(tryBind, 0);
  }

  private getSelectPanelElement(): HTMLElement | null {
    const directPanel = this.selectRef?.panel?.nativeElement as
      | HTMLElement
      | undefined;

    if (directPanel) {
      return directPanel;
    }

    return document.querySelector(
      ".df-combo-scroll-panel",
    ) as HTMLElement | null;
  }

  private bindPanelScroll(panel: HTMLElement): void {
    const onScroll = () => {
      this.handlePanelScroll(panel);
    };

    panel.addEventListener("scroll", onScroll, {
      passive: true,
    });

    this.removeScrollListener = () => {
      panel.removeEventListener("scroll", onScroll);
    };
  }

  private removePanelScrollListener(): void {
    if (this.removeScrollListener) {
      this.removeScrollListener();
      this.removeScrollListener = null;
    }
  }

  private handlePanelScroll(panel: HTMLElement): void {
    if (this.control.formAction.type !== TYPE_CONTROL_FORM.COMBOPAGINATE) {
      return;
    }

    if (this.signalStore.getIsLoading()) {
      return;
    }

    this.scrollTop = panel.scrollTop;

    const distanceFromBottom =
      panel.scrollHeight - panel.scrollTop - panel.clientHeight;

    const threshold = this.control.formAction?.scrollThreshold ?? 64;

    if (distanceFromBottom > threshold) {
      this.reachedEnd = false;
      return;
    }

    if (this.reachedEnd) {
      return;
    }

    if (!this.canLoadNextPage()) {
      return;
    }

    this.reachedEnd = true;
    this.loadNextPage();
  }

  private loadNextPage(): void {
    const paging = this.control.formAction?.paging || this.initPagination;

    const nextPage = Number(paging?.page ?? 1) + 1;
    const count =
      Number(paging?.count) ||
      Number(this.control.formAction?.pageSize) ||
      Number(this.initPagination.count) ||
      10;

    this.control.formAction.paging = {
      ...paging,
      page: nextPage,
      count,
    };

    this.emitScrollEnd(this.control.formAction.paging);

    this.callRemoteData({
      ...this.getRemoteParams(),
      ...this.control.formAction.paging,
      [this.getSearchKey()]: this.currentSearchValue ?? this.getSearchValue(),
      append: true,
    });
  }

  /***********************************************************************************************************************************
   * REMOTE DATA
   ***********************************************************************************************************************************/

  private getSearchKey(): string {
    const keySearch = this.control?.formAction?.keyCombo?.keySearch;
    return typeof keySearch === "string" ? keySearch : "search";
  }

  private getSearchValue(): string | null {
    const value = this.filterInput()?.nativeElement?.value?.trim();
    return value ? value : null;
  }

  private getRemoteParams(): Record<string, any> {
    const params = this.control?.formAction?.paramsForRemoteData;

    if (typeof params === "function") {
      return params() || {};
    }

    return params || {};
  }

  private compactParams(params: Record<string, any>): Record<string, any> {
    return Object.entries(params || {}).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          acc[key] = value;
        }

        return acc;
      },
      {} as Record<string, any>,
    );
  }

  private setInitialOptionWithIdForm = (...args: any[]): any => {
    const idForm = this.getIdForm();

    if (args.some((arg) => arg === idForm)) {
      return (this.setInitialOption as any)(...args);
    }

    return (this.setInitialOption as any)(...args, idForm);
  };

  private callRemoteData(param: Record<string, any>): void {
    const remoteData = this.control?.formAction?.remoteData;

    if (!remoteData) {
      this.signalStore.setIsLoading(false);
      this.reachedEnd = false;
      return;
    }

    this.signalStore.setIsLoading(true);

    const payload = {
      param: this.compactParams(param),
      externalStore: this.signalStore,
      setInitialOption: this.setInitialOptionWithIdForm,
      signalStore: this.signalStore,
      formAction: this.control?.formAction,
      formGroup: this.group,
      instance: this,
      idForm: this.getIdForm(),
    };

    const requestId = ++this.remoteRequestCounter;

    try {
      const result = this.resolveRemoteData(remoteData, payload);
      this.handleRemoteDataResult(result, param, requestId);
    } catch (error) {
      console.error("[COMBOPAGINATE] remoteData error", error);
      this.signalStore.setIsLoading(false);
      this.reachedEnd = false;
    }
  }

  private resolveRemoteData(remoteData: any, payload: any): any {
    if (isSignal(remoteData)) {
      return remoteData();
    }

    if (typeof remoteData === "function") {
      try {
        return remoteData(payload);
      } catch (errorWithPayload) {
        try {
          return remoteData();
        } catch {
          throw errorWithPayload;
        }
      }
    }

    if (remoteData && typeof remoteData.then === "function") {
      return remoteData;
    }

    if (isObservable(remoteData)) {
      return remoteData;
    }

    return remoteData;
  }

  private handleRemoteDataResult(
    result: any,
    param: Record<string, any>,
    requestId: number,
  ): void {
    if (isObservable(result)) {
      result.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (response) =>
          this.handleRemoteDataResult(response, param, requestId),
        error: (error) => {
          console.error("[COMBOPAGINATE] remoteData observable error", error);
          this.signalStore.setIsLoading(false);
          this.reachedEnd = false;
        },
      });

      return;
    }

    if (result && typeof result.then === "function") {
      result
        .then((response: any) =>
          this.handleRemoteDataResult(response, param, requestId),
        )
        .catch((error: any) => {
          console.error("[COMBOPAGINATE] remoteData promise error", error);
          this.signalStore.setIsLoading(false);
          this.reachedEnd = false;
        });

      return;
    }

    if (typeof result === "function") {
      try {
        const signalValue = result();
        this.handleRemoteDataResult(signalValue, param, requestId);
        return;
      } catch (error) {
        console.error("[COMBOPAGINATE] remoteData signal error", error);
        this.signalStore.setIsLoading(false);
        this.reachedEnd = false;
        return;
      }
    }

    if (requestId !== this.remoteRequestCounter) {
      return;
    }

    this.applyRemoteDataResponse(result, param);
  }

  private applyRemoteDataResponse(
    response: any,
    param: Record<string, any>,
  ): void {
    const append = param?.append === true;
    const keyCombo = this.control?.formAction?.keyCombo;

    if (response === undefined || response === null) {
      this.signalStore.setIsLoading(false);
      this.reachedEnd = false;
      return;
    }

    const normalized = this.normalizeRemoteResponse(response);
    const items = normalized.items;
    const totalCount = normalized.totalCount ?? items.length;
    this.lastLoadedItemsCount = items.length;

    this.cacheOptions(items);

    this.control.formAction.paging = {
      ...(this.control.formAction.paging || this.initPagination),
      totalCount,
    };

    this.signalStore.setFilteredOptions(
      {
        items,
        totalCount,
      },
      keyCombo,
      append,
    );

    const currentTotal = append
      ? this.mergeOptionsDistinct(
        this.signalStore.getTotalOptions?.() || [],
        items,
      )
      : this.mergeOptionsDistinct([], items);

    const totalItems = this.shouldExposeMissingSelectedOptions()
      ? this.distinctOptionsByValue([
        ...this.getSelectedCachedOptionsMissingFrom(currentTotal),
        ...currentTotal,
      ])
      : this.distinctOptionsByValue(currentTotal);

    this.signalStore.setTotalOptions(
      {
        /**
         * Non sporco totalOptions con i selezionati durante la normale apertura.
         * Aggiungo i selezionati mancanti solo quando c'è una ricerca attiva,
         * così il filtro remoto non fa sparire ciò che era già selezionato.
         */
        items: totalItems,
        totalCount,
      },
      keyCombo,
    );

    this.hydrateSelectedOptionsFromCurrentValue();
    this.cacheSelectedVisibleOptions();
    this.keepSelectedOptionsInStores();

    this.signalStore.setIsLoading(false);
    this.reachedEnd = false;
    this.refreshSelectedView();
    this.cdr.markForCheck();

    queueMicrotask(() => {
      const panel = this.selectRef?.panel?.nativeElement;

      if (panel && append) {
        panel.scrollTop = this.scrollTop;
      }
    });

    queueMicrotask(() => {
      if (
        this.control.formAction.type === TYPE_CONTROL_FORM.COMBOPAGINATE &&
        this.control.formAction?.enableInfiniteScroll === true
      ) {
        this.bindPanelScrollWithRetry();
      }
    });
  }

  private normalizeRemoteResponse(response: any): {
    items: Array<any>;
    totalCount?: number;
  } {
    if (Array.isArray(response)) {
      return {
        items: response,
        totalCount: response.length,
      };
    }

    if (response?.items && Array.isArray(response.items)) {
      return {
        items: response.items,
        totalCount:
          response.totalCount ??
          response.total ??
          response.countTotal ??
          response.items.length,
      };
    }

    if (response?.data && Array.isArray(response.data)) {
      return {
        items: response.data,
        totalCount:
          response.totalCount ??
          response.total ??
          response.countTotal ??
          response.data.length,
      };
    }

    if (response?.result && Array.isArray(response.result)) {
      return {
        items: response.result,
        totalCount:
          response.totalCount ??
          response.total ??
          response.countTotal ??
          response.result.length,
      };
    }

    return {
      items: [],
      totalCount: 0,
    };
  }

  /***********************************************************************************************************************************
   * VISIBLE OPTIONS / MULTI LIST
   ***********************************************************************************************************************************/

  private isPaginatedCombo(): boolean {
    return (
      this.control?.formAction?.type === TYPE_CONTROL_FORM.COMBOPAGINATE ||
      this.control?.formAction?.enableInfiniteScroll === true
    );
  }

  private hasActiveSearch(): boolean {
    const inputValue = this.getSearchValue();
    const currentSearch = this.currentSearchValue;

    return !!(
      (typeof inputValue === "string" && inputValue.trim() !== "") ||
      (typeof currentSearch === "string" && currentSearch.trim() !== "")
    );
  }

  private shouldExposeMissingSelectedOptions(): boolean {
    /**
     * UX definitiva DynamicForm:
     * - combo normale / multiselect non paginata: ordine naturale sempre;
     * - combo paginata senza ricerca: ordine naturale della pagina/lista corrente;
     * - combo paginata durante ricerca: mostro anche i selezionati mancanti,
     *   perché il filtro remoto può non restituirli ma il valore deve restare
     *   visibile/checked e disponibile nel FormControl.
     */
    return this.isPaginatedCombo() && this.hasActiveSearch();
  }

  getVisibleOptions(): any[] {
    const naturalSource = this.getNaturalVisibleOptionSource();

    const source = this.shouldExposeMissingSelectedOptions()
      ? [
        ...this.getSelectedCachedOptionsMissingFrom(naturalSource),
        ...naturalSource,
      ]
      : naturalSource;

    return this.distinctOptionsByValue(source)
      .map((option) => this.normalizeOption(option))
      .filter((option) => !!option && option.hide !== true);
  }

  private getNaturalVisibleOptionSource(): any[] {
    const defaultOptions = this.signalStore?.getDefaultOptions?.() || [];
    const filterOptions = this.signalStore?.getFilterOption?.() || [];
    const totalOptions = this.signalStore?.getTotalOptions?.() || [];
    const actionOptions = this.normalizeActionOptions(this.getOptionsValue());
    const initialOptions = this.normalizeActionOptions(
      this.control?.formAction?.initialOptions || [],
    );

    return [
      ...defaultOptions,
      ...filterOptions,
      ...totalOptions,
      ...actionOptions,
      ...initialOptions,
    ];
  }

  private getSelectedCachedOptionsMissingFrom(source: any[]): any[] {
    const selectedCachedOptions = this.getSelectedCachedOptions();
    const sourceKeys = new Set(
      this.distinctOptionsByValue(source)
        .map((option) => this.toCompareKey(this.getOptionValue(option))),
    );

    return selectedCachedOptions.filter((option) => {
      const key = this.toCompareKey(this.getOptionValue(option));
      return !sourceKeys.has(key);
    });
  }

  private cacheInitialOptions(): void {
    const initialOptions = this.normalizeActionOptions(
      this.control?.formAction?.initialOptions || [],
    );

    if (!initialOptions.length) {
      return;
    }

    this.cacheOptions(initialOptions);

    const currentDefaultOptions = this.signalStore?.getDefaultOptions?.() || [];
    const mergedDefaultOptions = this.distinctOptionsByValue([
      ...initialOptions,
      ...currentDefaultOptions,
    ]);

    this.signalStore?.setDefaultOptions?.(
      mergedDefaultOptions,
      this.control?.formAction?.keyCombo,
    );
  }

  private hydrateSelectedOptionsFromCurrentValue(): void {
    const formControl = this.control?.formAction?.formControl;

    if (!formControl) {
      return;
    }

    const values = Array.isArray(formControl.value)
      ? formControl.value
      : formControl.value === null ||
        formControl.value === undefined ||
        formControl.value === ""
        ? []
        : [formControl.value];

    const knownOptions = this.getAllKnownOptionsSafe();

    for (const value of values) {
      const option = knownOptions.find((item) =>
        this.compareValue(this.getOptionValue(item), value),
      );

      if (option) {
        this.cacheOption(option);
      }
    }
  }

  private keepSelectedOptionsInStores(): void {
    const selectedOptions = this.distinctOptionsByValue([
      ...this.getSelectedCachedOptions(),
      ...this.getAllKnownOptionsSafe().filter((option) =>
        this.isOptionSelected(option),
      ),
    ]);

    this.signalStore.setSelectedOptions(selectedOptions);

    const currentTotal = this.normalizeActionOptions(
      this.signalStore?.getTotalOptions?.() || [],
    );

    const totalItems = this.shouldExposeMissingSelectedOptions()
      ? this.distinctOptionsByValue([
        ...this.getSelectedCachedOptionsMissingFrom(currentTotal),
        ...currentTotal,
      ])
      : this.distinctOptionsByValue(currentTotal);

    this.signalStore.setTotalOptions(
      {
        /**
         * In apertura normale non metto i selezionati dentro totalOptions, perché
         * la combo paginata non deve riordinarsi o mostrare extra non richiesti.
         * Durante la ricerca, invece, aggiungo i selezionati mancanti per non
         * perdere il valore scelto mentre il filtro remoto cambia la lista.
         */
        items: totalItems,
        totalCount: Math.max(currentTotal.length, selectedOptions.length),
      },
      this.control?.formAction?.keyCombo,
    );
  }

  private cacheOption(option: any): void {
    if (!option) {
      return;
    }

    const normalized = this.normalizeOption(option);
    const value = this.getOptionValue(normalized);
    const key = this.toCompareKey(value);

    this.selectedOptionsCache.set(key, normalized);
  }

  private cacheOptions(options: any[]): void {
    for (const option of options || []) {
      this.cacheOption(option);
    }
  }

  private cacheSelectedVisibleOptions(): void {
    const options = [
      ...(this.signalStore?.getDefaultOptions?.() || []),
      ...(this.signalStore?.getFilterOption?.() || []),
      ...(this.signalStore?.getTotalOptions?.() || []),
      ...this.normalizeActionOptions(this.getOptionsValue()),
      ...this.normalizeActionOptions(this.control?.formAction?.initialOptions || []),
    ];

    for (const option of options) {
      if (this.isOptionSelected(option)) {
        this.cacheOption(option);
      }
    }
  }

  private getSelectedCachedOptions(): any[] {
    const formControl = this.control?.formAction?.formControl;

    if (!formControl) {
      return [];
    }

    const selectedValues = Array.isArray(formControl.value)
      ? formControl.value
      : formControl.value === null ||
        formControl.value === undefined ||
        formControl.value === ""
        ? []
        : [formControl.value];

    return selectedValues
      .map((value: any) => this.selectedOptionsCache.get(this.toCompareKey(value)))
      .filter(Boolean);
  }

  private distinctOptionsByValue(options: any[]): any[] {
    const map = new Map<string, any>();

    for (const option of options || []) {
      if (!option) {
        continue;
      }

      const normalized = this.normalizeOption(option);
      const value = this.getOptionValue(normalized);
      map.set(this.toCompareKey(value), normalized);
    }

    return Array.from(map.values());
  }

  private toCompareKey(value: any): string {
    if (value === null || value === undefined) {
      return String(value);
    }

    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    return String(value);
  }

  /***********************************************************************************************************************************
   * SELECTED LABEL
   ***********************************************************************************************************************************/

  getValueCombo(formControl: FormControl, smal: boolean): string {
    return this.getSelectedLabel(smal);
  }

  getSelectedLabel(small = true): string {
    if (!this.isReady()) {
      return "";
    }

    const value = this.control.formAction.formControl.value;

    if (value === null || value === undefined || value === "") {
      return this.control?.formAction?.placeholder ?? "";
    }

    const options = this.getAllKnownOptionsSafe();

    if (this.isMultipleSelection()) {
      const values = Array.isArray(value)
        ? value
        : value === null || value === undefined || value === ""
          ? []
          : [value];

      if (!values.length) {
        return this.control?.formAction?.placeholder ?? "";
      }

      const descriptions = values
        .map((id) => this.findOptionDescriptionByValue(id, options))
        .filter((description) => !!description);

      if (!descriptions.length) {
        return `${values.length} selezionati`;
      }

      if (!small) {
        return descriptions.join("; ");
      }

      return descriptions.length <= this.combotext.maxElementShow
        ? descriptions.join("; ")
        : `${descriptions
          .slice(0, this.combotext.maxElementShow)
          .join("; ")} + ${descriptions.length - this.combotext.maxElementShow}`;
    }

    return (
      this.findOptionDescriptionByValue(value, options) ||
      this.control?.formAction?.placeholder ||
      ""
    );
  }

  private findOptionDescriptionByValue(value: any, options: any[]): string {
    const option = options.find((item) => this.optionEqualsValue(item, value));

    if (!option) {
      return typeof value === "object" ? "" : String(value ?? "");
    }

    return option.description || this.getOptionDescription(option);
  }

  private optionEqualsValue(option: any, value: any): boolean {
    if (
      option === null ||
      option === undefined ||
      value === null ||
      value === undefined
    ) {
      return false;
    }

    const optionValue = this.getOptionValue(option);

    if (typeof value === "object") {
      const keyId = this.control?.formAction?.keyCombo?.keyId ?? "id";

      if (Array.isArray(keyId)) {
        const valueKey = keyId
          .map((key) => value?.[key])
          .filter((v) => v !== null && v !== undefined)
          .join("|");

        return optionValue == valueKey;
      }

      return optionValue == value?.[keyId];
    }

    return optionValue == value;
  }

  private getAllKnownOptionsSafe(): any[] {
    const fromCache = Array.from(this.selectedOptionsCache.values());
    const fromInitial = this.normalizeActionOptions(
      this.control?.formAction?.initialOptions || [],
    );
    const fromTotal = this.signalStore?.getTotalOptions?.() || [];
    const fromSelected = this.signalStore?.getSelectedOptions?.() || [];
    const fromDefault = this.signalStore?.getDefaultOptions?.() || [];
    const fromFiltered = this.signalStore?.getFilterOption?.() || [];
    const fromAction = this.normalizeActionOptions(this.getOptionsValue());

    const key = this.control?.formAction?.keyCombo?.keyId ?? "id";
    const map = new Map<any, any>();

    for (const item of [
      ...fromCache,
      ...fromInitial,
      ...fromTotal,
      ...fromSelected,
      ...fromDefault,
      ...fromFiltered,
      ...fromAction,
    ]) {
      if (!item) {
        continue;
      }

      const normalized = this.normalizeOption(item);
      const mapKey = this.resolveOptionKey(normalized, key);

      map.set(mapKey, normalized);
    }

    return Array.from(map.values());
  }

  /***********************************************************************************************************************************
   * OPTIONS HELPERS
   ***********************************************************************************************************************************/

  getOptionValue(option: any): any {
    const keyId = this.control?.formAction?.keyCombo?.keyId ?? "id";

    if (Array.isArray(keyId)) {
      return keyId
        .map((key) => option?.[key])
        .filter((value) => value !== null && value !== undefined)
        .join("|");
    }

    return option?.[keyId] ?? option?.id;
  }

  getOptionDescription(option: any): string {
    if (!option) {
      return "";
    }

    const keys = this.control?.formAction?.keyCombo?.keyDescription ?? [
      "description",
    ];

    const keyList = Array.isArray(keys) ? keys : [keys];

    return keyList
      .map((key: string) => option?.[key])
      .filter(
        (value: any) => value !== null && value !== undefined && value !== "",
      )
      .join(" - ");
  }

  private normalizeActionOptions(
    value: any[] | { items: any[]; totalCount: number },
  ): any[] {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Array.isArray(value.items)
    ) {
      return value.items.map((item) => this.normalizeOption(item));
    }

    return Array.isArray(value)
      ? value.map((item) => this.normalizeOption(item))
      : [];
  }

  private normalizeOption(option: any): any {
    if (!option) {
      return option;
    }

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
        .join("|");
    }

    return option?.[key] ?? option?.id ?? JSON.stringify(option);
  }

  isCheckboxSelect(): boolean {
    return (
      this.control?.formAction?.checkboxSelect === true ||
      this.control?.formAction?.props?.checkboxSelect === true
    );
  }

  isMultipleSelection(): boolean {
    return (
      this.control?.formAction?.multiple === true || this.isCheckboxSelect()
    );
  }

  isOptionDisabled(option: any): boolean {
    return (
      (this.signalStore.getDisabledOptions() || []).indexOf(option?.id) > -1
    );
  }

  isOptionSelected(option: any): boolean {
    const formControl = this.control?.formAction?.formControl;

    if (!formControl) {
      return false;
    }

    const optionValue = this.getOptionValue(option);
    const value = formControl.value;

    if (this.isMultipleSelection()) {
      const values = Array.isArray(value)
        ? value
        : value === null || value === undefined || value === ""
          ? []
          : [value];

      return values.some((item: any) => this.compareValue(item, optionValue));
    }

    return this.compareValue(value, optionValue);
  }

  getResetValue(): any {
    return this.isMultipleSelection() ? [] : null;
  }

  private compareValue(value: any, optionValue: any): boolean {
    return this.areJsonEqual(value, optionValue) || value == optionValue;
  }

  private normalizeControlValueForMultiple(): void {
    const formControl = this.control?.formAction?.formControl;

    if (!formControl || !this.isMultipleSelection()) {
      return;
    }

    const value = formControl.value;

    if (Array.isArray(value)) {
      return;
    }

    if (value === null || value === undefined || value === "") {
      formControl.setValue([], { emitEvent: false });
      return;
    }

    formControl.setValue([value], { emitEvent: false });
  }

  private mergeOptionsDistinct(current: any[], next: any[]): any[] {
    const key = this.control?.formAction?.keyCombo?.keyId ?? "id";
    const map = new Map<any, any>();

    for (const item of [...(current || []), ...(next || [])]) {
      if (!item) {
        continue;
      }

      const normalized = this.normalizeOption(item);
      const mapKey = this.resolveOptionKey(normalized, key);

      map.set(mapKey, normalized);
    }

    return Array.from(map.values());
  }

  private emitFormActionOnChange(ctx: {
    value: any;
    formControl: FormControl;
    option?: any;
    selected?: boolean;
  }): void {
    const onChange = this.control?.formAction?.onChange;

    if (typeof onChange !== "function") {
      return;
    }

    const payload = {
      value: ctx.value,
      formControl: ctx.formControl,
      formAction: this.control.formAction,
      control: this.control,
      option: ctx.option,
      selected: ctx.selected,
      formGroup: this.group,
      form: this.group,
      instance: this,
      idForm: this.getIdForm(),
    };

    if ((onChange as Function).length <= 1) {
      (onChange as any)(payload);
      return;
    }

    (onChange as any)(
      payload.value,
      payload.formControl,
      payload.formAction,
      payload.control,
      payload.option,
      payload.selected,
      payload.formGroup,
      payload.instance,
      payload.idForm,
      payload,
    );
  }

  onMaterialSelectionChange(event: MatSelectChange): void {
    const formControl = this.control?.formAction?.formControl;

    if (!formControl) {
      return;
    }

    let value = event.value;

    if (this.isMultipleSelection()) {
      value = Array.isArray(value)
        ? value
        : value === null || value === undefined || value === ""
          ? []
          : [value];
    }

    formControl.setValue(value);
    formControl.markAsDirty();
    formControl.markAsTouched();
    formControl.updateValueAndValidity();

    this.hydrateSelectedOptionsFromCurrentValue();
    this.cacheSelectedVisibleOptions();
    this.keepSelectedOptionsInStores();
    this.refreshSelectedView();

    this.emitFormActionOnChange({
      value,
      formControl: formControl as FormControl,
    });
  }

  resetCombo(event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();

    const formControl = this.control?.formAction?.formControl;

    if (!formControl) {
      return;
    }

    const value = this.getResetValue();

    formControl.reset(value);
    formControl.markAsDirty();
    formControl.markAsTouched();
    formControl.updateValueAndValidity();

    this.selectedOptionsCache.clear();
    this.signalStore.setSelectedOptions([]);
    this.refreshSelectedView();

    this.emitFormActionOnChange({
      value,
      formControl: formControl as FormControl,
    });
  }

  getComboPanelClass(): string[] {
    return [
      'df-combo-scroll-panel',
      this.control?.formAction?.themeClass || 'df-theme-aurora-luxe',
    ];
  }
}
