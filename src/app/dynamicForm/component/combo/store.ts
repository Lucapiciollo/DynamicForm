import { InjectionToken, computed, inject } from '@angular/core';
import { patchState, signalStore, StateSignals, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { TypeComboOption } from '../../dynamic-form.interface';

/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
interface IState {
  totalOptions: TypeComboOption,
  filteredOptions: TypeComboOption,
  selectedOptions: TypeComboOption,
  isLoading: boolean,
  disabledOption: Array<string>
};
/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
/**************************************************************************************************************************************************/
const initialState = {
  isLoading: false,
  filteredOptions: null,
  selectedOptions: null,
  totalOptions: null,
  disabledOption: []
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
export const Store = signalStore({ protectedState: false },
  withState(() => inject(STATE)),
  /**************************************************************************************************************************************************/
  /**************************************************************************************************************************************************/
  /**************************************************************************************************************************************************/

  withComputed((store) => ({
    getFilterOption: computed(() => {
      return store.filteredOptions();
    }),
    /**************************************************************************************************************************************************/
    getIsLoading: computed(() => {
      return store.isLoading();
    }),

    /**************************************************************************************************************************************************/
    getSelectedOptions: computed(() => {
      return store.selectedOptions();
    }),
    /**************************************************************************************************************************************************/
    getTotalOptions: computed(() => {
      return store.totalOptions();
    }),
    /**************************************************************************************************************************************************/
    getDisabledOptions: computed(() => {
      return store.disabledOption();
    }),
  })),

  /**************************************************************************************************************************************************/
  /**************************************************************************************************************************************************/
  /**************************************************************************************************************************************************/

  withMethods((store) => ({

    distinctArray(array) {
      const seenIds = new Set();
      return array.clone().filter(item => {
        if (seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
      });
    },

    setFilteredOptions(newElement: Partial<TypeComboOption | { items: Array<any>, totalCount: number }>, keyCombo: { keyId: string, keyDescription: string | Array<string> } = { keyId: "id", keyDescription: "description" }, append: boolean): void {
      if (newElement.hasOwnProperty("items")) {
        if (append) {
          patchState(store, (state) => ({ isLoading: false, filteredOptions: this.distinctArray([...state.selectedOptions, ...state.filteredOptions, ...(newElement as { items: Array<any>, totalCount: number }).items?.map(m => ({ id: m[keyCombo?.keyId], description: keyCombo.keyDescription instanceof Array ? keyCombo.keyDescription.reduce((a, b) => a += ` ${m[b]}`, "") : m[keyCombo?.keyDescription] }))]) }));

        } else {
          patchState(store, (state) => ({ isLoading: false, filteredOptions: this.distinctArray([...state.selectedOptions, ...(newElement as { items: Array<any>, totalCount: number }).items?.map(m => ({ id: m[keyCombo?.keyId], description: keyCombo.keyDescription instanceof Array ? keyCombo.keyDescription.reduce((a, b) => a += ` ${m[b]}`, "") : m[keyCombo?.keyDescription] }))]) }));
        }
      }
      else {
        if (append) {

          patchState(store, (state) => ({ filteredOptions: this.distinctArray([...state.selectedOptions, ...state.filteredOptions, ...(newElement as TypeComboOption).map(m => ({ id: m[keyCombo?.keyId], description: keyCombo.keyDescription instanceof Array ? keyCombo.keyDescription.reduce((a, b) => a += ` ${m[b]}`, "") : m[keyCombo?.keyDescription] }))]), isLoading: false }));
        } else {
          patchState(store, (state) => ({ filteredOptions: this.distinctArray([...state.selectedOptions, ...(newElement as TypeComboOption).map(m => ({ id: m[keyCombo?.keyId], description: keyCombo.keyDescription instanceof Array ? keyCombo.keyDescription.reduce((a, b) => a += ` ${m[b]}`, "") : m[keyCombo?.keyDescription] }))]), isLoading: false }));

        }
      }
    },

    setSelectedOptions(newElement: Partial<TypeComboOption>): void {
      patchState(store, (state) => ({ selectedOptions: [...newElement] }));
    },

    setTotalOptions(newElement: Partial<TypeComboOption>): void {
      patchState(store, (state) => ({ totalOptions: [...newElement] }));

    },

    setIsLoading(value: boolean): void {
      patchState(store, (state) => ({ isLoading: value }));
    },

    addDisabledOption(value: Array<string>): void {
      patchState(store, (state) => ({ disabledOption: value }));
    },


    /**************************************************************************************************************************************************/
    updateOptionSelected(optionId: string, isSelected: boolean, isMultiple: boolean): void {
      let selectedOptions = (store.selectedOptions() || []).clone<TypeComboOption>();
      if (isMultiple) {
        if (selectedOptions.find((f: any) => f.id == optionId) != null) {
          selectedOptions = selectedOptions.filter(f => f.id != optionId);
        } else {
          let items = (store.filteredOptions() || [])?.clone<TypeComboOption>().find(f => f.id == optionId);
          items["selected"] = true;
          selectedOptions.push(items);
        }
        patchState(store, (state) => ({ selectedOptions: selectedOptions }));
      } else {
        let items = (store.filteredOptions() || [])?.clone<TypeComboOption>().find(f => f.id == optionId);
        patchState(store, (state) => ({ selectedOptions: [items] }));
      }
    },
    /**************************************************************************************************************************************************/
  })),

  /**************************************************************************************************************************************************/
  /**************************************************************************************************************************************************/
  /**************************************************************************************************************************************************/
  withHooks({
    onInit(store) {
      patchState(store, (state) => ({ ...state, filteredOptions: [], selectedOptions: [], storeData: { items: [], totalCount: 0 }, isLoading: true }));
    },
    onDestroy(store) {
      patchState(store, (state) => ({ ...state, filteredOptions: [], selectedOptions: [], storeData: { items: [], totalCount: 0 }, isLoading: true }));
    }
  }),
  /**************************************************************************************************************************************************/

);



