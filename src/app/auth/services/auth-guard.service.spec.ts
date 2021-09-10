import {TestBed} from '@angular/core/testing';
import {AuthGuard} from '@example-app/auth/services';
import {AuthSelectors, AuthState} from "@example-app/auth/slice";
import {MemoizedSelector} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {cold} from 'jasmine-marbles';

describe('Auth Guard', () => {
    let guard: AuthGuard;
    let store: MockStore;
    let loggedIn: MemoizedSelector<AuthState, boolean>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthGuard, provideMockStore()],
        });

        store = TestBed.inject(MockStore);
        guard = TestBed.inject(AuthGuard);

        loggedIn = store.overrideSelector(AuthSelectors.selectLoggedIn, false);
    });

    it('should return false if the user state is not logged in', () => {
        const expected = cold('(a|)', {a: false});

        expect(guard.canActivate()).toBeObservable(expected);
    });

    it('should return true if the user state is logged in', () => {
        const expected = cold('(a|)', {a: true});

        loggedIn.setResult(true);

        expect(guard.canActivate()).toBeObservable(expected);
    });
});
