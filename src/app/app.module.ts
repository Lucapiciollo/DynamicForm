import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedAppModule } from './module/shared-app.module';
import { environment } from '../environments/environment';

@NgModule({
   declarations: [AppComponent],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      MatButtonToggleModule,
      AppRoutingModule,
      SharedAppModule,
      // ─── NgRx root ─────────────────────────────────────────────────────
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      StoreDevtoolsModule.instrument({
         maxAge: 25,
         logOnly: environment.production,
      }),
   ],
   providers: [
      provideHttpClient(withFetch()),
   ],
   bootstrap: [AppComponent],
})
export class AppModule { }
