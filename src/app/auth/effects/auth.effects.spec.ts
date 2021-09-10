import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {AuthActions, AuthApiActions} from "@example-app/auth/slice";
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';

import { Credentials, User } from '@example-app/auth/models';
import { AuthService } from '@example-app/auth/services';
import { AuthEffects } from '@example-app/auth/effects';

describe('AuthEffects', () => {
  let effects: AuthEffects;
  let authService: any;
  let actions$: Observable<any>;
  let routerService: any;
  let dialog: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        {
          provide: AuthService,
          useValue: { login: jest.fn() },
        },
        provideMockActions(() => actions$),
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(AuthEffects);
    authService = TestBed.inject(AuthService);
    actions$ = TestBed.inject(Actions);
    routerService = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);

    spyOn(routerService, 'navigate').and.callThrough();
  });

  describe('loginSuccess$', () => {
    it('should dispatch a RouterNavigation action', (done: any) => {
      const user = { name: 'User' } as User;
      const action = AuthApiActions.loginSuccess({ user });

      actions$ = of(action);

      effects.loginSuccess$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/']);
        done();
      });
    });
  });

  describe('loginRedirect$', () => {
    it('should dispatch a RouterNavigation action when auth.loginRedirect is dispatched', (done: any) => {
      const action = AuthApiActions.loginRedirect();

      actions$ = of(action);

      effects.loginRedirect$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });

    it('should dispatch a RouterNavigation action when auth.logout is dispatched', (done: any) => {
      const action = AuthActions.logout();

      actions$ = of(action);

      effects.loginRedirect$.subscribe(() => {
        expect(routerService.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });
  });

  describe('logoutConfirmation$', () => {
    it('should dispatch a Logout action if dialog closes with true result', () => {
      const action = AuthActions.logoutConfirmation();
      const completion = AuthActions.logout();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      dialog.open = () => ({
        afterClosed: jest.fn(() => of(true)),
      });

      expect(effects.logoutConfirmation$).toBeObservable(expected);
    });

    it('should dispatch a LogoutConfirmationDismiss action if dialog closes with falsy result', () => {
      const action = AuthActions.logoutConfirmation();
      const completion = AuthActions.logoutConfirmationDismiss();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      dialog.open = () => ({
        afterClosed: jest.fn(() => of(false)),
      });

      expect(effects.logoutConfirmation$).toBeObservable(expected);
    });
  });
});
