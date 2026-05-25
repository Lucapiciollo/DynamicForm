/** @format */

import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanDeactivate,
    RouterStateSnapshot,
} from '@angular/router';

/**
 * NutriActivateGuard — protezione di accesso alle route.
 * Restituisce sempre true (da completare con logica auth/role).
 */
@Injectable({ providedIn: 'root' })
export class NutriActivateGuard implements CanActivate {
    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        // TODO: implementare controllo accessi (auth check, role check, ecc.)
        return true;
    }
}

/**
 * NutriDeactivateGuard — protezione di uscita dalla route.
 * Restituisce sempre true (da completare con controllo modifiche non salvate).
 */
@Injectable({ providedIn: 'root' })
export class NutriDeactivateGuard<T> implements CanDeactivate<T> {
    canDeactivate(
        _component: T,
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): boolean {
        // TODO: chiedere conferma se ci sono modifiche non salvate
        return true;
    }
}
