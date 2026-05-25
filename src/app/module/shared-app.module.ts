/** @format */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { DynamicFormModule } from 'projects/dynamicform/src/public-api';
import { InitializerModule } from '../core/module/initializer.module';
import { DYNAMIC_FORM_NESTED_EVENTS } from '../components/nutricare/form/minimal-form.json-schema-events';
import { NUTRITIONIST_EVENTS } from '../components/nutricare/form/nutritionist-form.events';
import { AppStoreModule } from '../store/store.module';

import { HomeComponent } from '../components/home/home.component';
import { NutriSidebarComponent } from '../components/nutricare/components/nutri-sidebar/nutri-sidebar.component';
import { DiarioSettimanaleComponent } from '../components/nutricare/components/diario-settimanale/diario-settimanale.component';
import { NutriCareComponent } from '../components/nutricare/nutricare.component';

/**
 * SharedAppModule — modulo condiviso dell'applicazione.
 *
 * Responsabilità:
 *  - Dichiara tutti i componenti di pagina (Home, NutriCare, NutriSidebar).
 *  - Importa InitializerModule (bootstrap app, locale, PlCoreModule).
 *  - Importa DynamicFormModule.forRoot() con eventi e tema.
 *  - Esporta CommonModule, RouterModule, ReactiveFormsModule per i componenti
 *    figli dichiarati qui dentro.
 *
 * Viene importato una sola volta da AppModule (root).
 */
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,

        // Modulo di inizializzazione applicativo (APP_INITIALIZER, locale IT, PlCore)
        InitializerModule,

        // NgRx feature store (combo reducer + effects)
        AppStoreModule,

        // DynamicForm con eventi, azioni e tema — chiamato una sola volta qui
        DynamicFormModule.forRoot({
            events: {
                ...DYNAMIC_FORM_NESTED_EVENTS.events,
                ...NUTRITIONIST_EVENTS.events,
            },
            actions: {
                ...DYNAMIC_FORM_NESTED_EVENTS.actions,
                ...NUTRITIONIST_EVENTS.actions,
            },
            theme: {
                name: 'silk-compact',
                mode: 'light',
                applyToBody: true,
                loadMaterialIcons: true,
                injectRuntimeStyles: true,
            },
        }),
    ],
    declarations: [
        HomeComponent,
        NutriCareComponent,
        NutriSidebarComponent,
        DiarioSettimanaleComponent,
    ],
    exports: [
        HomeComponent,
        NutriCareComponent,
        NutriSidebarComponent,
        // Re-esportati per i template dei componenti dichiarati qui sopra
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
    ],
})
export class SharedAppModule { }
