/**
 * @format
 * @author luca.piciollo
 * @email lucapiciollo@gmail.com
 * @create date 2022-03-29 19:47:50
 * @modify date 2022-03-29 19:47:50
 * @desc [description]
 */

import {AfterViewInit, ChangeDetectionStrategy, Component, effect, EffectRef, ElementRef, inject, Injector, Signal, signal, untracked, viewChild, ViewChild} from '@angular/core';
import {BaseComponent} from '../base-component.component';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {debounceTime, distinctUntilChanged, fromEvent, Subject, takeUntil} from 'rxjs';
import {TYPE_CONTROL_FORM} from '../../dynamic-form.interface';
import {Store} from './store';
import {toSignal} from '@angular/core/rxjs-interop';

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
   private filterInput = viewChild('filterInput', {
      read: ElementRef<HTMLInputElement>,
   });
   private searchTermSignal: Signal<string> = signal<string>(null);

   public signalStore = inject(Store);
   public loaderss = signal(false);

   private distinctArray = array => {
      const seenIds = new Set();
      // const disabledOptions = (this.control.formAction?.disabledOptions || []).map(f => f.id);
      return array.clone().filter(item => {
         if (seenIds.has(item.id)) return false;
         seenIds.add(item.id);
         // if (disabledOptions.includes(item.id)) item.disabled = true;
         return true;
      });
   };

   constructor(
      protected override injector: Injector,
      protected override element: ElementRef,
   ) {
      super(injector, element);
      super.signalStoreValue = this.signalStore;
      this.searchTermSignal = toSignal(this.inputSubject.pipe(debounceTime(500), distinctUntilChanged()));
      this.control.formAction.paging = {...this.initPagination, totalCount: 0};

      effect(
         () => {
            let initialOptions = this.setInitialOption();
            if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBO) {
               this.signalStore.setFilteredOptions(initialOptions, this.control.formAction.keyCombo, false);
               this.signalStore.setTotalOptions(untracked(() => this.signalStore.getFilterOption()));
               if (
                  !this.areJsonEqual(
                     initialOptions,
                     untracked(() => this.signalStore.getTotalOptions()),
                  )
               )
                  (this.onOptionSetted as any)?.set(untracked(() => this.signalStore.getTotalOptions()));
            }
            if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) {
               this.control.formAction.paging = {
                  ...this.control.formAction.paging,
                  totalCount: (initialOptions as {items: Array<any>; totalCount: number})?.totalCount || 0,
               };
               this.signalStore.setFilteredOptions(initialOptions, this.control.formAction.keyCombo, !this.resetOption);
               this.signalStore.setTotalOptions(untracked(() => this.signalStore.getFilterOption()));
               if (
                  !this.areJsonEqual(
                     initialOptions,
                     untracked(() => this.signalStore.getTotalOptions()),
                  )
               )
                  (this.onOptionSetted as any)?.set(untracked(() => this.signalStore.getTotalOptions()));
            }
            let selectedOptions = [];
            let formValue = this.control.formAction.formControl.value;
            if (formValue && formValue instanceof Array) selectedOptions = untracked(() => this.signalStore.getFilterOption()).filter(f => formValue?.includes(f.id));
            else selectedOptions = untracked(() => this.signalStore.getFilterOption()).filter(f => f.id == formValue);
            this.signalStore.setSelectedOptions(selectedOptions);
         },
         {allowSignalWrites: true},
      );

      effect(
         () => {
            let valueSearch = this.searchTermSignal();
            if (valueSearch != undefined && valueSearch != null) this.search(valueSearch);
         },
         {allowSignalWrites: true},
      );
   }

   areJsonEqual(json1: any, json2: any): boolean {
      if (typeof json1 !== typeof json2) return false;
      if (Array.isArray(json1) && Array.isArray(json2)) {
         if (json1.length !== json2.length) return false;
         return json1.every((item, index) => this.areJsonEqual(item, json2[index]));
      }
      if (typeof json1 === 'object' && json1 !== null && json2 !== null) {
         const keys1 = Object.keys(json1);
         const keys2 = Object.keys(json2);
         if (keys1.length !== keys2.length) return false;
         for (const key of keys1) {
            if (!keys2.includes(key) || !this.areJsonEqual(json1[key], json2[key])) {
               return false;
            }
         }
         return true;
      }
      return json1 === json2;
   }

   search(value) {
      this.signalStore.setIsLoading(true);
      this.resetOption = value != null && value.trim() != '';
      if (this.control.formAction.remoteData && this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) {
         this._filter({
            param: Object({
               ...this.initPagination,
               [this.control?.formAction?.keyCombo?.keySearch != null ? this.control?.formAction?.keyCombo?.keySearch : 'search']: this.resetOption ? value : null,
               ...(this.control?.formAction?.paramsForRemoteData() || {}),
            }).changeValues([null], undefined),
            externalStore: this.setInitialOption,
         } as any);
      } else if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBO) {
         let filtered = this._filter(value);
         this.signalStore.setFilteredOptions(filtered, this.control.formAction.keyCombo, !this.resetOption);
      }
   }

   getValueCombo(formControl: FormControl, smal) {
      let option = [...(this.signalStore.getTotalOptions() || []), ...(this.signalStore.getDefaultOptions() || [])];
      let formValue = this.control.formAction.formControl.value;
      if (option != null) {
         if (formValue instanceof Array) {
            let description = formValue?.map(id => option?.find(f => f.id == id)?.description).filter(f => f != null);
            if (smal) return description?.length < this.combotext.maxElementShow ? `${description?.join('; ')}` : description?.length > this.combotext.maxElementShow ? `${description?.slice(0, this.combotext.maxElementShow)?.join('; ')}  + ${description?.length - this.combotext.maxElementShow}` : `${description?.slice(0, this.combotext.maxElementShow)?.join('; ')}`;
            else return `${description?.join('; ')}`;
         }
         return option?.find(f => f.id == formValue)?.description || null;
      }
      return null;
   }

   toggleOption(option: any, event: Event): void {
      if (this.control.formAction.multiple) event.stopPropagation();
      this.signalStore.updateOptionSelected(option.id, !option.selected, this.control.formAction.multiple);
   }

   @ViewChild('selectRef') selectRef: MatSelect;
   onPanelOpen() {
      try {
         this.signalStore.setIsLoading(false);
         this.effectStore.push(
            effect(
               () => {
                  const input = this.filterInput();
                  if (input != null) {
                     queueMicrotask(() => {
                        input?.nativeElement?.focus();
                     });
                  }
               },
               {injector: this.injector},
            ),
         );

         let oldremotedata = (this.control.formAction as any).remoteData;
         this._filter =
            oldremotedata != null
               ? (...args) => {
                    this.signalStore.setIsLoading(true);
                    oldremotedata(...args);
                 }
               : this._filter;

         if (this.control?.formAction?.opened) this.control.formAction.opened(this.formGroupIndex, this.formActionIndex, this.control.formAction?.formControl, this.control.formAction.formName, this.group, this._allGroup, this.utils);

         if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE || this.control.formAction.type == TYPE_CONTROL_FORM.COMBO) {
            this.search('');
            this.addEventScroll();
         } else {
            this.signalStore.setIsLoading(false);
         }
      } catch (e) {
         throw new Error(e);
      }
   }

   addEventScroll() {
      try {
         fromEvent(this.selectRef?.panel?.nativeElement, 'scroll')
            .pipe(debounceTime(10), takeUntil(this.onPanelCloseObs), distinctUntilChanged())
            .subscribe(() => {
               const panel = this.selectRef?.panel?.nativeElement;
               this.scrollTop = panel.scrollTop;
               const scrollHeight = panel.scrollHeight;
               const clientHeight = panel.clientHeight;
               const distanceFromBottom = scrollHeight - this.scrollTop - clientHeight;
               const threshold = 10;
               if (distanceFromBottom <= threshold && !this.reachedEnd) {
                  const paging = this.control.formAction?.paging;
                  const currentPage = paging?.page ?? 1;
                  this.control.formAction.paging = {
                     ...paging,
                     page: currentPage + 1,
                  };
                  const totalPages = Math.ceil((paging?.totalCount ?? 0) / (paging?.count ?? 1));
                  this.reachedEnd = true;
                  if (currentPage <= totalPages && this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) {
                     this.signalStore.setIsLoading(true);
                     this.control.formAction.remoteData({
                        param: Object({
                           ...this.control.formAction.paging,
                           //  search: this.filterInput()?.nativeElement?.value?.trim() != '' ? this.filterInput()?.nativeElement?.value : null,
                           [this.control?.formAction?.keyCombo?.keySearch != null ? this.control?.formAction?.keyCombo?.keySearch : 'search']: this.filterInput()?.nativeElement?.value?.trim() != '' ? this.filterInput()?.nativeElement?.value : null,
                           ...(this.control?.formAction?.paramsForRemoteData() || {}),
                        }).changeValues([null], undefined),
                        externalStore: this.setInitialOption,
                     });
                     this.control.formAction.paging = {
                        ...this.control.formAction.paging,
                        page: currentPage + 1,
                     };
                  }
               } else {
                  this.reachedEnd = false;
               }
            });
      } catch (e) {
         throw new Error(e);
      }
   }

   clearInput = () => {
      try {
         if (this.filterInput()) this.filterInput().nativeElement.value = '';
      } catch (e) {
         throw new Error(e);
      }
   };

   onPanelClose() {
      try {
         this.signalStore.setIsLoading(false);
         this.effectStore.map(m => m.destroy());
         this.showOptionDefault = true;
         this.onPanelCloseObs.next();
         if (this.control.formAction.type == TYPE_CONTROL_FORM.COMBOPAGINATE) {
            let selected = this.signalStore.getSelectedOptions();
            this.signalStore.setFilteredOptions([], this.control.formAction.keyCombo, false);
            this.signalStore.setTotalOptions(untracked(() => this.signalStore.getSelectedOptions()));
            this.control.formAction.paging = {...this.initPagination};
         }
         if (this.control?.formAction?.closed) {
            this.control.formAction.closed(this.formGroupIndex, this.formActionIndex, this.control.formAction?.formControl, this.control.formAction.formName, this.group, this._allGroup, this.utils);
         }
      } catch (e) {
         throw new Error(e);
      }
   }

   onInputChange(value: string): void {
      this.inputSubject.next(value);
   }
}
