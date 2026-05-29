
// --- FORM BUILDER DI TEST PER TUTTE LE COMBO PRINCIPALI ---
import { effect, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DynamicFormBuilder } from 'projects/dynamicform/src/lib/dynamic-form.builder';
import { ConfigForm, TYPE_CONTROL_FORM } from 'projects/dynamicform/src/public-api';
import { ComboApiService } from 'src/app/store/services/combo-api.service';

export function buildComboTestForm<T>(context: T): ConfigForm {
    // Signal per le opzioni locali
    const options = signal([
        { id: '1', description: 'Opzione 1' },
        { id: '2', description: 'Opzione 2' },
        { id: '3', description: 'Opzione 3' },
    ]);

    // Signal e stato per combo paginata (livello)
    const remoteOptionsLivello = signal([]);
    let totalLivello = 0;
    let pageLivello = 1;
    let searchLivello = '';
    let pageSize = 10; // default, può essere aumentato dinamicamente

    // Signal e stato per combo paginata multipla (tipo)
    const remoteOptionsTipo = signal([]);
    let totalTipo = 0;
    let pageTipo = 1;
    let searchTipo = '';

    const comboApi = inject(ComboApiService);

    function loadRemoteOptions({ page = 1, search = '', pageSize: ps = pageSize } = {}, tipo = 'livello', append = false) {
        const params: any = { page, pageSize: ps, search };
        const apiCall = tipo === 'livello' ? comboApi.getLivelloAttivita(params) : comboApi.getTipoAttivitaFisica(params);
        apiCall.subscribe((result: any) => {
            if (tipo === 'livello') {
                totalLivello = result.totalCount;
                pageLivello = page;
                searchLivello = search;
                if (page > 1) {
                    const ids = new Set(remoteOptionsLivello().map((o: any) => o.id));
                    remoteOptionsLivello.set([...remoteOptionsLivello(), ...result.items.filter((o: any) => !ids.has(o.id))]);
                } else {
                    remoteOptionsLivello.set(result.items);
                }
            } else {
                totalTipo = result.totalCount;
                pageTipo = page;
                searchTipo = search;
                if (page > 1) {
                    const ids = new Set(remoteOptionsTipo().map((o: any) => o.id));
                    remoteOptionsTipo.set([...remoteOptionsTipo(), ...result.items.filter((o: any) => !ids.has(o.id))]);
                } else {
                    remoteOptionsTipo.set(result.items);
                }
            }
        });
    }

    // Helper di log uniforme — stampa l'evento + le stats di completamento del form
    function logEvent(event: string, field: string, utility?: any, extra?: any) {
        const stats = utility?.formCompletion?.();
        const completion = stats
            ? `[Form ${stats.percentage}% | ${stats.filled}/${stats.total}] [Required ${stats.required.percentage}% | ${stats.required.filled}/${stats.required.total}]`
            : '';
        console.log(`%c[${event}] ${field} ${completion}`, 'color:#6366f1;font-weight:600', extra ?? '');
    }

    return DynamicFormBuilder.create(context)

        // ═══════════════════════════════════════════════════════════════════
        // RIGA 1 — Combo (2 × col-6)
        // ═══════════════════════════════════════════════════════════════════
        .addGroup('Combo Semplice', ['col-6', 'px-3', 'mb-4'])
        .addForm({
            formName: 'combo_normale',
            title: 'Combo normale',
            type: TYPE_CONTROL_FORM.COMBO,
            options,
            formControl: new FormControl(null, Validators.required),
            initialOptions: [
                {
                    id: null,
                    description: 'Nessuna selezione',
                    tag: { bgTag: 'tag-gray', bgText: 'tag-text-gray', name: 'Default' },
                },
            ],
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'combo_normale', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'combo_normale', utility, { field: fn, prev, curr: fc?.value }),
        })
        .addForm({
            formName: 'combo_multipla',
            title: 'Combo multipla',
            type: TYPE_CONTROL_FORM.COMBO,
            options,
            formControl: new FormControl([]),
            multiple: true,
            initialOptions: [
                {
                    id: 'all',
                    description: 'Tutte le opzioni',
                    tag: { bgTag: 'tag-blue', bgText: 'tag-text-blue', name: 'Tutti' },
                },
                {
                    id: 'recommended',
                    description: 'Consigliato',
                    tag: { bgTag: 'tag-green', bgText: 'tag-text-green', name: 'Top' },
                },
            ],
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'combo_multipla', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'combo_multipla', utility, { field: fn, prev, curr: fc?.value }),
        })

        .addGroup('Combo Paginata', ['col-6', 'px-3', 'mb-4'])
        .addForm({
            formName: 'combo_paginate',
            title: 'Combo paginata (remota)',
            type: TYPE_CONTROL_FORM.COMBOPAGINATE,
            options: remoteOptionsLivello,
            formControl: new FormControl(null),
            totalCount: () => totalLivello,
            initialOptions: [
                {
                    id: 'sedentario',
                    description: 'Sedentario (nessuna attività)',
                    tag: { bgTag: 'tag-gray', bgText: 'tag-text-gray', name: 'Default' },
                },
            ],
            enableInfiniteScroll: true,
            keyCombo: { keySearch: 'search', keyId: 'id', keyDescription: 'description' },
            pageSize: 10,
            paging: { page: 1, count: 10, totalCount: 0 },
            remoteData: ({ param, append }) => {
                return new Promise((resolve, reject) => {
                    loadRemoteOptions({ page: param.page, search: param.search, pageSize: param.count }, 'livello', append);
                    setTimeout(() => {
                        console.log('[DEBUG remoteData] remoteOptionsLivello:', remoteOptionsLivello().map(o => o.id));
                        resolve({ items: remoteOptionsLivello(), totalCount: totalLivello });
                    }, 100);
                });
            },
            onInitialize: () => {
                pageSize = 10;
                loadRemoteOptions({ page: 1, pageSize }, 'livello');
            },
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'combo_paginate', utility, { field: fn, prev, curr: fc?.value }),
            onSearch: (_idGroup, _idForm, _fc, _formName, _formGroup, search) => {
                pageSize = 10;
                loadRemoteOptions({ page: 1, search, pageSize }, 'livello');
            },
            onScrollEnd: () => {
                if (remoteOptionsLivello().length < totalLivello) {
                    loadRemoteOptions({ page: pageLivello + 1, search: searchLivello, pageSize }, 'livello', true);
                }
            },
        })
        .addForm({
            formName: 'combo_paginate_multipla',
            title: 'Combo paginata multipla (remota)',
            type: TYPE_CONTROL_FORM.COMBOPAGINATE,
            options: remoteOptionsTipo,
            formControl: new FormControl([]),
            multiple: true,
            autocomplete: true,
            enableInfiniteScroll: true,
            keyCombo: { keySearch: 'search', keyId: 'id', keyDescription: 'description' },
            pageSize: 10,
            paging: { page: 1, count: 10, totalCount: 0 },
            remoteData: ({ param, append }) => {
                return new Promise((resolve, reject) => {
                    loadRemoteOptions({ page: param.page, search: param.search, pageSize: param.count }, 'tipo', append);
                    setTimeout(() => {
                        resolve({ items: remoteOptionsTipo(), totalCount: totalTipo });
                    }, 100);
                });
            },
            onInitialize: () => {
                pageSize = 10;
                loadRemoteOptions({ page: 1, pageSize }, 'tipo');
            },
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'combo_paginate_multipla', utility, { field: fn, prev, curr: fc?.value }),
            onSearch: (_idGroup, _idForm, _fc, _formName, _formGroup, search) => {
                pageSize = 10;
                loadRemoteOptions({ page: 1, search, pageSize }, 'tipo');
            },
            onScrollEnd: () => {
                if (remoteOptionsTipo().length < totalTipo) {
                    loadRemoteOptions({ page: pageTipo + 1, search: searchTipo, pageSize }, 'tipo', true);
                }
            },
        })

        // ═══════════════════════════════════════════════════════════════════
        // RIGA 2 — Input / Numeri / Date / Orari  (4 × col-3)
        // ═══════════════════════════════════════════════════════════════════
        .addGroup('Input Testo', ['col-3', 'px-3', 'mb-4'])
        .addForm({
            formName: 'campo_text',
            title: 'Input Text',
            type: TYPE_CONTROL_FORM.TEXT,
            formControl: new FormControl(''),
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_text', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_text', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_text', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_text', utility),
        })
        .addForm({
            formName: 'campo_textarea',
            title: 'Textarea',
            type: TYPE_CONTROL_FORM.TEXTAREA,
            formControl: new FormControl(''),
            rows: 3,
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_textarea', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_textarea', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_textarea', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_textarea', utility),
        })

        .addGroup('Numeri', ['col-3', 'px-3', 'mb-4'])
        .addForm({
            formName: 'campo_number',
            title: 'Number',
            type: TYPE_CONTROL_FORM.NUMBER,
            formControl: new FormControl(null),
            optionNumber: { min: 0, max: 100, step: 1 },
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_number', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_number', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_number', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_number', utility),
        })
        .addForm({
            formName: 'campo_currency',
            title: 'Currency (€)',
            type: TYPE_CONTROL_FORM.CURRENCY,
            formControl: new FormControl(null),
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_currency', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_currency', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_currency', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_currency', utility),
        })

        .addGroup('Date', ['col-3', 'px-3', 'mb-4'])
        .addForm({
            formName: 'campo_data',
            title: 'Data',
            type: TYPE_CONTROL_FORM.DATA,
            formControl: new FormControl(null),
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_data', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_data', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_data', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_data', utility),
        })
        .addForm({
            formName: 'campo_datarange',
            title: 'Date Range',
            type: TYPE_CONTROL_FORM.DATARANGE,
            formControl: new FormControl(null),
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_datarange', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_datarange', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_datarange', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_datarange', utility),
        })
        .addForm({
            formName: 'campo_datetime',
            title: 'DateTime',
            type: TYPE_CONTROL_FORM.DATETIME,
            formControl: new FormControl(null),
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_datetime', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_datetime', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_datetime', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_datetime', utility),
        })

        .addGroup('Orari e Anno', ['col-3', 'px-3', 'mb-4'])
        .addForm({
            formName: 'campo_time',
            title: 'Time',
            type: TYPE_CONTROL_FORM.TIME,
            formControl: new FormControl(null),
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_time', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_time', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_time', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_time', utility),
        })
        .addForm({
            formName: 'campo_year',
            optionDate: { min: "2000", max: "2002" },
            title: 'Year',
            type: TYPE_CONTROL_FORM.YEAR,
            formControl: new FormControl(null),
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_year', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_year', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_year', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_year', utility),
        })

        // ═══════════════════════════════════════════════════════════════════
        // RIGA 3 — Selezione / File-Display / Rating  (4+4+4)
        // ═══════════════════════════════════════════════════════════════════
        .addGroup('Selezione e Toggle', ['col-4', 'px-3', 'mb-4'])
        .addForm({
            formName: 'campo_checkbox',
            title: 'Checkbox',
            type: TYPE_CONTROL_FORM.CHECKBOX,
            formControl: new FormControl(false),
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_checkbox', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_checkbox', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_checkbox', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_checkbox', utility),
        })
        .addForm({
            formName: 'campo_radiogroup',
            title: 'Radio Group',
            type: TYPE_CONTROL_FORM.RADIOGROUP,
            formControl: new FormControl(null),
            options: signal([
                { id: 'a', description: 'Opzione A' },
                { id: 'b', description: 'Opzione B' },
                { id: 'c', description: 'Opzione C' },
            ]),
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_radiogroup', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_radiogroup', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_radiogroup', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_radiogroup', utility),
        })
        .addForm({
            formName: 'campo_arraystring',
            title: 'Array String (tag)',
            type: TYPE_CONTROL_FORM.ARRAYSTRING,
            formControl: new FormControl([]),
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_arraystring', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_arraystring', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_arraystring', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_arraystring', utility),
        })

        .addGroup('File e Display', ['col-4', 'px-3', 'mb-4']).addActions([
            {
                label: 'Salva',
                visible: true,
                cssClassButton: ['btn-primary', "col-6"],
                action: (_questions, _id, groupForm, _group, _idx, _allGroup, totalForm) => {
                    alert('Salva!');
                    console.log('[Azione Salva] gruppo:', groupForm?.value, '| totale:', totalForm?.value);
                },
            },
            {
                label: 'Reset',
                visible: true,
                cssClassButton: ['btn-secondary', "col-6"],
                action: (_questions, _id, groupForm) => {
                    if (groupForm?.reset) groupForm.reset();
                },
            },
        ]).addForm((context) => ({
            formName: 'campo_rating',
            title: 'Rating — completamento form',
            type: TYPE_CONTROL_FORM.RATING,
            formControl: new FormControl({ value: null, disabled: true }),
            optionRating: { max: 10 },
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, paging, onOptionSetted, utility) => {
                logEvent('onInitialize', 'campo_rating', utility);
                effect(() => {
                    const stats = utility?.formCompletion?.();
                    _fc.setValue(stats.groups[_ig].percentage / 10, { emitEvent: false, onlySelf: true, emitModelToViewChange: true, emitViewToModelChange: true });
                    stats.groups.forEach(g => console.log(g));
                }, { injector: context["injector"], allowSignalWrites: true });
            },
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_rating', utility, { field: fn, prev, curr: fc?.value }),
        }))

        .addForm({
            formName: 'campo_file',
            title: 'File Upload',
            type: TYPE_CONTROL_FORM.FILE,
            formControl: new FormControl(null),
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, utility) => logEvent('onInitialize', 'campo_file', utility),
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_file', utility, { field: fn, prev, curr: fc?.value }),
            onFocus: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onFocus', 'campo_file', utility),
            onBlur: (_ig, _if, fc, fn, _fg, _all, utility) => logEvent('onBlur', 'campo_file', utility),
        })

        .addGroup('Completamento', ['col-4', 'px-3', 'mb-4'])
        .addForm((context) => ({
            formName: 'campo_rating',
            title: 'Rating — completamento form',
            type: TYPE_CONTROL_FORM.RATING,
            formControl: new FormControl({ value: null, disabled: true }),
            optionRating: { max: 10 },
            onInitialize: (_ig, _if, _fc, _fn, _fg, _t, _all, paging, onOptionSetted, utility) => {
                logEvent('onInitialize', 'campo_rating', utility);
                effect(() => {
                    const stats = utility?.formCompletion?.();
                    _fc.setValue(stats.percentage / 10, { emitEvent: false, onlySelf: true, emitModelToViewChange: true, emitViewToModelChange: true });
                    stats.groups.forEach(g => console.log(g));
                }, { injector: context["injector"], allowSignalWrites: true });
            },
            onChange: (_ig, _if, fc, fn, _fg, _t, prev, _all, utility) => logEvent('onChange', 'campo_rating', utility, { field: fn, prev, curr: fc?.value }),
        }))

        .build();
}
