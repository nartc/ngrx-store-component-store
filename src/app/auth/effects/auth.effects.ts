import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {LogoutConfirmationDialogComponent} from '@example-app/auth/components';
import {AuthService} from '@example-app/auth/services';
import {UserActions} from '@example-app/core/actions';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {exhaustMap, map, tap} from 'rxjs/operators';
import {AuthActions, AuthApiActions } from '../slice';

@Injectable()
export class AuthEffects {
    loginRedirect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthApiActions.loginRedirect, AuthActions.logout),
                tap((authed) => {
                    this.router.navigate(['/login']);
                })
            ),
        {dispatch: false}
    );

    logoutConfirmation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logoutConfirmation),
            exhaustMap(() => {
                const dialogRef = this.dialog.open<LogoutConfirmationDialogComponent,
                    undefined,
                    boolean>(LogoutConfirmationDialogComponent);

                return dialogRef.afterClosed();
            }),
            map((result) =>
                result ? AuthActions.logout() : AuthActions.logoutConfirmationDismiss()
            )
        )
    );

    logoutIdleUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.idleTimeout),
            map(() => AuthActions.logout())
        )
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router,
        private dialog: MatDialog
    ) {
    }
}
