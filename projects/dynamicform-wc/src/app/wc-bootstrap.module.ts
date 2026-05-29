/** @format */

import { DoBootstrap, Injector, NgModule, signal } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import {
    DynamicFormModule,
    DYNAMIC_FORM_NESTED_EVENTS,
    TYPE_CONTROL_FORM,
} from 'projects/dynamicform/src/public-api';
import { DynamicFormComponent } from 'projects/dynamicform/src/lib/dynamic-form.component';
import { DynamicFormBuilder } from 'projects/dynamicform/src/lib/dynamic-form.builder';
import { DEMO_WC_EVENTS } from './wc-demo-events';

/**
 * Modulo bootstrap per il build Web Component.
 *
 * Registra <dynamic-form> come Custom Element ed espone su window.DynamicFormLib
 * il builder e le classi Angular/Forms necessarie per costruire la ConfigForm
 * direttamente in JavaScript dalla demo HTML.
 *
 * Uso nella demo HTML:
 *   const { DynamicFormBuilder, FormControl, Validators, TYPE_CONTROL_FORM } = window.DynamicFormLib;
 *   const config = DynamicFormBuilder.create()
 *     .addGroup('Titolo', ['col-12'])
 *     .addForm({ formName: 'nome', type: TYPE_CONTROL_FORM.TEXT,
 *                formControl: new FormControl(null, Validators.required), title: 'Nome' })
 *     .addActions([{ label: 'Salva', action: (_q, _id, fg) => console.log(fg.value) }])
 *     .build();
 *   document.getElementById('dfWc').config = config;
 */
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        DynamicFormModule.forRoot({
            events: {
                ...DYNAMIC_FORM_NESTED_EVENTS.events,
                ...DEMO_WC_EVENTS.events,
            },
            actions: {
                ...DYNAMIC_FORM_NESTED_EVENTS.actions,
                ...DEMO_WC_EVENTS.actions,
            },
            theme: {
                name: 'silk-compact',
                mode: 'light',
                applyToBody: false,
                loadMaterialIcons: true,
                injectRuntimeStyles: true,
            },
        }),
    ],
    declarations: [],
    providers: [provideHttpClient(withFetch())],
})
export class WcBootstrapModule implements DoBootstrap {
    constructor(private injector: Injector) { }

    ngDoBootstrap(): void {
        if (!customElements.get('dynamic-form')) {
            customElements.define(
                'dynamic-form',
                createCustomElement(DynamicFormComponent, { injector: this.injector }),
            );
            console.info('[DynamicForm WC] <dynamic-form> registered.');
        }

        // Espone il builder e i tipi Angular su window so la demo HTML li usa direttamente
        (window as any).DynamicFormLib = {
            DynamicFormBuilder,
            FormControl,
            FormGroup,
            FormArray,
            Validators,
            TYPE_CONTROL_FORM,
            signal,
        };

        console.info('[DynamicForm WC] window.DynamicFormLib exposed.');
    }
}
