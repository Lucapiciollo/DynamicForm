/** @format */

import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { comboReducer } from './combo/combo.reducer';
import { ComboEffects } from './combo/combo.effects';

/**
 * AppStoreModule — modulo NgRx dedicato allo store dell'applicazione.
 *
 * Registra la feature 'combo' con il suo reducer e gli effects.
 * Viene importato da SharedAppModule, che a sua volta è importato da AppModule.
 *
 * StoreModule.forRoot / EffectsModule.forRoot → registrati in AppModule.
 * StoreModule.forFeature / EffectsModule.forFeature → registrati qui.
 */
@NgModule({
    imports: [
        StoreModule.forFeature('combo', comboReducer),
        EffectsModule.forFeature([ComboEffects]),
    ],
})
export class AppStoreModule { }
