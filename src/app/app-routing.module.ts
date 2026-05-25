/** @format */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NutriCareComponent } from './components/nutricare/nutricare.component';
import { NutriActivateGuard, NutriDeactivateGuard } from './guards/nutri.guard';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [NutriActivateGuard] },
    {
        path: 'nutricare',
        component: NutriCareComponent,
        canActivate: [NutriActivateGuard],
        canDeactivate: [NutriDeactivateGuard],
    },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: false })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
