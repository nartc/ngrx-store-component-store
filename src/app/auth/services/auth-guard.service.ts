import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthApiActions, AuthSelectors} from "@example-app/auth/slice";
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private store: Store) {
    }

    canActivate(): Observable<boolean> {
        return this.store.select(AuthSelectors.selectLoggedIn).pipe(
            map((authed) => {
                if (!authed) {
                    this.store.dispatch(AuthApiActions.loginRedirect());
                    return false;
                }

                return true;
            }),
            take(1)
        );
    }
}
