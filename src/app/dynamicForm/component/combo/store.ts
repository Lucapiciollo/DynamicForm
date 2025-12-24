/** @format */

import {InjectionToken, computed, inject, untracked} from '@angular/core';
import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';

import {TypeComboOption} from '../../dynamic-form.interface';

/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
interface IState {
   totalOptions: TypeComboOption;
   filteredOptions: TypeComboOption;
   selectedOptions: TypeComboOption;
   defaultOptions: TypeComboOption;
   isLoading: boolean;
   disabledOption: Array<string>;
}
/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
const initialState = {
   isLoading: false,
   filteredOptions: null,
   selectedOptions: null,
   totalOptions: null,
   defaultOptions: null,
   disabledOption: [],
};
/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
const STATE = new InjectionToken<IState>('IState', {
   factory: () => initialState,
});

/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
export const Store = signalStore(
   {protectedState: false},
   withState(() => inject(STATE)),
   /**************************************************************************************************************************************************/
   /**************************************************************************************************************************************************/
   /**************************************************************************************************************************************************/

   withComputed(store => ({
      getFilterOption: computed(() => {
         return store.filteredOptions();
      }),
      /**************************************************************************************************************************************************/
      getIsLoading: computed(() => {
         return store.isLoading();
      }),

      /**************************************************************************************************************************************************/
      getSelectedOptions: computed(() => {
         return [...store.selectedOptions(), ...(store.defaultOptions() || [])];
      }),
      /**************************************************************************************************************************************************/
      getSelectedOptionsFromTotal: computed(() => {
         let selectedOptions = store.selectedOptions() || [];
         let defaultOptions = store.defaultOptions() || [];
         let opt = untracked(() => [...(store.totalOptions() || []?.filter(f => selectedOptions?.some(s => s.id == f.id))), ...defaultOptions]);
         return opt;
      }),
      /**************************************************************************************************************************************************/
      getTotalOptions: computed(() => {
         return store.totalOptions();
      }),
      /**************************************************************************************************************************************************/
      getDisabledOptions: computed(() => {
         return store.disabledOption();
      }),
      /**************************************************************************************************************************************************/
      getDefaultOptions: computed(() => {
         return store.defaultOptions();
      }),
      /**************************************************************************************************************************************************/
      getConcatStringDescription: computed(() => {
         let description = [...(store.defaultOptions() || [])?.map(m => m.description), ...(store.selectedOptions() || [])?.map(m => m.description)].filter(f => f.length > 0);
         if (description.length > 2) return description.join(',');
         return null;
      }),
   })),

   /**************************************************************************************************************************************************/
   /**************************************************************************************************************************************************/
   /**************************************************************************************************************************************************/

   withMethods(store => ({
      distinctArray(array) {
         const seenIds = new Set();
         return array.clone().filter(item => {
            if (seenIds.has(item.id)) return false;
            seenIds.add(item.id);
            return true;
         });
      },

      setFilteredOptions(
         newElement: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>,
         keyCombo: {
            keyId: string | Array<string>;
            keyDescription: string | Array<string>;
         } = {keyId: 'id', keyDescription: 'description'},
         append: boolean,
      ): void {
         if (newElement.hasOwnProperty('items')) {
            if (append) {
               patchState(store, state => ({
                  isLoading: false,
                  filteredOptions: this.distinctArray([
                     ...state.selectedOptions,
                     ...state.filteredOptions,
                     ...(newElement as {items: Array<any>; totalCount: number}).items?.map(m => ({
                        ...m,
                        id: keyCombo.keyId instanceof Array ? keyCombo.keyId.reduce((a, b) => (a += ` ${m[b]}`), '').trim() : m[keyCombo?.keyId],
                        description: keyCombo.keyDescription instanceof Array ? keyCombo.keyDescription.reduce((a, b) => (a += ` ${m[b]}`), '').trim() : m[keyCombo?.keyDescription],
                     })),
                  ]),
               }));
            } else {
               patchState(store, state => ({
                  isLoading: false,
                  filteredOptions: this.distinctArray([
                     ...state.selectedOptions,
                     ...(newElement as {items: Array<any>; totalCount: number}).items?.map(m => ({
                        ...m,
                        id: keyCombo.keyId instanceof Array ? keyCombo.keyId.reduce((a, b) => (a += ` ${m[b]}`), '').trim() : m[keyCombo?.keyId],
                        description: keyCombo.keyDescription instanceof Array ? keyCombo.keyDescription.reduce((a, b) => (a += ` ${m[b]}`), '').trim() : m[keyCombo?.keyDescription],
                     })),
                  ]),
               }));
            }
         } else {
            if (append) {
               let opt = null;
               untracked(() => {
                  opt = this.getFilterOption().clone();
                  opt.map(m => (m.selected = this.getSelectedOptions().some(s => s.id == m.id)));
               });
               patchState(store, state => ({
                  filteredOptions: this.distinctArray([
                     //  ...state.selectedOptions,
                     //  ...state.filteredOptions,
                     ...opt,
                     ...(newElement as TypeComboOption).map(m => ({
                        ...m,
                        id: keyCombo.keyId instanceof Array ? keyCombo.keyId.reduce((a, b) => (a += ` ${m[b]}`), '').trim() : m[keyCombo?.keyId],
                        description: keyCombo.keyDescription instanceof Array ? keyCombo.keyDescription.reduce((a, b) => (a += ` ${m[b]}`), '').trim() : m[keyCombo?.keyDescription],
                     })),
                  ]),
                  isLoading: false,
               }));
            } else {
               patchState(store, state => ({
                  filteredOptions: this.distinctArray([
                     ...state.selectedOptions,
                     ...(newElement as TypeComboOption).map(m => ({
                        ...m,
                        id: keyCombo.keyId instanceof Array ? keyCombo.keyId.reduce((a, b) => (a += ` ${m[b]}`), '').trim() : m[keyCombo?.keyId],
                        description: keyCombo.keyDescription instanceof Array ? keyCombo.keyDescription.reduce((a, b) => (a += ` ${m[b]}`), '').trim() : m[keyCombo?.keyDescription],
                     })),
                  ]),
                  isLoading: false,
               }));
            }
         }
      },

      setSelectedOptions(newElement: Partial<TypeComboOption>): void {
         patchState(store, state => ({selectedOptions: [...newElement]}));
      },

      setTotalOptions(newElement: Partial<TypeComboOption>): void {
         patchState(store, state => ({totalOptions: [...newElement]}));
      },

      setIsLoading(value: boolean): void {
         patchState(store, state => ({isLoading: value}));
      },

      setDefaultOptions(
         newElement: Partial<TypeComboOption | {items: Array<any>; totalCount: number}>,
         keyCombo: {keyId: string; keyDescription: string | Array<string>} = {
            keyId: 'id',
            keyDescription: 'description',
         },
      ): void {
         if (newElement.hasOwnProperty('items')) {
            patchState(store, state => ({
               defaultOptions: [
                  ...(newElement as {items: Array<any>; totalCount: number}).items?.map(m => ({
                     ...m,
                     id: m[keyCombo?.keyId],
                     description: keyCombo.keyDescription instanceof Array ? keyCombo.keyDescription.reduce((a, b) => (a += ` ${m[b]}`), '') : m[keyCombo?.keyDescription],
                  })),
               ],
            }));
         } else {
            patchState(store, state => ({
               defaultOptions: [
                  ...(newElement as TypeComboOption).map(m => ({
                     ...m,
                     id: m[keyCombo?.keyId],
                     description: keyCombo.keyDescription instanceof Array ? keyCombo.keyDescription.reduce((a, b) => (a += ` ${m[b]}`), '') : m[keyCombo?.keyDescription],
                  })),
               ],
               isLoading: false,
            }));
         }
      },

      addDisabledOption(value: Array<string>): void {
         patchState(store, state => ({disabledOption: value}));
      },

      /**************************************************************************************************************************************************/
      updateOptionSelected(optionId: string, isSelected: boolean, isMultiple: boolean): void {
         let selectedOptions = (store.selectedOptions() || []).clone<TypeComboOption>();
         if (isMultiple) {
            if (selectedOptions.find((f: any) => f.id == optionId) != null) {
               selectedOptions = selectedOptions.filter(f => f.id != optionId);
            } else {
               let items = (store.filteredOptions() || [])?.clone<TypeComboOption>().find(f => f.id == optionId);
               items['selected'] = true;
               selectedOptions.push(items);
            }
            patchState(store, state => ({selectedOptions: selectedOptions}));
         } else {
            let items = (store.filteredOptions() || [])?.clone<TypeComboOption>().find(f => f.id == optionId);
            patchState(store, state => ({selectedOptions: [items]}));
         }
      },
      /**************************************************************************************************************************************************/
   })),

   /**************************************************************************************************************************************************/
   /**************************************************************************************************************************************************/
   /**************************************************************************************************************************************************/
   withHooks({
      onInit(store) {
         patchState(store, state => ({
            ...state,
            filteredOptions: [],
            selectedOptions: [],
            storeData: {items: [], totalCount: 0},
            isLoading: true,
         }));
      },
      onDestroy(store) {
         patchState(store, state => ({
            ...state,
            filteredOptions: [],
            selectedOptions: [],
            storeData: {items: [], totalCount: 0},
            isLoading: true,
         }));
      },
   }),
   /**************************************************************************************************************************************************/
);
