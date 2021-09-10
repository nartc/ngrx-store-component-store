import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Credentials} from '@example-app/auth/models';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {exhaustMap} from 'rxjs/operators';
import {AuthService} from '../services';
import {AuthApiActions} from '../slice';

export interface LoginPageState {
    error: string | null;
    pending: boolean;
}

export const initialState: LoginPageState = {
    error: null,
    pending: false,
};

@Injectable()
export class LoginPageStore extends ComponentStore<LoginPageState> {
    error$ = this.select(state => state.error);
    pending$ = this.select(state => state.pending);

    login = this.effect((credentials$: Observable<Credentials>) => {
        this.setState({
            pending: true,
            error: null
        });

        return credentials$.pipe(
            exhaustMap((auth: Credentials) =>
                this.authService.login(auth).pipe(
                    tapResponse(
                        (user) => {
                            this.setState({
                                error: null,
                                pending: false
                            });
                            this.store.dispatch(AuthApiActions.loginSuccess({user}));
                            this.router.navigate(['/']);
                        },
                        (error: string) => {
                            this.setState({
                                error,
                                pending: false
                            })
                        }))
            )
        )
    })

    constructor(
        private authService: AuthService,
        private store: Store,
        private router: Router
    ) {
        super(initialState);
    }
}