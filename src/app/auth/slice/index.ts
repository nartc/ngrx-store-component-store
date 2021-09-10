import {createSelector} from "@ngrx/store";
import {actions, selectors} from './auth.slice';

export {AuthFeature} from './auth.slice';

const selectUser = createSelector(
    selectors.selectStatus,
    status => status.user
);

const selectLoggedIn = createSelector(
    selectUser,
    user => !!user
);


export const AuthSelectors = {
    selectUser,
    selectLoggedIn,
    ...selectors
};

const {loginSuccess, loginRedirect, logoutConfirmation, logoutConfirmationDismiss, logout} = actions;
export const AuthApiActions = {loginSuccess, loginRedirect};
export const AuthActions = {logout, logoutConfirmation, logoutConfirmationDismiss};
