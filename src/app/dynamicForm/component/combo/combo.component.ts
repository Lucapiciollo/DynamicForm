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
export class ComboComponent extends BaseComponent {
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
   * Valore tecnico usato solo dal mat-select quando la combo è in modalità
   * checkboxSelect. Il valore vero rimane sempre nel formControl reale.
   */
  public readonly CHECKBOX_SELECT_VALUE = "__DF_CHECKBOX_SELECT__";
  private readonly checkboxSelectFakeControl = new FormControl<string>(
    this.CHECKBOX_SELECT_VALUE,
  );

  getCheckboxOptionTechnicalValue(option: any): string {
   return `__checkbox_option_${option?.id ?? this.getOptionValue(option)}`;
}

  /** Testo visuale forzato per il trigger della checkbox select. */
  public readonly selectedLabelText = signal<string>("");

  private filterInput = viewChild("filterInput", {
    read: ElementRef<HTMLInputElement>,
  });

  public signalStore = inject(Store);
  public loaderss = signal(false);

  @ViewChild("selectRef") selectRef: MatSelect;

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

  private isReady(): boolean {
    return !!this.control?.formAction?.formControl;
  }

  getSelectFormControl(): FormControl {
    return this.isCheckboxSelect()
      ? this.checkboxSelectFakeControl
      : this.control.formAction.formControl as FormControl;
  }

  hasComboValue(): boolean {
    const value = this.control?.formAction?.formControl?.value;

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== null && value !== undefined && value !== "";
  }

  private syncCheckboxSelectFakeControl(): void {
    if (!this.isCheckboxSelect()) {
      return;
    }

    if (this.checkboxSelectFakeControl.value !== this.CHECKBOX_SELECT_VALUE) {
      this.checkboxSelectFakeControl.setValue(this.CHECKBOX_SELECT_VALUE, {
        emitEvent: false,
      });
    }
  }

