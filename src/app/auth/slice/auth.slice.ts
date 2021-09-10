import {User} from "@example-app/auth/models";
import {createSelector} from "@ngrx/store";
import {createSlice, noopReducer, PayloadAction} from "ngrx-slice";

export interface AuthState {
    status: {
        user: User | null;
    }
}

export const initialState: AuthState = {
    status: {
        user: null,
    }
};

export const {actions, selectors, ...AuthFeature} = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRedirect: noopReducer(),
        loginSuccess: (state, action: PayloadAction<{ user: User }>) => {
            state.status.user = action.user;
        },
        logout: state => {
            state = initialState;
        },
        logoutConfirmation: noopReducer(),
        logoutConfirmationDismiss: noopReducer()
    }
});
