/** @format */

import {InjectionToken, computed, inject, untracked} from '@angular/core';
import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';

import {TypeComboOption} from '../../dynamic-form.interface';

interface IState {
   totalOptions: TypeComboOption;
   filteredOptions: TypeComboOption;
   selectedOptions: TypeComboOption;
   defaultOptions: TypeComboOption;
   isLoading: boolean;
   disabledOption: Array<string>;
}

const initialState: IState = {
   isLoading: false,
   filteredOptions: [],
   selectedOptions: [],
   totalOptions: [],
   defaultOptions: [],
   disabledOption: [],
};

const STATE = new InjectionToken<IState>('IState', {
   factory: () => initialState,
});

type KeyCombo = {
   keyId: string | Array<string>;
   keyDescription: string | Array<string>;
};

function asArray<T = any>(value: T[] | null | undefined): T[] {
   return Array.isArray(value) ? [...value] : [];
}

function getByKey(source: any, key: string | Array<string>): any {
   if (Array.isArray(key)) {
      return key.map(k => source?.[k]).filter(v => v !== null && v !== undefined).join(' ').trim();
   }
   return source?.[key];
}

function normalizeOptions(value: Partial<TypeComboOption | {items: Array<any>; totalCount: number}> | null | undefined, keyCombo: KeyCombo = {keyId: 'id', keyDescription: 'description'}): TypeComboOption {
   const source = value && typeof value === 'object' && !Array.isArray(value) && Object.prototype.hasOwnProperty.call(value, 'items')
      ? (value as {items: Array<any>; totalCount: number}).items
      : value;

   return asArray(source as any[]).map(item => ({
      ...item,
      id: getByKey(item, keyCombo.keyId),
      description: getByKey(item, keyCombo.keyDescription),
   }));
}

function distinctArray<T extends {id?: any} = any>(array: T[] | null | undefined): T[] {
   const seenIds = new Set<any>();
   const result: T[] = [];

   for (const item of asArray(array)) {
      const key = item && typeof item === 'object' ? item.id : item;
      if (seenIds.has(key)) continue;
      seenIds.add(key);
      result.push(item);
   }

   return result;
}

export const Store = signalStore(
   {protectedState: false},
   withState(() => inject(STATE)),

   withComputed(store => ({
      getFilterOption: computed(() => asArray(store.filteredOptions())),

      getIsLoading: computed(() => store.isLoading()),

      getSelectedOptions: computed(() => [...asArray(store.selectedOptions()), ...asArray(store.defaultOptions())]),

      getSelectedOptionsFromTotal: computed(() => {
         const selectedOptions = asArray(store.selectedOptions());
         const defaultOptions = asArray(store.defaultOptions());
         return untracked(() => [
            ...asArray(store.totalOptions()).filter(f => selectedOptions.some(s => s.id == f.id)),
            ...defaultOptions,
         ]);
      }),

      getTotalOptions: computed(() => asArray(store.totalOptions())),

      getDisabledOptions: computed(() => asArray(store.disabledOption())),

      getDefaultOptions: computed(() => asArray(store.defaultOptions())),

      getConcatStringDescription: computed(() => {
         const description = [...asArray(store.defaultOptions()), ...asArray(store.selectedOptions())]
            .map(m => m?.description)
            .filter(f => !!f && f.length > 0);
         if (description.length > 2) return description.join(',');
         return null;
      }),
   })),

   withMethods(store => ({
      distinctArray,

      setFilteredOptions(
         newElement: Partial<TypeComboOption | {items: Array<any>; totalCount: number}> | null | undefined,
         keyCombo: KeyCombo = {keyId: 'id', keyDescription: 'description'},
         append: boolean = false,
      ): void {
         const selected = asArray(store.selectedOptions());
         const current = asArray(store.filteredOptions());
         const next = normalizeOptions(newElement, keyCombo);
         const filteredOptions = append ? distinctArray([...selected, ...current, ...next]) : distinctArray([...selected, ...next]);

         const totalCount = newElement && typeof newElement === 'object' && !Array.isArray(newElement) && Object.prototype.hasOwnProperty.call(newElement, 'totalCount')
            ? Number((newElement as {items: Array<any>; totalCount: number}).totalCount || 0)
            : undefined;

         patchState(store, state => ({
            ...state,
            filteredOptions,
            isLoading: false,
            ...(totalCount !== undefined ? {storeData: {items: filteredOptions, totalCount}} : {}),
         } as any));
      },

      updateFilterOption(options: TypeComboOption | null | undefined): void {
         patchState(store, state => ({...state, filteredOptions: distinctArray(asArray(options)), isLoading: false}));
      },

      setSelectedOptions(newElement: Partial<TypeComboOption> | null | undefined): void {
         patchState(store, state => ({...state, selectedOptions: asArray(newElement as any)}));
      },

      setTotalOptions(newElement: Partial<TypeComboOption | {items: Array<any>; totalCount: number}> | null | undefined, keyCombo: KeyCombo = {keyId: 'id', keyDescription: 'description'}): void {
         patchState(store, state => ({...state, totalOptions: distinctArray(normalizeOptions(newElement, keyCombo))}));
      },

      setIsLoading(value: boolean): void {
         patchState(store, state => ({...state, isLoading: value}));
      },

      setDefaultOptions(
         newElement: Partial<TypeComboOption | {items: Array<any>; totalCount: number}> | null | undefined,
         keyCombo: KeyCombo = {keyId: 'id', keyDescription: 'description'},
      ): void {
         patchState(store, state => ({
            ...state,
            defaultOptions: normalizeOptions(newElement, keyCombo),
            isLoading: false,
         }));
      },

      addDisabledOption(value: Array<string> | null | undefined): void {
         patchState(store, state => ({...state, disabledOption: asArray(value)}));
      },

      updateOptionSelected(optionId: string, isSelected: boolean, isMultiple: boolean): void {
         let selectedOptions = asArray(store.selectedOptions());
         const option = asArray(store.filteredOptions()).find(f => f.id == optionId);

         if (!option) return;

         if (isMultiple) {
            if (selectedOptions.find((f: any) => f.id == optionId) != null) {
               selectedOptions = selectedOptions.filter(f => f.id != optionId);
            } else {
               selectedOptions.push({...option, selected: true});
            }
         } else {
            selectedOptions = [{...option, selected: true}];
         }

         patchState(store, state => ({...state, selectedOptions}));
      },
   })),

   withHooks({
      onInit(store) {
         patchState(store, state => ({
            ...state,
            filteredOptions: [],
            selectedOptions: [],
            totalOptions: [],
            defaultOptions: [],
            storeData: {items: [], totalCount: 0},
            isLoading: false,
         } as any));
      },
      onDestroy(store) {
         patchState(store, state => ({
            ...state,
            filteredOptions: [],
            selectedOptions: [],
            totalOptions: [],
            defaultOptions: [],
            storeData: {items: [], totalCount: 0},
            isLoading: false,
         } as any));
      },
   }),
);