  private refreshSelectedView(): void {
    if (!this.isReady()) {
      return;
    }

    this.syncCheckboxSelectFakeControl();
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
      this.syncCheckboxSelectFakeControl();
      this.refreshSelectedView();
      this.signalStore.setIsLoading(false);
      this.emitOpened( );

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
      this.signalStore.setIsLoading(false);

      this.removePanelScrollListener();

      this.effectStore.forEach((m) => m.destroy());
      this.effectStore = [];

      this.showOptionDefault = true;
      this.reachedEnd = false;
      this.scrollBindRetry = 0;
      this.onPanelCloseObs.next();

      if (this.control.formAction.type === TYPE_CONTROL_FORM.COMBOPAGINATE) {
        this.signalStore.setFilteredOptions(
          [],
          this.control.formAction.keyCombo,
          false,
        );

        this.signalStore.setTotalOptions(
          untracked(() => this.signalStore.getSelectedOptions()),
          this.control.formAction.keyCombo,
        );

        this.control.formAction.paging = {
          ...this.initPagination,
        };
      }

      this.emitClosed( );
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

    this.emitSearch(valueSearch );

    this.signalStore.setIsLoading(true);
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

    console.log("[COMBOPAGINATE] scroll listener agganciato", {
      scrollHeight: panel.scrollHeight,
      clientHeight: panel.clientHeight,
      scrollTop: panel.scrollTop,
      options: this.signalStore.getFilterOption?.()?.length,
    });
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
      console.log("[COMBOPAGINATE] fine dati raggiunta", {
        paging: this.control.formAction.paging,
      });
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

    console.log("[COMBOPAGINATE] load next page", {
      paging: this.control.formAction.paging,
      search: this.currentSearchValue ?? this.getSearchValue(),
    });

    this.emitScrollEnd(this.control.formAction.paging );

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
    /**
     * Caso Signal Angular.
     */
    if (isSignal(remoteData)) {
      return remoteData();
    }

    /**
     * Caso RxMethod / funzione classica:
     * remoteData({ param, externalStore, ... })
     */
    if (typeof remoteData === "function") {
      /**
       * Se è una Signal Angular, chiamarla senza argomenti restituisce il valore.
       * Ma una funzione remota normale accetta payload.
       *
       * Strategia:
       * - provo prima come funzione remota con payload
       * - se esplode, provo come signal senza payload
       */
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

    /**
     * Caso Promise già pronta.
     */
    if (remoteData && typeof remoteData.then === "function") {
      return remoteData;
    }

    /**
     * Caso Observable già pronto.
     */
    if (isObservable(remoteData)) {
      return remoteData;
    }

    /**
     * Caso array diretto oppure oggetto { items, totalCount }.
     */
    return remoteData;
  }

  private handleRemoteDataResult(
    result: any,
    param: Record<string, any>,
    requestId: number,
  ): void {
    /**
     * Observable
     */
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

    /**
     * Promise
     */
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

    /**
     * Signal Angular già risolta male:
     * può capitare che result sia ancora una funzione senza argomenti.
     */
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

    /**
     * Array / object / undefined
     */
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

    /**
     * Caso vecchio:
     * remoteData aggiorna già lo store e non ritorna nulla.
     */
    if (response === undefined || response === null) {
      this.signalStore.setIsLoading(false);
      this.reachedEnd = false;
      return;
    }

    const normalized = this.normalizeRemoteResponse(response);
    const items = normalized.items;
    const totalCount = normalized.totalCount ?? items.length;
    this.lastLoadedItemsCount = items.length;

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

    this.signalStore.setTotalOptions(
      {
        items: currentTotal,
        totalCount,
      },
      keyCombo,
    );

    this.signalStore.setIsLoading(false);
    this.reachedEnd = false;
    this.refreshSelectedView();

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
      return "";
    }

    const options = this.getAllKnownOptionsSafe();

    if (this.isMultipleSelection()) {
      const values = Array.isArray(value) ? value : [value];

      const descriptions = values
        .map((id) => this.findOptionDescriptionByValue(id, options))
        .filter((description) => !!description);

      if (!small) {
        return descriptions.join("; ");
      }

      return descriptions.length <= this.combotext.maxElementShow
        ? descriptions.join("; ")
        : `${descriptions
            .slice(0, this.combotext.maxElementShow)
            .join(
              "; ",
            )} + ${descriptions.length - this.combotext.maxElementShow}`;
    }

    return this.findOptionDescriptionByValue(value, options);
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
    const fromTotal = this.signalStore?.getTotalOptions?.() || [];
    const fromSelected = this.signalStore?.getSelectedOptions?.() || [];
    const fromDefault = this.signalStore?.getDefaultOptions?.() || [];
    const fromFiltered = this.signalStore?.getFilterOption?.() || [];
    const fromAction = this.normalizeActionOptions(this.getOptionsValue());

    const key = this.control?.formAction?.keyCombo?.keyId ?? "id";
    const map = new Map<any, any>();

    for (const item of [
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

    /**
     * Compatibilità doppia:
     * - nuova modalità: onChange(ctx)
     * - vecchia modalità tipizzata: onChange(value, formControl, formAction, control, option, selected, formGroup, instance, idForm, ctx)
     *
     * Usiamo cast ad any perché dynamic-form.interface può dichiarare più parametri obbligatori.
     */
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
    if (this.isCheckboxSelect()) {
      return;
    }

    const formControl = this.control?.formAction?.formControl;

    if (!formControl) {
      return;
    }

    const value = event.value;
    formControl.markAsDirty();
    formControl.markAsTouched();
    formControl.updateValueAndValidity();
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
    this.syncCheckboxSelectFakeControl();

    this.signalStore.setSelectedOptions([]);
    this.refreshSelectedView();

    this.emitFormActionOnChange({
      value,
      formControl: formControl as FormControl,
    });
  }

  toggleOption(option: any, event?: any): void {
    const formControl = this.control?.formAction?.formControl;

    if (!formControl) {
      return;
    }

    if (this.isMultipleSelection()) {
      event?.stopPropagation?.();
      event?.preventDefault?.();
    }

    const optionValue = this.getOptionValue(option);
    const isMultiple = this.isMultipleSelection();

    if (isMultiple) {
      const currentValue = Array.isArray(formControl.value)
        ? formControl.value
        : formControl.value === null ||
            formControl.value === undefined ||
            formControl.value === ""
          ? []
          : [formControl.value];

      const exists = currentValue.some((value: any) =>
        this.compareValue(value, optionValue),
      );

      const nextValue = exists
        ? currentValue.filter(
            (value: any) => !this.compareValue(value, optionValue),
          )
        : [...currentValue, optionValue];

      formControl.setValue(nextValue);
      formControl.markAsDirty();
      formControl.markAsTouched();
      formControl.updateValueAndValidity();
      this.syncCheckboxSelectFakeControl();

      this.signalStore.updateOptionSelected(optionValue, !exists, true);

      const selectedOptions = this.getAllKnownOptionsSafe().filter((knownOption) =>
        nextValue.some((value: any) => this.optionEqualsValue(knownOption, value)),
      );
      this.signalStore.setSelectedOptions(selectedOptions);
      this.refreshSelectedView();

      this.emitFormActionOnChange({
        value: nextValue,
        formControl: formControl as FormControl,
        option,
        selected: !exists,
      });

      return;
    }

    formControl.setValue(optionValue);
    formControl.markAsDirty();
    formControl.markAsTouched();
    formControl.updateValueAndValidity();

    this.signalStore.updateOptionSelected(optionValue, true, false);
    this.refreshSelectedView();

    this.emitFormActionOnChange({
      value: optionValue,
      formControl: formControl as FormControl,
      option,
      selected: true,
    });
  }
}
